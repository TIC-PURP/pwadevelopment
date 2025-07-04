"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Save, Trash2, X, Undo, Navigation } from "lucide-react"

interface Coordinate {
  lat: number
  lng: number
}

interface EnhancedPolygonMapProps {
  onPolygonChange: (coordinates: Coordinate[] | null) => void
  initialPolygon?: Coordinate[] | null
  onClose: () => void
}

export function EnhancedPolygonMap({ onPolygonChange, initialPolygon, onClose }: EnhancedPolygonMapProps) {
  const [coordinates, setCoordinates] = useState<Coordinate[]>(initialPolygon || [])
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mapCenter] = useState({ lat: 25.5428, lng: -108.4687 })
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null)

  useEffect(() => {
    drawMap()
  }, [coordinates, currentLocation])

  useEffect(() => {
    // Simular obtención de ubicación actual
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          // Si falla, usar ubicación por defecto
          setCurrentLocation(mapCenter)
        },
      )
    } else {
      setCurrentLocation(mapCenter)
    }
  }, [])

  const drawMap = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Dibujar fondo tipo satélite
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#8B7355")
    gradient.addColorStop(0.3, "#A0956B")
    gradient.addColorStop(0.6, "#6B8B47")
    gradient.addColorStop(1, "#4A6B3A")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Dibujar patrones de terreno
    ctx.fillStyle = "rgba(139, 115, 85, 0.3)"
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 50 + 20
      ctx.fillRect(x, y, size, size / 3)
    }

    // Dibujar ubicación actual
    if (currentLocation) {
      const x = (currentLocation.lng - mapCenter.lng + 0.01) * 10000 + canvas.width / 2
      const y = (mapCenter.lat - currentLocation.lat + 0.01) * 10000 + canvas.height / 2

      // Marcador de ubicación actual
      ctx.fillStyle = "#FF4444"
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, 2 * Math.PI)
      ctx.fill()
      ctx.strokeStyle = "#FFFFFF"
      ctx.lineWidth = 2
      ctx.stroke()

      // Etiqueta "Ubicación Actual"
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
      ctx.fillRect(x - 60, y - 35, 120, 20)
      ctx.fillStyle = "#333"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Ubicación Actual", x, y - 20)
    }

    // Dibujar polígono si hay coordenadas
    if (coordinates.length > 0) {
      // Relleno del polígono
      if (coordinates.length > 2) {
        ctx.fillStyle = "rgba(59, 130, 246, 0.4)"
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
        ctx.closePath()
        ctx.fill()
      }

      // Líneas del polígono
      ctx.strokeStyle = "#3B82F6"
      ctx.lineWidth = 3
      ctx.setLineDash([])
      ctx.beginPath()
      coordinates.forEach((coord, index) => {
        const x = (coord.lng - mapCenter.lng + 0.01) * 10000 + canvas.width / 2
        const y = (mapCenter.lat - coord.lat + 0.01) * 10000 + canvas.height / 2

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }

        // Líneas de conexión entre puntos
        if (index > 0) {
          const prevX = (coordinates[index - 1].lng - mapCenter.lng + 0.01) * 10000 + canvas.width / 2
          const prevY = (mapCenter.lat - coordinates[index - 1].lat + 0.01) * 10000 + canvas.height / 2
          ctx.moveTo(prevX, prevY)
          ctx.lineTo(x, y)
        }
      })

      // Cerrar polígono si hay más de 2 puntos
      if (coordinates.length > 2) {
        const firstX = (coordinates[0].lng - mapCenter.lng + 0.01) * 10000 + canvas.width / 2
        const firstY = (mapCenter.lat - coordinates[0].lat + 0.01) * 10000 + canvas.height / 2
        const lastX = (coordinates[coordinates.length - 1].lng - mapCenter.lng + 0.01) * 10000 + canvas.width / 2
        const lastY = (mapCenter.lat - coordinates[coordinates.length - 1].lat + 0.01) * 10000 + canvas.height / 2
        ctx.moveTo(lastX, lastY)
        ctx.lineTo(firstX, firstY)
      }
      ctx.stroke()

      // Dibujar puntos marcadores
      coordinates.forEach((coord, index) => {
        const x = (coord.lng - mapCenter.lng + 0.01) * 10000 + canvas.width / 2
        const y = (mapCenter.lat - coord.lat + 0.01) * 10000 + canvas.height / 2

        // Círculo azul del marcador
        ctx.fillStyle = "#1D4ED8"
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, 2 * Math.PI)
        ctx.fill()

        // Borde blanco
        ctx.strokeStyle = "#FFFFFF"
        ctx.lineWidth = 2
        ctx.stroke()

        // Número del punto
        ctx.fillStyle = "#FFFFFF"
        ctx.font = "bold 10px Arial"
        ctx.textAlign = "center"
        ctx.fillText((index + 1).toString(), x, y + 3)
      })
    }

    // Dibujar línea de ayuda si está dibujando
    if (isDrawing && coordinates.length > 0) {
      ctx.strokeStyle = "rgba(59, 130, 246, 0.5)"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.stroke()
    }
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Convertir coordenadas del canvas a coordenadas GPS
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

  const removeLastPoint = () => {
    if (coordinates.length > 0) {
      setCoordinates((prev) => prev.slice(0, -1))
    }
  }

  const savePolygon = () => {
    if (coordinates.length >= 3) {
      onPolygonChange(coordinates)
      onClose()
    }
  }

  const calculateArea = () => {
    if (coordinates.length < 3) return 0
    // Fórmula simplificada para calcular área aproximada
    return ((coordinates.length - 2) * 2.5).toFixed(2)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-5xl max-h-[95vh] overflow-hidden">
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
            {/* Instrucciones mejoradas */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <Navigation className="h-4 w-4" />
                Instrucciones para delimitar el área:
              </h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Haz clic en "Iniciar Delimitación" para comenzar</li>
                <li>Haz clic en el mapa para agregar puntos del perímetro</li>
                <li>Necesitas al menos 3 puntos para formar un área válida</li>
                <li>Usa "Eliminar Último Punto" si cometes un error</li>
                <li>Haz clic en "Finalizar" cuando completes el perímetro</li>
              </ol>
            </div>

            {/* Mapa Canvas mejorado */}
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg">
              <canvas
                ref={canvasRef}
                width={900}
                height={500}
                className="w-full cursor-crosshair"
                onClick={handleCanvasClick}
                style={{ maxWidth: "100%", height: "auto" }}
              />
            </div>

            {/* Información del polígono mejorada */}
            {coordinates.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-green-900">Información del Área Delimitada</h4>
                  <div className="flex gap-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                      {coordinates.length} puntos
                    </span>
                    {coordinates.length >= 3 && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        ~{calculateArea()} hectáreas
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                  {coordinates.map((coord, index) => (
                    <div key={index} className="flex justify-between bg-white p-2 rounded">
                      <span className="font-medium">Punto {index + 1}:</span>
                      <span className="text-gray-600">
                        {coord.lat.toFixed(6)}, {coord.lng.toFixed(6)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Controles mejorados */}
            <div className="flex flex-wrap gap-3 justify-center">
              {!isDrawing ? (
                <Button onClick={startDrawing} className="bg-blue-500 hover:bg-blue-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  Iniciar Delimitación
                </Button>
              ) : (
                <Button onClick={finishDrawing} className="bg-green-500 hover:bg-green-600">
                  <Save className="h-4 w-4 mr-2" />
                  Finalizar Delimitación
                </Button>
              )}

              {coordinates.length > 0 && (
                <Button onClick={removeLastPoint} variant="outline" className="border-orange-300 text-orange-700">
                  <Undo className="h-4 w-4 mr-2" />
                  Eliminar Último Punto
                </Button>
              )}

              <Button onClick={clearPolygon} variant="outline" className="border-red-300 text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Limpiar Todo
              </Button>

              {coordinates.length >= 3 && !isDrawing && (
                <Button onClick={savePolygon} className="bg-green-500 hover:bg-green-600">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Marcadores
                </Button>
              )}
            </div>

            {/* Estado actual mejorado */}
            <div className="text-center text-sm">
              {isDrawing && (
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <span>Modo delimitación activo - Haz clic en el mapa para agregar puntos</span>
                </div>
              )}
              {!isDrawing && coordinates.length === 0 && (
                <span className="text-gray-600">📍 Haz clic en "Iniciar Delimitación" para comenzar</span>
              )}
              {!isDrawing && coordinates.length > 0 && coordinates.length < 3 && (
                <span className="text-orange-600">⚠️ Necesitas al menos 3 puntos para formar un área válida</span>
              )}
              {!isDrawing && coordinates.length >= 3 && (
                <span className="text-green-600">✅ Área delimitada correctamente</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
