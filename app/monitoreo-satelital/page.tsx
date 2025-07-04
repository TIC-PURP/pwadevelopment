"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { SatelliteMapView } from "@/components/satellite-monitoring/satellite-map-view"
import { SidebarNavigation } from "@/components/satellite-monitoring/sidebar-navigation"
import { FloatingControls } from "@/components/satellite-monitoring/floating-controls"
import { LayerSelector } from "@/components/satellite-monitoring/layer-selector"
import { DateControls } from "@/components/satellite-monitoring/date-controls"
import { SearchBar } from "@/components/satellite-monitoring/search-bar"
import { Bell, HelpCircle } from "lucide-react"

interface Campaign {
  id: string
  name: string
  crop: string
  totalArea: number
  startDate: string
  endDate: string
  harvestStart: string
  variety: string
}

interface LayerType {
  id: string
  name: string
  description: string
  enabled: boolean
  icon: string
}

export default function MonitoreoSatelitalPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedLayer, setSelectedLayer] = useState("rgb")
  const [cloudCoverage, setCloudCoverage] = useState(8)
  const [searchQuery, setSearchQuery] = useState("")
  const [showLayerSelector, setShowLayerSelector] = useState(false)

  const campaigns: Campaign[] = [
    {
      id: "1",
      name: "Purp_maiz 05/2025",
      crop: "CORN",
      totalArea: 500.75,
      startDate: "2024-10-01",
      endDate: "2025-08-31",
      harvestStart: "2025-05-01",
      variety: "DK4050",
    },
    {
      id: "2",
      name: "Purp_garbanzo 03/2025",
      crop: "CHICKPEA",
      totalArea: 320.5,
      startDate: "2024-11-15",
      endDate: "2025-07-15",
      harvestStart: "2025-03-01",
      variety: "BLANCO",
    },
  ]

  const layers: LayerType[] = [
    { id: "rgb", name: "Fotografía RGB", description: "Visualización en color natural", enabled: true, icon: "🌍" },
    { id: "biomass", name: "Biomasa", description: "Cantidad de materia vegetal", enabled: false, icon: "🌱" },
    { id: "chlorophyll", name: "Clorofila", description: "Contenido de clorofila foliar", enabled: false, icon: "🍃" },
    { id: "ndvi", name: "NDVI", description: "Índice de vegetación", enabled: false, icon: "📊" },
    {
      id: "anomalies",
      name: "Anomalías",
      description: "Detección de zonas con desarrollo atípico",
      enabled: false,
      icon: "⚠️",
    },
    {
      id: "production",
      name: "Producción",
      description: "Estimación cualitativa de productividad",
      enabled: false,
      icon: "🌾",
    },
  ]

  useEffect(() => {
    if (campaigns.length > 0 && !selectedCampaign) {
      setSelectedCampaign(campaigns[0])
    }
  }, [])

  const getCurrentLayer = () => {
    return layers.find((layer) => layer.id === selectedLayer) || layers[0]
  }

  const handleDateChange = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 1)
    } else {
      newDate.setDate(newDate.getDate() + 1)
    }
    setSelectedDate(newDate)
  }

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Sidebar Navigation */}
      <SidebarNavigation />

      {/* Main Map Area */}
      <div className="absolute inset-0 left-20">
        <SatelliteMapView
          campaign={selectedCampaign}
          selectedDate={selectedDate}
          selectedLayer={selectedLayer}
          cloudCoverage={cloudCoverage}
        />
      </div>

      {/* Top Header with Search */}
      <div className="absolute top-4 left-24 right-4 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-white font-bold text-xl">PURPTech{"}"}</span>
            <span className="text-cyan-400 text-sm font-medium">Modelos inteligentes / Informes</span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="text-cyan-400 border-cyan-400/50 bg-cyan-400/10 hover:bg-cyan-400/20 backdrop-blur-sm"
            >
              Novedades
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 backdrop-blur-sm">
              <HelpCircle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 backdrop-blur-sm">
              <Bell className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-20 w-96">
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Buscar" />
      </div>

      {/* Floating Controls - Right Side */}
      <FloatingControls />

      {/* Layer Selector - Bottom Center */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20">
        <LayerSelector
          currentLayer={getCurrentLayer()}
          layers={layers}
          onLayerChange={setSelectedLayer}
          isOpen={showLayerSelector}
          onToggle={() => setShowLayerSelector(!showLayerSelector)}
        />
      </div>

      {/* Date Controls - Bottom */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
        <DateControls
          selectedDate={selectedDate}
          cloudCoverage={cloudCoverage}
          onDateChange={handleDateChange}
          onDateSelect={setSelectedDate}
        />
      </div>
    </div>
  )
}
