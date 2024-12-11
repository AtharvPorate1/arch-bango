import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  username: string
  setAuth: (isAuthenticated: boolean, username: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  username: '',
  setAuth: (isAuthenticated, username) => set({ isAuthenticated, username }),
  logout: () => set({ isAuthenticated: false, username: '' }),
}))
