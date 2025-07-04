"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { fetchSensorsData } from "@/lib/sensors-api"
import { Thermometer, Droplets, Wind, Sun, CloudRain, Gauge, Battery, Wifi } from "lucide-react"

interface SensorData {
  id: string
  name: string
  type: string
  value: number
  unit: string
  status: "active" | "inactive" | "alert"
  battery: number
  signal: number
  lastUpdate: string
  icon: any
  color: string
  alertRange?: { min: number; max: number }
}

export function RealTimeData() {
  const [selectedField, setSelectedField] = useState("campo-1")
  const [sensorsData, setSensorsData] = useState<SensorData[]>([])
  const [loading, setLoading] = useState(true)

  const fields = [
    { id: "campo-1", name: "Campo Norte - Maíz" },
    { id: "campo-2", name: "Campo Sur - Soja" },
    { id: "campo-3", name: "Campo Este - Trigo" },
    { id: "campo-4", name: "Campo Oeste - Girasol" },
  ]

  useEffect(() => {
    const loadSensorData = async () => {
      setLoading(true)
      try {
        const data = await fetchSensorsData(selectedField)
        const mappedData = data.map((sensor: any) => ({
          ...sensor,
          icon: getSensorIcon(sensor.type),
          color: getSensorColor(sensor.type),
        }))
        setSensorsData(mappedData)
      } catch (error) {
        console.error("Error loading sensor data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadSensorData()

    // Actualización automática cada 30 segundos
    const interval = setInterval(loadSensorData, 30000)
    return () => clearInterval(interval)
  }, [selectedField])

  const getSensorIcon = (type: string) => {
    switch (type) {
      case "temperature":
        return Thermometer
      case "humidity":
        return Droplets
      case "wind_speed":
        return Wind
      case "wind_direction":
        return Wind
      case "solar_radiation":
        return Sun
      case "precipitation":
        return CloudRain
      case "soil_humidity":
        return Gauge
      default:
        return Thermometer
    }
  }

  const getSensorColor = (type: string) => {
    switch (type) {
      case "temperature":
        return "text-red-500"
      case "humidity":
        return "text-blue-500"
      case "wind_speed":
        return "text-gray-500"
      case "wind_direction":
        return "text-gray-600"
      case "solar_radiation":
        return "text-yellow-500"
      case "precipitation":
        return "text-blue-600"
      case "soil_humidity":
        return "text-brown-500"
      default:
        return "text-gray-500"
    }
  }

  const mockSensorData: SensorData[] = [
    {
      id: "temp-001",
      name: "Temperatura Ambiente",
      type: "temperature",
      value: 24.5,
      unit: "°C",
      status: "active",
      battery: 85,
      signal: 92,
      lastUpdate: "Hace 2 min",
      icon: Thermometer,
      color: "text-red-500",
      alertRange: { min: 10, max: 35 },
    },
    {
      id: "hum-001",
      name: "Humedad Relativa",
      type: "humidity",
      value: 68,
      unit: "%",
      status: "active",
      battery: 78,
      signal: 88,
      lastUpdate: "Hace 2 min",
      icon: Droplets,
      color: "text-blue-500",
      alertRange: { min: 40, max: 80 },
    },
    {
      id: "wind-001",
      name: "Velocidad del Viento",
      type: "wind_speed",
      value: 12.3,
      unit: "km/h",
      status: "active",
      battery: 92,
      signal: 95,
      lastUpdate: "Hace 1 min",
      icon: Wind,
      color: "text-gray-500",
    },
    {
      id: "wind-dir-001",
      name: "Dirección del Viento",
      type: "wind_direction",
      value: 225,
      unit: "° (SO)",
      status: "active",
      battery: 92,
      signal: 95,
      lastUpdate: "Hace 1 min",
      icon: Wind,
      color: "text-gray-600",
    },
    {
      id: "solar-001",
      name: "Radiación Solar",
      type: "solar_radiation",
      value: 850,
      unit: "W/m²",
      status: "alert",
      battery: 65,
      signal: 82,
      lastUpdate: "Hace 3 min",
      icon: Sun,
      color: "text-yellow-500",
      alertRange: { min: 200, max: 1200 },
    },
    {
      id: "rain-001",
      name: "Precipitación",
      type: "precipitation",
      value: 2.5,
      unit: "mm",
      status: "active",
      battery: 88,
      signal: 90,
      lastUpdate: "Hace 5 min",
      icon: CloudRain,
      color: "text-blue-600",
    },
    {
      id: "soil-001",
      name: "Humedad del Suelo",
      type: "soil_humidity",
      value: 45,
      unit: "%",
      status: "active",
      battery: 72,
      signal: 85,
      lastUpdate: "Hace 4 min",
      icon: Gauge,
      color: "text-brown-500",
      alertRange: { min: 30, max: 70 },
    },
  ]

  const currentData = loading ? [] : mockSensorData

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "alert":
        return "bg-red-500"
      case "inactive":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const isOutOfRange = (value: number, range?: { min: number; max: number }) => {
    if (!range) return false
    return value < range.min || value > range.max
  }

  return (
    <div className="space-y-6">
      {/* Header con selector de campo */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Thermometer className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                Datos en Tiempo Real
              </CardTitle>
              <CardDescription>Monitoreo continuo de condiciones ambientales y del suelo</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Actualizando...</span>
              </div>
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Seleccionar campo" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Grid de sensores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentData.map((sensor) => (
          <Card
            key={sensor.id}
            className={`relative ${isOutOfRange(sensor.value, sensor.alertRange) ? "ring-2 ring-red-500" : ""}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <sensor.icon className={`h-5 w-5 ${sensor.color}`} />
                  <Badge
                    variant={
                      sensor.status === "active" ? "default" : sensor.status === "alert" ? "destructive" : "secondary"
                    }
                  >
                    {sensor.status === "active" ? "Activo" : sensor.status === "alert" ? "Alerta" : "Inactivo"}
                  </Badge>
                </div>
                <div className={`w-3 h-3 rounded-full ${getStatusColor(sensor.status)}`}></div>
              </div>
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{sensor.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${isOutOfRange(sensor.value, sensor.alertRange) ? "text-red-500" : "text-gray-900 dark:text-white"}`}
                  >
                    {sensor.value}
                    <span className="text-lg font-normal text-gray-500 ml-1">{sensor.unit}</span>
                  </div>
                  {isOutOfRange(sensor.value, sensor.alertRange) && (
                    <Badge variant="destructive" className="mt-2 text-xs">
                      Fuera de rango
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Battery className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">Batería</span>
                    </div>
                    <span
                      className={`font-medium ${sensor.battery < 20 ? "text-red-500" : sensor.battery < 50 ? "text-yellow-500" : "text-green-500"}`}
                    >
                      {sensor.battery}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Wifi className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">Señal</span>
                    </div>
                    <span
                      className={`font-medium ${sensor.signal < 30 ? "text-red-500" : sensor.signal < 70 ? "text-yellow-500" : "text-green-500"}`}
                    >
                      {sensor.signal}%
                    </span>
                  </div>

                  <div className="text-xs text-gray-500 text-center pt-2 border-t">Actualizado {sensor.lastUpdate}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(7)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
