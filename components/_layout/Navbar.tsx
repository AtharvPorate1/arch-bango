"use client"

import { useState, useCallback } from "react"
// import span from "next/span"
import { LuArrowUpDown } from "react-icons/lu";

import {  CircleHelp, House, Menu, Paperclip, X } from "lucide-react"
import Image from "next/image"
import ConnectButton from "./ConnectButton"
import Cash from "./cash"
import "intro.js/introjs.css"
import Link from "next/link"
import { Button } from "../ui/button";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const setFilter = useCallback((filter: string) => {
    localStorage.setItem("filter", filter)
  }, [])

  const handleLogoClick = useCallback(() => {
    setFilter("_")
  }, [setFilter])

  const handleCategoryClick = useCallback(
    (category: string) => {
      setFilter(category)
    },
    [setFilter],
  )

  return (
    <>
      <nav className="bg-[#0c0c0c] text-white px-4 py-3 dm-sans">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" onClick={handleLogoClick}>
            <Image src="/mlogo.png" height={200} width={200} alt="Logo" />
          </Link>

          {/* <div className="hidden md:flex items-center text-lg font-medium gap-8">
            <span
              className="text-ow1 hover:text-o1 hover:border-b-2 border-o1 transition-colors"
              onClick={() => handleCategoryClick("sports")}
            >
              Sports
            </span>
            <span
              className="text-ow1 hover:text-o1 hover:border-b-2 border-o1 transition-colors"
              onClick={() => handleCategoryClick("crypto")}
            >
              Crypto
            </span>
            <span
              className="text-ow1 hover:text-o1 hover:border-b-2 border-o1 transition-colors"
              onClick={() => handleCategoryClick("politics")}
            >
              Politics
            </span>
            <span
              className="text-ow1 hover:text-o1 hover:border-b-2 border-o1 transition-colors"
              onClick={() => handleCategoryClick("pop-culture")}
            >
              Pop Culture
            </span>
            <span
              className="text-ow1 hover:text-o1 hover:border-b-2 border-o1 transition-colors"
              onClick={() => handleCategoryClick("business")}
            >
              Business
            </span>
          </div> */}

          <div className="flex items-center ">
            <div className="flex text-[#8F8F8F]">
              <div>
              <a href="/discover#faq">
                <div className="flex flex-col hover:cursor-pointer dm-sans hover:bg-[#191B2A] w-20 p-2 rounded-sm cursor-pointer duration-300 items-center">
                  <div className=" text-md font-medium">
                    <CircleHelp className="w-12" size={24}/>
                  </div>
                  <div className="text-gray-400 text-xs mt-1">FAQ</div>
                </div>
              </a>
              </div>
              <div>
              <Link href="/litepaper">
                <div className="flex flex-col dm-sans hover:cursor-pointer hover:bg-[#191B2A] w-20 p-2 rounded-sm cursor-pointer duration-300 items-center">
                  <div className=" text-md font-medium">
                    <Paperclip size={24}/>
                  </div>
                  <div className="text-gray-400 text-xs mt-1">Litepaper</div>
                </div>
              </Link>
              </div>
              <div>
                <Link href="/discover">
                <div className="flex flex-col dm-sans hover:cursor-pointer hover:bg-[#191B2A] w-20 p-2 rounded-sm cursor-pointer duration-300 items-center">
                  <div className=" text-md font-medium">
                    <House size={24}/>
                  </div>
                  <div className="text-gray-400 text-xs mt-1">Home</div>
                </div>
                </Link>
              </div>

            </div>

            <Cash />
            <Link
                    href="/swap"
                    className="flex items-center gap-1 dm-sans text-[#EC762E] font-bold hover:text-[#FFA500] transition-colors"
                  >
                    <Button className="bg-[#EC762E] hover:bg-[#EC762E]/70 text-[#151419] font-semibold"> 
                    Swap
                    </Button>
                  </Link>
            <span className="">
              <ConnectButton />
            </span>
            <button className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {/* {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <span
              href="/sports"
              className="block py-2 text-white hover:text-gray-300 transition-colors"
              onClick={() => handleCategoryClick("sports")}
            >
              Sports
            </span>
            <span
              href="/crypto"
              className="block py-2 text-white hover:text-gray-300 transition-colors"
              onClick={() => handleCategoryClick("crypto")}
            >
              Crypto
            </span>
            <span
              href="/politics"
              className="block py-2 text-white hover:text-gray-300 transition-colors"
              onClick={() => handleCategoryClick("politics")}
            >
              Politics
            </span>
            <span
              href="/pop-culture"
              className="block py-2 text-white hover:text-gray-300 transition-colors"
              onClick={() => handleCategoryClick("pop-culture")}
            >
              Pop Culture
            </span>
            <span
              href="/business"
              className="block py-2 text-white hover:text-gray-300 transition-colors"
              onClick={() => handleCategoryClick("business")}
            >
              Business
            </span>
          </div>
        )} */}
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

