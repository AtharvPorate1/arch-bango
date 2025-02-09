"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown } from "lucide-react"

interface FAQItem {
  question: string
  answer: string
  category?: string
}

const faqs: FAQItem[] = [
    {
      question: "What is Predictr.Market?",
      answer: "Predictr.Market is an opinion trading platform where users can buy and sell shares in the outcome of real-world events. It enables users to express their views on politics, sports, crypto, markets, and more.",
      category: "General",
    },
    {
      question: "How does Predictr.Market work?",
      answer: 'Users can purchase "Yes" or "No" shares on specific questions. The market price reflects the collective probability of an event occurring. If your prediction is correct, you can sell your shares for a profit or hold them until resolution.',
      category: "Trading",
    },
    {
      question: "Who can use Predictr.Market?",
      answer: "Anyone who meets our platform's eligibility criteria can participate. Check our terms and conditions for specific requirements based on your location.",
      category: "General",
    },
    {
      question: "What types of markets are available?",
      answer: "Predictr.Market hosts markets on various topics, including: Politics, Sports, Crypto, Finance, and Entertainment.",
      category: "Markets",
    },
    {
      question: "How are prices determined?",
      answer: 'Prices fluctuate based on supply and demand. If more users believe an event will happen, the price of "Yes" shares increases, and "No" shares decrease, and vice versa.',
      category: "Trading",
    },
    {
      question: "What is a share in a prediction market?",
      answer: 'A share in a prediction market represents a contract that pays out if a specific event outcome occurs. Each market has "Yes" and "No" shares, where a "Yes" share pays out 1 unit (e.g., $1 or 1 USDC) if the event happens, and a "No" share pays out 1 unit if the event does not happen. The price of a share fluctuates based on market demand, reflecting the collective probability of the outcome. If you buy a share at $0.60, the market implies a 60% chance of that outcome occurring.',
      category: "Trading",
    },
    {
      question: "How do I create a market?",
      answer: "Currently, only verified creators can list markets. We will update a form to apply for creation of market very soon.",
      category: "Markets",
    },
    {
      question: "What happens when a market resolves?",
      answer: "Once an event concludes, our system verifies the outcome and settles the market. If you hold winning shares, you receive a payout based on the final price.",
      category: "Trading",
    },
    {
      question: "How do I deposit funds?",
      answer: "You can deposit funds using Unisat wallet.",
      category: "Payments",
    },
    {
      question: "How do I withdraw my earnings?",
      answer: "Withdrawals are processed through the same crypto wallet used for deposits. Ensure your wallet is compatible before requesting a withdrawal.",
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
      answer: "We comply with applicable regulations in supported jurisdictions. However, users should ensure they follow local laws before trading.",
      category: "Legal",
    },
    {
      question: "How can I contact support?",
      answer: "If you have any issues, you can reach out via our support page or join our community on Discord and Twitter and raise a ticket.",
      category: "Support",
    },
  ]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="w-full dm-sans max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold text-ow1 mb-6">Frequently Asked Questions</h2>
      {faqs.map((faq, index) => (
        <Card
          key={index}
          className="bg-[#151419] shadow-none border-none text-ow1 overflow-hidden transition-all duration-200 hover:bg-[#1a1920]"
        >
          <CardContent className="p-0">
            <button
              className="w-full text-left p-4 flex items-center justify-between"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <div className="flex flex-col">
{/* 
                {faq.category && <span className="text-xs text-[#89A2ED] mb-1">{faq.category}</span>}
                 */}
                <h3 className="text-sm font-semibold text-ow1">{faq.question}</h3>
              </div>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${
                  openIndex === index ? "transform rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${openIndex === index ? "max-h-96" : "max-h-0"}`}
            >
              <p className="px-4 pb-4 text-sm text-gray-300">{faq.answer}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

