"use client"

import { useState, useCallback } from "react"
import { GoogleMap, LoadScript, DrawingManager, Polygon } from "@react-google-maps/api"

export interface Coordinate {
  lat: number
  lng: number
}

interface PolygonMapGoogleProps {
  onPolygonChange: (coordinates: Coordinate[] | null) => void
  initialPolygon?: Coordinate[] | null
  onClose?: () => void
}

const containerStyle = { width: "100%", height: "400px" }
const defaultCenter = { lat: 23.6345, lng: -102.5528 }

export default function PolygonMapGoogle({
  onPolygonChange,
  initialPolygon,
  onClose,
}: PolygonMapGoogleProps) {
  const [polygonPath, setPolygonPath] = useState<Coordinate[]>(initialPolygon || [])

  const handlePolygonComplete = useCallback(
    (polygon: google.maps.Polygon) => {
      const path = polygon.getPath().getArray().map(latlng => ({
        lat: latlng.lat(),
        lng: latlng.lng(),
      }))
      setPolygonPath(path)
      onPolygonChange(path)
      polygon.setMap(null) // elimina el polígono editable del DrawingManager
    },
    [onPolygonChange]
  )

  return (
    <div>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? ""}
        libraries={["drawing"]}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={polygonPath[0] || defaultCenter}
          zoom={polygonPath.length ? 15 : 6}
        >
          <DrawingManager
            onPolygonComplete={handlePolygonComplete}
            options={{
              drawingControl: true,
              drawingControlOptions: {
                drawingModes: ["POLYGON" as google.maps.drawing.OverlayType],
              },
              polygonOptions: {
                fillColor: "#16a34a",
                fillOpacity: 0.3,
                strokeColor: "#16a34a",
                strokeOpacity: 1,
                strokeWeight: 2,
                clickable: false,
                editable: false,
                zIndex: 1,
              },
            }}
          />

          {polygonPath.length > 2 && (
            <Polygon
              path={polygonPath}
              options={{
                fillColor: "#16a34a",
                fillOpacity: 0.3,
                strokeColor: "#16a34a",
                strokeOpacity: 1,
                strokeWeight: 2,
                clickable: false,
                editable: false,
                zIndex: 1,
              }}
            />
          )}
        </GoogleMap>
      </LoadScript>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 8 }}>
        <button
          onClick={() => {
            setPolygonPath([])
            onPolygonChange(null)
          }}
          style={{
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Limpiar
        </button>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 6,
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            Cerrar
          </button>
        )}
      </div>
    </div>
  )
}
