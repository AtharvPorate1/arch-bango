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
    <div className="w-full max-w-md mx-auto" style={{ backgroundColor: '#0c0c0c', color: '#e0e0e0' }}>
      {/* Tab Navigation */}
      <div className="grid grid-cols-2 mb-6 border border-gray-800 rounded-lg overflow-hidden">
        <button
          onClick={() => setActiveTab('swap')}
          className={`p-4 text-center ${
            activeTab === 'swap' ? 'bg-purple-900/30 text-purple-300' : 'bg-gray-900'
          }`}
        >
          Swap
        </button>
        <button
          onClick={() => setActiveTab('liquidity')}
          className={`p-4 text-center ${
            activeTab === 'liquidity' ? 'bg-purple-900/30 text-purple-300' : 'bg-gray-900'
          }`}
        >
          Liquidity
        </button>
      </div>

      {/* Main Content */}
      <div className="border border-gray-800 rounded-lg p-6 bg-gray-900">
        {/* Title */}
        <h1 className="text-xl font-semibold text-center mb-2 text-white">
          {activeTab === 'swap' ? 'Swap' : 'Liquidity'}
        </h1>
        <p className="text-center text-purple-400 mb-6">
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
              <div className="flex justify-between text-sm">
                <span>From</span>
                <span className="text-gray-500">Balance: --</span>
              </div>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  placeholder="0.00"
                  className="text-left bg-gray-800 border-gray-700 text-white"
                />
                <Button 
                  variant="outline"
                  onClick={() => openTokenDialog('from')}
                  className="min-w-[120px] border-gray-700 bg-gray-800 text-white"
                >
                  BNB
                </Button>
              </div>
            </div>

            {/* Swap Direction Toggle */}
            <div className="flex justify-center">
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full bg-purple-900/30 hover:bg-purple-800/50"
              >
                <ArrowDownUp className="h-4 w-4 text-purple-300" />
              </Button>
            </div>

            {/* To */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>To</span>
                <span className="text-gray-500">Balance: --</span>
              </div>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  placeholder="0.00"
                  className="text-left bg-gray-800 border-gray-700 text-white"
                />
                <Button 
                  variant="outline"
                  onClick={() => openTokenDialog('to')}
                  className="min-w-[120px] border-gray-700 bg-gray-800 text-white"
                >
                  Select a currency
                </Button>
              </div>
            </div>

            {/* No Pool Message */}
            <div className="bg-gray-800 text-gray-400 p-4 rounded-lg text-center">
              No pool for this trade
            </div>
          </div>
        ) : (
          /* Liquidity Interface */
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pool</span>
              </div>
              <Button 
                variant="outline" 
                className="w-full justify-between border-gray-700 bg-gray-800 text-white"
                onClick={() => openTokenDialog('from')}
              >
                Select a currency
              </Button>
            </div>

            {/* Balance Inputs */}
            <div className="space-y-2">
              <span className="text-sm text-gray-500">Balance: --</span>
              <Input type="number" placeholder="0.00" className="bg-gray-800 border-gray-700 text-white"/>
            </div>

            <div className="space-y-2">
              <span className="text-sm text-gray-500">Balance: --</span>
              <Input 
                type="number" 
                placeholder="0.00" 
                value="BNB"
                readOnly
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white">
              Create pool
            </Button>

            <div className="space-y-2">
              <span className="text-sm text-gray-500">Balance: --</span>
              <Input 
                type="number" 
                placeholder="0.00" 
                value="LP tokens"
                readOnly
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white">
              Remove liquidity
            </Button>
          </div>
        )}
      </div>

      {/* Token Selection Dialog */}
      <Dialog open={tokenDialogOpen} onOpenChange={setTokenDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">Select a token</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input 
              placeholder="0x000000" 
              className="border-purple-800 bg-gray-800 text-white"
            />
            <p className="text-sm text-purple-400">
              Paste the token address and press enter, or select one from the list below.
            </p>
            <div className="space-y-2">
              {tokens.map((token) => (
                <div 
                  key={token.symbol}
                  className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-lg cursor-pointer"
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
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-purple-400" />
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

