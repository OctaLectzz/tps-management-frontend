import api from '@/services/api'
import type { ApiResponse, LoginCredentials, LoginResponse, User } from '@/types'
import Cookies from 'js-cookie'
import { create } from 'zustand'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
  loadUser: () => Promise<void>
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: Cookies.get('electra-token') || localStorage.getItem('electra-token'),
  isAuthenticated: !!(Cookies.get('electra-token') || localStorage.getItem('electra-token')),
  isLoading: false,

  setAuth: (user: User, token: string) => {
    Cookies.set('electra-token', token, { expires: 7 })
    localStorage.setItem('electra-token', token)
    set({ user, token, isAuthenticated: true })
  },

  clearAuth: () => {
    Cookies.remove('electra-token')
    localStorage.removeItem('electra-token')
    set({ user: null, token: null, isAuthenticated: false })
  },

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true })
    try {
      const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials)
      const { user, token } = data.data
      get().setAuth(user, token)
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout')
    } catch {
      // Proceed with local cleanup even if API call fails
    } finally {
      get().clearAuth()
    }
  },

  loadUser: async () => {
    const { token } = get()
    if (!token) return
    set({ isLoading: true })
    try {
      const { data } = await api.get<ApiResponse<User>>('/auth/profile')
      set({ user: data.data, isAuthenticated: true })
    } catch {
      get().clearAuth()
    } finally {
      set({ isLoading: false })
    }
  }
}))
