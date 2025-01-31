import { create } from 'zustand'

interface PortfolioState {
    pusdBalance: number
    setPusdBalance: (balance: number) => void
}

export const usePortfolioState = create<PortfolioState>((set) => ({
    pusdBalance: 0,
    setPusdBalance: (balance) => set({ pusdBalance: balance }),
}))

