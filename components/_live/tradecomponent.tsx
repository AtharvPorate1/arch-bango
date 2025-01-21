'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "sonner"
import { client } from '@/lib/utils'
import { PubkeyUtil } from '@saturnbtcio/arch-sdk'
import { fetchEventData, fetchTokenData, handleBuyOutcome, handleSellOutcome } from '@/utils/rpcHelpers'

type EventData = {
  id: number
  unique_id: string,
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
  setLastTradeTimestamp
}: TradeComponentProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [isBuySelected, setIsBuySelected] = useState(true)
  const [shares, setShares] = useState(10)
  const [price, setPrice] = useState("10")
  const [selectedOutcome, setSelectedOutcome] = useState<string | null>(null)
  const [outcomePrices, setOutcomePrices] = useState<PriceData[]>([])
  const [positionsData, setPositionsData] = useState<any>([])

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768)
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    return () => window.removeEventListener('resize', checkIfMobile)
  }, [])

  useEffect(() => {
    if (!eventData?.id) return

    const fetchPrices = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}trades/${eventData.id}`)
        if (!response.ok) throw new Error('Failed to fetch prices')
        const data = await response.json()
        setOutcomePrices(data)
      } catch (error) {
        console.error('Error fetching prices:', error)
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
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}trades?eventID=48&sortBy=createdAt%3Adesc&limit=10&page=1`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        const result = await response.json()
        setPositionsData(result)
      } catch (err) {
        console.error('Error fetching data:', err)
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
    if (!address || isDisconnected || !selectedOutcome || !eventData) {
      console.error("Cannot place order: User not authenticated or outcome not selected")
      toast.error("Please connect your wallet to place an order")
      return
    }

    const accessToken = localStorage.getItem('accessToken')
    if (!accessToken) {
      console.error("Access token not found")
      toast.error("Please connect your wallet")
      return
    }

    const selectedOutcomeData = eventData.outcomes.find(o => o.outcome_title === selectedOutcome)

    if (!selectedOutcomeData) {
      console.error("Selected outcome not found in event data")
      return
    }

    try {
      let totalAmountInvesting = 0
      if (isBuySelected) {
        const outcome = outcomePrices.find(outcomeInfo => outcomeInfo.title === selectedOutcome)
        totalAmountInvesting = parseFloat(price) * (outcome?.btcPrice! / 100000000)
      }

      // const publicKeyResp: string = await window.unisat.getPublicKey();
      // const publicKey = publicKeyResp.slice(2, publicKeyResp.length)
      // const contractAddress = await client.getAccountAddress(PubkeyUtil.fromHex(publicKey))

      // const txid = await window.unisat.sendBitcoin(contractAddress, parseInt(price))

      const getOutcomePriceEndpoint = `${process.env.NEXT_PUBLIC_BACKEND_URL}trades/${eventData.id}`
      const resp = await fetch(getOutcomePriceEndpoint);
      const jsn = await resp.json();
      const outcome = jsn.find((outcomeInfo: any) => outcomeInfo.outcomeId === selectedOutcomeData.id)

      if (isBuySelected) {
        let result = await handleBuyOutcome(eventData.unique_id, Math.floor(outcome.price * parseFloat(price)), selectedOutcomeData.id - eventData.outcomes[0].id);
        console.log(result, "++++++++");
        if (!result) {
          return;
        }
      } else {
        let result = await handleSellOutcome(eventData.unique_id, Math.floor(outcome.price * parseFloat(price)), selectedOutcomeData.id - eventData.outcomes[0].id);
        console.log(result, "++++++++");
        if (!result) {
          return;
        }
      }

      return;

      const endpoint = isBuySelected ? `${process.env.NEXT_PUBLIC_BACKEND_URL}trades/buy` : `${process.env.NEXT_PUBLIC_BACKEND_URL}trades/sell`
      const body = isBuySelected
        ? {
          eventId: eventData.id,
          outcomeId: selectedOutcomeData.id,
          usdtAmount: totalAmountInvesting
        }
        : {
          eventId: eventData.id,
          outcomeId: selectedOutcomeData.id,
          sharesToSell: shares
        }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(body)
      })

      if (!response.ok) {
        throw new Error('Failed to place order')
      }

      const data = await response.json()
      console.log("Order placed successfully:", data)
      toast.success("Order placed successfully")
      setLastTradeTimestamp(Date.now())
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error("Some error occurred, order is not placed!")
    }
  }

  useEffect(() => {
    fetchTokenData();
    const interval = setInterval(fetchTokenData, 5000);
    return () => clearInterval(interval);
  }, [fetchTokenData]);


  const getOutcomePrice = (outcomeId: number) => {
    const outcomePrice = outcomePrices.find(p => p.outcomeId === outcomeId)
    return outcomePrice?.price || 0
  }

  const calculateSharePrice = (outcomeId: number) => {
    return getOutcomePrice(outcomeId)
  }

  const calculateBuyPrice = (outcomeId: number) => {
    const sharePrice = calculateSharePrice(outcomeId)
    return (sharePrice).toFixed(3)
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
                  className={`w-full h-10 rounded-none scale-x-[1.07] md:-translate-x-2 font-medium hover:font-medium rounded-t-md ${isBuySelected ? 'bg-[#4ADE80] text-black' : 'bg-darkbg2 text-white hover:text-black'} hover:z-10 hover:bg-[#4ADE80] shadow-none`}
                  onClick={() => setIsBuySelected(true)}
                >
                  BUY
                </Button>
                <Button
                  className={`w-full h-10 rounded-none scale-x-[1.07] md:translate-x-2 font-medium hover:font-medium ${!isBuySelected ? 'bg-[#F87171] text-black' : 'bg-darkbg2 text-white hover:text-black'} rounded-t-md shadow-none hover:bg-[#F87171]`}
                  onClick={() => setIsBuySelected(false)}
                >
                  SELL
                </Button>
              </div>
            )}
            <div>
              <h3 className="mb-2">Outcome</h3>
              <div
                className={` ${eventData?.outcomes.length! >= 3 ? 'grid grid-cols-2 gap-2' : 'grid grid-cols-2 gap-2'
                  }`}
              >
                {eventData?.outcomes.map((outcome, index) => (
                  <Button
                    key={outcome.id}
                    className={`w-full py-5 bg-darkbg ${selectedOutcome === outcome.outcome_title
                        ? index % 2 === 0
                          ? 'bg-[#4ADE80] text-black hover:bg-[#4ADE80]'
                          : 'bg-[#F87171] text-black hover:bg-[#F87171]'
                        : index % 2 === 0
                          ? 'text-[#4ADE80] hover:text-[#4ADE80] hover:bg-darkbg'
                          : 'text-[#F87171] hover:bg-darkbg hover:text-[#F87171]'
                      }`}
                    onClick={() => setSelectedOutcome(outcome.outcome_title)}
                  >
                    <div className="flex gap-2 items-center">
                      <span>{outcome.outcome_title}</span>
                      <span className="text-xs flex">${calculateBuyPrice(outcome.id)}</span>
                    </div>
                  </Button>
                ))}
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
                  <Button onClick={() => handlePricePreset(2000)} size="sm" className="bg-darkbg text-ow1 px-2 text-xs">
                    2000 SATS
                  </Button>
                  <Button onClick={() => handlePricePreset(5000)} size="sm" className="bg-darkbg text-ow1 px-2 text-xs">
                    5000 SATS
                  </Button>
                  <Button onClick={() => handlePricePreset(10000)} size="sm" className="bg-darkbg text-ow1 px-2 text-xs">
                    10000 SAT
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
                    onChange={(e) => setShares(parseInt(e.target.value) || 0)}
                    className="bg-darkbg border-none mb-2 flex self-center"
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    Current Price: ${calculateSharePrice(eventData?.outcomes.find(o => o.outcome_title === selectedOutcome)?.id || 0).toFixed(7)}
                  </p>
                  <div className="grid grid-cols-4 gap-1">
                    <Button onClick={() => setShares(0)} size="sm" className="bg-darkbg text-ow1 px-2 text-xs">
                      Reset
                    </Button>
                    <Button onClick={() => setShares(Math.floor(shares * 0.1))} size="sm" className="bg-darkbg text-ow1 px-2 text-xs">
                      10 %
                    </Button>
                    <Button onClick={() => setShares(Math.floor(shares * 0.5))} size="sm" className="bg-darkbg text-ow1 px-2 text-xs">
                      50 %
                    </Button>
                    <Button onClick={() => setShares(shares)} size="sm" className="bg-darkbg text-ow1 px-2 text-xs">
                      100 %
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-400">
                {isBuySelected
                  ? `${calculateSharePrice(eventData?.outcomes[0]?.id || 0).toFixed(7)} (Shares)`
                  : `${(parseFloat(price) * shares).toFixed(2)} SATS`}
              </p>
              <Button
                className="w-full bg-[#EC762E] hover:bg-orange-600 mt-2"
                onClick={handlePlaceOrder}
                disabled={!address || isDisconnected}
              >
                {address && !isDisconnected ? 'Place Order' : 'Connect Wallet'}
              </Button>
            </div>
            <div className="flex justify-between text-sm">
              <span>Total</span>
              <span>$ {isBuySelected ? (parseFloat(price) * (outcomePrices[0]?.btcPrice! / 100000000)).toFixed(2) : (calculateSharePrice(eventData?.outcomes.find(o => o.outcome_title === selectedOutcome)?.id || 0) * shares).toFixed(2)}</span>
            </div>
            {isBuySelected && (
              <div className="flex justify-between text-sm">
                <span>Potential Return</span>
                <span className="text-green-500">$ {(parseFloat(price) * (outcomePrices[0]?.btcPrice! / 100000000) * 12) / 100} ({((calculateSharePrice(eventData?.outcomes[0]?.id || 0) * shares / (parseFloat(price) * shares) - 1) * 12).toFixed(2)}%)</span>
              </div>
            )}
            {!isBuySelected && (
              <div className="flex justify-between text-sm">
                <span>Potential Return</span>
                <span className="text-red-500">$ {(calculateSharePrice(eventData?.outcomes.find(o => o.outcome_title === selectedOutcome)?.id || 0) * shares).toFixed(2)} ({((calculateSharePrice(eventData?.outcomes.find(o => o.outcome_title === selectedOutcome)?.id || 0) * shares / (parseFloat(price)) - 1) * 100).toFixed(2)}%)</span>
              </div>
            )}
          </>
        )}
        <p className="text-xs text-center text-gray-500">By trading you agree the terms of use</p>
      </CardContent>
    </Card>
  )

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
      <Card className="bg-darkbg2 border-none text-ow1 mt-4">
        <CardHeader>
          <CardTitle className="text-ow1 text-lg -mb-1">Trade History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-6 w-full" />
            </>
          ) : address && !isDisconnected ? (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-gray-500">
                  <th className="px-4 py-1 text-o1 text-left">Outcome</th>
                  <th className="px-4 text-o1 text-center">Price</th>
                  <th className="px-4 text-o1 text-right">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {positionsData.map((trade: any) => (
                  <tr key={trade.id}>
                    {
                      trade.order_type === "SELL"
                        ? <td className="px-4 py-1 text-red-500">{trade.outcome.outcome_title}</td>
                        : <td className="px-4 py-1 text-green-500">{trade.outcome.outcome_title}</td>
                    }
                    <td className="px-4 text-center">$ {trade.amount}</td>
                    <td className="px-4 text-right">{trade.order_size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">Connect your wallet to view your position</p>
          )}
        </CardContent>
      </Card>
    </>
  )
}

