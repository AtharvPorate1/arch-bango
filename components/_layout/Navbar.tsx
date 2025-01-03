'use client'

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from 'lucide-react'
import Image from "next/image"
import ConnectButton from "./ConnectButton"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="bg-[#0c0c0c] text-white px-4 py-3 dm-sans">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 ">
            <Image
              src="/plogo3.png"
              height={200}
              width={200}
              alt="Logo"
            />
          </Link>

        <div className="hidden md:flex items-center text-lg font-medium gap-8">
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
          <ConnectButton />
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

