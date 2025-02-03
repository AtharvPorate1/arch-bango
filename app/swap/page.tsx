"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDownUp } from "lucide-react"
import { toast } from 'sonner'
import { client } from '@/lib/utils'
import { PROGRAM_PUBKEY } from "@/app/constants";
import { PubkeyUtil } from "@saturnbtcio/arch-sdk"
import { handleMintTokens } from "@/utils/rpcHelpers"

export default function SwapInterface() {
  const [fromToken, setFromToken] = useState<"BTC" | "PUSDC">("BTC")
  const [toToken, setToToken] = useState<"BTC" | "PUSDC">("PUSDC")
  const [fromAmount, setFromAmount] = useState(0)
  const [toAmount, setToAmount] = useState(0)
  const [btcUSDPrice, setBtcUsdPrice] = useState(0);
  const [balance, setBalance] = useState(0);

  const toggleSwapDirection = () => {
    setFromToken((prevFrom) => (prevFrom === "BTC" ? "PUSDC" : "BTC"))
    setToToken((prevTo) => (prevTo === "BTC" ? "PUSDC" : "BTC"))
    setFromAmount(0)
    setToAmount(0)
  }

  const executeSwap = async () => {
    
    if (fromToken === "BTC") {

      let contractAddress = await client.getAccountAddress(PubkeyUtil.fromHex(PROGRAM_PUBKEY!));
      // contractAddress = "tb1pd0epx6sjty2xd2ukxmj5j59a3nykuggkkqqsm28x5uweev6s7peqr32gvq"

      // const txid = await window.unisat.sendBitcoin(contractAddress, fromAmount * 100000000);
      // toast.success(`Tx sent for ${txid}`);

      try{
        await handleMintTokens(parseInt(toAmount.toFixed(0)));
        toast.success(`Tokens successfully added!`);
      } catch {
        toast.error(`Couldn't add tokens to your account`);
      }


    } else {
      toast.error("PUSD to BTC swap is not allowed currently");
    }

  }


  const changeFromAmount = (e: any) => {
    const value = Number.isNaN(e.target.value) ? 0 : e.target.value
    setFromAmount(value);
    setToAmount(parseFloat((value * btcUSDPrice).toFixed(2)));

  }


  useEffect(()=> {
  
    const fetchBalance = async () => {
      const balance = await window.unisat.getBalance();
      setBalance(balance.total/100000000)
    }

    fetchBalance();

  })


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}utils/fetch-btc-price`);
        const data = await response.json();

        if (response.status !== 200) {
          return;
        }
        setBtcUsdPrice(data.price)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Make initial call
    fetchData();
    
    // Set up polling interval
    const timer = setInterval(fetchData, 10000);

    // Cleanup function to prevent memory leaks
    return () => clearInterval(timer);
  }, []); 



  return (
    <div className="w-full dm-sans max-w-md translate-y-1/3 mx-auto bg-[#0c0c0c]">
      {/* Main Container with orange glow */}
      <div className="rounded-xl overflow-hidden border border-[#F5841F]">
        {/* Content Area */}
        <div className="p-6 bg-[#141414]">
          {/* Title */}
          <h1 className="text-2xl font-medium text-center mb-2 text-white">Swap</h1>
          <p className="text-center text-gray-400 text-sm mb-6">Swap between BTC and PUSDC</p>

          {/* Swap Interface */}
          <div className="space-y-4">
            {/* From */}
            <div className="space-y-2">
              <div className="relative flex-1">
                <div className="bg-[#1A1A1A] rounded-xl border border-[#F5841F]/20 shadow-[0_0_0_1px_rgba(245,132,31,0.2)] focus-within:shadow-[0_0_0_1px_rgba(245,132,31,0.4)]">
                  <div className="flex justify-between text-sm px-4 pt-3">
                    <span className="text-gray-400">From</span>
                    <span className="text-gray-400">Balance: {balance} BTC</span>
                  </div>
                  <div className="flex px-4 pb-3 items-center justify-between">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={fromAmount}
                      onChange={changeFromAmount}
                      className="w-full bg-transparent border-none text-white focus:outline-none text-lg"
                    />
                    <span className="text-white px-3 text-base">{fromToken}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Swap Direction Toggle */}
            <div className="flex justify-center -my-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSwapDirection}
                className="rounded-full bg-[#F5841F] hover:bg-[#F5841F]/90 w-10 h-10 p-0"
              >
                <ArrowDownUp className="h-5 w-5 text-white" />
              </Button>
            </div>

            {/* To */}
            <div className="space-y-2">
              <div className="relative flex-1">
                <div className="bg-[#1A1A1A] rounded-xl border border-[#F5841F]/20 shadow-[0_0_0_1px_rgba(245,132,31,0.2)] focus-within:shadow-[0_0_0_1px_rgba(245,132,31,0.4)]">
                  <div className="flex justify-between text-sm px-4 pt-3">
                    <span className="text-gray-400">To</span>
                  </div>
                  <div className="flex px-4 pb-3 items-center justify-between">
                    <input
                      type="number"
                      placeholder="0.00"
                      value={toAmount}
                      className="w-full bg-transparent border-none text-white focus:outline-none text-lg"
                    />
                    <span className="text-white px-3 text-base">{toToken}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Execute Swap Button */}
            <Button
              className="w-full bg-[#F5841F] hover:bg-[#F5841F]/90 text-white font-normal h-14 rounded-xl text-base shadow-[0_0_20px_rgba(245,132,31,0.2)]"
              onClick={executeSwap}
            >
              Swap {fromToken} to {toToken}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

