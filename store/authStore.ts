import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  username: string
  setAuth: (isAuthenticated: boolean, username: string) => void
  logout: () => void
}

export interface WalletState {
  isConnected: boolean;
  publicKey: string | null;
  privateKey: string | null;
  address: string | null;
  setWalletData: (data: Partial<Omit<WalletState, 'setWalletData'>>) => void;
}

export const useAuthStore = create<AuthState>((set: any) => ({
  isAuthenticated: false,
  username: '',
  setAuth: (isAuthenticated: boolean, username: string) => set({ isAuthenticated, username }),
  logout: () => set({ isAuthenticated: false, username: '' }),
}))



export const walletStore = create<WalletState>()(
  persist(
    (set) => ({
      // Initial state
      isConnected: false,
      publicKey: null,
      privateKey: null,
      address: null,

      // Single state updater
      setWalletData: (data) => set((state) => ({
        ...state,
        ...data
      })),
    }),
    {
      name: 'wallet-storage',
    }
  )
)