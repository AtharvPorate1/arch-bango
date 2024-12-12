"use client"

import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import DiscoverCards from '@/components/_live/discovercards'
import Footer from '@/components/_layout/Footer'
import { toast } from 'sonner'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ChevronRight, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from 'next/image'

type CardData = {
  id: number
  unique_id: string
  image: string
  question: string
  option_a: string
  option_b: string
  outcomes: {
    id: number
    outcome_title: string
    current_supply: number
    total_liquidity: number
  }[]
  description: string
  createdAt: Date
}

const navigationItems = [
  { label: "Top", variant: "outline" as const },
  { label: "News", variant: "ghost" as const },
  { label: "Indian Elections", variant: "ghost" as const },
  { label: "IPL", variant: "ghost" as const },
  { label: "Top Test Cricketer", variant: "ghost" as const },
  { label: "WTC FINALS", variant: "ghost" as const },
  { label: "Chill Guy", variant: "ghost" as const },
  { label: "Friday Sale LIVE", variant: "ghost" as const },
]

export default function DiscoverSection() {
  const [sortBy, setSortBy] = useState('featured')
  const [isLoading, setIsLoading] = useState(true)
  const [sortedCards, setSortedCards] = useState<CardData[]>([])
  
  console.log(setSortBy)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://backend-tkuv.onrender.com/v1/events?status=ACTIVE&limit=10&page=1')
        const data = await response.json()
        console.log("data : ",data)
        // toast.success("Data fetched succesfully")
        const sorted = data.sort((a: CardData, b: CardData) => {
          switch (sortBy) {
            case 'recent':
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            default:
              return 0
          }
        })
        
        setSortedCards(sorted)
        setIsLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.message("Some error occured, Please refresh")
        setIsLoading(false)
      }
    }

    setIsLoading(true)
    fetchData()
  }, [sortBy])

  return (
    <div className="min-h-screen dm-sans bg-[#0c0c0c] text-white p-8">
      <div className="max-w-md mx-auto space-y-8">
        {/* Create an Event Button */}
        {/* <div className="flex justify-center">
          <Link href="/create-event">
          <div className="text-lg md:text-2xl hover:underline font-sans font-semibold b text-ow1 border-gray-700 ">
            [ CREATE AN EVENT ]
          </div>
          </Link>
        </div > */}

        {/* Prediction Card */}
        
        
       


        {/* Search Bar */}
      </div>
      <div className="flex flex-col gap-8 p-4 py-6 ">
      {/* Search Bar */}
      <div className="relative max-w-3xl  mx-auto w-full">
        <Input
          placeholder="Search Events/Bets."
          className="w-full bg-[#1c1c1f] text-white py-8 placeholder:text-gray-400 h-12 pr-12 border-[#FF4B00]/40 focus-visible:ring-[#ff4d00]"
        />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-7 w-7 text-[#FF4B00]/40" />
      </div>

      {/* Promotional Cards */}
      <div className="grid grid-cols-1 dm-sans  md:grid-cols-3 gap-4 max-w-7xl mx-auto w-full">
        <Card className="bg-[#151419] border-[#FF4B00]/40 p-4 flex items-center gap-4">
        <div className="w-24 h-24 rounded-lg overflow-hidden">
            <Image
              src="/main/trump.jpg"
              alt="elon"
              className="object-cover w-full h-full"
              width={400}
              height={400}
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="text-ow1 dm-sans text-lg font-medium">2024 election results</h3>
            <Button variant="outline" className="w-fit text-[#89A2ED] bg-[#89A2ED]/20 rounded-full px-5 hover:text-black border-[#89A2ED]">
              View Now!
            </Button>
          </div>
        </Card>

        <Card className="bg-[#151419] border-[#FF4B00]/40 p-4 flex items-center gap-4">
        <div className="w-24 h-24 rounded-lg overflow-hidden">
            <Image
              src="/main/trading.jpg"
              alt="elon"
              className="object-cover w-full h-full"
              width={400}
              height={400}
            />
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="text-ow1 text-lg font-medium">Start Trading</h3>
            <Button variant="outline" className="w-fit text-[#89A2ED] bg-[#89A2ED]/20 rounded-full px-8 hover:text-black border-[#89A2ED]">
              Sign Up
            </Button>
          </div>
        </Card>

        <Card className="bg-[#151419] border-[#FF4B00]/40 p-4 flex items-center gap-4">
        <div className="w-24 h-24 rounded-lg overflow-hidden">
            <Image
              src="/main/elon.jpg"
              alt="elon"
              className="object-cover w-full h-full"
              width={400}
              height={400}
            />
          </div>

          
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="text-ow1 text-lg font-medium">Elon Musk tweet's</h3>
            <Button variant="outline" className="w-fit text-[#89A2ED] bg-[#89A2ED]/20 rounded-full px-8 hover:text-black border-[#89A2ED]">
              See Now
            </Button>
          </div>
        </Card>
      </div>

      {/* Navigation Menu - Centered */}
      <div className="flex justify-center w-full">
        <div className="max-w-7xl w-full">
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-2">
              {navigationItems.map((item, index) => (
                <Button 
                  key={index}
                  variant={item.variant}
                  className={`
                    ${item.variant === 'outline' 
                      ? 'bg-[#ff4d00] text-[#151419] text-xl hover:bg-[#ff4d00]/90 border-none' 
                      : 'text-[#ff4d00] text-xl hover:text-[#ff4d00]/90 bg-[#1F2133] hover:bg-[#1a1c2a]'
                    } 
                    whitespace-nowrap
                  `}
                >
                  {item.label}
                </Button>
              ))}
              <div
  className="text-[#ffffff] bg-[#1F2133] rounded-full flex items-center justify-center h-8 w-8 hover:bg-[#ff4d00]/90"
>
  <ChevronRight className="h-4 w-4" />
</div>

            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </div>
      <div className=''>
        <DiscoverCards/>
      </div>

      <Footer/>
    </div>
  )
}

