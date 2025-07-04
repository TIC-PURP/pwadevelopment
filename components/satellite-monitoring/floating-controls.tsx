"use client"

import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw, Eye, Layers, Download, Maximize } from "lucide-react"
import { useState } from "react"

export function FloatingControls() {
  const [zoomLevel, setZoomLevel] = useState(100)

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 400))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 25))
  }

  const handleReset = () => {
    setZoomLevel(100)
  }

  return (
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20">
      <div className="flex flex-col gap-2 bg-slate-900/80 backdrop-blur-md rounded-lg p-2 border border-slate-700/50">
        {/* Zoom In */}
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 text-white hover:bg-white/10 hover:text-cyan-400 transition-colors"
          onClick={handleZoomIn}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>

        {/* Zoom Out */}
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 text-white hover:bg-white/10 hover:text-cyan-400 transition-colors"
          onClick={handleZoomOut}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        {/* Reset View */}
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 text-white hover:bg-white/10 hover:text-cyan-400 transition-colors"
          onClick={handleReset}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>

        <div className="w-full h-px bg-slate-700/50 my-1" />

        {/* View Options */}
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 text-white hover:bg-white/10 hover:text-cyan-400 transition-colors"
        >
          <Eye className="h-4 w-4" />
        </Button>

        {/* Layers */}
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 text-white hover:bg-white/10 hover:text-cyan-400 transition-colors"
        >
          <Layers className="h-4 w-4" />
        </Button>

        {/* Fullscreen */}
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 text-white hover:bg-white/10 hover:text-cyan-400 transition-colors"
        >
          <Maximize className="h-4 w-4" />
        </Button>

        {/* Download */}
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 text-white hover:bg-white/10 hover:text-cyan-400 transition-colors"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Zoom Level Indicator */}
      <div className="mt-2 bg-slate-900/80 backdrop-blur-md rounded px-2 py-1 text-xs text-white text-center border border-slate-700/50">
        {zoomLevel}%
      </div>
    </div>
  )
}
