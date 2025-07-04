"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { ZoomIn, ZoomOut, RotateCcw, Maximize, MapPin, Layers, Download } from "lucide-react"

interface Campaign {
  id: string
  name: string
  crop: string
  totalArea: number
}

interface LayerType {
  id: string
  name: string
  description?: string
  enabled: boolean
  opacity: number
}

interface SatelliteMapProps {
  campaign: Campaign
  selectedDate: Date
  selectedLayer: string
  selectedSensor: string
  layers: LayerType[]
  onParcelSelect: (parcelId: string | null) => void
  isOfflineMode: boolean
}

export function SatelliteMap({
  campaign,
  selectedDate,
  selectedLayer,
  selectedSensor,
  layers,
  onParcelSelect,
  isOfflineMode,
}: SatelliteMapProps) {
  const [zoom, setZoom] = useState(14)
  const [selectedParcel, setSelectedParcel] = useState<string | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: -34.6037, lng: -58.3816 })

  // Simulación de parcelas con diferentes valores según la capa seleccionada
  const getParcels = () => {
    const baseParcels = [
      {
        id: "1",
        name: "Lote A",
        bounds: [
          [0, 0],
          [100, 100],
        ],
        center: [50, 50],
      },
      {
        id: "2",
        name: "Lote B",
        bounds: [
          [100, 0],
          [200, 100],
        ],
        center: [150, 50],
      },
      {
        id: "3",
        name: "Lote C",
        bounds: [
          [0, 100],
          [100, 200],
        ],
        center: [50, 150],
      },
      {
        id: "4",
        name: "Lote D",
        bounds: [
          [100, 100],
          [200, 200],
        ],
        center: [150, 150],
      },
    ]

    return baseParcels.map((parcel) => {
      let color = "#22c55e" // Verde por defecto
      let value = 0

      switch (selectedLayer) {
        case "biomass":
          value = Math.random() * 100
          color = value > 70 ? "#22c55e" : value > 40 ? "#f59e0b" : "#ef4444"
          break
        case "chlorophyll":
          value = Math.random() * 50 + 25
          color = value > 40 ? "#10b981" : value > 30 ? "#f59e0b" : "#ef4444"
          break
        case "ndvi":
          value = Math.random() * 0.8 + 0.2
          color = value > 0.7 ? "#22c55e" : value > 0.5 ? "#f59e0b" : "#ef4444"
          break
        case "anomalies":
          const anomalyTypes = [
            "excess-3",
            "excess-2",
            "excess-1",
            "normal",
            "deficiency-1",
            "deficiency-2",
            "deficiency-3",
          ]
          const anomaly = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)]
          switch (anomaly) {
            case "excess-3":
              color = "#7c2d12"
              break
            case "excess-2":
              color = "#ea580c"
              break
            case "excess-1":
              color = "#f97316"
              break
            case "normal":
              color = "#22c55e"
              break
            case "deficiency-1":
              color = "#fbbf24"
              break
            case "deficiency-2":
              color = "#f59e0b"
              break
            case "deficiency-3":
              color = "#d97706"
              break
          }
          break
        case "production":
          value = Math.random() * 10 + 2 // Toneladas por hectárea
          color = value > 8 ? "#22c55e" : value > 6 ? "#f59e0b" : "#ef4444"
          break
        default:
          color = "#22c55e"
      }

      return { ...parcel, color, value }
    })
  }

  const parcels = getParcels()

  const handleParcelClick = (parcelId: string) => {
    setSelectedParcel(parcelId === selectedParcel ? null : parcelId)
    onParcelSelect(parcelId === selectedParcel ? null : parcelId)
  }

  const getLayerDescription = () => {
    const layer = layers.find((l) => l.id === selectedLayer)
    return layer?.description || "Visualización satelital"
  }

  return (
    <Card className="h-[600px] relative overflow-hidden">
      <CardContent className="p-0 h-full">
        {/* Map Header */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
          <div className="bg-white dark:bg-gray-900 rounded-lg px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {selectedLayer.toUpperCase()}
              </Badge>
              <span className="text-sm font-medium">{getLayerDescription()}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOfflineMode && (
              <Badge variant="secondary" className="text-xs">
                Modo Offline
              </Badge>
            )}
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-20 right-4 z-10 flex flex-col gap-2">
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0 bg-transparent"
            onClick={() => setZoom(Math.min(zoom + 1, 20))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-10 h-10 p-0 bg-transparent"
            onClick={() => setZoom(Math.max(zoom - 1, 1))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="w-10 h-10 p-0 bg-transparent" onClick={() => setZoom(14)}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="w-10 h-10 p-0 bg-transparent">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>

        {/* Simulated Map Area */}
        <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 relative">
          {/* Background Pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23000000' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          {/* Parcels */}
          <div className="absolute inset-0 p-8">
            <div className="grid grid-cols-2 gap-4 h-full">
              {parcels.map((parcel) => (
                <div
                  key={parcel.id}
                  className={`relative rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedParcel === parcel.id
                      ? "border-blue-500 shadow-lg scale-105"
                      : "border-white/50 hover:border-white/80"
                  }`}
                  style={{
                    backgroundColor: parcel.color,
                    opacity: selectedParcel && selectedParcel !== parcel.id ? 0.6 : 1,
                  }}
                  onClick={() => handleParcelClick(parcel.id)}
                >
                  {/* Parcel Label */}
                  <div className="absolute top-2 left-2 bg-white/90 rounded px-2 py-1">
                    <span className="text-xs font-medium">{parcel.name}</span>
                  </div>

                  {/* Parcel Value */}
                  {selectedLayer !== "rgb" && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white rounded px-2 py-1">
                      <span className="text-xs">
                        {selectedLayer === "ndvi"
                          ? parcel.value.toFixed(2)
                          : selectedLayer === "production"
                            ? `${parcel.value.toFixed(1)} t/ha`
                            : `${parcel.value.toFixed(0)}%`}
                      </span>
                    </div>
                  )}

                  {/* Selection Indicator */}
                  {selectedParcel === parcel.id && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <MapPin className="h-8 w-8 text-blue-500 drop-shadow-lg" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Scale Bar */}
          <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-900 rounded px-3 py-2 shadow-lg">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-16 h-1 bg-black dark:bg-white"></div>
              <span>100m</span>
            </div>
          </div>

          {/* Coordinates */}
          <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-900 rounded px-3 py-2 shadow-lg">
            <div className="text-xs font-mono">
              {mapCenter.lat.toFixed(4)}, {mapCenter.lng.toFixed(4)}
            </div>
          </div>
        </div>

        {/* Layer Opacity Control */}
        {selectedLayer !== "rgb" && (
          <div className="absolute bottom-16 left-4 bg-white dark:bg-gray-900 rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-3 min-w-[200px]">
              <Layers className="h-4 w-4" />
              <span className="text-xs">Opacidad</span>
              <Slider
                value={[layers.find((l) => l.id === selectedLayer)?.opacity || 100]}
                onValueChange={([value]) => {
                  // Handle opacity change
                }}
                max={100}
                step={10}
                className="flex-1"
              />
              <span className="text-xs w-8">{layers.find((l) => l.id === selectedLayer)?.opacity || 100}%</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
