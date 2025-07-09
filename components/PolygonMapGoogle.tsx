"use client"

// Importación de hooks y componentes de Google Maps
import { useCallback, useRef, useState, useEffect } from "react"
import {
  GoogleMap,
  LoadScript,
  DrawingManager,
  Polygon,
  Marker,
  InfoWindow
} from "@react-google-maps/api"

// Tipo de dato para una coordenada
export interface Coordinate {
  lat: number
  lng: number
}

// Props que recibe el componente del mapa
interface PolygonMapGoogleProps {
  onPolygonChange: (coordinates: Coordinate[] | null) => void
  initialPolygon?: Coordinate[] | null
  onClose?: () => void
}

// Estilo del contenedor del mapa
const containerStyle = {
  width: "100%",
  height: "500px"
}

// Centro inicial del mapa (México)
const defaultCenter = {
  lat: 23.6345,
  lng: -102.5528
}

// Opciones del mapa
const mapOptions = {
  fullscreenControl: true,
  mapTypeControl: true,
  streetViewControl: true
}

export default function PolygonMapGoogle({
  onPolygonChange,
  initialPolygon,
  onClose
}: PolygonMapGoogleProps) {
  // Estado del polígono dibujado
  const [polygonPath, setPolygonPath] = useState<Coordinate[]>(initialPolygon || [])
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const polygonRef = useRef<google.maps.Polygon | null>(null)
  const [drawingModes, setDrawingModes] = useState<google.maps.drawing.OverlayType[]>([])
  const [selectedVertex, setSelectedVertex] = useState<number | null>(null)

  // Estado para la geolocalización
  const [userLocation, setUserLocation] = useState<Coordinate | null>(null)

  // Obtener la ubicación del usuario
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error("Error obteniendo la geolocalización: ", error)
          // Si no se puede obtener la ubicación, mantén el valor por defecto
        }
      )
    }
  }, [])

  // Al cargar el mapa, se inicializa drawingModes y carga del localStorage si no hay initialPolygon
  const handleMapLoad = (map: google.maps.Map) => {
    setMap(map)
    if (window.google?.maps?.drawing) {
      setDrawingModes([window.google.maps.drawing.OverlayType.POLYGON])
    }
    if (!initialPolygon) {
      const saved = localStorage.getItem("polygon")
      if (saved) {
        try {
          const coords: Coordinate[] = JSON.parse(saved)
          setPolygonPath(coords)
          onPolygonChange(coords)
        } catch {
          localStorage.removeItem("polygon")
        }
      }
    }
  }

  // Cuando se completa el dibujo de un polígono
  const handlePolygonComplete = useCallback((polygon: google.maps.Polygon) => {
    const path = polygon.getPath().getArray().map(latlng => ({
      lat: latlng.lat(),
      lng: latlng.lng()
    }))
    setPolygonPath(path)
    onPolygonChange(path)
    polygon.setMap(null) // Elimina el polígono de dibujo original
  }, [onPolygonChange])

  // Cuando se edita el polígono manualmente (al mover vértices)
  const handleEdit = () => {
    const polygon = polygonRef.current
    if (!polygon) return
    const path = polygon.getPath().getArray().map(p => ({ lat: p.lat(), lng: p.lng() }))
    setPolygonPath(path)
    onPolygonChange(path)
  }

  // Guardar el polígono en localStorage
  const handleSave = () => {
    localStorage.setItem("polygon", JSON.stringify(polygonPath))
    alert("Polígono guardado en localStorage")
  }

  // Cargar el polígono desde localStorage
  const handleLoadSaved = () => {
    const saved = localStorage.getItem("polygon")
    if (saved) {
      try {
        const coords: Coordinate[] = JSON.parse(saved)
        setPolygonPath(coords)
        onPolygonChange(coords)
      } catch {
        alert("No se pudo cargar el polígono guardado.")
      }
    }
  }

  // Eliminar el polígono
  const handleDelete = () => {
    setPolygonPath([])
    onPolygonChange(null)
    localStorage.removeItem("polygon")
    if (polygonRef.current) {
      polygonRef.current.setMap(null)
      polygonRef.current = null
    }
    setSelectedVertex(null)
  }

  return (
    <div>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
        libraries={["drawing"]}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation || defaultCenter}  // Usa la ubicación del usuario si está disponible
          zoom={6}
          options={mapOptions}
          onLoad={handleMapLoad}
        >
          {/* Mostrar el DrawingManager solo si aún no hay polígono */}
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

          {/* Mostrar el polígono existente con edición activada */}
          {polygonPath.length > 0 && (
            <>
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
              {/* Marcadores para cada vértice del polígono */}
              {polygonPath.map((coord, idx) => (
                <Marker
                  key={idx}
                  position={coord}
                  label={(idx + 1).toString()}
                  onClick={() => setSelectedVertex(idx)}
                  icon={{
                    path: window.google?.maps.SymbolPath.CIRCLE,
                    scale: 6,
                    fillColor: "#8B5CF6",
                    fillOpacity: 1,
                    strokeWeight: 1,
                    strokeColor: "#fff"
                  }}
                />
              ))}
              {/* InfoWindow con coordenadas del vértice seleccionado */}
              {selectedVertex !== null && (
                <InfoWindow
                  position={polygonPath[selectedVertex]}
                  onCloseClick={() => setSelectedVertex(null)}
                >
                  <div>
                    <div><b>Vértice {selectedVertex + 1}</b></div>
                    <div>Lat: {polygonPath[selectedVertex].lat.toFixed(6)}</div>
                    <div>Lng: {polygonPath[selectedVertex].lng.toFixed(6)}</div>
                  </div>
                </InfoWindow>
              )}
            </>
          )}
        </GoogleMap>
      </LoadScript>

      {/* Botones de control */}
      <div className="mt-4 flex gap-2 flex-wrap">
        <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">💾 Guardar</button>
        <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">🗑️ Borrar</button>
        {onClose && (
          <button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">❌ Cerrar</button>
        )}
      </div>
    </div>
  )
}
