"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Campaign {
  id: string
  name: string
  crop: string
  totalArea: number
}

interface TemporalChartProps {
  campaign: Campaign | null
  selectedLayer: string
  selectedParcel: string | null
}

export function TemporalChart({ campaign, selectedLayer, selectedParcel }: TemporalChartProps) {
  // Datos simulados para el gráfico temporal
  const data = [
    { month: "Nov", value: 0.2, biomass: 0.3, ndvi: 0.25, chlorophyll: 0.2 },
    { month: "Dic", value: 0.4, biomass: 0.5, ndvi: 0.45, chlorophyll: 0.4 },
    { month: "Ene", value: 0.6, biomass: 0.7, ndvi: 0.65, chlorophyll: 0.6 },
    { month: "Feb", value: 0.8, biomass: 0.85, ndvi: 0.8, chlorophyll: 0.75 },
    { month: "Mar", value: 0.9, biomass: 0.95, ndvi: 0.9, chlorophyll: 0.85 },
    { month: "Abr", value: 0.85, biomass: 0.9, ndvi: 0.85, chlorophyll: 0.8 },
    { month: "May", value: 0.7, biomass: 0.75, ndvi: 0.7, chlorophyll: 0.65 },
    { month: "Jun", value: 0.5, biomass: 0.55, ndvi: 0.5, chlorophyll: 0.45 },
    { month: "Jul", value: 0.3, biomass: 0.35, ndvi: 0.3, chlorophyll: 0.25 },
  ]

  const getLayerName = () => {
    switch (selectedLayer) {
      case "biomass":
        return "Biomasa"
      case "ndvi":
        return "NDVI"
      case "chlorophyll":
        return "Clorofila"
      default:
        return "Índice"
    }
  }

  const getDataKey = () => {
    switch (selectedLayer) {
      case "biomass":
        return "biomass"
      case "ndvi":
        return "ndvi"
      case "chlorophyll":
        return "chlorophyll"
      default:
        return "value"
    }
  }

  return (
    <Card className="bg-slate-900/90 backdrop-blur-md border-slate-700/50 text-white">
      <CardHeader>
        <CardTitle className="text-lg">
          Evolución Temporal - {getLayerName()}
          {selectedParcel && <span className="text-cyan-400 ml-2">(Lote {selectedParcel})</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#ffffff",
                }}
              />
              <Line
                type="monotone"
                dataKey={getDataKey()}
                stroke="#06b6d4"
                strokeWidth={2}
                dot={{ fill: "#06b6d4", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#06b6d4", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
