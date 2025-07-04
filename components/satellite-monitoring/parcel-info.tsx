"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, MapPin, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Campaign {
  id: string
  name: string
  crop: string
  totalArea: number
}

interface ParcelInfoProps {
  parcelId: string
  campaign: Campaign | null
  selectedDate: Date
  selectedLayer: string
}

export function ParcelInfo({ parcelId, campaign, selectedDate, selectedLayer }: ParcelInfoProps) {
  // Datos simulados para la parcela seleccionada
  const parcelData = {
    name: `Lote ${parcelId}`,
    area: 45.2,
    variety: "DK4050",
    plantingDate: "2024-10-15",
    lastUpdate: selectedDate,
    coordinates: { lat: -34.6037, lng: -58.3816 },
    metrics: {
      biomass: { current: 2850, trend: "up", change: 12.5 },
      ndvi: { current: 0.72, trend: "stable", change: 0.02 },
      chlorophyll: { current: 38.5, trend: "up", change: 8.3 },
      soilMoisture: { current: 65, trend: "down", change: -5.2 },
    },
    alerts: [
      { type: "warning", message: "Posible estrés hídrico en sector norte" },
      { type: "info", message: "Crecimiento dentro de parámetros normales" },
    ],
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-400" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-400" />
      default:
        return <Minus className="h-3 w-3 text-slate-400" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-400"
      case "down":
        return "text-red-400"
      default:
        return "text-slate-400"
    }
  }

  return (
    <Card className="bg-slate-900/90 backdrop-blur-md border-slate-700/50 text-white">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-4 w-4 text-cyan-400" />
          {parcelData.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Área:</span>
            <p className="font-medium">{parcelData.area} Ha</p>
          </div>
          <div>
            <span className="text-slate-400">Variedad:</span>
            <p className="font-medium">{parcelData.variety}</p>
          </div>
          <div>
            <span className="text-slate-400">Siembra:</span>
            <p className="font-medium">{format(new Date(parcelData.plantingDate), "dd/MM/yyyy", { locale: es })}</p>
          </div>
          <div>
            <span className="text-slate-400">Actualización:</span>
            <p className="font-medium flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(parcelData.lastUpdate, "dd/MM", { locale: es })}
            </p>
          </div>
        </div>

        {/* Metrics */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-slate-300">Métricas Actuales</div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Biomasa</span>
              <div className="flex items-center gap-2">
                {getTrendIcon(parcelData.metrics.biomass.trend)}
                <span className="text-sm font-medium">{parcelData.metrics.biomass.current} kg/ha</span>
                <span className={`text-xs ${getTrendColor(parcelData.metrics.biomass.trend)}`}>
                  {parcelData.metrics.biomass.change > 0 ? "+" : ""}
                  {parcelData.metrics.biomass.change}%
                </span>
              </div>
            </div>
            <Progress value={75} className="h-1" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">NDVI</span>
              <div className="flex items-center gap-2">
                {getTrendIcon(parcelData.metrics.ndvi.trend)}
                <span className="text-sm font-medium">{parcelData.metrics.ndvi.current}</span>
                <span className={`text-xs ${getTrendColor(parcelData.metrics.ndvi.trend)}`}>
                  {parcelData.metrics.ndvi.change > 0 ? "+" : ""}
                  {parcelData.metrics.ndvi.change}
                </span>
              </div>
            </div>
            <Progress value={80} className="h-1" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Clorofila</span>
              <div className="flex items-center gap-2">
                {getTrendIcon(parcelData.metrics.chlorophyll.trend)}
                <span className="text-sm font-medium">{parcelData.metrics.chlorophyll.current} μg/cm²</span>
                <span className={`text-xs ${getTrendColor(parcelData.metrics.chlorophyll.trend)}`}>
                  {parcelData.metrics.chlorophyll.change > 0 ? "+" : ""}
                  {parcelData.metrics.chlorophyll.change}%
                </span>
              </div>
            </div>
            <Progress value={85} className="h-1" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Humedad del Suelo</span>
              <div className="flex items-center gap-2">
                {getTrendIcon(parcelData.metrics.soilMoisture.trend)}
                <span className="text-sm font-medium">{parcelData.metrics.soilMoisture.current}%</span>
                <span className={`text-xs ${getTrendColor(parcelData.metrics.soilMoisture.trend)}`}>
                  {parcelData.metrics.soilMoisture.change > 0 ? "+" : ""}
                  {parcelData.metrics.soilMoisture.change}%
                </span>
              </div>
            </div>
            <Progress value={65} className="h-1" />
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-300">Alertas</div>
          <div className="space-y-2">
            {parcelData.alerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-2">
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    alert.type === "warning" ? "text-yellow-400 border-yellow-400" : "text-blue-400 border-blue-400"
                  }`}
                >
                  {alert.type === "warning" ? "⚠️" : "ℹ️"}
                </Badge>
                <span className="text-xs text-slate-300 flex-1">{alert.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Coordinates */}
        <div className="pt-2 border-t border-slate-700/50">
          <div className="text-xs text-slate-400">
            Coordenadas: {parcelData.coordinates.lat}, {parcelData.coordinates.lng}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
