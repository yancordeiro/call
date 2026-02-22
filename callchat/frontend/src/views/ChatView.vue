<template>
  <v-app class="discord-layout">
    <!-- Sidebar Esquerda: Conversas -->
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
          class="glass-btn"
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

        <!-- Placeholder quando não há conversas -->
        <div v-if="chatStore.conversations.length === 0" class="text-center py-8">
          <PhChatCircle :size="48" class="text-muted mb-3" />
          <p class="text-caption text-muted px-4">
            Nenhuma conversa ainda.<br>
            Adicione amigos para começar!
          </p>
        </div>

        <!-- Conversation Items (exemplo) -->
        <v-list-item
          v-for="i in 0"
          :key="i"
          class="conversation-item rounded-lg mb-1"
          density="compact"
        >
          <template v-slot:prepend>
            <v-avatar size="32" class="mr-3">
              <PhUser :size="18" />
            </v-avatar>
          </template>
          <v-list-item-title class="text-body-2 font-weight-medium">
            Usuário {{ i }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption text-muted">
            Mensagem...
          </v-list-item-subtitle>
        </v-list-item>
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

    <!-- Área Central: Chat -->
    <v-main class="chat-main">
      <!-- Ambient Glow Background -->
      <div class="ambient-glow">
        <div class="glow-orb glow-primary"></div>
        <div class="glow-orb glow-secondary"></div>
      </div>

      <!-- Chat Container -->
      <div class="chat-container">
        <!-- Empty State -->
        <div class="empty-state">
          <div class="text-center">
            <div class="empty-icon mb-4">
              <PhChatsCircle :size="80" class="text-muted" weight="duotone" />
            </div>
            <h3 class="text-h5 font-weight-bold mb-2">Bem-vindo ao CallChat!</h3>
            <p class="text-body-1 text-muted mb-6">
              Selecione uma conversa para começar ou adicione novos amigos
            </p>
            <v-btn
              rounded="xl"
              class="gradient-bg glow-shadow"
              style="background: linear-gradient(to right, #6366F1, #A855F7) !important; text-transform: none;"
              @click="router.push('/friends')"
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import {
  PhUserPlus,
  PhMagnifyingGlass,
  PhChatCircle,
  PhUser,
  PhSignOut,
  PhChatsCircle
} from '@phosphor-icons/vue'

const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()

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

.conversation-item {
  transition: all 0.2s ease;
  cursor: pointer;
  padding: 8px !important;
}

.conversation-item:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

.conversation-item.active {
  background-color: rgba(99, 102, 241, 0.15) !important;
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

/* Chat Main Area */
.chat-main {
  position: relative;
  background-color: #0B0F19 !important;
}

.chat-container {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-state {
  max-width: 600px;
  padding: 48px 24px;
}

.empty-icon {
  display: inline-flex;
  padding: 24px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 50%;
}

/* Override Navigation Drawer Styles */
:deep(.v-navigation-drawer__content) {
  display: flex;
  flex-direction: column;
}
</style>
