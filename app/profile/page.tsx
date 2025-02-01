"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageSquare, PenSquare, Search, MoreVertical } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useWallet } from "@/hooks/useWallet"
import EditProfileModal from "@/components/_layout/EditProfileModal"
import { usePortfolioState } from "@/store/profileStore"
import { TransactionHistory } from "@/components/_live/transaction-history"

interface UserData {
  id?: number
  profile_pic?: string
  username?: string
  about?: string
}

interface Outcome {
  id: number
  outcome_title: string
  current_supply: number
  total_liquidity: number
}

interface Event {
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
  outcomes: Outcome[]
  user: {
    id: number
    username: string
  }
  _count: {
    threads: number
    trades: number
  }
}

const GetWalletAddress = (): string | undefined => {
  const wallet = useWallet()
  return wallet.address!
}

const PredictionCard: React.FC<Event & { showEndButton: boolean }> = ({
  id,
  image,
  question,
  outcomes,
  description,
  showEndButton,
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
    <div className="relative bg-[#0c0c0c]">
      <Link href={`/discover/${id}`} className="block">
        <div className="group cursor-pointer" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Card
            className={`bg-[#151419] shadow-none dm-sans border-none rounded-none text-ow1 overflow-hidden transition-all duration-200 group-hover:bg-[] group-hover:text-white ${showEndButton ? "w-full" : "w-5/6"}`}
          >
            <CardContent className="p-1 border border-transparent group-hover:border-ow1 group-hover:border-[1px] transition-all duration-200">
              <div className="flex">
                <div className="w-1/3 aspect-square border-none bg-[#2A2A2A] rounded-none flex items-center justify-center group-hover:bg-[#0C0C0C]">
                  <img src={image || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="w-2/3 px-2 py-1 flex flex-col justify-between">
                  <div className="flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-[#89A2ED] mb-1">KryptoCnight</p>
                      <h3 className="text-sm font-semibold text-ow1 line-clamp-2">{question}</h3>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between gap-2">
                      {outcomes.slice(0, 2).map((outcome, index) => (
                        <Button
                          key={outcome.id}
                          className={`w-full text-xs py-1 px-2 ${
                            index % 2 === 0
                              ? "bg-[#0C0C0C] text-[#4ADE80] group-hover:text-[#0c0c0c] group-hover:font-semibold group-hover:bg-green-500"
                              : "bg-[#0C0C0C] text-[#F87171] group-hover:text-[#0c0c0c] group-hover:font-semibold group-hover:bg-red-500"
                          }`}
                        >
                          {outcome.outcome_title}
                        </Button>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-ow1 mt-2">
                      <span>$0 Vol.</span>
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" /> 0
                      </span>
                      <span className="flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" /> 0
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {showEndButton && (
                <div className="mt-2">
                  <Link href={`/end-event/${id}`}>
                    <Button className="w-full bg-red-500 hover:bg-red-600 text-white text-xs py-1 px-2">
                      End Event
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Link>
      {showTooltip && (
        <div
          className="fixed z-50 w-64 bg-[#1E1E1E] text-white p-4 rounded-md shadow-lg"
          style={{
            left: `${tooltipPosition.x + 20}px`,
            top: `${tooltipPosition.y}px`,
            transform: "translate(0, -50%)",
            pointerEvents: "none",
          }}
        >
          <h4 className="font-semibold mb-2">{question}</h4>
          <p className="text-sm text-gray-300">{description}</p>
        </div>
      )}
    </div>
  )
}

export default function Component() {
  const address = GetWalletAddress()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [eventStatus, setEventStatus] = useState<string>("ACTIVE")
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)
  const portfolioStore = usePortfolioState((state) => state)

  useEffect(() => {
    const fetchUserData = async () => {
      if (!address) return
      try {
        const accessToken = localStorage.getItem("accessToken")
        const username = localStorage.getItem("username")
        if (!username) throw new Error("Username not found in localStorage")

        const userResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}users?username=${username}&limit=10&page=1`,
          {
            headers: {
              Authorization: `Bearer ${accessToken || ""}`,
            },
          },
        )
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data")
        }
        const userData: UserData[] = await userResponse.json()
        if (userData.length === 0) throw new Error("User not found")
        setUserData(userData[0])
        setLoading(false)

        // Fetch events
        await fetchEvents(userData[0].id)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        setLoading(false)
      }
    }

    fetchUserData()
  }, [address])

  const fetchEvents = async (userId: number | undefined) => {
    if (!userId) return
    try {
      const accessToken = localStorage.getItem("accessToken")
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}events?userID=${userId}&status=${eventStatus}&sortBy=asc&limit=10&page=1`,
        {
          headers: {
            Authorization: `Bearer ${accessToken || ""}`,
          },
        },
      )
      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }
      const data: Event[] = await response.json()
      setEvents(data)
    } catch (err) {
      console.error("Error fetching events:", err)
    }
  }

  useEffect(() => {
    if (userData?.id) {
      fetchEvents(userData.id)
    }
  }, [eventStatus, userData?.id])

  const SkeletonLoading = () => (
    <div className="min-h-screen bg-[#0c0c0c] text-white p-4 md:p-8">
      <div className="max-w-[90%] md:max-w-[70%] mx-auto">
        <Skeleton className="h-8 w-32 bg-gray-700 my-10" />

        <Card className="bg-darkbg2 border-[1px] border-gray-800 p-6 md:p-8 rounded-xl">
          <div className="flex justify-center mb-8">
            <Card className="bg-transparent shadow-none border-none p-6 rounded-xl w-full sm:w-[450px]">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <Skeleton className="w-32 h-32 bg-gray-700 rounded-md" />
                <div className="flex flex-col dm-sans items-center sm:items-start gap-2 w-full">
                  <Skeleton className="h-6 w-32 bg-gray-700" />
                  <Skeleton className="h-4 w-full bg-gray-700" />
                  <Skeleton className="h-4 w-3/4 bg-gray-700" />
                  <Skeleton className="h-10 w-full bg-gray-700 mt-2" />
                </div>
              </div>
            </Card>
          </div>

          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="bg-transparent gap-3 border-gray-800 w-full justify-center h-auto p-0 mb-6 overflow-x-auto flex-wrap">
              {["transactions", "participation", "created", "rewards"].map((tab) => (
                <Skeleton key={tab} className="h-10 w-32 bg-gray-700 rounded-md" />
              ))}
            </TabsList>

            <div className="w-3/4 mx-auto">
              {[1, 2, 3, 4].map((item) => (
                <Skeleton key={item} className="h-16 w-full bg-gray-700 rounded-md mb-4" />
              ))}
            </div>
          </Tabs>
        </Card>
      </div>
    </div>
  )

  if (loading) {
    return <SkeletonLoading />
  }

  if (error) {
    return <div className="min-h-screen bg-darkbg text-white flex items-center justify-center">Error: {error}</div>
  }

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white p-4 md:p-8 dm-sans">
      <div className="max-w-[90%] md:max-w-[70%] mx-auto">
        <Link
          href="/discover"
          className="inline-flex w-full justify-center  items-center text-2xl font-bold text-ow1 transition-colors"
        >
          {/* <span className="hover:underline">[ Go Back ]</span> */}
        </Link>

        <Card className="bg-darkbg2 border-[1px] border-gray-800 p-6 md:p-8 rounded-xl">
          <div className="bg-[#1c1f2e]/50 p-6 rounded-xl mb-8">
            <div className="flex flex-col sm:flex-row gap-6 relative">
              {/* Left Section */}
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-1/2">
                <div className="w-36 h-36 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={userData?.profile_pic || "" || "" || "/placeholder.svg"}
                    alt="Profile"
                    width={150}
                    height={150}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-[#F87171] text-md">@{userData?.username || "KryptoNight"}</h2>
                  <p className="text-gray-300 text-sm">
                    {userData?.about || "Lorem Ipsum Dolor Sit Amet Consectetur. Posuere Lorem Enim Eu Nun (BIO)"}
                  </p>
                  <Button
                    variant="outline"
                    className="bg-black w-fit hover:bg-black/80 text-[#F19236] border-none mt-2 text-sm"
                    onClick={() => setIsEditProfileModalOpen(true)}
                  >
                    Edit Profile <PenSquare className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Separator */}
              <div className="hidden sm:block w-px bg-gray-700 self-stretch mx-4" />

              {/* Right Section */}
              <div className="relative flex justify-around w-full translate-y-[15%] sm:w-1/2">
                <div className="flex flex-col gap-2">
                  <span className="text-gray-400 text-sm">Portfolio</span>
                  <div className="flex flex-col">
                    <span className="text-white text-2xl font-semibold">${portfolioStore.pusdBalance}</span>
                    <span className="text-[#22c55e] text-sm">
                      $10.04 (10%) <span className="text-gray-400">Today</span>
                    </span>
                  </div>
                </div>

                {/* Buttons positioned absolutely */}
                <div className="relative translate-y-1/4 flex flex-col gap-2">
                  <Link href="/swap">
                    <Button className="bg-[#EC762E] hover:bg-[#EC762E]/90 w-[106px] text-white h-[32px] ">Swap</Button>
                  </Link>
                  {/* <Button
                  variant="outline"
                  className="bg-[#151419] border-gray-700 text-gray-300 hover:text-gray-300 hover:bg-gray-800 w-[106px] h-[32px] "
                >
                  Withdraw
                </Button> */}
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="transactions" className="w-full">
            <TabsList className="bg-transparent border-b border-gray-700 w-full justify-start h-auto p-0 mb-6 overflow-x-auto">
              <TabsTrigger
                value="transactions"
                className="text-gray-400 hover:text-gray-300 border-b-2 border-[#F19236] rounded-none px-4 py-2 flex-shrink-0 data-[state=active]:bg-transparent data-[state=active]:text-[#F19236] data-[state=inactive]:text-gray-400 data-[state=inactive]:border-b-transparent "
              >
                History
              </TabsTrigger>
              {/* <TabsTrigger
              value="event-participation"
              className="text-gray-400 hover:text-gray-300 rounded-none px-4 py-2 flex-shrink-0 data-[state=active]:bg-transparent data-[state=active]:text-[#F19236] data-[state=active]:border-b-2 data-[state=active]:border-[#F19236]"
            >
              Event Participation
            </TabsTrigger> */}
              {/* <TabsTrigger
              value="events-created"
              className="text-gray-400 hover:text-gray-300 rounded-none px-4 py-2 flex-shrink-0 data-[state=active]:bg-transparent data-[state=active]:text-[#F19236] data-[state=active]:border-b-2 data-[state=active]:border-[#F19236]"
            >
              Events Created
            </TabsTrigger>
            <TabsTrigger
              value="rewards"
              className="text-gray-400 hover:text-gray-300 rounded-none px-4 py-2 flex-shrink-0 data-[state=active]:bg-transparent data-[state=active]:text-[#F19236] data-[state=active]:border-b-2 data-[state=active]:border-[#F19236]"
            >
              Rewards
            </TabsTrigger> */}
            </TabsList>

            <TabsContent value="transactions" className="mt-0">
              {/* Transactions Section */}
              <div className="w-full mx-auto space-y-4">
                {/* Search and Filter Bar */}
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="relative flex-1 min-w-[200px]">
                    <input
                      type="text"
                      placeholder="Search"
                      className="w-full bg-[#1c1f2e] border border-gray-700 rounded-md py-2 pl-4 pr-10 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-[#F19236]"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  </div>
                  <Button variant="outline" className="bg-[#1c1f2e] border-gray-700 text-gray-300">
                    Filter
                  </Button>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[100px] bg-[#1c1f2e] border-gray-700 text-gray-300">
                      <SelectValue placeholder="All" className="" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1c1f2e] border-gray-700 ">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-[120px] bg-[#1c1f2e] border-gray-700 text-gray-300">
                      <SelectValue placeholder="Newest" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1c1f2e] border-gray-700">
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" className="p-2" aria-label="More options">
                    <MoreVertical className="w-5 h-5 text-gray-500  border-gray-700" />
                  </Button>
                </div>

                {/* Transaction History */}
                <TransactionHistory />
              </div>
            </TabsContent>

            <TabsContent value="participation" className="focus-visible:outline-none">
              <div className="w-3/4 mx-auto">
                <div className="grid gap-4">
                  {[1, 2, 3].map((item) => (
                    <Card key={item} className="bg-gray-800/50 p-4 border-none">
                      <h3 className="text-white mb-2">Event #{item}</h3>
                      <p className="text-ow1 text-sm">Participated on 2024-01-{item}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="created" className="focus-visible:outline-none">
              <div className="w-full mx-auto">
                <div className="mb-4">
                  <Select onValueChange={(value) => setEventStatus(value)}>
                    <SelectTrigger className="w-[180px] text-ow1">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-darkbg2 text-ow1">
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                      <SelectItem value="EXPIRED">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => (
                    <PredictionCard key={event.id} {...event} showEndButton={eventStatus === "ACTIVE"} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rewards" className="focus-visible:outline-none">
              <div className="w-3/4 mx-auto">
                <div className="grid gap-4">
                  {[1, 2, 3, 4].map((item) => (
                    <Card key={item} className="bg-gray-800/50 p-4 border-none">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-white mb-1">Reward #{item}</h3>
                          <p className="text-ow1 text-sm">Earned on 2024-03-{item}</p>
                        </div>
                        <span className="text-orange-400 font-medium">+100 Points</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      <EditProfileModal isOpen={isEditProfileModalOpen} onClose={() => setIsEditProfileModalOpen(false)} />
    </div>
  )
}

