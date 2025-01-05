"use client"

import { useEffect, useState } from "react"

const Cash = () => {
  const [playMoney, setPlayMoney] = useState<number | null>(null)

  useEffect(() => {
    const fetchPlayMoney = async () => {

      let balance = await window.unisat.getBalance();
      let total_balance = balance.total;

      // Fetch latest BTC Prices

      const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}utils/fetch-btc-price`);
      const btcPriceJsn = await resp.json();
      const btcPrice: number = btcPriceJsn.price;

      const cost_of_1_sat = btcPrice / 100000000
      const totalMoneyOwned = total_balance * cost_of_1_sat

      setPlayMoney(totalMoneyOwned);

    }

    const intervalId = setInterval(() => {
      fetchPlayMoney()
    }, 10000)

    fetchPlayMoney()

    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="flex flex-col dm-sans hover:bg-[#191B2A] p-2 rounded-sm cursor-pointer duration-300 items-center">
      {playMoney !== null ? (
        <>
          <div className="text-[#EC762E] text-md font-medium">
            ${playMoney.toFixed(2)}
          </div>
          <div className="text-gray-400 text-xs mt-1">Portfolio</div>
        </>
      ) : (
        <>
          <div className="text-[#EC762E] text-md font-medium">$0.00</div>
          <div className="text-gray-400 text-xs mt-1">Login</div>
        </>
      )}
    </div>
  )
}

export default Cash

