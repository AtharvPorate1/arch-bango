'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Pencil } from 'lucide-react'
import { AddressPurpose, MessageSigningProtocols, request, RpcErrorCode } from "sats-connect"
import { toast } from 'sonner'
import EditProfileModal from './EditProfileModal'
import { walletStore } from '@/store/authStore'
// import Wallet from "sats-connect";
// import FaucetButton from '../Faucet'
import { Steps } from 'intro.js-react'
import 'intro.js/introjs.css'


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


const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialUsername = "KryptoNight" }) => {
  const [username, setUsername] = useState(initialUsername);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Get store values and actions
  const { setWalletData, isConnected, address, publicKey } = walletStore();

  // Move localStorage initialization to a separate useEffect with empty dependency array
  useEffect(() => {
    const savedState = localStorage.getItem('walletState');

    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Only set wallet data if there's actually a connected wallet
        if (parsed.isConnected && parsed.address) {
          setWalletData({
            isConnected: parsed.isConnected,
            publicKey: parsed.publicKey,
            privateKey: parsed.privateKey,
            address: parsed.address
          });
        }
      } catch (error) {
        console.error('Error parsing wallet state:', error);
      }
    }
  }, []); // Empty dependency array - runs only once on mount

  const connectWallet = async () => {
    try {
      // const result: any = await Wallet.request('getAccounts', {
      //   purposes: [AddressPurpose.Ordinals],
      //   message: 'Connect to Predictr Market',
      // });

      const result = await window.unisat.requestAccounts(); 
      const pubKey = await window.unisat.getPublicKey();

      // if (result.result.length === 0) {
      //   throw "No Account found | Wallet Error"
      // }

      if (result.length === 0) {
        throw "No Account found | Wallet Error"
      }

      // const newState = {
      //   isConnected: true,
      //   publicKey: result.result[0].publicKey,
      //   privateKey: null,
      //   address: result.result[0].address,
      // };

      const newState = {
        isConnected: true,
        publicKey: pubKey,
        privateKey: null,
        address: result[0],
      };

      // Update zustand store
      setWalletData(newState);

      // Update localStorage
      localStorage.setItem('walletState', JSON.stringify(newState));

      const message = "Prediction market at its peak with Bango"

      const signResponse: any = await window.unisat.signMessage(message,"bip322-simple")
      // const signResponse: any = await Wallet.request('signMessage', {
      //   address: newState.address!,
      //   message: message,
      //   protocol: MessageSigningProtocols.BIP322,
      // });

      // if (signResponse.status === "success") {
      if (signResponse.length > 0) {
        // const signature = signResponse.result.signature
        const signature = signResponse;
        console.log(signature)

        const walletData = {
          walletAddress: newState.address,
          signature,
          signatureType: `${process.env.NEXT_PUBLIC_APP_TYPE}`
        }

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

          setUsername(data.user.username)
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
      console.error('Something Went Wrong', err);
      toast.error('Failed to connect wallet');
    }
  };

  const disconnectWallet = async () => {
    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    localStorage.removeItem('walletAddress');
    localStorage.removeItem('walletState');

    // Reset username
    setUsername('');

    // Reset wallet state
    setWalletData({
      isConnected: false,
      publicKey: null,
      privateKey: null,
      address: null
    });
  };


  const handleDisconnect = useCallback(async () => {
    await disconnectWallet()
    toast.success("Wallet Disconnected")
  }, [])

  const handleEditProfile = useCallback(() => {
    setIsEditProfileOpen(true)
    onClose()
  }, [])




  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95%] max-w-[600px] sm:w-full bg-[#1F2133] border-gray-800 text-white rounded-lg">
          <DialogTitle className='sr-only'>Profile</DialogTitle>
          {isConnected ? (
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
                {formatAddress(address!)}
              </div>
              <Button
                onClick={handleDisconnect}
                className="w-full bg-[#EC762E] hover:bg-[#ff8533] text-[#1F2133] text-sm sm:text-base"
              >
                Disconnect Wallet
              </Button>
              {/* <FaucetButton /> */}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors text-center text-sm"
              >
                <a href="https://mempool.space/testnet4/faucet " target='_blank'>[ Get Testnet Faucet ]</a>
              </button>
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
                className="modal-connect-button w-full bg-[#ff6600] hover:bg-[#ff8533] text-sm sm:text-base"
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

