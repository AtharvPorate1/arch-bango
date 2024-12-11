
// context/index.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

// Set up queryClient
const queryClient = new QueryClient()


// Set up metadata
const metadata = {
  name: 'bango',
  description: 'AppKit Example',
  url: 'https://testnet.bango.fun', // origin must match your domain & subdomain
  icons: ['https://assets.reown.com/reown-profile-pic.png']
}



function ContextProvider({ children, cookies }: { children: ReactNode; cookies: string | null }) {
// console.log(modal)
  return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default ContextProvider
    