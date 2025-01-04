"use client"

import { useEffect, useState } from "react"

const Cash = () => {
  const [playMoney, setPlayMoney] = useState<number | null>(null)

  useEffect(() => {
    const fetchPlayMoney = async () => {
      const accessToken = localStorage.getItem("accessToken")
      if (!accessToken) {
        console.error("No access token found")
        setPlayMoney(null)
        return
      }
      try {
        const storedUsername = localStorage.getItem("username")
        if (!storedUsername) {
          throw new Error("No username found in localStorage")
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}users?username=${storedUsername}&limit=10&page=1`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const data = await response.json()
        if (data && data.length > 0) {
          setPlayMoney(data[0].playmoney)
        } else {
          throw new Error("No user data found")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setPlayMoney(null)
      }
    }

    const intervalId = setInterval(() => {
      fetchPlayMoney()
    }, 5000)

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

