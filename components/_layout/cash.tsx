"use client"

import Link from "next/link"
import { fetchTokenData } from "@/utils/rpcHelpers";
import { PubkeyUtil } from "@saturnbtcio/arch-sdk";
import { useEffect, useState } from "react"
import { usePortfolioState } from "@/store/profileStore";

const Cash = () => {
  const portfolioStore = usePortfolioState((state)=> state);

  const getMyBalance = async () => {
    
    const publicKeyResp: string = await window.unisat.getPublicKey();
    const publicKey = publicKeyResp.slice(2, publicKeyResp.length)
    let pubKeyBytes = Array.from(PubkeyUtil.fromHex(publicKey));
    const data: any = await fetchTokenData();
    const balances: Map<number[], bigint> = data.balances;

    balances.forEach((value, key) => {
      if (key.toString() === pubKeyBytes.toString()) {
        portfolioStore.setPusdBalance(Number(value));
      }
    });
    

  }

  useEffect(() => {

    const intervalId = setInterval(() => {
      getMyBalance()
    }, 10000)

    getMyBalance()

    return () => clearInterval(intervalId)
  }, [])

  return (
    <Link href="/profile">
    <div className="flex flex-col dm-sans w-20 hover:bg-[#191B2A] p-2 rounded-sm cursor-pointer duration-300 items-center">
      <div className="text-[#EC762E] text-md font-medium">
        ${portfolioStore.pusdBalance.toFixed(2)}
      </div>
      <div className="text-gray-400 text-xs mt-1">Portfolio</div>
    </div>
    </Link>
  )
}

export default Cash

