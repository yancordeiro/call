<template>
  <v-app class="discord-layout">
    <!-- Sidebar Esquerda: Conversas (mesma do ChatView) -->
    <v-navigation-drawer
      permanent
      :width="240"
      class="glass conversations-sidebar"
      style="border-right: 1px solid rgba(255, 255, 255, 0.08) !important;"
    >
      <!-- Header da Sidebar -->
      <div class="sidebar-header pa-4 d-flex align-center justify-space-between" style="border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
        <h2 class="text-h6 font-weight-bold">CallChat</h2>
        <v-btn
          icon
          size="small"
          class="glass-btn active"
          @click="router.push('/friends')"
        >
          <PhUserPlus :size="20" />
        </v-btn>
      </div>

      <!-- Search Bar -->
      <div class="pa-3">
        <v-text-field
          placeholder="Procurar conversa"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          class="search-field"
        >
          <template v-slot:prepend-inner>
            <PhMagnifyingGlass :size="16" class="text-muted" />
          </template>
        </v-text-field>
      </div>

      <!-- Lista de Conversas -->
      <v-list class="px-2 conversations-list">
        <v-list-subheader class="text-xs font-weight-bold text-uppercase text-muted px-2">
          Mensagens Diretas
        </v-list-subheader>

        <!-- Placeholder -->
        <div class="text-center py-8">
          <PhChatCircle :size="48" class="text-muted mb-3" />
          <p class="text-caption text-muted px-4">
            Nenhuma conversa ainda
          </p>
        </div>
      </v-list>

      <!-- User Info Footer -->
      <div class="user-footer glass-strong pa-3" style="border-top: 1px solid rgba(255, 255, 255, 0.08);">
        <div class="d-flex align-center">
          <v-avatar size="32" class="mr-3">
            <PhUser :size="18" />
          </v-avatar>
          <div class="flex-grow-1" style="min-width: 0;">
            <p class="text-body-2 font-weight-medium mb-0 text-truncate">
              {{ authStore.user?.username || 'Usuário' }}
            </p>
            <p class="text-caption text-muted mb-0">
              <span class="status-dot online"></span>
              Online
            </p>
          </div>
          <v-btn
            icon
            size="small"
            class="glass-btn"
            @click="handleLogout"
          >
            <PhSignOut :size="18" />
          </v-btn>
        </div>
      </div>
    </v-navigation-drawer>

    <!-- Área Central: Friends -->
    <v-main class="friends-main">
      <!-- Ambient Glow Background -->
      <div class="ambient-glow">
        <div class="glow-orb glow-primary"></div>
        <div class="glow-orb glow-secondary"></div>
      </div>

      <div class="friends-container">
        <!-- Header -->
        <div class="friends-header glass pa-4" style="border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
          <div class="d-flex align-center">
            <PhUsersFour :size="24" class="mr-3 text-muted" />
            <h2 class="text-h6 font-weight-bold">Amigos</h2>
          </div>

          <!-- Tabs -->
          <div class="d-flex gap-2 mt-4">
            <v-btn
              :variant="tab === 'online' ? 'flat' : 'text'"
              :class="tab === 'online' ? 'active-tab' : ''"
              size="small"
              rounded="lg"
              @click="tab = 'online'"
            >
              Online
            </v-btn>
            <v-btn
              :variant="tab === 'all' ? 'flat' : 'text'"
              :class="tab === 'all' ? 'active-tab' : ''"
              size="small"
              rounded="lg"
              @click="tab = 'all'"
            >
              Todos
            </v-btn>
            <v-btn
              :variant="tab === 'pending' ? 'flat' : 'text'"
              :class="tab === 'pending' ? 'active-tab' : ''"
              size="small"
              rounded="lg"
              @click="tab = 'pending'"
            >
              Pendentes
            </v-btn>
            <v-btn
              variant="flat"
              :class="tab === 'add' ? 'active-tab' : ''"
              size="small"
              rounded="lg"
              class="gradient-bg"
              style="background: linear-gradient(to right, #6366F1, #A855F7) !important;"
              @click="tab = 'add'"
            >
              Adicionar Amigo
            </v-btn>
          </div>
        </div>

        <!-- Content Area -->
        <div class="friends-content pa-6">
          <!-- Tab: Adicionar Amigos -->
          <div v-if="tab === 'add'">
            <div class="search-container mb-6">
              <v-text-field
                v-model="searchQuery"
                placeholder="Buscar usuários pelo nome ou email"
                variant="outlined"
                rounded="lg"
                hide-details
                class="search-users-field"
                @input="handleSearch"
              >
                <template v-slot:prepend-inner>
                  <PhMagnifyingGlass :size="20" class="text-muted mr-2" />
                </template>
              </v-text-field>
            </div>

            <!-- Search Results -->
            <div v-if="searchResults.length > 0" class="results-list">
              <div
                v-for="user in searchResults"
                :key="user.id"
                class="user-result glass-hover rounded-xl pa-4 mb-3 d-flex align-center"
              >
                <v-avatar size="48" color="primary" class="mr-4">
                  <span class="text-h6">{{ user.username?.[0]?.toUpperCase() || 'U' }}</span>
                </v-avatar>
                <div class="flex-grow-1">
                  <p class="text-body-1 font-weight-medium mb-0">{{ user.username }}</p>
                  <p class="text-caption text-muted mb-0">{{ user.email }}</p>
                </div>
                <v-btn
                  rounded="lg"
                  class="gradient-bg"
                  style="background: linear-gradient(to right, #6366F1, #A855F7) !important; text-transform: none;"
                  @click="handleAddFriend(user)"
                >
                  <PhUserPlus :size="18" class="mr-2" />
                  Adicionar
                </v-btn>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!searchQuery" class="empty-search text-center py-12">
              <PhUsers :size="64" class="text-muted mb-4" weight="duotone" />
              <h3 class="text-h6 font-weight-medium mb-2">Encontre seus amigos</h3>
              <p class="text-body-2 text-muted">
                Digite o nome de usuário ou email para encontrar amigos
              </p>
            </div>

            <!-- No Results -->
            <div v-else-if="searchQuery && searchResults.length === 0 && !loading" class="text-center py-12">
              <PhUserMinus :size="64" class="text-muted mb-4" />
              <p class="text-body-1 text-muted">Nenhum usuário encontrado</p>
            </div>
          </div>

          <!-- Tab: Online / All / Pending -->
          <div v-else class="text-center py-12">
            <PhUsersFour :size="64" class="text-muted mb-4" weight="duotone" />
            <h3 class="text-h6 font-weight-medium mb-2">Nenhum amigo ainda</h3>
            <p class="text-body-2 text-muted mb-6">
              Comece adicionando alguns amigos!
            </p>
            <v-btn
              rounded="xl"
              class="gradient-bg glow-shadow"
              style="background: linear-gradient(to right, #6366F1, #A855F7) !important; text-transform: none;"
              @click="tab = 'add'"
            >
              <PhUserPlus :size="20" class="mr-2" />
              Adicionar Amigos
            </v-btn>
          </div>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/authService'
import type { User } from '@/types/auth'
import {
  PhUserPlus,
  PhMagnifyingGlass,
  PhChatCircle,
  PhUser,
  PhSignOut,
  PhUsersFour,
  PhUsers,
  PhUserMinus
} from '@phosphor-icons/vue'

const router = useRouter()
const authStore = useAuthStore()

const tab = ref('add')
const searchQuery = ref('')
const searchResults = ref<User[]>([])
const loading = ref(false)

let searchTimeout: ReturnType<typeof setTimeout>

async function handleSearch() {
  clearTimeout(searchTimeout)

  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }

  searchTimeout = setTimeout(async () => {
    loading.value = true
    try {
      const results = await authService.searchUsers(searchQuery.value)
      searchResults.value = results
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      loading.value = false
    }
  }, 300)
}

function handleAddFriend(user: User) {
  console.log('Add friend:', user)
  // TODO: Implement add friend functionality
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.discord-layout {
  background-color: #0B0F19 !important;
}

.conversations-sidebar {
  background: #111827 !important;
}

.sidebar-header {
  min-height: 56px;
}

.glass-btn.active {
  background-color: rgba(99, 102, 241, 0.2) !important;
}

/* Search Field Styling */
.search-field :deep(.v-field) {
  background-color: rgba(11, 15, 25, 0.6) !important;
  border-color: transparent !important;
}

.search-field :deep(.v-field:hover) {
  background-color: rgba(11, 15, 25, 0.8) !important;
}

.search-field :deep(.v-field__input) {
  color: #F3F4F6 !important;
  font-size: 14px !important;
}

.search-field :deep(.v-field__input)::placeholder {
  color: #9CA3AF !important;
}

/* Conversations List */
.conversations-list {
  flex: 1;
  overflow-y: auto;
}

/* User Footer */
.user-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(11, 15, 25, 0.9) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Friends Main Area */
.friends-main {
  position: relative;
  background-color: #0B0F19 !important;
}

.friends-container {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.friends-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.friends-content {
  flex: 1;
  overflow-y: auto;
}

/* Tabs */
.active-tab {
  background-color: rgba(99, 102, 241, 0.15) !important;
  color: #818CF8 !important;
}

/* Search Users Field */
.search-users-field :deep(.v-field) {
  background-color: rgba(31, 41, 55, 0.5) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

.search-users-field :deep(.v-field:hover) {
  background-color: rgba(31, 41, 55, 0.7) !important;
}

.search-users-field :deep(.v-field--focused) {
  background-color: rgba(31, 41, 55, 0.8) !important;
  border-color: #6366F1 !important;
}

.search-users-field :deep(.v-field__input) {
  color: #F3F4F6 !important;
}

.search-users-field :deep(.v-field__input)::placeholder {
  color: #9CA3AF !important;
}

/* User Results */
.user-result {
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}

.user-result:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
}

/* Override Navigation Drawer Styles */
:deep(.v-navigation-drawer__content) {
  display: flex;
  flex-direction: column;
}
</style>
