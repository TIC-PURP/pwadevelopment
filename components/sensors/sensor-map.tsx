"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MapPin, Thermometer, Droplets, Activity, Battery, Wifi } from "lucide-react"

interface Sensor {
  id: string
  name: string
  type: string
  status: "active" | "alert" | "inactive"
  position: { x: number; y: number }
  data: {
    temperature: number
    humidity: number
    battery: number
    signal: number
  }
  lastUpdate: string
}

export function SensorMap() {
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null)

  const sensors: Sensor[] = [
    {
      id: "sensor-001",
      name: "Estación Norte",
      type: "Meteorológica",
      status: "active",
      position: { x: 25, y: 20 },
      data: { temperature: 24.5, humidity: 68, battery: 85, signal: 92 },
      lastUpdate: "Hace 2 min",
    },
    {
      id: "sensor-002",
      name: "Sensor Suelo A",
      type: "Humedad Suelo",
      status: "active",
      position: { x: 45, y: 35 },
      data: { temperature: 22.1, humidity: 45, battery: 72, signal: 88 },
      lastUpdate: "Hace 3 min",
    },
    {
      id: "sensor-003",
      name: "Estación Sur",
      type: "Meteorológica",
      status: "alert",
      position: { x: 70, y: 65 },
      data: { temperature: 28.9, humidity: 82, battery: 45, signal: 65 },
      lastUpdate: "Hace 1 min",
    },
    {
      id: "sensor-004",
      name: "Sensor Viento",
      type: "Anemómetro",
      status: "active",
      position: { x: 60, y: 25 },
      data: { temperature: 23.2, humidity: 55, battery: 88, signal: 95 },
      lastUpdate: "Hace 1 min",
    },
    {
      id: "sensor-005",
      name: "Sensor Suelo B",
      type: "Humedad Suelo",
      status: "inactive",
      position: { x: 30, y: 70 },
      data: { temperature: 0, humidity: 0, battery: 12, signal: 0 },
      lastUpdate: "Hace 2 horas",
    },
  ]

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

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activo"
      case "alert":
        return "Alerta"
      case "inactive":
        return "Inactivo"
      default:
        return "Desconocido"
    }
  }

  const selectedSensorData = sensors.find((s) => s.id === selectedSensor)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Mapa */}
      <div className="lg:col-span-2">
        <Card className="h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Ubicación de Sensores
            </CardTitle>
            <CardDescription>Mapa interactivo con la ubicación de todos los sensores del campo</CardDescription>
          </CardHeader>
          <CardContent className="h-full">
            <div className="relative w-full h-[450px] bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-lg overflow-hidden">
              {/* Simulación de campo agrícola */}
              <div className="absolute inset-0 opacity-30">
                <div className="w-full h-full bg-gradient-to-r from-green-300 via-green-400 to-green-300"></div>
                {/* Líneas de cultivo simuladas */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-full h-1 bg-green-600 opacity-20"
                    style={{ top: `${15 + i * 10}%` }}
                  ></div>
                ))}
              </div>

              {/* Sensores en el mapa */}
              {sensors.map((sensor) => (
                <div
                  key={sensor.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{
                    left: `${sensor.position.x}%`,
                    top: `${sensor.position.y}%`,
                  }}
                  onClick={() => setSelectedSensor(sensor.id)}
                >
                  <div className={`relative group`}>
                    <div
                      className={`w-4 h-4 rounded-full ${getStatusColor(sensor.status)} border-2 border-white shadow-lg animate-pulse`}
                    ></div>
                    <div
                      className={`absolute -top-1 -left-1 w-6 h-6 rounded-full ${getStatusColor(sensor.status)} opacity-30 animate-ping`}
                    ></div>

                    {/* Tooltip */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {sensor.name}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black"></div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Leyenda */}
              <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
                <div className="text-sm font-medium mb-2">Estado de Sensores</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Activo</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span>Alerta</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    <span>Inactivo</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panel lateral */}
      <div className="space-y-6">
        {/* Lista de sensores */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lista de Sensores</CardTitle>
            <CardDescription>Haz clic en un sensor para ver detalles</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {sensors.map((sensor) => (
                  <div
                    key={sensor.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedSensor === sensor.id
                        ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setSelectedSensor(sensor.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(sensor.status)}`}></div>
                        <div>
                          <div className="font-medium text-sm">{sensor.name}</div>
                          <div className="text-xs text-gray-500">{sensor.type}</div>
                        </div>
                      </div>
                      <Badge
                        variant={
                          sensor.status === "active"
                            ? "default"
                            : sensor.status === "alert"
                              ? "destructive"
                              : "secondary"
                        }
                        className="text-xs"
                      >
                        {getStatusText(sensor.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Detalles del sensor seleccionado */}
        {selectedSensorData && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                {selectedSensorData.name}
              </CardTitle>
              <CardDescription>{selectedSensorData.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Estado</span>
                  <Badge
                    variant={
                      selectedSensorData.status === "active"
                        ? "default"
                        : selectedSensorData.status === "alert"
                          ? "destructive"
                          : "secondary"
                    }
                  >
                    {getStatusText(selectedSensorData.status)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <Thermometer className="h-5 w-5 text-red-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-red-600">{selectedSensorData.data.temperature}°C</div>
                    <div className="text-xs text-gray-500">Temperatura</div>
                  </div>

                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <Droplets className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-blue-600">{selectedSensorData.data.humidity}%</div>
                    <div className="text-xs text-gray-500">Humedad</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Battery className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">Batería</span>
                    </div>
                    <span
                      className={`font-medium ${
                        selectedSensorData.data.battery < 20
                          ? "text-red-500"
                          : selectedSensorData.data.battery < 50
                            ? "text-yellow-500"
                            : "text-green-500"
                      }`}
                    >
                      {selectedSensorData.data.battery}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Wifi className="h-3 w-3 text-gray-500" />
                      <span className="text-gray-600 dark:text-gray-400">Señal</span>
                    </div>
                    <span
                      className={`font-medium ${
                        selectedSensorData.data.signal < 30
                          ? "text-red-500"
                          : selectedSensorData.data.signal < 70
                            ? "text-yellow-500"
                            : "text-green-500"
                      }`}
                    >
                      {selectedSensorData.data.signal}%
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="text-xs text-gray-500 text-center">
                    Última actualización: {selectedSensorData.lastUpdate}
                  </div>
                </div>

                <Button className="w-full" size="sm">
                  Ver Historial Completo
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
