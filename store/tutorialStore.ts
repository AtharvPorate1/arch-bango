import { create } from 'zustand'

interface TutorialState {
  currentStep: number
  isAuthModalOpen: boolean
  setCurrentStep: (step: number) => void
  setIsAuthModalOpen: (isOpen: boolean) => void
}

export const useTutorialStore = create<TutorialState>((set) => ({
  currentStep: 0,
  isAuthModalOpen: false,
  setCurrentStep: (step) => set({ currentStep: step }),
  setIsAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
}))

