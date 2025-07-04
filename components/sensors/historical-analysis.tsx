"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts"
import { CalendarIcon, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { format, subDays } from "date-fns"
import { es } from "date-fns/locale"

export function HistoricalAnalysis() {
  const [selectedSensors, setSelectedSensors] = useState<string[]>(["temperature", "humidity"])
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 7),
    to: new Date(),
  })
  const [showCalendar, setShowCalendar] = useState(false)

  const sensors = [
    { id: "temperature", name: "Temperatura", color: "#ef4444", unit: "°C" },
    { id: "humidity", name: "Humedad", color: "#3b82f6", unit: "%" },
    { id: "wind_speed", name: "Viento", color: "#6b7280", unit: "km/h" },
    { id: "solar_radiation", name: "Radiación Solar", color: "#eab308", unit: "W/m²" },
    { id: "soil_humidity", name: "Humedad Suelo", color: "#a3a3a3", unit: "%" },
  ]

  // Datos simulados para las últimas 24 horas
  const generateMockData = () => {
    const data = []
    const now = new Date()

    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000)
      data.push({
        time: format(time, "HH:mm"),
        fullTime: time,
        temperature: 20 + Math.sin(i * 0.5) * 8 + Math.random() * 3,
        humidity: 60 + Math.cos(i * 0.3) * 15 + Math.random() * 5,
        wind_speed: 8 + Math.random() * 10,
        solar_radiation: i > 6 && i < 18 ? 200 + Math.sin((i - 6) * 0.5) * 600 : Math.random() * 50,
        soil_humidity: 45 + Math.random() * 10,
      })
    }
    return data
  }

  const chartData = generateMockData()

  const getStatistics = (sensorId: string) => {
    const values = chartData.map((d) => d[sensorId as keyof typeof d] as number)
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const max = Math.max(...values)
    const min = Math.min(...values)
    const trend = values[values.length - 1] - values[0]

    return { avg, max, min, trend }
  }

  const toggleSensor = (sensorId: string) => {
    setSelectedSensors((prev) => (prev.includes(sensorId) ? prev.filter((id) => id !== sensorId) : [...prev, sensorId]))
  }

  const chartConfig = sensors.reduce(
    (config, sensor) => {
      config[sensor.id] = {
        label: sensor.name,
        color: sensor.color,
      }
      return config
    },
    {} as Record<string, { label: string; color: string }>,
  )

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Análisis Histórico
          </CardTitle>
          <CardDescription>Visualización de datos históricos y análisis comparativo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sensores:</span>
              <div className="flex flex-wrap gap-2">
                {sensors.map((sensor) => (
                  <Button
                    key={sensor.id}
                    variant={selectedSensors.includes(sensor.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleSensor(sensor.id)}
                    className="text-xs"
                  >
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: sensor.color }}></div>
                    {sensor.name}
                  </Button>
                ))}
              </div>
            </div>

            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {format(dateRange.from, "dd/MM", { locale: es })} - {format(dateRange.to, "dd/MM", { locale: es })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange({ from: range.from, to: range.to })
                      setShowCalendar(false)
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico principal */}
      <Card>
        <CardHeader>
          <CardTitle>Tendencias - Últimas 24 horas</CardTitle>
          <CardDescription>Comparación de múltiples sensores en el tiempo</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                {selectedSensors.map((sensorId) => {
                  const sensor = sensors.find((s) => s.id === sensorId)
                  return (
                    <Line
                      key={sensorId}
                      type="monotone"
                      dataKey={sensorId}
                      stroke={sensor?.color}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      name={`${sensor?.name} (${sensor?.unit})`}
                    />
                  )
                })}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {selectedSensors.map((sensorId) => {
          const sensor = sensors.find((s) => s.id === sensorId)
          const stats = getStatistics(sensorId)

          return (
            <Card key={sensorId}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sensor?.color }}></div>
                  {sensor?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{stats.avg.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">Promedio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{stats.max.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">Máximo</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{stats.min.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">Mínimo</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {stats.trend > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : stats.trend < 0 ? (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      ) : (
                        <Minus className="h-4 w-4 text-gray-500" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          stats.trend > 0 ? "text-green-500" : stats.trend < 0 ? "text-red-500" : "text-gray-500"
                        }`}
                      >
                        {Math.abs(stats.trend).toFixed(1)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">Tendencia</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="text-xs text-gray-500 text-center">Unidad: {sensor?.unit}</div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
