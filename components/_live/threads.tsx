'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {  X } from "lucide-react"
import Image from "next/image"
import { toast } from "@/hooks/use-toast"


type Thread = {
  id: number
  unique_id: string
  message: string
  image: string
  eventID: number
  userID: number
  createdAt: string
  user: {
    id: number
    username: string
    profile_pic: string
  }
}

const userBgColors = [
  'bg-[#BA9BC7]',
  'bg-[#86EDAA]',
  'bg-[#E0A3A1]',
  'bg-[#FAF1F4]',
  
]

const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem("accessToken")
  }
  return null
}

export default function Component({ 
  isLoading = false,
  id = "1",
  scrollToTop = () => {},
  scrollToBottom = () => {}
}: {
  isLoading?: boolean
  scrollAreaRef?: React.RefObject<HTMLDivElement>
  scrollToTop?: () => void
  scrollToBottom?: () => void
  id?: string
}) {
  const [threads, setThreads] = React.useState<Thread[] | null>(null)
  const [newComment, setNewComment] = React.useState("")
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null)
  const [replyingTo, setReplyingTo] = React.useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const fetchThreads = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}threads?eventID=${id}&limit=100&page=1`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setThreads(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching threads:", error)
      setThreads([])
      toast({
        title: "Error",
        description: "Failed to fetch threads. Please try again later.",
        variant: "destructive",
      })
    }
  }

  React.useEffect(() => {
    fetchThreads()
  }, [id])

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('type', 'threads')

    const token = getAccessToken()
    if (!token) {
      throw new Error("No access token found")
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to upload image: ${response.status} ${response.statusText}. ${errorText}`)
      }

      const data = await response.json()
      if (!data.success || !data.url) {
        throw new Error('Image upload failed or URL not found in server response')
      }
      return data.url
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      let imageUrl = ""
      if (selectedImage) {
        try {
          imageUrl = await uploadImage(selectedImage)
        } catch (error) {
          console.error("Image upload failed:", error)
          toast({
            title: "Warning",
            description: "Failed to upload image. Your comment will be posted without the image.",
            variant: "destructive",
          })
        }
      }

      const body = {
        message: newComment,
        eventID: Number(id),
        image: imageUrl
      }
      const token = getAccessToken()

      if (!token) {
        throw new Error("No access token found")
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}threads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        throw new Error(`Failed to submit comment: ${response.status} ${response.statusText}`)
      }

      await fetchThreads()
      
      setNewComment("")
      setSelectedImage(null)
      setReplyingTo(null)
      setIsDialogOpen(false)
      toast({
        title: "Success",
        description: "Your comment has been posted successfully.",
      })
    } catch (error) {
      console.error("Error submitting comment:", error)
      toast({
        title: "Error",
        description: `Failed to post your comment: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0])
    }
  }

  const ThreadItem = ({ user, createdAt, message, image, id, onReply }: Thread & { onReply: () => void }) => {
    const [isExpanded, setIsExpanded] = React.useState(false)
    const colorIndex = React.useMemo(() => id % userBgColors.length, [id])
    const userBgColor = userBgColors[colorIndex]
    
    if (!user || !user.username) {
      return null
    }

    return (
      <div className="mb-2 px-1  bg-darkbg2">
        <div className="flex items-center gap-2 ">
          <span>
            <Image src={user.profile_pic} alt="chill guy"  width={20} height={20} className="rounded-sm"/>
          </span>
          <span className={`font-bold text-xs text-[#151419]  px-[0.1rem] rounded ${userBgColor}`}>{user.username}</span>
          <span className="text-gray-400 text-xs">{new Date(createdAt).toLocaleTimeString()}</span>
          <button 
            onClick={onReply} 
            className="text-sm text-gray-400 hover:text-ow1"
          >
            [reply]
          </button>
        </div>
        <p className="text-ow1  text-sm mb-1">{message}</p>
        {image && image !== "htt" && (
          <div className="relative">
            <Image
              src={image}
              alt="Thread image"
              width={500}
              height={300}
              className={`cursor-pointer  ${isExpanded ? 'w-full' : 'w-1/2'}`}
              onClick={() => setIsExpanded(!isExpanded)}
            />
            {isExpanded && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                onClick={() => setIsExpanded(false)}
              >
                <X className="h-4 w-4 text-white" />
              </Button>
            )}
          </div>
        )}
      </div>
    )
  }

  const handleReply = (threadId: number) => {
    setReplyingTo(threadId)
    setIsDialogOpen(true)
  }

  const handleCancel = () => {
    setReplyingTo(null)
    setNewComment("")
    setSelectedImage(null)
    setIsDialogOpen(false)
  }

  return (
    <Card className="bg-transparent md:-translate-y-4 w-full rounded-none shadow-none border-none text-ow1">
    <CardContent className="p-0">
      <Tabs defaultValue="thread" className="w-full">
        <TabsList className="bg-transparent shadow-none gap-3 w-full justify-start flex py-4">
        <TabsTrigger 
          value="thread" 
          className="data-[state=active]:text-ow1 data-[state=active]:underline data-[state=active]:shadow-none data-[state=active]:underline-offset-8 data-[state=active]:decoration-o1 data-[state=active]:decoration-2 data-[state=active]:bg-transparent data-[state=inactive]:text-[#8F8F8F] data-[state=inactive]:bg-transparent"
        >
          Thread
        </TabsTrigger>
        <TabsTrigger 
          value="trades" 
          className="data-[state=active]:text-ow1 data-[state=active]:underline data-[state=active]:shadow-none data-[state=active]:underline-offset-8 data-[state=active]:decoration-o1 data-[state=active]:decoration-2 data-[state=active]:bg-transparent data-[state=inactive]:text-[#8F8F8F] data-[state=inactive]:bg-transparent"
        >
          Trades
        </TabsTrigger>
        <TabsTrigger 
          value="holders" 
          className="data-[state=active]:text-ow1 data-[state=active]:underline data-[state=active]:shadow-none data-[state=active]:underline-offset-8 data-[state=active]:decoration-o1 data-[state=active]:decoration-2 data-[state=active]:bg-transparent data-[state=inactive]:text-[#8F8F8F] data-[state=inactive]:bg-transparent"
        >
          Holders
        </TabsTrigger>
        <div className="p-0 hidden md:flex md:w-full md:justify-end ">
              <Button variant="link" className="text-ow1" onClick={scrollToBottom}>
                [ Scroll To Bottom ]
              </Button>
            </div>
        </TabsList>
        
        <TabsContent value="thread" className="mt-0 w-full">
          <div className="space-y-1 w-full">
            <div className="p-0 md:hidden md:w-full md:justify-end ">
              <Button variant="link" className="text-ow1" onClick={scrollToBottom}>
                [ Scroll To Bottom ]
              </Button>
            </div>
            
            {isLoading || isSubmitting ? (
              <>
                <Skeleton className="h-24 w-full mb-2" />
                <Skeleton className="h-24 w-full mb-2" />
                <Skeleton className="h-24 w-full mb-2" />
              </>
            ) : threads && threads.length > 0 ? (
              threads.map((thread) => (
                <ThreadItem key={thread.id} {...thread} onReply={() => handleReply(thread.id)} />
              ))
            ) : (
              <p className="text-ow1 p-4"></p>
            )}
            
            <div className="flex w-1/2 justify-between p-0">
              <Button variant="link" className="text-ow1" onClick={scrollToTop}>
                [ Scroll To Top ]
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="link" className="bg-transparent hover:bg-transparent hover:text-ow1/90 text-ow1">[ Post Reply ]</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-darkbg2 text-ow1">
                  <DialogHeader>
                    <DialogTitle>{replyingTo ? `Reply to thread #${replyingTo}` : 'Add a comment'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Type your comment here..."
                      className="min-h-[100px] bg-darkbg border-gray-600"
                    />
                    <div>
                      <p className="mb-2">Image (optional)</p>
                      <div className="border-2 border-dashed border-gray-600 rounded-md p-4 text-center">
                        {selectedImage ? (
                          <p>{selectedImage.name}</p>
                        ) : (
                          <p>Drag and Drop an image here</p>
                        )}
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="mt-2"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button 
                        type="submit" 
                        className="bg-o1 hover:bg-o1/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Posting...' : 'Post Reply'}
                      </Button>
                      <Button 
                        type="button"
                        variant="ghost" 
                        className="bg-transparent shadow-none hover:bg-transparent text-ow1 hover:text-ow1/90" 
                        onClick={handleCancel}
                        disabled={isSubmitting}
                      >
                        [ Cancel ]
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="trades"></TabsContent>
        <TabsContent value="holders"></TabsContent>
      </Tabs>
    </CardContent>
  </Card>
  )
}