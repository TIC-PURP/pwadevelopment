"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  GoogleMap,
  LoadScript,
  DrawingManager,
  Polygon
} from "@react-google-maps/api"

export interface Coordinate {
  lat: number
  lng: number
}

interface PolygonMapGoogleProps {
  onPolygonChange: (coordinates: Coordinate[] | null) => void
  initialPolygon?: Coordinate[] | null
  onClose?: () => void
}

const containerStyle = {
  width: "100%",
  height: "500px"
}

const defaultCenter = {
  lat: 23.6345,
  lng: -102.5528 // México
}

const mapOptions = {
  fullscreenControl: false,
  mapTypeControl: true,
  streetViewControl: false
}

export default function PolygonMapGoogle({
  onPolygonChange,
  initialPolygon,
  onClose
}: PolygonMapGoogleProps) {
  const [polygonPath, setPolygonPath] = useState<Coordinate[]>(initialPolygon || [])
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const polygonRef = useRef<google.maps.Polygon | null>(null)
  const [drawingModes, setDrawingModes] = useState<google.maps.drawing.OverlayType[]>([])

  useEffect(() => {
    if (typeof window !== "undefined" && window.google?.maps?.drawing) {
      setDrawingModes([window.google.maps.drawing.OverlayType.POLYGON])
    }
  }, [])

  const handlePolygonComplete = useCallback((polygon: google.maps.Polygon) => {
    const path = polygon.getPath().getArray().map(latlng => ({
      lat: latlng.lat(),
      lng: latlng.lng()
    }))
    setPolygonPath(path)
    onPolygonChange(path)
    polygon.setMap(null)
  }, [onPolygonChange])

  const handleEdit = () => {
    const polygon = polygonRef.current
    if (!polygon) return
    const path = polygon.getPath().getArray().map(p => ({ lat: p.lat(), lng: p.lng() }))
    setPolygonPath(path)
    onPolygonChange(path)
  }

  const handleSave = () => {
    localStorage.setItem("polygon", JSON.stringify(polygonPath))
    alert("Polígono guardado en localStorage")
  }

  const handleLoadSaved = () => {
    const saved = localStorage.getItem("polygon")
    if (saved) {
      const coords = JSON.parse(saved)
      setPolygonPath(coords)
      onPolygonChange(coords)
    }
  }

  const handleDelete = () => {
    setPolygonPath([])
    onPolygonChange(null)
    localStorage.removeItem("polygon")
  }

  return (
    <div>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        libraries={["drawing"]}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={defaultCenter}
          zoom={6}
          options={mapOptions}
          onLoad={map => setMap(map)}
        >
          {!polygonPath.length && drawingModes.length > 0 && (
            <DrawingManager
              onPolygonComplete={handlePolygonComplete}
              options={{
                drawingControl: true,
                drawingControlOptions: {
                  drawingModes: drawingModes,
                  position: google.maps.ControlPosition.TOP_CENTER
                },
                polygonOptions: {
                  editable: true,
                  draggable: false,
                  fillColor: "#00FF00",
                  fillOpacity: 0.2,
                  strokeWeight: 2
                }
              }}
            />
          )}

          {polygonPath.length > 0 && (
            <Polygon
              path={polygonPath}
              editable
              draggable={false}
              onMouseUp={handleEdit}
              onDragEnd={handleEdit}
              onLoad={(polygon) => (polygonRef.current = polygon)}
              options={{
                fillColor: "#00FF00",
                fillOpacity: 0.2,
                strokeWeight: 2
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      <div style={{ marginTop: 16 }}>
        <button onClick={handleSave}>💾 Guardar</button>
        <button onClick={handleLoadSaved} style={{ marginLeft: 8 }}>📂 Cargar</button>
        <button onClick={handleDelete} style={{ marginLeft: 8 }}>🗑️ Borrar</button>
        {onClose && (
          <button onClick={onClose} style={{ marginLeft: 8 }}>❌ Cerrar</button>
        )}
      </div>
    </div>
  )
}
