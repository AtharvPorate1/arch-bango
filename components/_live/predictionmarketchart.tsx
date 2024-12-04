'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { Button } from "@/components/ui/button"
import { RefreshCcw, Settings } from 'lucide-react'
import { Circle } from 'lucide-react'
import { Checkbox } from "@/components/ui/checkbox"

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
  const [selectedOutcomes, setSelectedOutcomes] = useState<number[]>([])
  const [outcomeColors, setOutcomeColors] = useState<Record<number, string>>({})
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const fetchData = async () => {
    try {
      const response = await fetch(`https://backend-tkuv.onrender.com/v1/graph?eventID=${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      const data = await response.json()
      setChartData(data)
      if (selectedOutcomes.length === 0) {
        setSelectedOutcomes(data.map((outcome: Outcome) => outcome.outcome.id))
      }
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

    const labels = [...new Set(displayedChartData.flatMap(outcome => 
      outcome.data.map(d => new Date(d.createdAt).toLocaleString())
    ))].sort()

    const datasets = displayedChartData
      .filter(outcome => selectedOutcomes.includes(outcome.outcome.id))
      .map((outcome) => {
        const data = labels.map(label => {
          const dataPoint = outcome.data.find(d => new Date(d.createdAt).toLocaleString() === label)
          return dataPoint ? parseFloat(dataPoint.afterPrice) * 100 : null
        })

        // Interpolate missing values
        let lastValidValue = null
        for (let i = 0; i < data.length; i++) {
          if (data[i] !== null) {
            lastValidValue = data[i]
          } else if (lastValidValue !== null) {
            let nextValidIndex = data.findIndex((val, index) => index > i && val !== null)
            if (nextValidIndex !== -1) {
              const nextValidValue = data[nextValidIndex]
              const step = (nextValidValue - lastValidValue) / (nextValidIndex - i + 1)
              for (let j = i; j < nextValidIndex; j++) {
                data[j] = lastValidValue + step * (j - i + 1)
              }
              i = nextValidIndex - 1
            } else {
              data[i] = lastValidValue
            }
          }
        }

        return {
          label: outcome.outcome.outcome_title,
          data: data,
          borderColor: outcomeColors[outcome.outcome.id],
          backgroundColor: 'transparent',
          tension: 0.4,
          fill: false,
          borderWidth: 1.5,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: outcomeColors[outcome.outcome.id],
          pointHoverBorderColor: outcomeColors[outcome.outcome.id],
        }
      })

    return { labels, datasets }
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
          drawBorder: false,
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
    fetchData()
  }

  const toggleOutcome = (outcomeId: number) => {
    setSelectedOutcomes(prev => 
      prev.includes(outcomeId)
        ? prev.filter(id => id !== outcomeId)
        : [...prev, outcomeId]
    )
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Circle className="w-3 h-3 fill-orange-400 text-orange-400" />
          <div className="flex items-center gap-2">
            <span className="text-gray-300 text-sm font-medium">Volume: $300k</span>
            <span className="text-gray-500 text-sm">Ending On 04 Nov, 2024</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
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

      <div className="mt-4 flex flex-wrap gap-4">
        {chartData.map((outcome) => (
          <div key={outcome.outcome.id} className="flex items-center">
            <Checkbox
              id={`outcome-${outcome.outcome.id}`}
              checked={selectedOutcomes.includes(outcome.outcome.id)}
              onCheckedChange={() => toggleOutcome(outcome.outcome.id)}
            />
            <label
              htmlFor={`outcome-${outcome.outcome.id}`}
              className="ml-2 text-sm font-medium text-gray-300"
              style={{ color: outcomeColors[outcome.outcome.id] }}
            >
              {outcome.outcome.outcome_title}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

