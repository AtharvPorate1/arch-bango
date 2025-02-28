"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ArrowUpRight, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FAQItem {
  question: string
  answer: string
  category?: string
}

const faqs: FAQItem[] = [
  {
    question: "What is Predictr.Market?",
    answer:
      "Predictr.Market is an opinion trading platform where users can buy and sell shares in the outcome of real-world events. It enables users to express their views on politics, sports, crypto, markets, and more.",
    category: "General",
  },
  {
    question: "How does Predictr.Market work?",
    answer:
      'Users can purchase "Yes" or "No" shares on specific questions. The market price reflects the collective probability of an event occurring. If your prediction is correct, you can sell your shares for a profit or hold them until resolution.',
    category: "General",
  },
  {
    question: "Who can use Predictr.Market?",
    answer:
      "Anyone who meets our platform's eligibility criteria can participate. Check our terms and conditions for specific requirements based on your location.",
    category: "General",
  },
  {
    question: "What types of markets are available?",
    answer:
      "Predictr.Market hosts markets on various topics, including: Politics, Sports, Crypto, Finance, and Entertainment.",
    category: "Markets",
  },
  {
    question: "How are prices determined?",
    answer:
      'Prices fluctuate based on supply and demand. If more users believe an event will happen, the price of "Yes" shares increases, and "No" shares decrease, and vice versa.',
    category: "Trading",
  },
  {
    question: "What is a share in a prediction market?",
    answer:
      'A share in a prediction market represents a contract that pays out if a specific event outcome occurs. Each market has "Yes" and "No" shares, where: • A "Yes" share pays out 1 unit (e.g., $1 or 1 USDC) if the event happens. • A "No" share pays out 1 unit if the event does not happen. The price of a share fluctuates based on market demand, reflecting the collective probability of the outcome. If you buy a share at $0.60, the market implies a 60% chance of that outcome occurring.',
    category: "Trading",
  },
  {
    question: "How do I create a market?",
    answer:
      "Currently, only verified creators can list markets. We will update a form to apply for creation of market very soon.",
    category: "Markets",
  },
  {
    question: "What happens when a market resolves?",
    answer:
      "Once an event concludes, our system verifies the outcome and settles the market. If you hold winning shares, you receive a payout based on the final price.",
    category: "Markets",
  },
  {
    question: "How do I deposit funds?",
    answer: "You can deposit funds using Unisat wallet.",
    category: "Payments",
  },
  {
    question: "How do I withdraw my earnings?",
    answer:
      "Withdrawals are processed through the same crypto wallet used for deposits. Ensure your wallet is compatible before requesting a withdrawal.",
    category: "Payments",
  },
  {
    question: "Are there any fees?",
    answer: "Predictr.Market charges a small trading fee on transactions and withdrawals in Mainnet.",
    category: "Payments",
  },
  {
    question: "Is Predictr.Market secure?",
    answer: "Yes. We use blockchain technology to ensure transparency, and all transactions are recorded on-chain.",
    category: "Security",
  },
  {
    question: "Is Predictr.Market legal?",
    answer:
      "We comply with applicable regulations in supported jurisdictions. However, users should ensure they follow local laws before trading.",
    category: "Legal",
  },
  {
    question: "How can I contact support?",
    answer:
      "If you have any issues, you can reach out via our support page or join our community on Discord and Twitter and raise a ticket.",
    category: "Support",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="w-full max-w-7xl dm-sans mx-auto p-4 space-y-8">
      {/* Header Cards */}
      <div className="flex w-full justify-center gap-4">
        <a href="https://discord.gg/6pWjbGYTX3" target="_blank" rel="noreferrer">
          <Card className="bg-[#1a1920]  h-[93px] border-none rounded-2xl">
            <CardContent className="p-2">
              <div className="w-full h-full flex items-center">
                <img src="/main/discord.png" alt="Discord" className="h-[72px] w-[72px] -translate-x-2" />
                <div className="flex-1">
                  <p className="text-[#89A2ED] font-medium text-base">DISCORD server</p>
                  <p className="text-[#89A2ED] text-base">in now LIVE!</p>
                </div>
                <div className="p-2 m-2 rounded-md bg-[#313131]">
                  <ArrowUpRight className="w-5 h-5 text-[#E67E42]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </a>
        <a href="https://x.com/predictr_market" target="_blank" rel="noreferrer">
          <Card className="bg-[#1a1920] h-[93px] border-none rounded-2xl">
            <CardContent className="p-2">
              <div className="w-full h-full flex items-center">
                <img src="/main/x.png" alt="X" className="h-[72px] w-[72px] -translate-x-2 " />
                <div className="flex-1">
                  <p className="text-[#89A2ED] font-medium text-base">Follow us on X</p>
                  <p className="text-[#89A2ED] text-base">(Exclusive Updates!)</p>
                </div>
                <div className="p-2 m-2 rounded-md bg-[#313131]">
                  <ArrowUpRight className="w-5 h-5 text-[#E67E42]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </a>
      </div>

      {/* Main Content */}
      <Card className="bg-[#151419] border-none rounded-2xl">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8">
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-4xl font-bold text-ow1 tracking-tight">Frequently Asked</h2>
                <h2 className="text-4xl font-bold text-[#E67E42] tracking-tight">Questions</h2>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-ow1/30 rounded-xl overflow-hidden transition-all duration-200 hover:bg-[#1a1920]"
                  >
                    <button
                      className="w-full text-left p-4 flex items-center justify-between"
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    >
                      <h3 className="text-ow1 font-medium ">{faq.question}</h3>
                      <ChevronDown
                        className={`w-5 h-5 text-ow1 transition-transform duration-200 ${
                          openIndex === index ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        openIndex === index ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      <p className="px-4 pb-4 text-sm text-ow1 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel */}
            <Card className="bg-[#151419] border border-[#1a1920] mt-[7rem] rounded-xl h-fit">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16  rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-16 h-16 text-[#89A2ED]" fill="#89A2ED" />
                </div>
                <h3 className="text-2xl font-bold text-ow1">Got More Questions?</h3>
                {/* <Button className="bg-[#E67E42] dm-sans hover:bg-[#E67E42]/90 text-[#151419] px-4 py-2 h-auto rounded-lg flex items-center gap-2">
                  Take Me To FAQ Page
                  <ArrowUpRight className="w-4 h-4" />
                </Button> */}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

