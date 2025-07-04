"use client"

import { useEffect, useState } from "react"

interface ChartData {
  time: string
  temperature: number
  humidity: number
}

interface HistoricalChartProps {
  fieldId: string
}

export function HistoricalChart({ fieldId }: HistoricalChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular datos históricos
    const generateHistoricalData = () => {
      const data: ChartData[] = []
      const now = new Date()

      for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000)
        data.push({
          time: time.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
          temperature: 20 + Math.sin(i * 0.3) * 8 + Math.random() * 4,
          humidity: 60 + Math.cos(i * 0.2) * 20 + Math.random() * 10,
        })
      }

      setChartData(data)
      setLoading(false)
    }

    generateHistoricalData()
  }, [fieldId])

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const maxTemp = Math.max(...chartData.map((d) => d.temperature))
  const minTemp = Math.min(...chartData.map((d) => d.temperature))
  const maxHum = Math.max(...chartData.map((d) => d.humidity))
  const minHum = Math.min(...chartData.map((d) => d.humidity))

  return (
    <div className="space-y-4">
      {/* Temperature Chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Temperatura (°C)</h4>
        <div className="h-32 relative bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <svg className="w-full h-full" viewBox="0 0 800 100">
            <polyline
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              points={chartData
                .map((d, i) => {
                  const x = (i / (chartData.length - 1)) * 800
                  const y = 100 - ((d.temperature - minTemp) / (maxTemp - minTemp)) * 80
                  return `${x},${y}`
                })
                .join(" ")}
            />
            {chartData.map((d, i) => {
              const x = (i / (chartData.length - 1)) * 800
              const y = 100 - ((d.temperature - minTemp) / (maxTemp - minTemp)) * 80
              return <circle key={i} cx={x} cy={y} r="2" fill="#ef4444" />
            })}
          </svg>
          <div className="absolute top-2 left-2 text-xs text-gray-500">{maxTemp.toFixed(1)}°C</div>
          <div className="absolute bottom-2 left-2 text-xs text-gray-500">{minTemp.toFixed(1)}°C</div>
        </div>
      </div>

      {/* Humidity Chart */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Humedad (%)</h4>
        <div className="h-32 relative bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <svg className="w-full h-full" viewBox="0 0 800 100">
            <polyline
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              points={chartData
                .map((d, i) => {
                  const x = (i / (chartData.length - 1)) * 800
                  const y = 100 - ((d.humidity - minHum) / (maxHum - minHum)) * 80
                  return `${x},${y}`
                })
                .join(" ")}
            />
            {chartData.map((d, i) => {
              const x = (i / (chartData.length - 1)) * 800
              const y = 100 - ((d.humidity - minHum) / (maxHum - minHum)) * 80
              return <circle key={i} cx={x} cy={y} r="2" fill="#3b82f6" />
            })}
          </svg>
          <div className="absolute top-2 left-2 text-xs text-gray-500">{maxHum.toFixed(1)}%</div>
          <div className="absolute bottom-2 left-2 text-xs text-gray-500">{minHum.toFixed(1)}%</div>
        </div>
      </div>

      {/* Time Labels */}
      <div className="flex justify-between text-xs text-gray-500 px-4">
        <span>{chartData[0]?.time}</span>
        <span>{chartData[Math.floor(chartData.length / 2)]?.time}</span>
        <span>{chartData[chartData.length - 1]?.time}</span>
      </div>
    </div>
  )
}
