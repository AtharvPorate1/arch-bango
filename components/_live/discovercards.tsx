"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, MessageSquare, Search, Star } from 'lucide-react'
import { Input } from '../ui/input'
import { Badge } from "@/components/ui/badge"


export type CardData = {
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
  user: {
    username: string
  }
  _count: {
    threads: number
    trades: number
  }
  community: string[]
}

export const PredictionCard: React.FC<CardData> = ({
  id,
  image,
  question,
  outcomes,
  description,
  _count,
  community, // New prop for tags
}) => {
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [showTooltip, setShowTooltip] = useState(false)
  let tooltipTimer: NodeJS.Timeout

  const handleMouseEnter = (e: React.MouseEvent) => {
    const x = e.clientX
    const y = e.clientY

    if (tooltipTimer) clearTimeout(tooltipTimer)

    tooltipTimer = setTimeout(() => {
      setTooltipPosition({ x, y })
      setShowTooltip(true)
    }, 600)
  }

  const handleMouseLeave = () => {
    if (tooltipTimer) clearTimeout(tooltipTimer)
    setShowTooltip(false)
  }

  return (
    <div className="relative">
      <Link href={`/discover/${id}`}>
        <div className="group" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Card className="bg-[#18181B] border-none overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col gap-2 flex-1">
                    <h2 className="text-lg font-semibold text-white">{question}</h2>
                    {/* <div className="flex flex-wrap gap-1">
                      {community.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-[#2D2D30] text-[#A0A0A0] hover:bg-[#3E3E42]"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div> */}
                  </div>
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="overflow-x-auto w-full pb-2">
                  <div className="grid grid-cols-2 gap-2 w-full">

                    {
                      outcomes
                        .filter(outcome => outcome.outcome_title.toLowerCase().trim() === "yes")
                        .map((outcome) => {
                          return (
                            <Button
                              key={outcome.id}
                              variant="ghost"
                              className={`h-10 text-sm font-medium w-full transition-colors duration-200 "bg-[#1F2133] group-hover:bg-[#1F4A37] hover:text-[#4ADE80] text-[#4ADE80]`}
                            >
                              Buy {outcome.outcome_title} {outcome.outcome_title.toLowerCase().trim() === "yes" && "↑"}

                            </Button>
                          );
                        })
                    }

                    {
                      outcomes
                        .filter(outcome => outcome.outcome_title.toLowerCase().trim() === "no")
                        .map((outcome) => {
                          return (
                            <Button
                              key={outcome.id}
                              variant="ghost"
                              className={`h-10 text-sm font-medium w-full transition-colors duration-200 bg-[#1F2133] group-hover:bg-[#482D33] hover:text-[#F87171] text-[#F87171]`}
                            >
                              Buy {outcome.outcome_title} {outcome.outcome_title.toLowerCase().trim() === "no" && "↓"}
                            </Button>
                          );
                        })
                    }

                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>$500K VOL.</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {_count.threads}
                    </span>
                    <Star className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Link>
      {showTooltip && (
        <div
          className="fixed z-50 w-48 bg-[#1E1E1E] text-white p-2 rounded-md shadow-lg"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y}px`,
            transform: "translate(0, -50%)",
            pointerEvents: "none",
          }}
        >
          <h4 className="font-semibold mb-1 text-sm">{question}</h4>
          <p className="text-xs text-gray-300">{description}</p>
        </div>
      )}
    </div>
  )
}

export const CardSkeleton = () => (
  <Card className="bg-[#151419] border-none text-white overflow-hidden animate-pulse">
    <CardContent className="p-0">
      <div className="flex">
        <div className="w-1/3 aspect-square bg-[#2A2A2A]"></div>
        <div className="w-2/3 p-4">
          <div className="h-4 bg-[#2A2A2A] rounded mb-2"></div>
          <div className="h-8 bg-[#2A2A2A] rounded mb-4"></div>
          <div className="flex gap-2 mb-4">
            <div className="h-8 w-16 bg-[#2A2A2A] rounded"></div>
            <div className="h-8 w-16 bg-[#2A2A2A] rounded"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-16 bg-[#2A2A2A] rounded"></div>
            <div className="h-4 w-16 bg-[#2A2A2A] rounded"></div>
            <div className="h-4 w-16 bg-[#2A2A2A] rounded"></div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)

const ITEMS_PER_PAGE = 9

export default function Component() {
  const [isLoading, setIsLoading] = useState(true)
  const [cards, setCards] = useState<CardData[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState(() => localStorage.getItem("filter") || "_")

  useEffect(() => {
    const handleStorageChange = () => {
      const newFilter = localStorage.getItem("filter") || "_"
      if (newFilter !== filter) {
        setFilter(newFilter)
        setCurrentPage(1)
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Cleanup
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [filter])

  useEffect(() => {
    const fetchData = async (page: number) => {
      try {
        let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}events?status=ACTIVE&sortBy=createdAt:desc&limit=9&page=${page}`
        if (filter !== "_") {
          url += `&community=${filter}`
        }
        const response = await fetch(url)
        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error("Unexpected API response format")
        }
        console.log(data)
        return data
      } catch (error) {
        console.error("Error fetching data:", error)
        throw error
      }
    }

    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const data: CardData[] = await fetchData(currentPage)
        setCards(data)
        setIsLoading(false)
      } catch (error) {
        setError("Failed to fetch data. Please try again later.")
        console.log(error)
        setIsLoading(false)
      }
    }

    loadData()
  }, [currentPage, filter])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
    localStorage.setItem("filter", newFilter)
    setCurrentPage(1) // Reset to first page when filter changes
  }

  const hasNextPage = cards.length === ITEMS_PER_PAGE
  const hasPrevPage = currentPage > 1

  return (
    <div className="bg-[#0c0c0c] text-ow1 dm-sans md:p-8">
      <div className="md:max-w-7xl mx-auto">
        {/* <div className="relative max-w-3xl mb-20 mx-auto w-full">
          <Input
            placeholder="Search Events/Bets."
            className="w-full bg-[#1c1c1f] text-white py-8 placeholder:text-gray-400 h-12 pr-12 border-[#FF4B00]/40 focus-visible:ring-[#ff4d00]"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-7 w-7 text-[#FF4B00]/40" />
        </div> */}

        {/* You can add filter controls here */}
        {/* For example: */}
        {/* <select value={filter} onChange={(e) => handleFilterChange(e.target.value)}>
          <option value="_">All</option>
          <option value="community1">Community 1</option>
          <option value="community2">Community 2</option>
        </select> */}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => (
              <PredictionCard key={card.id} {...card} />
            ))}
          </div>
        )}

        {!isLoading && !error && (
          <div className="mt-8 flex justify-center items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrevPage}
            >
              <ChevronLeft className="h-4 w-4 text-black" />
            </Button>
            <span className="text-sm">Page {currentPage}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNextPage}
            >
              <ChevronRight className="h-4 w-4 text-black" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

