'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Pencil } from 'lucide-react'
import Wallet, { AddressPurpose } from 'sats-connect'
import { request, RpcErrorCode } from "sats-connect"
import { toast } from 'sonner'
import EditProfileModal from './EditProfileModal'
import { useWallet } from '@/hooks/useWallet'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialUsername?: string
}

// Utility function
const formatAddress = (address: string) => {
  if (!address) return ''
  return `${address}`
}

// Custom hook for wallet functionality
const useWallet2 = (setUsername: (username: string) => void) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState('')
  const wallet = useWallet();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    const storedWalletAddress = localStorage.getItem('walletAddress')
    if (accessToken && storedWalletAddress) {
      setIsWalletConnected(true)
      setWalletAddress(storedWalletAddress)
    }
  }, [])

  const connectWallet = useCallback(async () => {
    try {
      await wallet.connect();
      const address = wallet.address!;
      setWalletAddress(address)
      localStorage.setItem("walletAddress", address)
      
      const message = "Prediction market at its peak with Bango"
      
      const signResponse = await request("signMessage", {
        address,
        message,
      })
      
      if (signResponse.status === "success") {
        const signature = signResponse.result.signature
        
        const walletData = {
          walletAddress: address,
          signature,
          signatureType: `${process.env.NEXT_PUBLIC_APP_TYPE}`
        }
        localStorage.setItem('walletData', JSON.stringify(walletData))
        
        const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}auth/get-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(walletData),
        })

        if (apiResponse.ok) {
          const data = await apiResponse.json()
          
          localStorage.setItem('accessToken', data.tokens.access.token)
          localStorage.setItem('username', data.user.username)
          localStorage.setItem('walletAddress', data.user.wallet_address)
          localStorage.removeItem('walletData')

          setUsername(data.user.username)
          setIsWalletConnected(true)
        } else {
          throw new Error('Failed to get token from API')
        }
      } else {
        if (signResponse.error.code === RpcErrorCode.USER_REJECTION) {
          console.log("User rejected the request")
        } else {
          console.log("Error during signing:", signResponse.error)
        }
      }
    } catch (err) {
      console.error('Something Went Wrong', err)
      toast.error('Failed to connect wallet')
    }
  }, [setUsername])

  const disconnectWallet = useCallback(async () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('username')
    localStorage.removeItem('walletAddress')
    setIsWalletConnected(false)
    setWalletAddress('')
    setUsername('')
    await request("wallet_disconnect", null)
  }, [setUsername])

  return { isWalletConnected, walletAddress, connectWallet, disconnectWallet }
}



const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialUsername = "KryptoNight" }) => {
  const [username, setUsername] = useState(initialUsername)
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const { isWalletConnected, walletAddress, connectWallet, disconnectWallet } = useWallet2(setUsername)

  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    if (storedUsername) {
      setUsername(storedUsername)
    }
  }, [])

  const handleDisconnect = useCallback(async () => {
    await disconnectWallet()
    toast.success("Wallet Disconnected")
  }, [disconnectWallet])

  const handleEditProfile = useCallback(() => {
    setIsEditProfileOpen(true)
    onClose()
  }, [onClose])

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95%] max-w-[600px] sm:w-full bg-[#1F2133] border-gray-800 text-white rounded-lg">
          <DialogTitle className='sr-only'>Profile</DialogTitle>
          {isWalletConnected ? (
            <div className="flex flex-col gap-4 py-4 px-2 sm:px-4">
              <div className="flex items-center w-full justify-center">
                <div className="flex items-center gap-3 w-full max-w-[300px]">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-600 rounded-sm flex-shrink-0" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[#89A2ED] dm-sans text-sm sm:text-base truncate">@{username}</span>
                    <div className='p-1 bg-darkbg2 flex justify-center border-[1px] border-white/40 rounded-sm mt-1'>
                      <button
                        onClick={handleEditProfile}
                        className="flex items-center dm-sans gap-2 text-[#F19236] hover:text-[#ff8533] transition-colors text-xs sm:text-sm"
                      >
                        Edit Profile <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-[#13141a] rounded-lg font-mono text-xs sm:text-sm break-all">
                {formatAddress(walletAddress)}
              </div>
              <Button 
                onClick={handleDisconnect}
                className="w-full bg-[#EC762E] hover:bg-[#ff8533] text-[#1F2133] text-sm sm:text-base"
              >
                Disconnect Wallet
              </Button>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-white transition-colors text-center text-sm"
              >
                [ Cancel ]
              </button>
            </div>
          ) : (
            <div className="grid gap-4 py-4 px-2 sm:px-4">
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-center">Connect Your Wallet</DialogTitle>
              </DialogHeader>
              <p className="text-center text-gray-400 text-sm sm:text-base">Choose your preferred method to connect:</p>
              <Button 
                onClick={connectWallet} 
                className="w-full bg-[#ff6600] hover:bg-[#ff8533] text-sm sm:text-base"
              >
                Connect Wallet
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <EditProfileModal 
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        
      />
    </>
  )
}

export default AuthModal

