import { Card, CardContent } from "@/components/ui/card"
import { useAuthStore } from "@/store/authStore"
import { ArrowUpRight, ArrowDownLeft } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

interface Transaction {
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
  }
}

export function TransactionHistory() {

  const [transactionHistory, setTransactionHistory] = useState<Transaction[]>([]);
  const userId = useAuthStore((state) => state.userId);

  const fetchTxData = async () => {

    const resp = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}trades?userID=${userId!}&sortBy=id:desc&page=1`);
    if (resp.status !== 200) {
      return;
    }

    const jsn: Transaction[] = await resp.json();
    setTransactionHistory(jsn);

    console.log(jsn);
  }

  useEffect(() => {
    fetchTxData()
  }, [])

  return (
    <div className="space-y-4 dm-sans">
      {transactionHistory.map((transaction) => (
        <Card key={transaction.id} className="bg-[#1c1f2e]/50 border-none cursor-pointer">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-full ${transaction.order_type === "BUY" ? "bg-green-500/20" : "bg-red-500/20"}`}>
                {transaction.order_type === "BUY" ? (
                  <ArrowDownLeft className="w-5 h-5 text-green-500" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-red-500 flex justify-center items-center">
                    <Image
                      src={transaction.event.image || "/placeholder.svg"}
                      alt={transaction.event.question}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">{transaction.event.question}</p>
                    <p className="text-xs text-gray-400">{transaction.createdAt.split("T")[0]} {transaction.createdAt.split("T")[1].split(":")[0]}:{transaction.createdAt.split("T")[1].split(":")[1]}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Selected Outcome:{" "}
                  <span className="font-medium text-gray-300">{transaction.outcome.outcome_title}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${transaction.order_type === "BUY" ? "text-green-500" : "text-red-500"}`}>
                {transaction.order_type === "BUY" ? "+" : "-"} {transaction.order_type === "BUY" ? "$" : "Shares"}  {transaction.order_type === "BUY" ? transaction.amount : transaction.order_size}
              </p>
              <p
                className={`text-xs text-green-400`}
              >
                Completed
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

