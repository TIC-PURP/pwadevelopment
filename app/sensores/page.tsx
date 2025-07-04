"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RealTimeData } from "@/components/sensors/real-time-data"
import { HistoricalAnalysis } from "@/components/sensors/historical-analysis"
import { SensorMap } from "@/components/sensors/sensor-map"
import { SensorManagement } from "@/components/sensors/sensor-management"
import { AlertsNotifications } from "@/components/sensors/alerts-notifications"
import { Activity, BarChart3, Map, Settings, Bell } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function SensorsPage() {
  const [activeTab, setActiveTab] = useState("realtime")

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header con botón de regresar */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b mb-8">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sensores Agrícolas</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monitoreo en tiempo real de condiciones ambientales y del suelo
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="realtime" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Tiempo Real
            </TabsTrigger>
            <TabsTrigger value="historical" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Mapa
            </TabsTrigger>
            <TabsTrigger value="management" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Gestión
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Alertas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="realtime">
            <RealTimeData />
          </TabsContent>

          <TabsContent value="historical">
            <HistoricalAnalysis />
          </TabsContent>

          <TabsContent value="map">
            <SensorMap />
          </TabsContent>

          <TabsContent value="management">
            <SensorManagement />
          </TabsContent>

          <TabsContent value="alerts">
            <AlertsNotifications />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
