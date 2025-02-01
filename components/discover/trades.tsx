"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"

interface Trade {
  id: string
  order_type: "BUY" | "SELL"
  amount: string,
  order_size: string,
  createdAt: string
  status: "completed" | "pending" | "failed"
  event: {
    id: string
    question: string
    image: string
    expiry_date: string
  }
  outcome: {
    id: string
    outcome_title: string
  },
  user: {
    id: number,
    wallet_address: string
  }
}


export default function TradingActivity({ eventID }: { eventID: string }) {

  const [trades, setTrades] = useState<Trade[]>([]);


  const fetchTrades = async () => {

    const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}trades?eventID=${eventID}&sortBy=id:desc&page=1`);
    if (resp.status !== 200) {
      return;
    }

    const jsn = await resp.json()
    setTrades(jsn);

  }

  useEffect(() => {
    fetchTrades();

    const interval = setInterval(fetchTrades, 5000);

    return () => clearInterval(interval);
  }, [])

  return (
    <div className="w-full space-y-4 bg-zinc-900 p-6 dm-sans rounded-lg">
      <div className="space-y-2 text-zinc-400">
        <div className="flex items-center gap-3">
          <span>filter by size</span>
          <Switch className="bg-zinc-700" />
          <div className="flex items-center gap-2 bg-zinc-800 rounded px-2 py-1">
            <span className="text-zinc-500">≥</span>
            <Input type="number" value="0.05" className="w-16 bg-transparent border-0 p-0 text-zinc-300" />
          </div>
          <span className="text-zinc-500">(1876 trades of size greater than 0.05 SOL)</span>
        </div>

        <div className="flex items-center gap-3">
          <span>filter by following</span>
          <Switch disabled className="bg-zinc-700" />
          <span className="text-zinc-500">connect your wallet to filter</span>
        </div>

        <div className="flex items-center gap-3">
          <span>filter by own trades</span>
          <Switch disabled className="bg-zinc-700" />
          <span className="text-zinc-500">connect your wallet to filter</span>
        </div>
      </div>

      <Table>
        <TableHeader className="bg-zinc-800/50">
          <TableRow className="border-zinc-800">
            <TableHead className="text-zinc-400">account</TableHead>
            <TableHead className="text-zinc-400">type</TableHead>
            <TableHead className="text-zinc-400">Amount</TableHead>
            <TableHead className="text-zinc-400">Shares</TableHead>
            <TableHead className="text-zinc-400">date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => (
            <TableRow key={trade.id} className="border-zinc-800">
              <TableCell className="font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full opacity-20" />
                  {trade.user.wallet_address}
                </div>
              </TableCell>
              <TableCell className={`${trade.order_type === "BUY" ? "text-emerald-400" : "text-red-400"}`}>{trade.order_type}</TableCell>
              <TableCell>{trade.amount}</TableCell>
              <TableCell>{trade.order_size}</TableCell>
              <TableCell>{trade.createdAt.split("T")[0]} {trade.createdAt.split("T")[1].split(":")[0]}:{trade.createdAt.split("T")[1].split(":")[1]} {parseInt(trade.createdAt.split("T")[1].split(":")[0]) < 12 ? "AM" : "PM"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

