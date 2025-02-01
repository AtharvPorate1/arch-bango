import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Holder {
  id: string
  percentage: number
}

const holders: Holder[] = [
  { id: "AAE3Qj", percentage: 78.84 },
  { id: "GN3Uvi", percentage: 1.9 },
  { id: "GheeQZ", percentage: 1.81 },
  { id: "A2QuTd", percentage: 1.65 },
  { id: "ESbDvr", percentage: 1.62 },
  { id: "AK9HnJ", percentage: 1.6 },
  { id: "J2ZnWD", percentage: 1.01 },
  { id: "CV2yiT", percentage: 0.95 },
  { id: "C8yht7", percentage: 0.89 },
  { id: "CVsHJB", percentage: 0.68 },
  { id: "5yaCuY", percentage: 0.64 },
  { id: "D5PDyW", percentage: 0.59 },
  { id: "2A5yat", percentage: 0.54 },
  { id: "FFSpF2", percentage: 0.48 },
  { id: "Gnv7n9", percentage: 0.43 },
  { id: "8WLsyA", percentage: 0.4 },
  { id: "342tYG", percentage: 0.3 },
  { id: "AbgSbz", percentage: 0.23 },
  { id: "DiiRtr", percentage: 0.23 },
  { id: "HvkoQs", percentage: 0.22 },
]

export default function HolderDistribution() {
  return (
    <Card className="bg-zinc-900 text-zinc-100 p-6 dm-sans w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
        <CardTitle className="text-3xl font-normal tracking-tight">holder distribution</CardTitle>
        {/* <Button variant="secondary" className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100">
          generate bubble map
        </Button> */}
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-2">
          {holders.map((holder, index) => (
            <div key={holder.id} className="flex justify-between items-center font-mono text-sm">
              <div>
                {index + 1}. {holder.id}
              </div>
              <div>{holder.percentage.toFixed(2)}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

