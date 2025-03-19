"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ArrowUpRight, MessageSquare, ExternalLink } from "lucide-react"
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
      <div className="flex flex-col sm:flex-row w-full gap-4">
        {/* Discord Card */}
        <a
          href="https://discord.gg/6pWjbGYTX3"
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-1/2 transition-transform hover:scale-[1.02] duration-200"
        >
          <div className="bg-[#18181B] border border-[#5865F2]/20 rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 flex items-center">
              <div className="bg-[#5865F2]/10 rounded-full p-2 mr-4 flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.317 4.49197C18.787 3.80197 17.147 3.29197 15.432 3.00197C15.4167 3.00004 15.4009 3.00232 15.3868 3.00856C15.3726 3.01479 15.3607 3.02475 15.352 3.03697C15.152 3.36697 14.932 3.80197 14.782 4.14697C12.927 3.87697 11.077 3.87697 9.24999 4.14697C9.09999 3.79197 8.87199 3.36697 8.67199 3.03697C8.66291 3.02509 8.65071 3.01555 8.63659 3.00963C8.62247 3.00371 8.60689 3.00159 8.59199 3.00197C6.87699 3.29197 5.23699 3.80197 3.70699 4.49197C3.69351 4.49785 3.6829 4.50766 3.67699 4.51997C0.939988 8.83197 0.156988 13.022 0.535988 17.152C0.538988 17.182 0.554988 17.212 0.577988 17.232C2.50199 18.692 4.35699 19.612 6.18699 20.222C6.20144 20.2262 6.21762 20.2255 6.23177 20.2198C6.24592 20.2141 6.25734 20.2038 6.26399 20.192C6.72399 19.552 7.13699 18.872 7.48699 18.152C7.50244 18.1238 7.49654 18.088 7.47299 18.067C6.83699 17.817 6.22699 17.517 5.63699 17.177C5.61967 17.166 5.60687 17.1486 5.602 17.1288C5.59713 17.1089 5.60057 17.0878 5.61149 17.071C5.62241 17.0542 5.63997 17.0422 5.65999 17.037C5.77999 16.947 5.89999 16.852 6.01499 16.757C6.03128 16.7433 6.05354 16.7369 6.07554 16.7397C6.09754 16.7425 6.11783 16.7542 6.12999 16.772C10.13 18.562 14.47 18.562 18.417 16.772C18.4293 16.7538 18.4498 16.7418 18.4721 16.7389C18.4944 16.736 18.5169 16.7424 18.5335 16.757C18.6485 16.852 18.7685 16.947 18.8885 17.037C18.9085 17.0421 18.9262 17.054 18.9372 17.0707C18.9483 17.0875 18.9519 17.1084 18.9473 17.1283C18.9427 17.1481 18.9301 17.1656 18.913 17.177C18.323 17.522 17.713 17.817 17.073 18.067C17.0605 18.0771 17.0512 18.0912 17.0467 18.1073C17.0421 18.1234 17.0427 18.1406 17.048 18.1567C17.0533 18.1727 17.0631 18.1868 17.0759 18.1969C17.0888 18.207 17.1042 18.2126 17.12 18.212C17.82 18.932 18.233 19.612 18.692 20.192C18.6982 20.2039 18.7093 20.2143 18.7233 20.2201C18.7373 20.2259 18.7533 20.2267 18.777 20.222C20.612 19.612 22.467 18.692 24.39 17.232C24.4023 17.2222 24.4125 17.2086 24.4196 17.1927C24.4267 17.1768 24.4304 17.159 24.43 17.142C24.89 12.332 23.612 8.17197 20.992 4.52197C20.9879 4.5118 20.9795 4.50301 20.969 4.49697L20.317 4.49197ZM8.19999 14.582C6.99999 14.582 5.99999 13.482 5.99999 12.142C5.99999 10.802 6.97999 9.70197 8.19999 9.70197C9.42799 9.70197 10.422 10.812 10.407 12.142C10.407 13.482 9.41999 14.582 8.19999 14.582ZM15.832 14.582C14.632 14.582 13.632 13.482 13.632 12.142C13.632 10.802 14.612 9.70197 15.832 9.70197C17.06 9.70197 18.054 10.812 18.039 12.142C18.039 13.482 17.06 14.582 15.832 14.582Z" fill="#5865F2" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-[#5865F2] font-bold text-lg">Join Our Discord</h3>
                <p className="text-gray-400 text-sm">Connect with our community</p>
              </div>
              <div className="ml-2 bg-[#5865F2]/10 p-2 rounded-lg">
                <ExternalLink className="w-5 h-5 text-[#5865F2]" />
              </div>
            </div>
          </div>
        </a>

        {/* Twitter/X Card */}
        <a
          href="https://x.com/predictr_market"
          target="_blank"
          rel="noreferrer"
          className="w-full sm:w-1/2 transition-transform hover:scale-[1.02] duration-200"
        >
          <div className="bg-[#18181B] border border-[#1DA1F2]/20 rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 flex items-center">
              <div className="bg-[#1DA1F2]/10 rounded-full p-2 mr-4 flex-shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#1DA1F2" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-[#1DA1F2] font-bold text-lg">Follow on X</h3>
                <p className="text-gray-400 text-sm">Get exclusive updates</p>
              </div>
              <div className="ml-2 bg-[#1DA1F2]/10 p-2 rounded-lg">
                <ExternalLink className="w-5 h-5 text-[#1DA1F2]" />
              </div>
            </div>
          </div>
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
                        className={`w-5 h-5 text-ow1 transition-transform duration-200 ${openIndex === index ? "transform rotate-180" : ""
                          }`}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-200 ${openIndex === index ? "max-h-96" : "max-h-0"
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

