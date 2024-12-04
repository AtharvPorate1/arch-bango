"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="bg-[#0c0c0c] text-white px-4 py-3 dm-sans">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-[#FF4500] rounded p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-white"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
          </div>
          <span className="text-[#FF4500] font-bold text-xl">Crypto Project</span>
        </Link>
        
        <div className="hidden md:flex items-center text-lg font-semibold gap-8">
          <Link href="/sports" className="text-ow1 hover:text-gray-300 transition-colors">
            Sports
          </Link>
          <Link href="/crypto" className="text-ow1 hover:text-gray-300 transition-colors">
            Crypto
          </Link>
          <Link href="/politics" className="text-ow1 hover:text-gray-300 transition-colors">
            Politics
          </Link>
          <Link href="/pop-culture" className="text-ow1 hover:text-gray-300 transition-colors">
            Pop Culture
          </Link>
          <Link href="/business" className="text-ow1 hover:text-gray-300 transition-colors">
            Business
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Button className="bg-[#FF4500] text-white hover:bg-[#FF4500]/90">
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

