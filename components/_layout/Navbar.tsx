'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from 'lucide-react'
import Image from "next/image"
import ConnectButton from "./ConnectButton"
import Cash from "./cash"
import { Steps } from 'intro.js-react'
import 'intro.js/introjs.css'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showIntro, setShowIntro] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // useEffect(() => {
  //   // Check if intro has been shown before
  //   const hasSeenIntro = localStorage.getItem('step1')
  //   if (!hasSeenIntro) {
  //     setShowIntro(true)
  //   }
  // }, [])

  const steps = [
    {
      element: '.connect-button-wrapper',
      intro: 'Click here to connect your wallet and start participating!',
      position: 'top',
      highlightClass: 'intro-highlight'
    }
  ]

  const onExit = () => {
    setShowIntro(false)
    // Set flag in localStorage when intro completes
    localStorage.setItem('step1', 'true')
  }

  const handleConnect = () => {
    // Close the intro and set localStorage when connect button is clicked
    setShowIntro(false)
    localStorage.setItem('step1', 'true')
  }

  return (
    <>
      <Steps
        enabled={showIntro}
        steps={steps}
        initialStep={0}
        onExit={onExit}
        options={{
          disableInteraction: false,
          showStepNumbers: false,
          showBullets: false,
          exitOnOverlayClick: true,
          overlayOpacity: 0.8,
          dontShowAgain: true,
          dontShowAgainLabel: "Don't show this again",
          tooltipPosition: 'top',
          highlightClass: 'intro-highlight'
        }}
      />

      <nav className="bg-[#0c0c0c] text-white px-4 py-3 dm-sans">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/mlogo.png"
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
            <Cash />
            {/* <span className="connect-button-wrapper" onClick={handleConnect}> */}
            <span className="" onClick={handleConnect}>
              <ConnectButton  />
            </span>
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

      <style jsx global>{`
        .intro-highlight {
          margin-top: -4.5rem;
          margin-right: -.5rem;
          border-radius: 4px !important;
          background: rgba(255, 255, 255, 0.1) !important;
          border: none !important;
        }
      `}</style>
    </>
  )
}