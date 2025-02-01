import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownLeft } from "lucide-react"
import Image from "next/image"

interface Transaction {
  id: string
  type: "buy" | "sell"
  amount: number
  date: string
  status: "completed" | "pending" | "failed"
  event: {
    id: string
    name: string
    image: string
    description: string
  }
  selectedOption: {
    question: string
    answer: string
  }
}

const transactions: Transaction[] = [
  {
    id: "1",
    type: "buy",
    amount: 100,
    date: "2024-03-01",
    status: "completed",
    event: {
      id: "evt1",
      name: "US Presidential Election 2024",
      image: "/placeholder.svg?height=50&width=50",
      description: "Predict the outcome of the 2024 US Presidential Election",
    },
    selectedOption: {
      question: "Who will win?",
      answer: "Democratic Candidate",
    },
  },
  {
    id: "2",
    type: "sell",
    amount: 50,
    date: "2024-03-02",
    status: "completed",
    event: {
      id: "evt2",
      name: "Bitcoin Price Prediction",
      image: "/placeholder.svg?height=50&width=50",
      description: "Will Bitcoin reach $100,000 by the end of 2024?",
    },
    selectedOption: {
      question: "Will it happen?",
      answer: "Yes",
    },
  },
  {
    id: "3",
    type: "buy",
    amount: 200,
    date: "2024-03-03",
    status: "pending",
    event: {
      id: "evt3",
      name: "Oscar Best Picture 2025",
      image: "/placeholder.svg?height=50&width=50",
      description: "Predict the winner of the Oscar for Best Picture in 2025",
    },
    selectedOption: {
      question: "Which film will win?",
      answer: "Untitled Spielberg Project",
    },
  },
  {
    id: "4",
    type: "sell",
    amount: 75,
    date: "2024-03-04",
    status: "failed",
    event: {
      id: "evt4",
      name: "Mars Landing 2026",
      image: "/placeholder.svg?height=50&width=50",
      description: "Will humans successfully land on Mars by 2026?",
    },
    selectedOption: {
      question: "Will it happen?",
      answer: "No",
    },
  },
]

export function TransactionHistory() {
  return (
    <div className="space-y-4 dm-sans">
      {transactions.map((transaction) => (
        <Card key={transaction.id} className="bg-[#1c1f2e]/50 border-none">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-full ${transaction.type === "buy" ? "bg-green-500/20" : "bg-red-500/20"}`}>
                {transaction.type === "buy" ? (
                  <ArrowDownLeft className="w-5 h-5 text-green-500" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <Image
                    src={transaction.event.image || "/placeholder.svg"}
                    alt={transaction.event.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-200">{transaction.event.name}</p>
                    <p className="text-xs text-gray-400">{transaction.date}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {transaction.selectedOption.question}:{" "}
                  <span className="font-medium text-gray-300">{transaction.selectedOption.answer}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${transaction.type === "buy" ? "text-green-500" : "text-red-500"}`}>
                {transaction.type === "buy" ? "+" : "-"}${transaction.amount.toFixed(2)}
              </p>
              <p
                className={`text-xs ${
                  transaction.status === "completed"
                    ? "text-green-400"
                    : transaction.status === "pending"
                      ? "text-yellow-400"
                      : "text-red-400"
                }`}
              >
                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

