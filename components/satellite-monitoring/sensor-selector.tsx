"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Satellite, Radar, Layers } from "lucide-react"

interface SensorType {
  id: string
  name: string
  description: string
  canPenetrateClouds: boolean
}

interface SensorSelectorProps {
  sensors: SensorType[]
  selectedSensor: string
  onSensorChange: (sensorId: string) => void
}

export function SensorSelector({ sensors, selectedSensor, onSensorChange }: SensorSelectorProps) {
  const getSensorIcon = (sensorId: string) => {
    switch (sensorId) {
      case "optical":
        return <Satellite className="h-5 w-5" />
      case "sar":
        return <Radar className="h-5 w-5" />
      case "combined":
        return <Layers className="h-5 w-5" />
      default:
        return <Satellite className="h-5 w-5" />
    }
  }

  const getSensorColor = (sensorId: string) => {
    switch (sensorId) {
      case "optical":
        return "text-blue-500"
      case "sar":
        return "text-green-500"
      case "combined":
        return "text-purple-500"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Satellite className="h-5 w-5" />
          Tipo de Sensor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedSensor} onValueChange={onSensorChange} className="space-y-4">
          {sensors.map((sensor) => (
            <div key={sensor.id} className="space-y-2">
              <div className="flex items-center space-x-3">
                <RadioGroupItem value={sensor.id} id={sensor.id} />
                <Label htmlFor={sensor.id} className="flex items-center gap-2 cursor-pointer flex-1">
                  <div className={getSensorColor(sensor.id)}>{getSensorIcon(sensor.id)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{sensor.name}</span>
                      {sensor.canPenetrateClouds && (
                        <Badge variant="secondary" className="text-xs">
                          Anti-nubes
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{sensor.description}</p>
                  </div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>

        {/* Sensor Information */}
        <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Información del Sensor</h4>
          <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            {selectedSensor === "optical" && (
              <>
                <p>• Resolución: 10-30m por píxel</p>
                <p>• Frecuencia: Cada 5-16 días</p>
                <p>• Limitación: Requiere cielo despejado</p>
                <p>• Ideal para: Análisis de vegetación detallado</p>
              </>
            )}
            {selectedSensor === "sar" && (
              <>
                <p>• Resolución: 5-20m por píxel</p>
                <p>• Frecuencia: Cada 6-12 días</p>
                <p>• Ventaja: Funciona con nubes y de noche</p>
                <p>• Ideal para: Monitoreo continuo</p>
              </>
            )}
            {selectedSensor === "combined" && (
              <>
                <p>• Combina lo mejor de ambos sensores</p>
                <p>• Mayor precisión en análisis</p>
                <p>• Compensación automática de limitaciones</p>
                <p>• Ideal para: Análisis profesional completo</p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
