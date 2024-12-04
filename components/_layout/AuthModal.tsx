'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAppKit } from '@reown/appkit/react'
import { useAccount, useDisconnect } from 'wagmi'
import { Pencil } from 'lucide-react'
import EditProfileModal from './EditProfileModal'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  username?: string
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, username = "KryptoNight" }) => {
  const { open } = useAppKit()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)

  const handleConnectWallet = () => {
    open()
    
    onClose()
  }

  const handleDisconnect = () => {
    disconnect()
    localStorage.removeItem('accessToken')
    localStorage.removeItem('username')
    onClose()
  }

  const formatAddress = (address: string) => {
    return address
  }

  const handleEditProfile = () => {
    setIsEditProfileOpen(true)
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogTitle className='hidden'>Profile</DialogTitle>
        <DialogContent className="sm:max-w-[425px] bg-[#1F2133] border-gray-800 text-white">
          {isConnected && address ? (
            <div className="flex flex-col gap-4 py-4">
              <div className="flex items-center w-full justify-center">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16  bg-gray-600 rounded-sm" />
                  <div className="flex flex-col">
                    <span className="text-[#89A2ED] dm-sans">@{username}</span>
                    <div className='p-1 bg-darkbg2 flex justify-center border-[1px] border-white/40 rounded-sm'>
                      <button
                        onClick={handleEditProfile}
                        className="flex items-center dm-sans gap-2 text-[#F19236] hover:text-[#ff8533] transition-colors"
                      >
                        Edit Profile <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-[#13141a] rounded-lg font-mono text-sm break-all">
                {formatAddress(address)}
              </div>
              <Button 
                onClick={handleDisconnect}
                className="w-full bg-[#EC762E] hover:bg-[#ff8533] text-[#1F2133]"
              >
                Disconnect Wallet
              </Button>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-white transition-colors text-center"
              >
                [ Cancel ]
              </button>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">Connect Your Wallet</DialogTitle>
              </DialogHeader>
              <p className="text-center text-gray-400">Choose your preferred method to connect:</p>
              <Button 
                onClick={handleConnectWallet} 
                className="w-full bg-[#ff6600] hover:bg-[#ff8533]"
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
        username={username}
      />
    </>
  )
}

export default AuthModal

