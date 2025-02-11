"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ArrowUpRight, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <div className="w-full max-w-7xl dm-sans mx-auto p-4 space-y-8">
      {/* Header Cards */}
      <div className="flex w-full justify-center gap-4">
        <a href="https://discord.gg/6pWjbGYTX3" target="_blank">
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
        <a href="https://x.com/predictr_market" target="_blank">
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
                <Button className="bg-[#E67E42] dm-sans hover:bg-[#E67E42]/90 text-[#151419] px-4 py-2 h-auto rounded-lg flex items-center gap-2">
                  Take Me To FAQ Page
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

