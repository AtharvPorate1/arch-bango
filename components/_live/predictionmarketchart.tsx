'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Button } from "@/components/ui/button"
import { RefreshCcw, Settings } from 'lucide-react'
import { Circle } from 'lucide-react'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const timePeriods = ['1H', '6H', '1D', '1W', '1M', '6M']

interface PriceData {
  afterPrice: string
  createdAt: string
}

interface Outcome {
  outcome: {
    id: number
    outcome_title: string
  }
  data: PriceData[]
}

const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

export default function PredictionMarketChart({id}: {id: number}) {
  const [selectedPeriod, setSelectedPeriod] = useState('1D')
  const [chartData, setChartData] = useState<Outcome[]>([])
  const [displayedChartData, setDisplayedChartData] = useState<Outcome[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentOutcomeIndex, setCurrentOutcomeIndex] = useState(0)
  const [outcomeColors, setOutcomeColors] = useState<Record<number, string>>({})
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}graph/interval-less?eventID=${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      const data = await response.json()
      setChartData(data)
      if (Object.keys(outcomeColors).length === 0) {
        const newColors = data.reduce((acc: Record<number, string>, outcome: Outcome, index: number) => {
          acc[outcome.outcome.id] = colors[index % colors.length]
          return acc
        }, {})
        setOutcomeColors(newColors)
      }
      filterDataByPeriod(data, selectedPeriod)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to fetch data. Please try again later.')
    }
  }

  useEffect(() => {
    fetchData()
    pollIntervalRef.current = setInterval(fetchData, 5000) // Poll every 5 seconds

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [id, selectedPeriod])

  const filterDataByPeriod = (data: Outcome[], period: string) => {
    const now = new Date()
    const filteredData = data.map(outcome => {
      const sortedData = outcome.data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      const firstValidIndex = sortedData.findIndex(d => {
        const date = new Date(d.createdAt)
        switch (period) {
          case '1H':
            return now.getTime() - date.getTime() <= 3600000
          case '6H':
            return now.getTime() - date.getTime() <= 21600000
          case '1D':
            return now.getTime() - date.getTime() <= 86400000
          case '1W':
            return now.getTime() - date.getTime() <= 604800000
          case '1M':
            return now.getTime() - date.getTime() <= 2592000000
          case '6M':
            return now.getTime() - date.getTime() <= 15552000000
          default:
            return true
        }
      })
      return {
        ...outcome,
        data: firstValidIndex > 0 ? [sortedData[firstValidIndex - 1], ...sortedData.slice(firstValidIndex)] : sortedData
      }
    })
    setDisplayedChartData(filteredData)
  }

  const formatChartData = () => {
    if (!displayedChartData.length) return null

    const currentOutcome = displayedChartData[currentOutcomeIndex]
    if (!currentOutcome) return null

    const labels = currentOutcome.data.map(d => new Date(d.createdAt).toLocaleString())

    const dataset = {
      label: currentOutcome.outcome.outcome_title,
      data: currentOutcome.data.map(d => parseFloat(d.afterPrice) * 100),
      borderColor: outcomeColors[currentOutcome.outcome.id],
      backgroundColor: 'transparent',
      tension: 0.4,
      fill: false,
      borderWidth: 1.5,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointHoverBackgroundColor: outcomeColors[currentOutcome.outcome.id],
      pointHoverBorderColor: outcomeColors[currentOutcome.outcome.id],
    }

    return { labels, datasets: [dataset] }
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#1F2937',
        titleColor: '#9CA3AF',
        bodyColor: '#10B981',
        borderColor: '#374151',
        borderWidth: 1,
        padding: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            if (context.parsed.y !== null) {
              return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}¢`
            }
            return ''
          },
          title: function(context) {
            return context[0].label.split(',')[0]
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        border: {
          display: false,
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.1)',
        },
        ticks: {
          color: '#4B5563',
          font: {
            size: 10,
          },
          callback: function(value) {
            return value + '%'
          },
          padding: 8,
        },
      },
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          color: '#4B5563',
          font: {
            size: 10,
          },
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 6,
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  }

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
    filterDataByPeriod(chartData, period)
  }

  const handleRefresh = () => {
    setCurrentOutcomeIndex((prevIndex) => (prevIndex + 1) % displayedChartData.length)
  }

  if (error) {
    return (
      <div className="min-h-[400px] rounded-lg bg-[#121212] flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    )
  }

  const data = formatChartData()

  if (!data) {
    return (
      <div className="min-h-[400px] rounded-lg bg-[#121212] flex items-center justify-center">
        <p className="text-gray-400">No data available</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg bg-[#0C0C0C] mb-2 p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Circle className="w-3 h-3 fill-orange-400 text-orange-400" />
          <div className="flex items-center gap-2">
            <span className="text-gray-300 text-sm font-medium">Volume: $300k</span>
            <span className="text-gray-500 text-sm">Ending On 04 Nov, 2024</span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {timePeriods.map((period) => (
            <Button
              key={period}
              variant="ghost"
              size="sm"
              className={`px-2 py-1 h-7 text-xs rounded ${
                selectedPeriod === period 
                  ? 'bg-gray-800 text-gray-200' 
                  : 'bg-gray-900 text-gray-500 hover:text-gray-300'
              }`}
              onClick={() => handlePeriodChange(period)}
            >
              {period}
            </Button>
          ))}
          <Button 
            variant="ghost" 
            size="sm"
            className="h-7 w-7 p-0 rounded bg-gray-900 hover:bg-gray-800 text-gray-500 hover:text-gray-300"
            onClick={handleRefresh}
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            <span className="sr-only">Refresh</span>
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-7 w-7 p-0 rounded bg-gray-900 hover:bg-gray-800 text-gray-500 hover:text-gray-300"
          >
            <Settings className="h-3.5 w-3.5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>

      <div className="h-[420px]">
        <Line data={data} options={options} />
      </div>

      <div className="mt-4">
        <div className="flex items-center">
          <div
            className="w-4 h-4 rounded-full mr-2"
            style={{ backgroundColor: outcomeColors[displayedChartData[currentOutcomeIndex]?.outcome.id] }}
          ></div>
          <span className="text-sm font-medium text-gray-300">
            {displayedChartData[currentOutcomeIndex]?.outcome.outcome_title}
          </span>
        </div>
      </div>
    </div>
  )
}

