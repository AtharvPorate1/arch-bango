"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { AlertTriangle } from "lucide-react"

interface Trade {
  account: string
  type: "buy" | "sell"
  sol: number
  glm: string
  date: string
  transaction: string
  hasWarning?: boolean
}

const trades: Trade[] = [
  { account: "E2Uah8", type: "buy", sol: 3.063, glm: "7.66m", date: "4h ago", transaction: "8saLqS" },
  {
    account: "DAi6CT",
    type: "buy",
    sol: 0.107,
    glm: "275.09k",
    date: "4h ago",
    transaction: "21kkT5",
    hasWarning: true,
  },
  { account: "88jp", type: "buy", sol: 0.105, glm: "271.48k", date: "4h ago", transaction: "M2Cz8F", hasWarning: true },
  { account: "UgJ6m1", type: "buy", sol: 0.542, glm: "1.46m", date: "4h ago", transaction: "63Ptqn", hasWarning: true },
  { account: "FxjyhG", type: "buy", sol: 2.18, glm: "5.75m", date: "4h ago", transaction: "3KG2Fc", hasWarning: true },
  {
    account: "2gucMc",
    type: "buy",
    sol: 0.158,
    glm: "408.73k",
    date: "4h ago",
    transaction: "5msguA",
    hasWarning: true,
  },
  {
    account: "FYzsN1",
    type: "buy",
    sol: 0.216,
    glm: "587.41k",
    date: "4h ago",
    transaction: "gdLtAi",
    hasWarning: true,
  },
  { account: "AdjZzR", type: "buy", sol: 0.101, glm: "277.08k", date: "4h ago", transaction: "dRpY5d" },
  { account: "7XwkWc", type: "buy", sol: 0.47, glm: "1.29m", date: "4h ago", transaction: "3YjK6M", hasWarning: true },
  { account: "CSeRrB", type: "buy", sol: 0.212, glm: "587.41k", date: "4h ago", transaction: "4sqKZ1" },
  {
    account: "HHBULU",
    type: "buy",
    sol: 0.106,
    glm: "293.99k",
    date: "4h ago",
    transaction: "5xdc4V",
    hasWarning: true,
  },
  { account: "2AgfrX", type: "buy", sol: 1.034, glm: "2.90m", date: "4h ago", transaction: "Z2pai8", hasWarning: true },
  {
    account: "J4AhL8",
    type: "buy",
    sol: 0.129,
    glm: "358.00k",
    date: "4h ago",
    transaction: "2UAAfH",
    hasWarning: true,
  },
  {
    account: "CsSkwC",
    type: "buy",
    sol: 0.099,
    glm: "272.86k",
    date: "4h ago",
    transaction: "3wWgFP",
    hasWarning: true,
  },
  {
    account: "5C5MxN",
    type: "buy",
    sol: 0.099,
    glm: "281.39k",
    date: "4h ago",
    transaction: "YV43LH",
    hasWarning: true,
  },
]

export default function TradingActivity() {
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
            <TableHead className="text-zinc-400">SOL</TableHead>
            <TableHead className="text-zinc-400">GLM</TableHead>
            <TableHead className="text-zinc-400">date</TableHead>
            <TableHead className="text-zinc-400 text-right">transaction</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => (
            <TableRow key={trade.transaction} className="border-zinc-800">
              <TableCell className="font-mono">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-500 rounded-full opacity-20" />
                  {trade.account}
                </div>
              </TableCell>
              <TableCell className="text-emerald-400">{trade.type}</TableCell>
              <TableCell>{trade.sol}</TableCell>
              <TableCell>{trade.glm}</TableCell>
              <TableCell>{trade.date}</TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <span className="font-mono">{trade.transaction}</span>
                  {trade.hasWarning && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

