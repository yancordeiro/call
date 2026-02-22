import api from './api'
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types/auth'

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/v1/auth/register', data)
    return response.data
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/v1/auth/login', data)
    return response.data
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/v1/users/me')
    return response.data
  },

  async searchUsers(query: string): Promise<User[]> {
    const response = await api.get<User[]>('/v1/users/search', {
      params: { q: query },
    })
    return response.data
  },
}
