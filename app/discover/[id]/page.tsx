'use client'

import * as React from "react"
import { useState, useEffect, useCallback } from "react"
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, LinkIcon } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import Footer from "@/components/_layout/Footer"
import Threads from "@/components/_live/threads"
import Image from "next/image"
import PredictionMarketChart from "@/components/_live/predictionmarketchart"
import TradeComponent from "@/components/_live/tradecomponent"
import { request } from "sats-connect"

type EventData = {
  id: number
  unique_id: string
  question: string
  description: string
  resolution_criteria: string
  image: string
  expiry_date: string
  community: string[]
  createdAt: string
  updatedAt: string
  outcomes: {
    id: number
    outcome_title: string
    current_supply: number
    total_liquidity: number
  }[],
  user:{
    username:string
  }

}

export default function EventDetailPage() {
  const { id = "" } = useParams()
  
  // State Management with Instant Authentication
  const [username, setUsername] = useState(() => localStorage.getItem('username') || "connect wallet")
  const [authenticated, setAuthenticated] = useState(() => {
    const storedUsername = localStorage.getItem('username')
    const accessToken = localStorage.getItem('accessToken')
    return !!storedUsername && !!accessToken
  })
  const [isLoading, setIsLoading] = useState(true)
  const [eventData, setEventData] = useState<EventData | null>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [isImageExpanded, setIsImageExpanded] = useState(true)
  const [lastTradeTimestamp, setLastTradeTimestamp] = useState(0)

  // Wallet Connection State
  const [connectionStatus, setConnectionStatus] = useState({
    isDisconnected: true,
    isConnecting: true
  })

  // Scroll Refs
  const scrollAreaRef = React.useRef<HTMLDivElement>(null)

  // Check Authentication Status - Instant and Callback-based
  const checkUsernameAndAuth = useCallback(() => {
    const storedUsername = localStorage.getItem('username')
    const accessToken = localStorage.getItem('accessToken')
    
    // Instantly update state
    if (storedUsername) {
      setUsername(storedUsername)
      setAuthenticated(!!accessToken)
    } else {
      setUsername("connect wallet")
      setAuthenticated(false)
    }
  }, [])

  // Fetch Wallet Address with Authentication Check
  const fetchWalletAddress = useCallback(async () => {
    try {
      const response = await request('wallet_getAccount', null)
      if (response) {
        const walletAddress = response.result.addresses[0].address
        
        setAddress(walletAddress)
        setConnectionStatus({
          isDisconnected: !walletAddress,
          isConnecting: false
        })
        
        // Verify authentication status after wallet connection
        checkUsernameAndAuth()
      }
    } catch (error) {
      console.error('Error fetching wallet address:', error)
      setAddress(null)
      setConnectionStatus({
        isDisconnected: true,
        isConnecting: false
      })
    }
  }, [checkUsernameAndAuth])

  // Fetch Event Data
  const fetchEventData = useCallback(async () => {
    try {
      const response = await fetch(`https://backend-tkuv.onrender.com/v1/events/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch event data')
      }
      const data = await response.json()
      console.log(data)
      setEventData(data)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching event data:', error)
      setIsLoading(false)
    }
  }, [id])

  // Set up storage event listener for cross-tab authentication
  useEffect(() => {
    const handleStorageChange = () => {
      checkUsernameAndAuth()
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [checkUsernameAndAuth])

  // Initial Effects
  useEffect(() => {
    // Initial authentication and wallet connection checks
    checkUsernameAndAuth()
    
    // Set up an interval to check for changes
    const intervalId = setInterval(checkUsernameAndAuth, 1000)
    
    // Attempt wallet address fetch
    fetchWalletAddress()
    
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId)
  }, [checkUsernameAndAuth, fetchWalletAddress])

  // Data Fetching Effect
  useEffect(() => {
    // Fetch event data when component mounts or trade occurs
    fetchEventData()
  }, [id, lastTradeTimestamp])

  // Scroll and Image Utility Functions
  const scrollToTop = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = 0
    }
  }

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }

  const handleImageClick = () => {
    setIsImageExpanded(!isImageExpanded)
  }

  return (
    <>
      <div className="flex md:justify-start justify-center items-start min-h-screen bg-darkbg text-ow1 dm-sans">
        <div className="w-full md:mt-6 md:w-[97%] flex flex-col md:flex-row gap-4 p-4">
          <div className="w-full md:w-[69.99%]">
            <Card className="bg-darkbg2 border-none text-ow1">
              <CardContent className="p-0">
                {isLoading ? (
                  <Skeleton className="w-full h-[480px]" />
                ) : (
                  <PredictionMarketChart id={id} />
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-darkbg2 rounded-none shadow-none border-none text-ow1 mb-4 w-full max-w-4xl md:max-w-full mx-auto">
              <CardHeader className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:p-6">
                {isLoading ? (
                  <Skeleton className="h-40 w-40 rounded-lg shrink-0" />
                ) : (
                  <div 
                    className={`${
                      isImageExpanded ? 'h-40 w-40' : 'h-20 w-20'
                    } rounded-lg bg-purple-900 shrink-0 flex items-center justify-center cursor-pointer `}
                    onClick={handleImageClick}
                  >
                    <Image
                      src={eventData?.image || "/placeholder.svg"}
                      alt="Event image"
                      className="h-full w-full object-cover rounded-lg"
                      width={200}
                      height={200}
                    />
                  </div>
                )}
                <div className={`flex-1 min-w-0 ${isImageExpanded ? '' : 'ml-4'}`}>
                  {isLoading ? (
                    <>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 mb-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-6 w-40" />
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col dm-sans sm:flex-row sm:items-center gap-2 sm:gap-8 mb-2">
                        <div className="text-sm text-[#89A2ED]">{eventData?.user.username}</div>
                        <div className="text-sm text-[#89A2ED]">
                          Ends on {new Date(eventData?.expiry_date || '').toLocaleDateString()}
                          <span className="block sm:inline sm:ml-4 text-o1">Volume: $300k</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg sm:text-xl break-words">{eventData?.question}</CardTitle>
                      <p className="text-sm text-ow1 mt-2 break-words">{eventData?.description}</p>
                    </>
                  )}
                </div>
                <div className="flex gap-2 shrink-0 mt-4 sm:mt-0">
                  <button className="hover:bg-darkbg bg-darkbg p-2 rounded transition-colors duration-200">
                    <Star className="h-4 w-4 text-o1" />
                    <span className="sr-only">Star event</span>
                  </button>
                  <button className="hover:bg-darkbg bg-darkbg p-2 rounded transition-colors duration-200">
                    <LinkIcon className="h-4 w-4 text-o1" />
                    <span className="sr-only">Share event link</span>
                  </button>
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-3/4" />
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-ow1 mb-2">Resolve</h3>
                    <p className="text-sm text-ow1 break-words">{eventData?.resolution_criteria}</p>
                  </>
                )}
              </CardContent>
            </Card>
            
            <Threads 
              id={id} 
              isLoading={isLoading} 
              scrollAreaRef={scrollAreaRef} 
              scrollToTop={scrollToTop} 
              scrollToBottom={scrollToBottom} 
            />
          </div>
          
          <div className="w-full md:w-[28.94%] space-y-2">
            <TradeComponent 
              eventData={eventData} 
              isLoading={isLoading} 
              address={address} 
              isDisconnected={connectionStatus.isDisconnected} 
              isConnecting={connectionStatus.isConnecting}
              authenticated={authenticated}
              username={username}
              setLastTradeTimestamp={setLastTradeTimestamp}
            />
          </div>
        </div>
      </div>
      <Footer/>
    </>
  )
}