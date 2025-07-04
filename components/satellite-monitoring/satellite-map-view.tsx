"use client"

import { useState } from "react"
import { Info } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Campaign {
  id: string
  name: string
  crop: string
  totalArea: number
}

interface SatelliteMapViewProps {
  campaign: Campaign | null
  selectedDate: Date
  selectedLayer: string
  cloudCoverage: number
}

export function SatelliteMapView({ campaign, selectedDate, selectedLayer, cloudCoverage }: SatelliteMapViewProps) {
  const [selectedParcel, setSelectedParcel] = useState<string | null>(null)

  // Simulación de parcelas con diferentes colores según la capa
  const getParcels = () => {
    const baseParcels = [
      { id: "1", name: "Lote A", x: 25, y: 30, width: 12, height: 15, biomass: 0.8, ndvi: 0.75, anomaly: "normal" },
      { id: "2", name: "Lote B", x: 45, y: 25, width: 15, height: 20, biomass: 0.6, ndvi: 0.65, anomaly: "exceso" },
      { id: "3", name: "Lote C", x: 65, y: 35, width: 14, height: 12, biomass: 0.9, ndvi: 0.85, anomaly: "normal" },
      { id: "4", name: "Lote D", x: 30, y: 55, width: 18, height: 15, biomass: 0.4, ndvi: 0.45, anomaly: "carencia" },
      { id: "5", name: "Lote E", x: 55, y: 60, width: 16, height: 14, biomass: 0.7, ndvi: 0.7, anomaly: "normal" },
    ]

    return baseParcels.map((parcel) => {
      let color = "#22c55e"
      let opacity = 0.6

      switch (selectedLayer) {
        case "biomass":
          color = parcel.biomass > 0.7 ? "#22c55e" : parcel.biomass > 0.5 ? "#f59e0b" : "#ef4444"
          opacity = 0.7
          break
        case "chlorophyll":
          const chlorophyllValue = parcel.biomass * 0.9
          color = chlorophyllValue > 0.7 ? "#10b981" : chlorophyllValue > 0.5 ? "#f59e0b" : "#ef4444"
          opacity = 0.7
          break
        case "ndvi":
          color = parcel.ndvi > 0.7 ? "#22c55e" : parcel.ndvi > 0.5 ? "#f59e0b" : "#ef4444"
          opacity = 0.7
          break
        case "anomalies":
          const anomalyColors = {
            exceso: "#ea580c",
            carencia: "#dc2626",
            normal: "#22c55e",
          }
          color = anomalyColors[parcel.anomaly as keyof typeof anomalyColors]
          opacity = 0.8
          break
        case "production":
          const productionValue = (parcel.biomass + parcel.ndvi) / 2
          color = productionValue > 0.7 ? "#22c55e" : productionValue > 0.5 ? "#f59e0b" : "#ef4444"
          opacity = 0.7
          break
        default:
          color = "transparent"
          opacity = 0.3
      }

      return { ...parcel, color, opacity }
    })
  }

  const parcels = getParcels()
  const selectedParcelData = parcels.find((p) => p.id === selectedParcel)

  return (
    <div className="w-full h-full relative">
      {/* Satellite Background Image Simulation */}
      <div
        className="w-full h-full bg-cover bg-center relative"
        style={{
          backgroundImage: `url('/placeholder.svg?height=800&width=1200')`,
          filter: selectedLayer !== "rgb" ? "contrast(1.1) brightness(0.9)" : "none",
        }}
      >
        {/* Gradient Overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20" />

        {/* Parcels Overlay */}
        <div className="absolute inset-0">
          {parcels.map((parcel) => (
            <div
              key={parcel.id}
              className={`absolute cursor-pointer transition-all duration-300 border-2 rounded-lg ${
                selectedParcel === parcel.id
                  ? "border-cyan-400 shadow-lg shadow-cyan-400/50 scale-105 z-10"
                  : "border-white/40 hover:border-white/80 hover:scale-102"
              }`}
              style={{
                left: `${parcel.x}%`,
                top: `${parcel.y}%`,
                width: `${parcel.width}%`,
                height: `${parcel.height}%`,
                backgroundColor: parcel.color,
                opacity: parcel.opacity,
              }}
              onClick={() => setSelectedParcel(parcel.id === selectedParcel ? null : parcel.id)}
            >
              {/* Parcel Label */}
              <div className="absolute -top-8 left-0 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium border border-slate-700/50">
                {parcel.name}
              </div>

              {/* Selection Indicator */}
              {selectedParcel === parcel.id && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 bg-cyan-400 rounded-full border-2 border-white shadow-lg animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Center Point Marker */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-cyan-500 rounded-full border-2 border-white shadow-lg animate-pulse" />
        </div>

        {/* Selected Parcel Info Card */}
        {selectedParcelData && (
          <div className="absolute top-4 right-4 z-20">
            <Card className="bg-slate-900/90 backdrop-blur-md border-slate-700/50 text-white">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-cyan-400" />
                  <span className="font-medium">{selectedParcelData.name}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Biomasa:</span>
                    <Badge variant="outline" className="text-xs">
                      {(selectedParcelData.biomass * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">NDVI:</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedParcelData.ndvi.toFixed(2)}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estado:</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        selectedParcelData.anomaly === "normal"
                          ? "text-green-400 border-green-400"
                          : selectedParcelData.anomaly === "exceso"
                            ? "text-orange-400 border-orange-400"
                            : "text-red-400 border-red-400"
                      }`}
                    >
                      {selectedParcelData.anomaly}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
