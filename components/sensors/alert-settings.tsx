"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"

interface AlertLimits {
  temperature: { min: number; max: number }
  humidity: { min: number; max: number }
  windSpeed: { max: number }
}

interface AlertSettingsProps {
  alertLimits: AlertLimits
  onSave: (limits: AlertLimits) => void
  onClose: () => void
}

export function AlertSettings({ alertLimits, onSave, onClose }: AlertSettingsProps) {
  const [limits, setLimits] = useState<AlertLimits>(alertLimits)

  const handleSave = () => {
    onSave(limits)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Configurar Límites de Alerta</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Temperature Limits */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Temperatura (°C)</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="temp-min" className="text-xs text-gray-500">
                  Mínimo
                </Label>
                <Input
                  id="temp-min"
                  type="number"
                  value={limits.temperature.min}
                  onChange={(e) =>
                    setLimits({
                      ...limits,
                      temperature: { ...limits.temperature, min: Number(e.target.value) },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="temp-max" className="text-xs text-gray-500">
                  Máximo
                </Label>
                <Input
                  id="temp-max"
                  type="number"
                  value={limits.temperature.max}
                  onChange={(e) =>
                    setLimits({
                      ...limits,
                      temperature: { ...limits.temperature, max: Number(e.target.value) },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Humidity Limits */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Humedad (%)</Label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="hum-min" className="text-xs text-gray-500">
                  Mínimo
                </Label>
                <Input
                  id="hum-min"
                  type="number"
                  value={limits.humidity.min}
                  onChange={(e) =>
                    setLimits({
                      ...limits,
                      humidity: { ...limits.humidity, min: Number(e.target.value) },
                    })
                  }
                />
              </div>
              <div>
                <Label htmlFor="hum-max" className="text-xs text-gray-500">
                  Máximo
                </Label>
                <Input
                  id="hum-max"
                  type="number"
                  value={limits.humidity.max}
                  onChange={(e) =>
                    setLimits({
                      ...limits,
                      humidity: { ...limits.humidity, max: Number(e.target.value) },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Wind Speed Limit */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Velocidad del Viento (km/h)</Label>
            <div>
              <Label htmlFor="wind-max" className="text-xs text-gray-500">
                Máximo
              </Label>
              <Input
                id="wind-max"
                type="number"
                value={limits.windSpeed.max}
                onChange={(e) =>
                  setLimits({
                    ...limits,
                    windSpeed: { max: Number(e.target.value) },
                  })
                }
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Guardar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
