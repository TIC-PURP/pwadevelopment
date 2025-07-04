"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Save, Trash2, X } from "lucide-react"

interface Coordinate {
  lat: number
  lng: number
}

interface PolygonMapProps {
  onPolygonChange: (coordinates: Coordinate[] | null) => void
  initialPolygon?: Coordinate[] | null
  onClose: () => void
}

export function PolygonMap({ onPolygonChange, initialPolygon, onClose }: PolygonMapProps) {
  const [coordinates, setCoordinates] = useState<Coordinate[]>(initialPolygon || [])
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mapCenter] = useState({ lat: 25.5428, lng: -108.4687 }) // Coordenadas de ejemplo para Sinaloa

  useEffect(() => {
    drawMap()
  }, [coordinates])

  const drawMap = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Dibujar fondo del mapa (simulado)
    ctx.fillStyle = "#f0f0f0"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Dibujar grid
    ctx.strokeStyle = "#ddd"
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Dibujar polígono si hay coordenadas
    if (coordinates.length > 0) {
      ctx.strokeStyle = "#3b82f6"
      ctx.fillStyle = "rgba(59, 130, 246, 0.3)"
      ctx.lineWidth = 3

      ctx.beginPath()
      coordinates.forEach((coord, index) => {
        const x = (coord.lng - mapCenter.lng + 0.01) * 10000 + canvas.width / 2
        const y = (mapCenter.lat - coord.lat + 0.01) * 10000 + canvas.height / 2

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      if (coordinates.length > 2) {
        ctx.closePath()
        ctx.fill()
      }
      ctx.stroke()

      // Dibujar puntos
      coordinates.forEach((coord) => {
        const x = (coord.lng - mapCenter.lng + 0.01) * 10000 + canvas.width / 2
        const y = (mapCenter.lat - coord.lat + 0.01) * 10000 + canvas.height / 2

        ctx.fillStyle = "#1d4ed8"
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, 2 * Math.PI)
        ctx.fill()
      })
    }
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Convertir coordenadas del canvas a coordenadas GPS (simulado)
    const lng = mapCenter.lng + (x - canvas.width / 2) / 10000 - 0.01
    const lat = mapCenter.lat - (y - canvas.height / 2) / 10000 + 0.01

    const newCoord = { lat, lng }
    setCoordinates((prev) => [...prev, newCoord])
  }

  const startDrawing = () => {
    setIsDrawing(true)
    setCoordinates([])
  }

  const finishDrawing = () => {
    setIsDrawing(false)
    if (coordinates.length >= 3) {
      onPolygonChange(coordinates)
    }
  }

  const clearPolygon = () => {
    setCoordinates([])
    onPolygonChange(null)
    setIsDrawing(false)
  }

  const savePolygon = () => {
    if (coordinates.length >= 3) {
      onPolygonChange(coordinates)
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Delimitar Área del Predio
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Instrucciones */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Instrucciones:</h4>
              <ol className="text-sm text-blue-800 space-y-1">
                <li>1. Haz clic en "Iniciar Dibujo" para comenzar</li>
                <li>2. Haz clic en el mapa para agregar puntos del polígono</li>
                <li>3. Necesitas al menos 3 puntos para formar un área</li>
                <li>4. Haz clic en "Finalizar" cuando termines</li>
              </ol>
            </div>

            {/* Mapa Canvas */}
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="w-full cursor-crosshair"
                onClick={handleCanvasClick}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>

            {/* Información del polígono */}
            {coordinates.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Coordenadas del Polígono:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {coordinates.map((coord, index) => (
                    <div key={index} className="flex justify-between">
                      <span>Punto {index + 1}:</span>
                      <span>
                        {coord.lat.toFixed(6)}, {coord.lng.toFixed(6)}
                      </span>
                    </div>
                  ))}
                </div>
                {coordinates.length >= 3 && (
                  <div className="mt-2 text-sm text-green-600">
                    ✓ Área aproximada: {((coordinates.length - 2) * 0.5).toFixed(2)} hectáreas
                  </div>
                )}
              </div>
            )}

            {/* Controles */}
            <div className="flex flex-wrap gap-3">
              {!isDrawing ? (
                <Button onClick={startDrawing} className="bg-blue-500 hover:bg-blue-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  Iniciar Dibujo
                </Button>
              ) : (
                <Button onClick={finishDrawing} className="bg-green-500 hover:bg-green-600">
                  Finalizar Dibujo
                </Button>
              )}

              <Button onClick={clearPolygon} variant="outline">
                <Trash2 className="h-4 w-4 mr-2" />
                Limpiar
              </Button>

              {coordinates.length >= 3 && (
                <Button onClick={savePolygon} className="bg-green-500 hover:bg-green-600">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Coordenadas
                </Button>
              )}
            </div>

            {/* Estado actual */}
            <div className="text-sm text-gray-600">
              {isDrawing && <span className="text-blue-600">🔵 Modo dibujo activo - Haz clic en el mapa</span>}
              {!isDrawing && coordinates.length === 0 && (
                <span>📍 Haz clic en "Iniciar Dibujo" para delimitar el área</span>
              )}
              {!isDrawing && coordinates.length > 0 && coordinates.length < 3 && (
                <span className="text-orange-600">⚠️ Necesitas al menos 3 puntos para formar un área</span>
              )}
              {!isDrawing && coordinates.length >= 3 && <span className="text-green-600">✅ Polígono completado</span>}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
