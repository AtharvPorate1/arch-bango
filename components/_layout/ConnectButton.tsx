'use client'

import React, { useState, useEffect } from 'react'
import { useAccount, useSignMessage, useDisconnect } from 'wagmi'
import { toast } from 'sonner'
import AuthModal from './AuthModal'

interface SignatureData {
  walletAddress: string
  signature: string
}

interface BackendResponse {
  user: {
    id: number
    username: string
    about: string
    wallet_address: string
    role: string
    profile_pic: string | null
    createdAt: string
    updatedAt: string
  }
  tokens: {
    access: {
      token: string
      expires: string
    }
    refresh: {
      token: string
      expires: string
    }
  }
}

function ConnectButton(): JSX.Element {
  const { address, isConnected } = useAccount()
  const { signMessage } = useSignMessage({
    mutation: {
      onSuccess(signature) {
        if (address) {
          const signatureData: SignatureData = {
            walletAddress: address,
            signature
          }
          fetchToken(signatureData)
        }
      },
      onError(error) {
        console.error("Error signing message:", error)
        toast.error("Failed to sign message. Please try again.")
        setIsSigningMessage(false)
      }
    }
  })
  const [hasAccessToken, setHasAccessToken] = useState(false)
  const [username, setUsername] = useState("...")
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isSigningMessage, setIsSigningMessage] = useState(false)

  useEffect(() => {
    const checkAccessToken = () => {
      const token = localStorage.getItem('accessToken')
      setHasAccessToken(!!token)
    }

    checkAccessToken()

    if (isConnected && address && !hasAccessToken) {
      handleSignMessage()
    }

    if (!isConnected) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('username')
      setHasAccessToken(false)
      setUsername("...")
    }
  }, [isConnected, address])

  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    if (storedUsername) {
      setUsername(storedUsername)
    }
  }, [])

  const fetchToken = async (signatureData: SignatureData): Promise<void> => {
    try {
      const response = await fetch('https://backend-tkuv.onrender.com/v1/auth/get-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signatureData)
      })
    
      if (!response.ok) {
        throw new Error('Failed to fetch token from backend')
      }

      const result: BackendResponse = await response.json()
      setUsername(result.user.username)
    
      localStorage.setItem('accessToken', result.tokens.access.token)
      localStorage.setItem('username', result.user.username)
      setHasAccessToken(true)
      setIsSigningMessage(false)
      console.log('Access token and username saved to local storage')
    } catch (error) {
      console.error("Error fetching token:", error)
      toast.error("Failed to fetch token. Please try again.")
      setIsSigningMessage(false)
    }
  }

  const handleSignMessage = async (): Promise<void> => {
    if (localStorage.getItem('accessToken')) {
      console.log('Access token already exists')
      return
    }

    if (!address || isSigningMessage) {
      return
    }

    setIsSigningMessage(true)
    const message = "Prediction market at its peak with Bango"
    
    signMessage({ message })
  }

  const handleAppkit = () => {
    setIsAuthModalOpen(true)
  }

  return (
    <div>
      {isConnected ? (
        <div className='flex gap-2'>
          <span 
            onClick={handleAppkit} 
            className='flex hover:cursor-pointer self-center dm-sans text-ow1'
          > 
            [ {isSigningMessage ? 'signing...' : username} ] 
          </span>
        </div>
      ) : (
        <div 
          onClick={handleAppkit} 
          className='text-ow1 cursor-pointer'
        >
          [ connect wallet ]
        </div>
      )}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        username={username}
      />
    </div>
  )
}

export default ConnectButton

