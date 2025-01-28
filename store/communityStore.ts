import { create } from "zustand"

type CommunityStore = {
  selectedCommunity: string | null
  setSelectedCommunity: (community: string | null) => void
}

export const useCommunityStore = create<CommunityStore>((set) => ({
  selectedCommunity: null,
  setSelectedCommunity: (community) => {
    console.log("Setting selected community:", community)
    set({ selectedCommunity: community })
  },
}))

