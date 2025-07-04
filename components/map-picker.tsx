"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Loader2 } from "lucide-react"

interface MapPickerProps {
  onLocationChange: (coords: { lat: number; lng: number } | null) => void
  initialLocation?: { lat: number; lng: number } | null
}

export function MapPicker({ onLocationChange, initialLocation }: MapPickerProps) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(initialLocation || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocalización no soportada en este navegador")
      return
    }

    setLoading(true)
    setError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setLocation(coords)
        onLocationChange(coords)
        setLoading(false)
      },
      (error) => {
        setError("Error al obtener la ubicación: " + error.message)
        setLoading(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  }

  const clearLocation = () => {
    setLocation(null)
    onLocationChange(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Coordenadas GPS
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {location ? (
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">Ubicación capturada:</p>
            <p className="text-xs text-green-600 dark:text-green-300">Lat: {location.lat.toFixed(6)}</p>
            <p className="text-xs text-green-600 dark:text-green-300">Lng: {location.lng.toFixed(6)}</p>
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">No se han capturado coordenadas</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button type="button" onClick={getCurrentLocation} disabled={loading} size="sm" className="flex-1">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Obteniendo...
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-2" />
                Capturar GPS
              </>
            )}
          </Button>

          {location && (
            <Button type="button" variant="outline" onClick={clearLocation} size="sm">
              Limpiar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
