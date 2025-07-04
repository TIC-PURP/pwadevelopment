"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Layers } from "lucide-react"

interface LayerType {
  id: string
  name: string
  description: string
  enabled: boolean
  opacity: number
}

interface LayerControlsProps {
  layers: LayerType[]
  selectedLayer: string
  onLayerToggle: (layerId: string) => void
  onOpacityChange: (layerId: string, opacity: number) => void
}

export function LayerControls({ layers, selectedLayer, onLayerToggle, onOpacityChange }: LayerControlsProps) {
  const getLayerIcon = (layerId: string) => {
    switch (layerId) {
      case "rgb":
        return "🌍"
      case "biomass":
        return "🌱"
      case "chlorophyll":
        return "🍃"
      case "ndvi":
        return "📊"
      case "anomalies":
        return "⚠️"
      case "production":
        return "🌾"
      default:
        return "📍"
    }
  }

  const getLayerColor = (layerId: string) => {
    switch (layerId) {
      case "rgb":
        return "bg-blue-500"
      case "biomass":
        return "bg-green-500"
      case "chlorophyll":
        return "bg-emerald-500"
      case "ndvi":
        return "bg-yellow-500"
      case "anomalies":
        return "bg-red-500"
      case "production":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Capas Satelitales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {layers.map((layer) => (
          <div key={layer.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded ${getLayerColor(layer.id)}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">{layer.name}</Label>
                    {selectedLayer === layer.id && (
                      <Badge variant="default" className="text-xs">
                        Activa
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{layer.description}</p>
                </div>
              </div>
              <Switch checked={layer.enabled} onCheckedChange={() => onLayerToggle(layer.id)} />
            </div>

            {layer.enabled && layer.id !== "rgb" && (
              <div className="ml-7 space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-xs">Opacidad</Label>
                  <span className="text-xs text-gray-500">{layer.opacity}%</span>
                </div>
                <Slider
                  value={[layer.opacity]}
                  onValueChange={([value]) => onOpacityChange(layer.id, value)}
                  max={100}
                  step={10}
                  className="w-full"
                />
              </div>
            )}
          </div>
        ))}

        {/* Legend for Anomalies */}
        {selectedLayer === "anomalies" && (
          <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium mb-3">Leyenda de Anomalías</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-800 rounded" />
                <span>Exceso (3+ imágenes)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded" />
                <span>Exceso (2 imágenes)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded" />
                <span>Exceso (1 imagen)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span>Sin anomalías</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded" />
                <span>Carencia (1 imagen)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-600 rounded" />
                <span>Carencia (2 imágenes)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-800 rounded" />
                <span>Carencia (3+ imágenes)</span>
              </div>
            </div>
          </div>
        )}

        {/* Legend for other layers */}
        {(selectedLayer === "biomass" || selectedLayer === "ndvi" || selectedLayer === "chlorophyll") && (
          <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium mb-3">Escala de Valores</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded" />
                <span>Alto (70-100%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded" />
                <span>Medio (40-70%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded" />
                <span>Bajo (0-40%)</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
