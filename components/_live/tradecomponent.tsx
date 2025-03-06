"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "sonner"
import { fetchTokenData, handleBuyOutcome, handleSellOutcome } from "@/utils/rpcHelpers"

type EventData = {
  id: number
  unique_id: string
  outcomes: {
    id: number
    outcome_title: string
    current_supply: number
    total_liquidity: number
  }[]
}

type PriceData = {
  outcomeId: number
  title: string
  price: number
  currentSupply: number
  totalLiquidity: number
  btcPrice: number
  outcome: {
    outcome_title: string
  }
}

type UserShare = {
  id: number
  outcomeId: number
  outcomeTitle: string
  shares: number
  averagePrice: number
}

type TradeComponentProps = {
  eventData: EventData | null
  isLoading: boolean
  address: string | undefined
  isDisconnected: boolean
  isConnecting: boolean
  setLastTradeTimestamp: React.Dispatch<React.SetStateAction<number>>
}

export default function TradeComponent({
  eventData,
  isLoading,
  address,
  isDisconnected,
  isConnecting,
  setLastTradeTimestamp,
}: TradeComponentProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isBuySelected, setIsBuySelected] = useState(true)
  const [shares, setShares] = useState(10)
  const [price, setPrice] = useState("10")
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null)
  const [outcomePrices, setOutcomePrices] = useState<PriceData[]>([])
  const [positionsData, setPositionsData] = useState<any>([])
  const [userShares, setUserShares] = useState<UserShare[]>([])
  const [userSharesLoading, setUserSharesLoading] = useState(false)

  // Function to fetch user outcome shares
  const fetchUserOutcomeShares = async () => {
    if (!eventData?.id || !address || isDisconnected) return

    setUserSharesLoading(true)
    try {
      const accessToken = localStorage.getItem("accessToken")

      if (!accessToken) {
        throw new Error("Access token not found")
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}trades/user-outcome-shares/${eventData.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      console.log(response)

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`)
      }

      const data = await response.json()
      console.log("User outcome shares:", data)
      setUserShares(data)
    } catch (error) {
      console.error("Error fetching user outcome shares:", error)
      toast.error("Failed to load your shares")
    } finally {
      setUserSharesLoading(false)
    }
  }

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  // Fetch user shares when event data changes or after authentication
  useEffect(() => {
    if (eventData?.id && address && !isDisconnected) {
      fetchUserOutcomeShares()
    }
  }, [eventData?.id, address, isDisconnected]) // Removed fetchUserOutcomeShares from dependencies

  useEffect(() => {
    if (!eventData?.id) return

    const fetchPrices = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}trades/${eventData.id}`)
        if (!response.ok) throw new Error("Failed to fetch prices")
        const data = await response.json()
        setOutcomePrices(data)
      } catch (error) {
        console.error("Error fetching prices:", error)
        toast.error("Failed to fetch current prices")
      }
    }

    fetchPrices()
    const intervalId = setInterval(fetchPrices, 10000) // 10 seconds

    return () => clearInterval(intervalId)
  }, [eventData?.id])

  useEffect(() => {
    const fetchData = async () => {
      if (eventData === null) {
        return
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}trades?eventID=48&sortBy=createdAt%3Adesc&limit=10&page=1`,
        )
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        setPositionsData(result)
      } catch (err) {
        console.error("Error fetching trade history data:", err)
        toast.error("Failed to load trade history")
      }
    }

    fetchData()
    const intervalId = setInterval(fetchData, 10000)
    return () => clearInterval(intervalId)
  }, [eventData])

  const handlePricePreset = (amount: number) => {
    setPrice(amount.toString())
  }

  const handlePlaceOrder = async () => {
    if (!address || isDisconnected) {
      console.error("Cannot place order: User not authenticated")
      toast.error("Please connect your wallet to place an order")
      return
    }

    if (!selectedOutcome) {
      console.error("Cannot place order: Outcome not selected")
      toast.error("Please select an outcome before placing an order")
      return
    }

    if (!eventData) {
      console.error("Cannot place order: Event data missing")
      toast.error("Event data is missing. Please refresh the page")
      return
    }

    if (Number.parseFloat(price) <= 0) {
      console.error("Invalid price amount")
      toast.error("Please enter a valid price amount")
      return
    }

    if (!isBuySelected && shares <= 0) {
      console.error("Invalid shares amount")
      toast.error("Please enter a valid number of shares")
      return
    }

    const accessToken = localStorage.getItem("accessToken")
    if (!accessToken) {
      console.error("Access token not found")
      toast.error("Authentication failed. Please reconnect your wallet")
      return
    }

    const selectedOutcomeData = eventData.outcomes.find((o) => o.outcome_title === selectedOutcome)

    if (!selectedOutcomeData) {
      console.error("Selected outcome not found in event data")
      toast.error("Invalid outcome selected. Please try again")
      return
    }

    try {
      const getOutcomePriceEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}trades/${eventData.id}`
      try {
        const resp = await fetch(getOutcomePriceEndpoint)
        if (!resp.ok) {
          throw new Error(`Failed to fetch outcome price: ${resp.status}`)
        }
        const jsn = await resp.json()
        const outcome = jsn.find((outcomeInfo: any) => outcomeInfo.outcomeId === selectedOutcomeData.id)

        if (!outcome) {
          throw new Error("Could not find outcome price data")
        }

        if (isBuySelected) {
          const result = await handleBuyOutcome(
            eventData.unique_id,
            Math.floor(outcome.price * Number.parseFloat(price)),
            selectedOutcomeData.id - eventData.outcomes[0].id,
          )
          console.log(result, "++++++++")
          if (!result) {
            console.error("Buy outcome transaction failed")
            toast.error("Buy transaction failed. Please try again")
            return
          }
        } else {
          const result = await handleSellOutcome(
            eventData.unique_id,
            Math.floor(outcome.price * Number.parseFloat(price)),
            selectedOutcomeData.id - eventData.outcomes[0].id,
          )
          console.log(result, "++++++++")
          if (!result) {
            console.error("Sell outcome transaction failed")
            toast.error("Sell transaction failed. Please try again")
            return
          }
        }

      } catch (error) {
        console.error("Error processing transaction:", error)
        toast.error("Failed to process transaction. Please try again")
        return
      }

      try {
        const endpoint = isBuySelected
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}trades/buy`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}trades/sell`
        const body = isBuySelected
          ? {
              eventId: eventData.id,
              outcomeId: selectedOutcomeData.id,
              usdtAmount: price,
            }
          : {
              eventId: eventData.id,
              outcomeId: selectedOutcomeData.id,
              sharesToSell: shares,
            }

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(body),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          const errorMessage = errorData?.message || "Failed to place order"
          throw new Error(errorMessage)
        }

        const data = await response.json()
        console.log("Order placed successfully:", data)
        toast.success("Order placed successfully")
        setLastTradeTimestamp(Date.now())

        // Refetch user shares after successful order
        fetchUserOutcomeShares()
      } catch (error) {
        console.error("Error placing order with API:", error)
        toast.error("Failed to record your order. Please check your wallet")
      }
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("Failed to place order. Please try again later")
    }
  }

  useEffect(() => {
    try {
      fetchTokenData()
      const interval = setInterval(fetchTokenData, 5000)
      return () => clearInterval(interval)
    } catch (error) {
      console.error("Error fetching token data:", error)
      toast.error("Failed to load token data")
    }
  }, [])

  const getOutcomePrice = (outcomeId: number) => {
    const outcomePrice = outcomePrices.find((p) => p.outcomeId === outcomeId)
    return outcomePrice?.price || 0
  }

  const calculateSharePrice = (outcomeId: number) => {
    return getOutcomePrice(outcomeId)
  }

  const calculateBuyPrice = (outcomeId: number) => {
    const sharePrice = calculateSharePrice(outcomeId)
    return sharePrice.toFixed(3)
  }

  // Get user shares for a specific outcome
  const getUserSharesForOutcome = (outcomeTitle: string) => {
    // console.log(outcomeTitle)
    // console.log("userhsa",userShares)

    // userShares.forEach((share) => {
    //   console.log("share : ",share.outcome.outcome_title);
    // });
    return userShares.find(
      (share) => share.outcome.outcome_title.toLowerCase().trim() === outcomeTitle.toLowerCase().trim(),
    )
  }
  const getUserShares = (outcomeTitle: string)=>{
    userShares.forEach((share) => {
        console.log("share : ",share);
      });
      return userShares.find(
        (share) => share.outcome.outcome_title.toLowerCase().trim() === outcomeTitle.toLowerCase().trim(),
      )

  }

  const TradeContent = ({ isDrawer = false }) => (
    <Card className="bg-darkbg2 shadow-none border-none text-white">
      <CardContent className="space-y-5 px-4">
        {isLoading ? (
          <>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </>
        ) : (
          <>
            {!isDrawer && (
              <div className="grid grid-cols-2 bg-darkbg">
                <Button
                  className={`w-full h-10 rounded-none scale-x-[1.07] md:-translate-x-2 font-medium hover:font-medium rounded-t-md ${isBuySelected ? "bg-[#4ADE80] text-black" : "bg-darkbg2 text-white hover:text-black"} hover:z-10 hover:bg-[#4ADE80] shadow-none`}
                  onClick={() => setIsBuySelected(true)}
                >
                  BUY
                </Button>
                <Button
                  className={`w-full h-10 rounded-none scale-x-[1.07] md:translate-x-2 font-medium hover:font-medium ${!isBuySelected ? "bg-[#F87171] text-black" : "bg-darkbg2 text-white hover:text-black"} rounded-t-md shadow-none hover:bg-[#F87171]`}
                  onClick={() => setIsBuySelected(false)}
                >
                  SELL
                </Button>
              </div>
            )}
            <div>
              <h3 className="mb-2">Outcome</h3>
              <div
                className={` ${eventData?.outcomes.length! >= 3 ? "grid grid-cols-2 gap-2" : "grid grid-cols-2 gap-2"}`}
              >
                {eventData?.outcomes
                  .filter((outcome) => outcome.outcome_title.toLowerCase().trim() === "yes")
                  .map((outcome) => {
                    const userShare = getUserSharesForOutcome("yes")
                    return (
                      <Button
                        key={outcome.id}
                        className={`w-full py-5 text-[#4ADE80] bg-darkbg ${selectedOutcome?.toLowerCase().trim() === "yes" ? "bg-[#4ADE80] text-black hover:bg-[#4ADE80]/90" : "text-[#4ADE80] bg-darkbg"}`}
                        onClick={() => {
                          setSelectedOutcome(outcome.outcome_title)
                          console.log(selectedOutcome)
                        }}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex gap-2 items-center">
                            <span>{outcome.outcome_title}</span>
                            <span className="text-xs flex">${calculateBuyPrice(outcome.id)}</span>
                          </div>
                          {/* {userShare && <span className="text-xs">You own: {userShare.shares} shares</span>} */}
                        </div>
                      </Button>
                    )
                  })}

                {eventData?.outcomes
                  .filter((outcome) => outcome.outcome_title.toLowerCase().trim() === "no")
                  .map((outcome) => {
                    const userShare = getUserSharesForOutcome("no")
                    return (
                      <Button
                        key={outcome.id}
                        className={`w-full py-5 ${selectedOutcome?.toLowerCase().trim() === "no" ? "bg-[#F87171] hover:bg-[#F87171]/90 text-black" : "text-[#F87171] bg-darkbg"}`}
                        onClick={() => {
                          setSelectedOutcome(outcome.outcome_title)
                          console.log(selectedOutcome)
                        }}
                      >
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex gap-2 items-center">
                            <span>{outcome.outcome_title}</span>
                            <span className="text-xs flex">${calculateBuyPrice(outcome.id)}</span>
                          </div>
                          {/* {userShare && <span className="text-xs">You own: {userShare.shares} shares</span>} */}
                        </div>
                      </Button>
                    )
                  })}
              </div>
            </div>
            {isBuySelected ? (
              <div>
                <h3 className="mb-2">Price</h3>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="bg-darkbg border-none mb-2"
                />
                <div className="grid grid-cols-4 gap-1">
                  <Button onClick={() => handlePricePreset(0)} size="sm" className="bg-darkbg text-ow1 px-2 text-xs">
                    Reset
                  </Button>
                  <Button onClick={() => handlePricePreset(20)} size="sm" className="bg-darkbg text-ow1 px-2 text-xs">
                    20 PUSD
                  </Button>
                  <Button onClick={() => handlePricePreset(500)} size="sm" className="bg-darkbg text-ow1 px-2 text-xs">
                    500 PUSD
                  </Button>
                  <Button onClick={() => handlePricePreset(1000)} size="sm" className="bg-darkbg text-ow1 px-2 text-xs">
                    10000 PUSD
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="mb-2">Shares</h3>
                <div className="flex justify-center flex-col">
                  <Input
                    type="number"
                    value={shares}
                    onChange={(e) => setShares(Number.parseInt(e.target.value) || 0)}
                    className="bg-darkbg border-none mb-2 flex self-center"
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Current Price: $
                    {calculateSharePrice(
                      eventData?.outcomes.find((o) => o.outcome_title === selectedOutcome)?.id || 0,
                    ).toFixed(7)}
                  </p>
                  {selectedOutcome && (
                    <div className="text-sm text-gray-400 mt-1">
                      {userSharesLoading ? (
                        <Skeleton className="h-4 w-full" />
                      ) : (
                        <>
                          {getUserSharesForOutcome(selectedOutcome) && (
                            <p>Your shares: {getUserShares(selectedOutcome).amount || 0} {selectedOutcome}</p>
                          )}
                        </>
                      )}
                    </div>
                  )}
                  <div className="grid grid-cols-4 gap-1 mt-2">
                    <Button onClick={() => setShares(0)} size="sm" className="bg-darkbg text-ow1 px-2 text-xs">
                      Reset
                    </Button>
                    <Button
                      onClick={() => {
                   
                        const userShare = selectedOutcome ? getUserSharesForOutcome(selectedOutcome).amount : null
                        if (userShare) {
                          setShares(Math.floor(userShare * 0.1))
                        }
                      }}
                      size="sm"
                      className="bg-darkbg text-ow1 px-2 text-xs"
                    >
                      10 %
                    </Button>
                    <Button
                      onClick={() => {
                        const userShare = selectedOutcome ? getUserSharesForOutcome(selectedOutcome).amount : null
                        
                        if (userShare) {
                          setShares(Math.floor(userShare * 0.5))
                        }
                      }}
                      size="sm"
                      className="bg-darkbg text-ow1 px-2 text-xs"
                    >
                      50 %
                    </Button>
                    <Button
                      onClick={() => {
                        const userShare = selectedOutcome ? getUserSharesForOutcome(selectedOutcome).amount : null
                        if (userShare) {
                          setShares(userShare)
                        }
                      }}
                      size="sm"
                      className="bg-darkbg text-ow1 px-2 text-xs"
                    >
                      100 %
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-400">
              {isBuySelected
  ? (() => {
      const sharePrice = Number.parseFloat(
        calculateSharePrice(eventData?.outcomes.find((o) => o.outcome_title === selectedOutcome)?.id || "0").toFixed(7)
      );

      return sharePrice > 0 
        ? `${(Number.parseFloat(price) / sharePrice).toFixed(2)} (Shares)`
        : "0 (Shares)";
    })()
  : ""}

              </p>
              <Button
                className="w-full bg-[#EC762E] hover:bg-orange-600 mt-2"
                onClick={handlePlaceOrder}
                disabled={!address || isDisconnected}
              >
                {address && !isDisconnected ? "Place Order" : "Connect Wallet"}
              </Button>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total</span>
              <span>
                ${" "}
                {isBuySelected
                  ? price
                  : (
                      calculateSharePrice(
                        eventData?.outcomes.find((o) => o.outcome_title === selectedOutcome)?.id || 0,
                      ) * shares
                    ).toFixed(2)}
              </span>
            </div>
            {isBuySelected && (
              <div className="flex justify-between text-sm">
                <span>Potential Return</span>
                <span className="text-green-500">
                  $ {(Number.parseFloat(price) * (outcomePrices[0]?.btcPrice! / 100000000) * 12) / 100} (
                  {(
                    ((calculateSharePrice(
                      eventData?.outcomes.find((o) => o.outcome_title === selectedOutcome)?.id || 0,
                    ) *
                      shares) /
                      (Number.parseFloat(price) * shares) -
                      1) *
                    12
                  ).toFixed(2)}
                  %)
                </span>
              </div>
            )}
            {!isBuySelected && (
              <div className="flex justify-between text-sm">
                <span>Potential Return</span>
                <span className="text-red-500">
                  ${" "}
                  {(
                    calculateSharePrice(eventData?.outcomes.find((o) => o.outcome_title === selectedOutcome)?.id || 0) *
                    shares
                  ).toFixed(2)}{" "}
                  (
                  {(
                    ((calculateSharePrice(
                      eventData?.outcomes.find((o) => o.outcome_title === selectedOutcome)?.id || 0,
                    ) *
                      shares) /
                      Number.parseFloat(price) -
                      1) *
                    100
                  ).toFixed(2)}
                  %)
                </span>
              </div>
            )}
          </>
        )}
        <p className="text-xs text-center text-gray-500">By trading you agree the terms of use</p>
      </CardContent>
    </Card>
  )

  const UserSharesCard = () => {
    if (!address || isDisconnected) {
      return null
    }

    return (
      <Card className="bg-darkbg2 border-none text-ow1 mt-4">
        {/* <CardHeader>
          <CardTitle className="text-ow1 text-lg -mb-1">Your Positions</CardTitle>
        </CardHeader>
        <CardContent>
          {userSharesLoading ? (
            <>
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full" />
            </>
          ) : userShares.length > 0 ? (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-gray-500">
                  <th className="px-4 py-1 text-o1 text-left">Outcome</th>
                  <th className="px-4 text-o1 text-center">Shares</th>
                  <th className="px-4 text-o1 text-right">Avg. Price</th>
                </tr>
              </thead>
              <tbody>
                {userShares.map((share) => (
                  <tr key={share.id}>
                    <td
                      className={`px-4 py-1 ${share.outcomeTitle.toLowerCase() === "yes" ? "text-green-500" : "text-red-500"}`}
                    >
                      {share.outcomeTitle}
                    </td>
                    <td className="px-4 text-center">{share.shares}</td>
                    <td className="px-4 text-right">$ {share.averagePrice.toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">You don't have any positions yet</p>
          )}
        </CardContent> */}
      </Card>
    )
  }

  if (isMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-darkbg p-4 flex justify-around">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="w-[45%] bg-[#4ADE80] text-black">Buy</Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="bg-darkbg2 text-white">
            <TradeContent isDrawer={true} />
          </SheetContent>
        </Sheet>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="w-[45%] bg-[#F87171] text-black">Sell</Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="bg-darkbg2 text-white">
            <TradeContent isDrawer={true} />
          </SheetContent>
        </Sheet>
      </div>
    )
  }

  return (
    <>
      <TradeContent />
      <UserSharesCard />
    </>
  )
}

