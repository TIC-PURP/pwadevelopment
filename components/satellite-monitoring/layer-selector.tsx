"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronUp, ChevronDown, Info } from "lucide-react"

interface LayerType {
  id: string
  name: string
  description: string
  enabled: boolean
  icon: string
}

interface LayerSelectorProps {
  currentLayer: LayerType
  layers: LayerType[]
  onLayerChange: (layerId: string) => void
  isOpen: boolean
  onToggle: () => void
}

export function LayerSelector({ currentLayer, layers, onLayerChange, isOpen, onToggle }: LayerSelectorProps) {
  return (
    <div className="relative">
      {/* Expanded Layer List */}
      {isOpen && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 mb-2">
          <Card className="bg-slate-900/90 backdrop-blur-md border-slate-700/50 text-white min-w-80">
            <CardContent className="p-4">
              <div className="space-y-2">
                {layers.map((layer) => (
                  <Button
                    key={layer.id}
                    variant={layer.id === currentLayer.id ? "default" : "ghost"}
                    className={`w-full justify-start text-left h-auto p-3 ${
                      layer.id === currentLayer.id
                        ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                        : "text-slate-300 hover:text-white hover:bg-slate-800"
                    }`}
                    onClick={() => {
                      onLayerChange(layer.id)
                      onToggle()
                    }}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <span className="text-lg">{layer.icon}</span>
                      <div className="flex-1">
                        <div className="font-medium">{layer.name}</div>
                        <div className="text-xs opacity-70 mt-1">{layer.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Current Layer Display */}
      <Card className="bg-slate-900/90 backdrop-blur-md border-slate-700/50 text-white min-w-80">
        <CardContent className="p-4">
          <Button
            variant="ghost"
            className="w-full justify-between text-left h-auto p-0 hover:bg-transparent"
            onClick={onToggle}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{currentLayer.icon}</span>
              <div>
                <div className="font-medium flex items-center gap-2">
                  {currentLayer.name}
                  <Info className="h-3 w-3 text-slate-400" />
                </div>
                <div className="text-xs text-slate-400 mt-1">{currentLayer.description}</div>
              </div>
            </div>
            {isOpen ? (
              <ChevronDown className="h-4 w-4 text-slate-400" />
            ) : (
              <ChevronUp className="h-4 w-4 text-slate-400" />
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
