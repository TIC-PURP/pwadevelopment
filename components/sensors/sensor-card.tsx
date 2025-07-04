"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react"
import type { ReactNode } from "react"

interface SensorCardProps {
  title: string
  value: number
  unit: string
  icon: LucideIcon
  color: string
  bgColor: string
  isAlert?: boolean
  trend?: "up" | "down" | "stable"
  extraInfo?: ReactNode
}

export function SensorCard({
  title,
  value,
  unit,
  icon: Icon,
  color,
  bgColor,
  isAlert = false,
  trend = "stable",
  extraInfo,
}: SensorCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case "down":
        return <TrendingDown className="h-3 w-3 text-red-500" />
      default:
        return <Minus className="h-3 w-3 text-gray-400" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-500"
    }
  }

  return (
    <Card
      className={`relative transition-all duration-200 hover:shadow-lg ${isAlert ? "ring-2 ring-red-500 shadow-red-100" : ""}`}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          {isAlert && (
            <Badge variant="destructive" className="text-xs animate-pulse">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Alerta
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{value.toFixed(1)}</span>
              <span className="text-sm text-gray-500">{unit}</span>
            </div>
            <div className={`flex items-center gap-1 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-xs font-medium">
                {trend === "up" ? "Alto" : trend === "down" ? "Bajo" : "Estable"}
              </span>
            </div>
          </div>
          {extraInfo}
        </div>
      </CardContent>
    </Card>
  )
}
