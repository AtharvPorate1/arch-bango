"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from 'lucide-react'
import Image from "next/image"
import Wallet, { AddressPurpose } from 'sats-connect'
import {
  request,
  BitcoinNetworkType,
  RpcErrorCode,
} from "sats-connect"

const ConnectWallet = async () => {
  try {
    const response = await Wallet.request('getAccounts', {
      purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals, AddressPurpose.Stacks],
      message: 'Cool app wants to know your addresses!',
    });
    const walletAddress = response.result[1].address
    console.log("Wallet is connected : ", walletAddress)
    
    const message = "Prediction market at its peak with Bango"
    
    const signResponse = await request("signMessage", {
      address: walletAddress,
      message,
    });
    console.log(signResponse.result)
    
    if (signResponse.status === "success") {
      const signature = signResponse.result.signature
      console.log("Signature : ", signature)
      
      // Create the object and save it to localStorage
      const walletData = {
        walletAddress: walletAddress,
        signature: signature
      }
      localStorage.setItem('walletData', JSON.stringify(walletData))
      
      console.log("Wallet data saved to localStorage")

      // Make API call to get token
      const apiResponse = await fetch('https://backend-tkuv.onrender.com/v1/auth/get-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(walletData),
      });

      if (apiResponse.ok) {
        const data = await apiResponse.json();
        
        // Save accessToken and username to localStorage
        localStorage.setItem('accessToken', data.tokens.access.token);
        localStorage.setItem('username', data.user.username);

        // Delete walletData from localStorage
        localStorage.removeItem('walletData');

        console.log("Access token and username saved, walletData removed");
      } else {
        throw new Error('Failed to get token from API');
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
    alert('Something Went Wrong');
  }
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // const [hasAccessToken, setHasAccessToken] = useState(!!localStorage.getItem('accessToken'));
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [isSigningMessage, setIsSigningMessage] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="bg-[#0c0c0c] text-white px-4 py-3 dm-sans">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-[#FF4500] rounded p-2">
            <Image 
            src="/C.png"
            height={24}
            width={24}
            alt="C"
            />
          </div>
          <span className="text-[#FF4500] font-bold  dm-sans text-xl">Crypto Project</span>
        </Link>
        
        <div className="hidden md:flex items-center text-lg font-medium  gap-8">
          <Link href="/sports" className="text-ow1 hover:text-o1 hover:border-b-2 border-o1 transition-colors">
            Sports
          </Link>
          <Link href="/crypto" className="text-ow1 hover:text-o1 hover:border-b-2 border-o1 transition-colors">
            Crypto
          </Link>
          <Link href="/politics" className="text-ow1 hover:text-o1 hover:border-b-2 border-o1 transition-colors">
            Politics
          </Link>
          <Link href="/pop-culture" className="text-ow1 hover:text-o1 hover:border-b-2 border-o1 transition-colors">
            Pop Culture
          </Link>
          <Link href="/business" className="text-ow1 hover:text-o1 hover:border-b-2 border-o1 transition-colors">
            Business
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button 
            onClick={() => {setIsSigningMessage(true); ConnectWallet().finally(() => setIsSigningMessage(false));}} 
            className="bg-[#FF4500] font-semibold text-lg text-[#151419] hover:bg-[#FF4500]/90"
            disabled={isSigningMessage}
          >
            Connect Wallet
          </Button>
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 pb-4">
          <Link href="/sports" className="block py-2 text-white hover:text-gray-300 transition-colors">
            Sports
          </Link>
          <Link href="/crypto" className="block py-2 text-white hover:text-gray-300 transition-colors">
            Crypto
          </Link>
          <Link href="/politics" className="block py-2 text-white hover:text-gray-300 transition-colors">
            Politics
          </Link>
          <Link href="/pop-culture" className="block py-2 text-white hover:text-gray-300 transition-colors">
            Pop Culture
          </Link>
          <Link href="/business" className="block py-2 text-white hover:text-gray-300 transition-colors">
            Business
          </Link>
        </div>
      )}
    </nav>
  )
}

