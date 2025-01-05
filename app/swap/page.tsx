'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowDownUp, Trash2 } from 'lucide-react'

export default function SwapInterface() {
  const [activeTab, setActiveTab] = useState<'swap' | 'liquidity'>('swap')
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false)
  const [selectedTokenField, setSelectedTokenField] = useState<'from' | 'to'>('from')
  
  const tokens = [
    { symbol: 'BNB', address: '', icon: '⚡' },
    { symbol: 'DAI', address: '0x1d...1b6A', icon: '🔸' },
    { symbol: 'BUSD', address: '0x45...ceF3', icon: '🔶' }
  ]

  const openTokenDialog = (field: 'from' | 'to') => {
    setSelectedTokenField(field)
    setTokenDialogOpen(true)
  }

  return (
    <div className="w-full dm-sans max-w-md mx-auto bg-[#0c0c0c]">
      {/* Main Container with orange glow */}
      <div className="rounded-xl overflow-hidden border border-[#F5841F]">
        {/* Tab Navigation */}
        <div className="grid grid-cols-2">
          <button
            onClick={() => setActiveTab('swap')}
            className={`p-4 border-b border-r  border-[#F5841F] text-center transition-colors ${
              activeTab === 'swap' ? 'bg-[#F5841F] text-white' : 'bg-[#141414] text-gray-400'
            }`}
          >
            Swap
          </button>
          <button
            onClick={() => setActiveTab('liquidity')}
            className={`p-4 text-center border-b border-[#F5841F] transition-colors ${
              activeTab === 'liquidity' ? 'bg-[#F5841F] text-white' : 'bg-[#141414] text-gray-400'
            }`}
          >
            Liquidity
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 bg-[#141414]">
          {/* Title */}
          <h1 className="text-2xl font-medium text-center mb-2 text-white">
            {activeTab === 'swap' ? 'Swap' : 'Liquidity'}
          </h1>
          <p className="text-center text-gray-400 text-sm mb-6">
            {activeTab === 'swap' 
              ? 'Trade tokens in an instant'
              : 'Add or remove liquidity from a pool'
            }
          </p>

          {activeTab === 'swap' ? (
            /* Swap Interface */
            <div className="space-y-4">
              {/* From */}
              <div className="space-y-2">
                <div className="relative flex-1">
                  <div className="bg-[#1A1A1A] rounded-xl border border-[#F5841F]/20 shadow-[0_0_0_1px_rgba(245,132,31,0.2)] focus-within:shadow-[0_0_0_1px_rgba(245,132,31,0.4)]">
                    <div className="flex justify-between text-sm px-4 pt-3">
                      <span className="text-gray-400">From</span>
                      <span className="text-gray-400">Balance: 458BTC</span>
                    </div>
                    <div className="flex px-4 pb-3 items-center justify-between">
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full bg-transparent border-none text-white focus:outline-none text-lg"
                      />
                      <button 
                        onClick={() => openTokenDialog('from')}
                        className="text-white hover:bg-[#F5841F]/10 px-3 rounded-lg text-base whitespace-nowrap"
                      >
                        BNB ▼
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Swap Direction Toggle */}
              <div className="flex justify-center -my-2">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full bg-[#F5841F] hover:bg-[#F5841F]/90 w-10 h-10 p-0"
                >
                  <ArrowDownUp className="h-5 w-5 text-white" />
                </Button>
              </div>

              {/* To */}
              <div className="space-y-2">
                <div className="relative flex-1">
                  <div className="bg-[#1A1A1A] rounded-xl border border-[#F5841F]/20 shadow-[0_0_0_1px_rgba(245,132,31,0.2)] focus-within:shadow-[0_0_0_1px_rgba(245,132,31,0.4)]">
                    <div className="flex justify-between text-sm px-4 pt-3">
                      <span className="text-gray-400">To</span>
                      <span className="text-gray-400">Balance: 458BTC</span>
                    </div>
                    <div className="flex px-4 pb-3 items-center justify-between">
                      <input 
                        type="number" 
                        placeholder="0.00"
                        className="w-full bg-transparent border-none text-white focus:outline-none text-lg"
                      />
                      <button 
                        onClick={() => openTokenDialog('to')}
                        className="text-white hover:bg-[#F5841F]/10 px-3 rounded-lg text-base whitespace-nowrap"
                      >
                        Select a currency ▼
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* No Pool Message */}
              <Button 
                className="w-full bg-[#F5841F] hover:bg-[#F5841F]/90 text-white font-normal h-14 rounded-xl text-base shadow-[0_0_20px_rgba(245,132,31,0.2)]"
                disabled
              >
                No Pool For This Trade
              </Button>
            </div>
          ) : (
            /* Liquidity Interface */
            <div className="space-y-4">
              {/* Pool Selection */}
              <div className="relative flex-1">
                <div className="bg-[#1A1A1A] rounded-xl border border-[#F5841F]/20 shadow-[0_0_0_1px_rgba(245,132,31,0.2)] focus-within:shadow-[0_0_0_1px_rgba(245,132,31,0.4)]">
                  <div className="flex justify-between text-sm px-4 pt-3">
                    <span className="text-gray-400">Pool</span>
                    <span className="text-gray-400">Balance: --</span>
                  </div>
                  <div className="flex px-4 pb-3 items-center justify-between">
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full bg-transparent border-none text-white focus:outline-none text-lg"
                    />
                    <button 
                      onClick={() => openTokenDialog('from')}
                      className="text-white hover:bg-[#F5841F]/10 px-3 rounded-lg text-base whitespace-nowrap"
                    >
                      Select a currency ▼
                    </button>
                  </div>
                </div>
              </div>

              {/* BNB Input */}
              <div className="relative flex-1">
                <div className="bg-[#1A1A1A] rounded-xl border border-[#F5841F]/20 shadow-[0_0_0_1px_rgba(245,132,31,0.2)] focus-within:shadow-[0_0_0_1px_rgba(245,132,31,0.4)]">
                  <div className="flex justify-between text-sm px-4 pt-3">
                    <span className="text-gray-400">Balance: --</span>
                  </div>
                  <div className="flex px-4 pb-3">
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full bg-transparent border-none text-white focus:outline-none text-lg"
                    />
                    <span className="text-white px-3">
                      BNB
                    </span>
                  </div>
                </div>
              </div>

              {/* Create Pool Button */}
              <Button 
                className="w-full bg-[#F5841F] hover:bg-[#F5841F]/90 text-white font-normal h-14 rounded-xl text-base shadow-[0_0_20px_rgba(245,132,31,0.2)]"
              >
                Create pool
              </Button>

              {/* LP Tokens */}
              <div className="relative flex-1">
                <div className="bg-[#1A1A1A] rounded-xl border border-[#F5841F]/20 shadow-[0_0_0_1px_rgba(245,132,31,0.2)] focus-within:shadow-[0_0_0_1px_rgba(245,132,31,0.4)]">
                  <div className="flex justify-between text-sm px-4 pt-3">
                    <span className="text-gray-400">Balance: --</span>
                  </div>
                  <div className="flex px-4 pb-3">
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full bg-transparent border-none text-white focus:outline-none text-lg"
                    />
                    <span className="text-white px-3">
                      LP tokens
                    </span>
                  </div>
                </div>
              </div>

              {/* Remove Liquidity Button */}
              <Button 
                className="w-full bg-[#F5841F] hover:bg-[#F5841F]/90 text-white font-normal h-14 rounded-xl text-base shadow-[0_0_20px_rgba(245,132,31,0.2)]"
              >
                Remove liquidity
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Token Selection Dialog */}
      <Dialog open={tokenDialogOpen} onOpenChange={setTokenDialogOpen}>
        <DialogContent className="bg-[#141414] border-[#F5841F]/20">
          <DialogHeader>
            <DialogTitle className="text-white">Select a token</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input 
              placeholder="0x000000" 
              className="border-[#F5841F]/20 bg-[#1A1A1A] text-white focus-visible:ring-[#F5841F]/50"
            />
            <p className="text-sm text-gray-400">
              Paste the token address and press enter, or select one from the list below.
            </p>
            <div className="space-y-2">
              {tokens.map((token) => (
                <div 
                  key={token.symbol}
                  className="flex items-center justify-between p-3 hover:bg-[#F5841F]/10 rounded-lg cursor-pointer"
                  onClick={() => setTokenDialogOpen(false)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{token.icon}</span>
                    <div>
                      <div className="font-medium text-white">{token.symbol}</div>
                      {token.address && (
                        <div className="text-sm text-gray-500">{token.address}</div>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="hover:bg-[#F5841F]/10">
                    <Trash2 className="h-4 w-4 text-[#F5841F]" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

