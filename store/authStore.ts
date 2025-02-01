import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  userId: number | undefined,
  isAuthenticated: boolean
  username: string
  setAuth: (isAuthenticated: boolean, username: string, userId: number) => void
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
  userId: undefined,
  isAuthenticated: false,
  username: '',
  setAuth: (isAuthenticated: boolean, username: string, userId: number) => set({ isAuthenticated, username, userId }),
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