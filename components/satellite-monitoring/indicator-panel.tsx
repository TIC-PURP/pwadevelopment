"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface Campaign {
  id: string
  name: string
  crop: string
  totalArea: number
}

interface IndicatorPanelProps {
  campaign: Campaign | null
  selectedLayer: string
  selectedParcel: string | null
}

export function IndicatorPanel({ campaign, selectedLayer, selectedParcel }: IndicatorPanelProps) {
  const getLayerIndicators = () => {
    switch (selectedLayer) {
      case "biomass":
        return {
          title: "Biomasa",
          unit: "kg/ha",
          min: 1200,
          max: 4500,
          avg: 2800,
          legend: [
            { color: "#ef4444", label: "Baja (< 2000)", range: "< 2000" },
            { color: "#f59e0b", label: "Media (2000-3500)", range: "2000-3500" },
            { color: "#22c55e", label: "Alta (> 3500)", range: "> 3500" },
          ],
        }
      case "ndvi":
        return {
          title: "NDVI",
          unit: "",
          min: 0.2,
          max: 0.9,
          avg: 0.65,
          legend: [
            { color: "#ef4444", label: "Bajo (< 0.4)", range: "< 0.4" },
            { color: "#f59e0b", label: "Medio (0.4-0.7)", range: "0.4-0.7" },
            { color: "#22c55e", label: "Alto (> 0.7)", range: "> 0.7" },
          ],
        }
      case "chlorophyll":
        return {
          title: "Clorofila",
          unit: "μg/cm²",
          min: 15,
          max: 45,
          avg: 32,
          legend: [
            { color: "#ef4444", label: "Baja (< 25)", range: "< 25" },
            { color: "#f59e0b", label: "Media (25-35)", range: "25-35" },
            { color: "#22c55e", label: "Alta (> 35)", range: "> 35" },
          ],
        }
      case "anomalies":
        return {
          title: "Anomalías",
          unit: "",
          min: 0,
          max: 100,
          avg: 15,
          legend: [
            { color: "#dc2626", label: "Carencia (3 imágenes)", range: "Severa" },
            { color: "#ea580c", label: "Carencia (2 imágenes)", range: "Moderada" },
            { color: "#f97316", label: "Carencia (1 imagen)", range: "Leve" },
            { color: "#22c55e", label: "Sin anomalías", range: "Normal" },
            { color: "#f59e0b", label: "Exceso (1 imagen)", range: "Leve" },
            { color: "#ea580c", label: "Exceso (2 imágenes)", range: "Moderada" },
            { color: "#dc2626", label: "Exceso (3 imágenes)", range: "Severa" },
          ],
        }
      default:
        return {
          title: "RGB",
          unit: "",
          min: 0,
          max: 255,
          avg: 128,
          legend: [
            { color: "#22c55e", label: "Vegetación saludable", range: "Verde" },
            { color: "#8b5cf6", label: "Suelo expuesto", range: "Marrón" },
            { color: "#3b82f6", label: "Agua", range: "Azul" },
          ],
        }
    }
  }

  const indicators = getLayerIndicators()

  return (
    <Card className="bg-slate-900/90 backdrop-blur-md border-slate-700/50 text-white">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Indicadores - {indicators.title}
          {selectedParcel && (
            <Badge variant="outline" className="text-cyan-400 border-cyan-400">
              Lote {selectedParcel}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Statistics */}
        {selectedLayer !== "anomalies" && selectedLayer !== "rgb" && (
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-slate-400">Mínimo</div>
              <div className="font-medium">
                {indicators.min}
                {indicators.unit}
              </div>
            </div>
            <div className="text-center">
              <div className="text-slate-400">Promedio</div>
              <div className="font-medium">
                {indicators.avg}
                {indicators.unit}
              </div>
            </div>
            <div className="text-center">
              <div className="text-slate-400">Máximo</div>
              <div className="font-medium">
                {indicators.max}
                {indicators.unit}
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar for non-anomaly layers */}
        {selectedLayer !== "anomalies" && selectedLayer !== "rgb" && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>{indicators.min}</span>
              <span>{indicators.max}</span>
            </div>
            <Progress
              value={((indicators.avg - indicators.min) / (indicators.max - indicators.min)) * 100}
              className="h-2"
            />
          </div>
        )}

        {/* Legend */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-slate-300">Leyenda</div>
          <div className="space-y-2">
            {indicators.legend.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.label}</span>
                </div>
                <span className="text-slate-400">{item.range}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Area Coverage for Anomalies */}
        {selectedLayer === "anomalies" && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-slate-300">Cobertura por Área</div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Sin anomalías:</span>
                <span className="text-green-400">78.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Anomalías leves:</span>
                <span className="text-yellow-400">15.2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Anomalías severas:</span>
                <span className="text-red-400">6.3%</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
