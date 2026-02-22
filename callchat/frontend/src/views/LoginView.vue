<template>
  <v-container fluid class="fill-height pa-0" style="position: relative;">
    <!-- Ambient Glow Background -->
    <div class="ambient-glow">
      <div class="glow-orb glow-primary"></div>
      <div class="glow-orb glow-secondary"></div>
    </div>

    <v-row align="center" justify="center" class="fill-height" style="position: relative; z-index: 1;">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card class="glass glow-shadow pa-8" rounded="xl" elevation="0">
          <v-card-title class="text-center text-h4 font-weight-bold mb-2 pa-0">
            CallChat
          </v-card-title>
          <v-card-subtitle class="text-center text-muted mb-6 pa-0">
            Bem-vindo de volta!
          </v-card-subtitle>

          <v-card-text class="pa-0">
            <v-form @submit.prevent="handleLogin">
              <v-text-field
                v-model="email"
                label="Email"
                variant="outlined"
                rounded="lg"
                class="mb-4"
                :rules="[rules.required, rules.email]"
                :disabled="authStore.loading"
              >
                <template v-slot:prepend-inner>
                  <PhEnvelope :size="20" class="text-muted mr-2" />
                </template>
              </v-text-field>

              <v-text-field
                v-model="password"
                label="Senha"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                rounded="lg"
                class="mb-4"
                :rules="[rules.required]"
                :disabled="authStore.loading"
              >
                <template v-slot:prepend-inner>
                  <PhLock :size="20" class="text-muted mr-2" />
                </template>
                <template v-slot:append-inner>
                  <v-btn
                    icon
                    variant="text"
                    size="small"
                    @click="showPassword = !showPassword"
                    class="glass-btn"
                  >
                    <PhEye v-if="!showPassword" :size="20" />
                    <PhEyeClosed v-else :size="20" />
                  </v-btn>
                </template>
              </v-text-field>

              <v-alert
                v-if="authStore.error"
                type="error"
                variant="tonal"
                rounded="lg"
                class="mb-4"
                density="compact"
              >
                {{ authStore.error }}
              </v-alert>

              <v-btn
                type="submit"
                block
                size="large"
                rounded="xl"
                class="gradient-bg glow-shadow hover-lift mb-4"
                style="background: linear-gradient(to right, #6366F1, #A855F7) !important; text-transform: none; font-weight: 600; letter-spacing: 0.5px;"
                :loading="authStore.loading"
                :disabled="authStore.loading"
              >
                Entrar
              </v-btn>

              <div class="text-center">
                <span class="text-muted">Precisa de uma conta? </span>
                <router-link to="/register" class="text-primary text-decoration-none font-weight-medium">
                  Registre-se
                </router-link>
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { PhEnvelope, PhLock, PhEye, PhEyeClosed } from '@phosphor-icons/vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)

const rules = {
  required: (value: string) => !!value || 'Campo obrigatório',
  email: (value: string) => {
    const pattern = /.+@.+\..+/
    return pattern.test(value) || 'Email inválido'
  },
}

async function handleLogin() {
  const success = await authStore.login({
    email: email.value,
    password: password.value,
  })

  if (success) {
    router.push('/chat')
  }
}
</script>

<style scoped>
.v-card {
  border: 1px solid rgba(255, 255, 255, 0.05) !important;
}

/* Override Vuetify field colors for dark theme */
:deep(.v-field) {
  background-color: rgba(31, 41, 55, 0.5) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

:deep(.v-field:hover) {
  background-color: rgba(31, 41, 55, 0.7) !important;
}

:deep(.v-field--focused) {
  background-color: rgba(31, 41, 55, 0.8) !important;
  border-color: #6366F1 !important;
}

:deep(.v-field__input) {
  color: #F3F4F6 !important;
}

:deep(.v-label) {
  color: #9CA3AF !important;
}

:deep(.v-field--focused .v-label) {
  color: #6366F1 !important;
}
</style>
