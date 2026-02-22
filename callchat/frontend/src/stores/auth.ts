import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import { websocketService } from '@/services/websocket'
import type { User, LoginRequest, RegisterRequest } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)

  async function initialize() {
    const token = localStorage.getItem('access_token')
    if (token) {
      accessToken.value = token
      await loadUser()
    }
  }

  async function loadUser() {
    try {
      user.value = await authService.getMe()
    } catch (err) {
      console.error('Failed to load user:', err)
      logout()
    }
  }

  async function register(data: RegisterRequest) {
    loading.value = true
    error.value = null

    try {
      const response = await authService.register(data)
      accessToken.value = response.access_token
      user.value = response.user

      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)

      // Connect WebSocket
      websocketService.connect(response.access_token)

      return true
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Registration failed'
      return false
    } finally {
      loading.value = false
    }
  }

  async function login(data: LoginRequest) {
    loading.value = true
    error.value = null

    try {
      const response = await authService.login(data)
      accessToken.value = response.access_token
      user.value = response.user

      localStorage.setItem('access_token', response.access_token)
      localStorage.setItem('refresh_token', response.refresh_token)

      // Connect WebSocket
      websocketService.connect(response.access_token)

      return true
    } catch (err: any) {
      error.value = err.response?.data?.error || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  function logout() {
    user.value = null
    accessToken.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')

    // Disconnect WebSocket
    websocketService.disconnect()
  }

  return {
    user,
    accessToken,
    loading,
    error,
    isAuthenticated,
    initialize,
    register,
    login,
    logout,
  }
})
