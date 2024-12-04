'use client'

import React, { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Info } from "lucide-react"
import { toast } from 'sonner'
import Link from 'next/link'
// import { useToast } from '@/hooks/use-toast'


export default function Component() {
  const [eventTitle, setEventTitle] = useState('')
  const [outcomes, setOutcomes] = useState(['', ''])
  const [description, setDescription] = useState('')
  const [resolutionCriteria, setResolutionCriteria] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [endDate, setEndDate] = useState('')
  const [endTime, setEndTime] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
  }

  const uploadImage = async (accessToken: string) => {
    if (!image) return null

    const formData = new FormData()
    formData.append('image', image)
    formData.append('type', 'events')

    const response = await fetch('https://backend-tkuv.onrender.com/v1/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const data = await response.json()
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        throw new Error('You must be logged in to create an event')
      }

      // First upload the image
      const imageUrl = await uploadImage(accessToken)

      // Combine date and time
      const expiryDate = new Date(`${endDate}T${endTime}:00`)

      // Create event payload
      const eventData = {
        question: eventTitle,
        outcomes: outcomes.filter(o => o !== ''),
        resolution_criteria: resolutionCriteria,
        description: description,
        expiry_date: expiryDate.toISOString(),
        community: ['elections', 'USA'],
        ...(imageUrl && { image: imageUrl }),
      }

      // Create the event
      const response = await fetch('https://backend-tkuv.onrender.com/v1/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        throw new Error('Failed to create event')
      }

      toast.success("Event created succesfully, Check discover Page")
      
      // Reset form
      setEventTitle('')
      setOutcomes(['', ''])
      setDescription('')
      setResolutionCriteria('')
      setImage(null)
      setEndDate('')
      setEndTime('')

    } catch (error) {
      
      toast.error(error instanceof Error ? error.message : "Failed to create event. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col gap-8 items-center justify-center bg-darkbg dm-sans">
      <Link href="/discover">
        <div className='text-3xl text-ow1 font-bold hover:text-o1 cursor-pointer'>
            [ Go Back ]
        </div>
        </Link> 
      <Card className="w-full max-w-md md:scale-90 md:-translate-y-10 bg-darkbg2 text-white">
        <CardContent className="p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="event-title">Event Title</Label>
              <Input 
                id="event-title" 
                className="bg-darkbg border-slate-700" 
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="outcomes">Outcomes</Label>
                <Info className="w-4 h-4 ml-2 text-slate-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  placeholder="Option 1" 
                  className="bg-darkbg border-slate-700 placeholder:text-green-500" 
                  value={outcomes[0]}
                  onChange={(e) => setOutcomes([e.target.value, outcomes[1]])}
                  required
                />
                <Input 
                  placeholder="Option 2" 
                  className="bg-darkbg border-slate-700 placeholder:text-red-500" 
                  value={outcomes[1]}
                  onChange={(e) => setOutcomes([outcomes[0], e.target.value])}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                className="bg-darkbg border-slate-700" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resolution-criteria">Resolution Criteria</Label>
              <Textarea 
                id="resolution-criteria" 
                className="bg-darkbg border-slate-700" 
                value={resolutionCriteria}
                onChange={(e) => setResolutionCriteria(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="upload-image">Upload Image</Label>
              <div className="border-2 border-dashed border-slate-700 rounded-md p-4 text-center bg-darkbg">
                <input 
                  type="file" 
                  id="upload-image" 
                  className="hidden" 
                  onChange={handleImageUpload}
                  accept="image/*"
                />
                <label htmlFor="upload-image" className="cursor-pointer">
                  <p className="text-slate-400">
                    {image ? image.name : "Drag and drop photo or click to upload"}
                  </p>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="end-time">End Time</Label>
                <Info className="w-4 h-4 ml-2 text-slate-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  type="date" 
                  placeholder="End date" 
                  className="bg-darkbg border-slate-700" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
                <Input 
                  type="time" 
                  placeholder="Time" 
                  className="bg-darkbg border-slate-700" 
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-o1 hover:bg-orange-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Event...' : 'Create Event'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}