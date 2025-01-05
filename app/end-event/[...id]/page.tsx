'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Info } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from 'sonner'

interface Outcome {
  id: number
  outcome_title: string
  current_supply: number
  total_liquidity: number
}

interface EventData {
  id: number
  unique_id: string
  question: string
  outcomes: Outcome[]
  description: string
  resolution_criteria: string
  image: string
  expiry_date: string
  status: string
  _count: {
    threads: number
    trades: number
  }
}

export default function EventDetails() {
  const [eventData, setEventData] = useState<EventData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null)
  const [isClosing, setIsClosing] = useState(false)
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}events/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch event data')
        }
        const data: EventData = await response.json()
        setEventData(data)
      } catch (err) {
        setError('An error occurred while fetching event data')
        console.log(err)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchEventData()
    }
  }, [params.id])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleCloseEvent = async () => {
    if (!selectedOutcome) {
      toast.error("Please select a winning outcome before closing the event.")
      return
    }

    setIsClosing(true)
    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
      toast.error("You are not authenticated. Please log in and try again.")
      setIsClosing(false)
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}events/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          eventId: eventData?.id,
          outcomeWonId: selectedOutcome
        })
      })

      if (!response.ok) {
        throw new Error('Failed to close event')
      }

      toast.success("Event closed successfully!")
      // You might want to redirect the user or update the UI here
    } catch (err) {
      toast.error("Failed to close the event. Please try again.")
      console.log(err)
    } finally {
      setIsClosing(false)
    }
  }

  const isEventExpiredOrClosed = () => {
    if (!eventData) return false
    const currentDate = new Date()
    const expiryDate = new Date(eventData.expiry_date)
    return currentDate > expiryDate || eventData.status === "CLOSED"
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-darkbg dm-sans">
        <Card className="w-full max-w-lg md:scale-90 md:-translate-y-10 bg-darkbg2 text-ow1">
          <CardContent className="p-6 space-y-6">
            <Skeleton className="h-6 w-3/4 bg-gray-700" />
            <Skeleton className="h-4 w-full bg-gray-700" />
            <div className="flex gap-4 w-full">
              <Skeleton className="h-10 w-1/2 bg-gray-700" />
              <Skeleton className="h-10 w-1/2 bg-gray-700" />
            </div>
            <Skeleton className="h-20 w-full bg-gray-700" />
            <Skeleton className="h-20 w-full bg-gray-700" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-gray-700" />
              <Skeleton className="h-4 w-3/4 bg-gray-700" />
              <Skeleton className="h-4 w-1/2 bg-gray-700" />
            </div>
            <Skeleton className="h-10 w-full bg-gray-700" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isEventExpiredOrClosed()) {
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-darkbg dm-sans">
        <Card className="w-full max-w-lg md:scale-90 md:-translate-y-10 bg-darkbg2 text-ow1">
          <CardContent className="p-6 space-y-6">
            <h2 className="text-2xl font-bold text-center text-[#89A2ED]">Event {eventData?.status === "CLOSED" ? "Closed" : "Expired"}</h2>
            <p className="text-center">This event is no longer active.</p>
            <Button 
              className="w-full bg-[#EC762E] hover:bg-orange-700" 
              onClick={() => router.push('/discover')}
            >
              Go to Discovery Page
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col gap-4 items-center justify-center bg-darkbg dm-sans">
      <Link href="/discover">
        <div className='text-3xl text-ow1 font-bold hover:text-o1 cursor-pointer'>
          [ Go Back ]
        </div>
      </Link>
      <Card className="w-full max-w-lg md:scale-90 md:-translate-y-10 bg-darkbg2 text-ow1">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-[#89A2ED]">Event Title</h2>
            <p className="text-xl font-semibold">{eventData?.question}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <h3 className="text-lg text-[#89A2ED] font-bold">Outcomes</h3>
              <Info className="w-4 h-4 ml-2 text-ow1" />
            </div>
            <div className="flex gap-4 w-full">
              {eventData?.outcomes.map((outcome, index) => (
                <Button
                  key={outcome.id}
                  onClick={() => setSelectedOutcome(outcome.id)}
                  className={`w-full ${
                    selectedOutcome === outcome.id
                      ? index === 0
                        ? 'bg-[#4ADE80] text-black'
                        : 'bg-[#F87171] text-black'
                      : index === 0
                      ? 'bg-black text-[#4ADE80]'
                      : 'bg-black text-[#F87171]'
                  }`}
                >
                  {outcome.outcome_title} {(outcome.current_supply / 100).toFixed(1)} ¢
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg text-[#89A2ED] font-bold">Description</h3>
            <p className="text-sm text-ow1">
              {eventData?.description.slice(0, 100)}... <span className="text-blue-400 cursor-pointer">Read more</span>
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg text-[#89A2ED] font-bold">Resolution Criteria</h3>
            <p className="text-sm text-ow1">
              {eventData?.resolution_criteria.slice(0, 100)}... <span className="text-blue-400 cursor-pointer">Read more</span>
            </p>
          </div>

          <div className="bg-darkbg p-4 rounded-md space-y-2">
            <div className="flex justify-between text-sm">
              <span className='text-[#89A2ED]'>Total volume:</span>
              <span>$ {eventData ? eventData._count.trades * 20 : 0}K</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className='text-[#89A2ED]'>No. Of Traders:</span>
              <span>{eventData?._count.trades}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className='text-[#89A2ED]'>End Date & Time:</span>
              <span>{eventData ? formatDate(eventData.expiry_date) : ''}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <h3 className="text-lg text-[#89A2ED] font-bold">Upload Evidence</h3>
              <Info className="w-4 h-4 ml-2 text-ow1" />
            </div>
            <div className="border-2 border-dashed border-slate-700 grid place-content-center h-[150px] rounded-md p-4 text-center bg-darkbg">
              <p className="text-ow1">Drag and drop photo or PDF or txt file</p>
            </div>
            <textarea
              placeholder="Describe the provided evidence"
              className="w-full bg-darkbg grid place-content-center h-[150px] border-slate-700 p-2 rounded-md text-white"
              rows={3}
            />
          </div>

          <Button 
            className="w-full bg-[#EC762E] hover:bg-orange-700" 
            onClick={handleCloseEvent}
            disabled={isClosing || !selectedOutcome}
          >
            {isClosing ? 'Closing Event...' : 'End Event'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

