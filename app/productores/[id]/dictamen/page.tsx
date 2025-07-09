"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { addDictamen } from "@/lib/slices/dictamenesSlice"
import PolygonMapGoogle from "@/components/PolygonMapGoogle"
import { useToast } from "@/hooks/use-toast"
import type { Coordinate, DictamenTecnico } from "@/lib/slices/dictamenesSlice"
import {
  FileText,
  MapPin,
  Calendar,
  User,
  Droplets,
  Mountain,
  Layers,
  Sprout,
  Plus,
  Edit,
  Save,
  Trash2,
  Map,
} from "lucide-react"


interface ProductividadRecord {
  id: string
  ciclo: string
  cultivo: string
  hectareas: string
  rendimiento: string
  observaciones: string
}

export default function DictamenTecnicoPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const productorId = params.id as string
  const { productores } = useAppSelector((state) => state.productores)

  const productor = productores.find((p) => p.id === productorId)

  const [formData, setFormData] = useState({
    // Datos Generales
    ciclo: "OI2526",
    fecha: new Date().toISOString().split("T")[0],
    ubicacion: "",
    tipoTenencia: "",
    predioRentado: "",
    propietarioPredio: "",
    cultivoSolicitado: "",
    superficie: "",
    plazoCultivo: "",

    // Régimen de Riego
    sistemaRiego: "",
    unidadModulo: "",
    metodoRiego: "",

    // Características del Suelo
    topografia: "",
    profundidad: "",
    textura: "",
    cultivoAnterior: "",
    infestacionMalezas: "LIBRE",

    // Avance de Labores
    subsoleo: "0",
    siembra: "0",
    marca: "0",
    rastreo: "0",
    aplicHerbicida: "0",
    escarificacion: "0",
    riego: "0",
    barbecho: "0",
    aplicInsecticida: "0",
    fertilizacion: "0",
    empareje: "0",
    analisisSuelo: "0",

    // Resultado y Plan
    resultadoSupervision: "POSITIVO",
    planAccion: "TERRENO APTO PARA ESTABLECER EL CULTIVO SOLICITADO",

    // Observaciones y Recomendaciones
    observaciones: "",
    recomendaciones: "",
  })

  const [productividadRecords, setProductividadRecords] = useState<ProductividadRecord[]>([])
  const [showAddProductividad, setShowAddProductividad] = useState(false)
  const [newProductividad, setNewProductividad] = useState({
    ciclo: "",
    cultivo: "",
    hectareas: "",
    rendimiento: "",
    observaciones: "",
  })

  // Estados para el mapa de coordenadas
  const [showPolygonMap, setShowPolygonMap] = useState(false)
  const [polygonCoordinates, setPolygonCoordinates] = useState<Coordinate[] | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addProductividadRecord = () => {
    if (newProductividad.ciclo && newProductividad.cultivo) {
      const record: ProductividadRecord = {
        id: Date.now().toString(),
        ...newProductividad,
      }
      setProductividadRecords((prev) => [...prev, record])
      setNewProductividad({
        ciclo: "",
        cultivo: "",
        hectareas: "",
        rendimiento: "",
        observaciones: "",
      })
      setShowAddProductividad(false)
    }
  }

  const removeProductividadRecord = (id: string) => {
    setProductividadRecords((prev) => prev.filter((record) => record.id !== id))
  }

  const handlePolygonChange = (coordinates: Coordinate[] | null) => {
    setPolygonCoordinates(coordinates)
  }

  const handleSave = () => {
    if (!formData.cultivoSolicitado || !formData.superficie) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const dictamen: DictamenTecnico = {
      id: Date.now().toString(),
      productorId,
      productorNombre: productor?.nombre || "",
      ...formData,
      avanceLabores: {
        subsoleo: formData.subsoleo,
        siembra: formData.siembra,
        marca: formData.marca,
        rastreo: formData.rastreo,
        aplicHerbicida: formData.aplicHerbicida,
        escarificacion: formData.escarificacion,
        riego: formData.riego,
        barbecho: formData.barbecho,
        aplicInsecticida: formData.aplicInsecticida,
        fertilizacion: formData.fertilizacion,
        empareje: formData.empareje,
        analisisSuelo: formData.analisisSuelo,
      },
      polygonCoordinates,
      status: "En Proceso",
      sincronizado: false,
    }

    dispatch(addDictamen(dictamen))

    toast({
      title: "Dictamen guardado",
      description: "El dictamen técnico se ha guardado correctamente",
    })

    router.push(`/productores/${productorId}/dictamenes`)
  }

  if (!productor) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header title="Productor no encontrado" showBack />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600 dark:text-gray-400">El productor no fue encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header title="Dictamen Técnico" showBack />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header del Dictamen */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6" />
                <div>
                  <CardTitle className="text-xl">Nuevo Dictamen Técnico</CardTitle>
                  <p className="text-blue-100 text-sm">Ciclo: {formData.ciclo}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Productor:</span>
                  <span className="font-medium">{productor.nombre}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Fecha:</span>
                  <span className="font-medium">{formData.fecha}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Superficie:</span>
                  <span className="font-medium">{formData.superficie || "25-00-00"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="default" className="bg-blue-500">
                    Status: En Proceso
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Datos Generales */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Datos Generales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ciclo">Ciclo</Label>
                  <Input
                    id="ciclo"
                    value={formData.ciclo}
                    onChange={(e) => handleInputChange("ciclo", e.target.value)}
                    placeholder="OI2526"
                  />
                </div>
                <div>
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => handleInputChange("fecha", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ubicacion">Ubicación</Label>
                  <Input
                    id="ubicacion"
                    value={formData.ubicacion}
                    onChange={(e) => handleInputChange("ubicacion", e.target.value)}
                    placeholder="Ej: PINITOS"
                  />
                </div>
                <div>
                  <Label htmlFor="tipoTenencia">Tipo de Tenencia</Label>
                  <Select
                    value={formData.tipoTenencia}
                    onValueChange={(value) => handleInputChange("tipoTenencia", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pequeña-propiedad">Pequeña Propiedad</SelectItem>
                      <SelectItem value="ejidal">Ejidal</SelectItem>
                      <SelectItem value="comunal">Comunal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="predioRentado">¿Predio es rentado?</Label>
                  <Select
                    value={formData.predioRentado}
                    onValueChange={(value) => handleInputChange("predioRentado", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="si">Sí</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cultivoSolicitado">Cultivo Solicitado *</Label>
                  <Select
                    value={formData.cultivoSolicitado}
                    onValueChange={(value) => handleInputChange("cultivoSolicitado", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona cultivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frijol">Frijol</SelectItem>
                      <SelectItem value="maiz">Maíz</SelectItem>
                      <SelectItem value="sorgo">Sorgo</SelectItem>
                      <SelectItem value="garbanzo">Garbanzo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="superficie">Superficie (Ha) *</Label>
                  <Input
                    id="superficie"
                    value={formData.superficie}
                    onChange={(e) => handleInputChange("superficie", e.target.value)}
                    placeholder="25-00-00"
                  />
                </div>
                <div>
                  <Label htmlFor="plazoCultivo">Plazo de Cultivo</Label>
                  <Input
                    id="plazoCultivo"
                    value={formData.plazoCultivo}
                    onChange={(e) => handleInputChange("plazoCultivo", e.target.value)}
                    placeholder="7 Meses"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agregar Coordenadas */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-blue-500" />
                Agregar Coordenadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {polygonCoordinates && polygonCoordinates.length > 0 ? (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-blue-800">Área delimitada correctamente</h4>
                    <Badge className="bg-blue-100 text-blue-800">{polygonCoordinates.length} puntos</Badge>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">
                    Se ha guardado un polígono con {polygonCoordinates.length} coordenadas GPS.
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowPolygonMap(true)}
                      className="text-blue-700 border-blue-300"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Área
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setPolygonCoordinates(null)}
                      className="text-red-600 border-red-300"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Map className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h4 className="font-medium text-gray-900 mb-2">Delimitar área del predio</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Utiliza el mapa interactivo para delimitar el área exacta del predio con coordenadas GPS
                  </p>
                  <Button onClick={() => setShowPolygonMap(true)} className="bg-blue-500 hover:bg-blue-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    Abrir Mapa
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Régimen de Riego */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                Régimen de Riego
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="sistemaRiego">Sistema de Riego</Label>
                  <Select
                    value={formData.sistemaRiego}
                    onValueChange={(value) => handleInputChange("sistemaRiego", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona sistema" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="canal">Canal</SelectItem>
                      <SelectItem value="bomba">Bomba</SelectItem>
                      <SelectItem value="pozo">Pozo</SelectItem>
                      <SelectItem value="represa">Represa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="unidadModulo">Unidad o Módulo</Label>
                  <Select
                    value={formData.unidadModulo}
                    onValueChange={(value) => handleInputChange("unidadModulo", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guasave">GUASAVE</SelectItem>
                      <SelectItem value="bamoa">BAMOA</SelectItem>
                      <SelectItem value="batequis">BATEQUIS</SelectItem>
                      <SelectItem value="el-sabinal">EL SABINAL</SelectItem>
                      <SelectItem value="juncos">JUNCOS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="metodoRiego">Método de Riego</Label>
                  <Select
                    value={formData.metodoRiego}
                    onValueChange={(value) => handleInputChange("metodoRiego", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gravedad">Gravedad</SelectItem>
                      <SelectItem value="aspersion">Aspersión</SelectItem>
                      <SelectItem value="bombeo">Bombeo</SelectItem>
                      <SelectItem value="goteo">Goteo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Características del Suelo */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mountain className="h-5 w-5 text-amber-500" />
                Características del Suelo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="topografia">Topografía</Label>
                  <Select value={formData.topografia} onValueChange={(value) => handleInputChange("topografia", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plana">Plana</SelectItem>
                      <SelectItem value="semiplana">Semiplana</SelectItem>
                      <SelectItem value="con-pendiente">Con Pendiente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="profundidad">Profundidad</Label>
                  <Select
                    value={formData.profundidad}
                    onValueChange={(value) => handleInputChange("profundidad", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="profundo">Profundo</SelectItem>
                      <SelectItem value="semiprofundo">Semiprofundo</SelectItem>
                      <SelectItem value="superficial">Superficial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="textura">Textura</Label>
                  <Select value={formData.textura} onValueChange={(value) => handleInputChange("textura", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona textura" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aluvion">Aluvión</SelectItem>
                      <SelectItem value="barrial">Barrial</SelectItem>
                      <SelectItem value="arcilloso">Arcilloso</SelectItem>
                      <SelectItem value="arenoso">Arenoso</SelectItem>
                      <SelectItem value="franco">Franco</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cultivoAnterior">Cultivo Anterior</Label>
                  <Select
                    value={formData.cultivoAnterior}
                    onValueChange={(value) => handleInputChange("cultivoAnterior", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona cultivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frijol">Frijol</SelectItem>
                      <SelectItem value="maiz">Maíz</SelectItem>
                      <SelectItem value="sorgo">Sorgo</SelectItem>
                      <SelectItem value="garbanzo">Garbanzo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="infestacionMalezas">Infestación de Malezas</Label>
                  <Select
                    value={formData.infestacionMalezas}
                    onValueChange={(value) => handleInputChange("infestacionMalezas", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LIBRE">Libre</SelectItem>
                      <SelectItem value="LEVE">Leve</SelectItem>
                      <SelectItem value="MODERADA">Moderada</SelectItem>
                      <SelectItem value="SEVERA">Severa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avance de Labores */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-500" />
                Avance de Labores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { key: "subsoleo", label: "Subsoleo" },
                  { key: "siembra", label: "Siembra" },
                  { key: "marca", label: "Marca" },
                  { key: "rastreo", label: "Rastreo" },
                  { key: "aplicHerbicida", label: "Aplic. Herbicida" },
                  { key: "escarificacion", label: "Escarificación" },
                  { key: "riego", label: "Riego" },
                  { key: "barbecho", label: "Barbecho" },
                  { key: "aplicInsecticida", label: "AP. Insecticida" },
                  { key: "fertilizacion", label: "Fertilización" },
                  { key: "empareje", label: "Empareje" },
                  { key: "analisisSuelo", label: "Análisis Suelo" },
                ].map((item) => (
                  <div key={item.key}>
                    <Label htmlFor={item.key} className="text-xs">
                      {item.label}
                    </Label>
                    <Input
                      id={item.key}
                      type="number"
                      value={formData[item.key as keyof typeof formData]}
                      onChange={(e) => handleInputChange(item.key, e.target.value)}
                      className="text-center"
                      min="0"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Antecedentes de Productividad */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="h-5 w-5 text-emerald-500" />
                Antecedentes de Productividad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {productividadRecords.map((record) => (
                <div key={record.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <Label className="text-xs text-gray-500">Ciclo</Label>
                      <p className="font-medium">{record.ciclo}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Cultivo</Label>
                      <p className="font-medium">{record.cultivo}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Hectáreas</Label>
                      <p className="font-medium">{record.hectareas}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500">Rendimiento</Label>
                      <p className="font-medium">{record.rendimiento}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => removeProductividadRecord(record.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {record.observaciones && (
                    <div className="mt-2">
                      <Label className="text-xs text-gray-500">Observaciones</Label>
                      <p className="text-sm">{record.observaciones}</p>
                    </div>
                  )}
                </div>
              ))}

              {showAddProductividad ? (
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="newCiclo">Ciclo</Label>
                      <Input
                        id="newCiclo"
                        value={newProductividad.ciclo}
                        onChange={(e) => setNewProductividad((prev) => ({ ...prev, ciclo: e.target.value }))}
                        placeholder="012324"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newCultivo">Cultivo</Label>
                      <Select
                        value={newProductividad.cultivo}
                        onValueChange={(value) => setNewProductividad((prev) => ({ ...prev, cultivo: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona cultivo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FRIJOL">Frijol</SelectItem>
                          <SelectItem value="MAÍZ">Maíz</SelectItem>
                          <SelectItem value="SORGO">Sorgo</SelectItem>
                          <SelectItem value="GARBANZO">Garbanzo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="newHectareas">Hectáreas</Label>
                      <Input
                        id="newHectareas"
                        value={newProductividad.hectareas}
                        onChange={(e) => setNewProductividad((prev) => ({ ...prev, hectareas: e.target.value }))}
                        placeholder="25-00-00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newRendimiento">Rendimiento</Label>
                      <Input
                        id="newRendimiento"
                        value={newProductividad.rendimiento}
                        onChange={(e) => setNewProductividad((prev) => ({ ...prev, rendimiento: e.target.value }))}
                        placeholder="12.9"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="newObservaciones">Observaciones</Label>
                    <Textarea
                      id="newObservaciones"
                      value={newProductividad.observaciones}
                      onChange={(e) => setNewProductividad((prev) => ({ ...prev, observaciones: e.target.value }))}
                      placeholder="Observaciones adicionales..."
                      rows={2}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addProductividadRecord} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Guardar
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddProductividad(false)} size="sm">
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowAddProductividad(true)}
                  className="w-full border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Antecedente
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Resultado de Supervisión y Plan de Acción */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" />
                Resultado de Supervisión de Campo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="resultadoSupervision">Resultado</Label>
                <Select
                  value={formData.resultadoSupervision}
                  onValueChange={(value) => handleInputChange("resultadoSupervision", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona resultado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POSITIVO">Positivo</SelectItem>
                    <SelectItem value="NEGATIVO">Negativo</SelectItem>
                    <SelectItem value="CONDICIONAL">Condicional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="planAccion">Plan de Acción para el Seguimiento de la Operación</Label>
                <Textarea
                  id="planAccion"
                  value={formData.planAccion}
                  onChange={(e) => handleInputChange("planAccion", e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Observaciones y Recomendaciones */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5 text-indigo-500" />
                Observaciones y Recomendaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange("observaciones", e.target.value)}
                  placeholder="Observaciones generales del dictamen..."
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="recomendaciones">Recomendaciones</Label>
                <Textarea
                  id="recomendaciones"
                  value={formData.recomendaciones}
                  onChange={(e) => handleInputChange("recomendaciones", e.target.value)}
                  placeholder="Recomendaciones técnicas..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botón Guardar */}
          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              <Save className="h-5 w-5 mr-2" />
              Guardar Dictamen Técnico
            </Button>
          </div>
        </div>
      </main>

      {/* Modal del mapa de polígonos */}
      {showPolygonMap && (
        <div className="fixed inset-0 z-50 bg-white p-6 shadow-xl rounded-lg">
          <PolygonMapGoogle
            onPolygonChange={handlePolygonChange}
            initialPolygon={polygonCoordinates}
            onClose={() => setShowPolygonMap(false)}
          />
        </div>
      )}
    </div>
  )
}
