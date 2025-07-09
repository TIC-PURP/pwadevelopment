"use client"

import { useState, useEffect } from "react"
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
import { updateDictamen } from "@/lib/slices/dictamenesSlice"
import PolygonMapGoogle from "@/components/PolygonMapGoogle"
import { useToast } from "@/hooks/use-toast"
import type { Coordinate } from "@/lib/slices/dictamenesSlice"
import { FileText, MapPin, Calendar, User, Droplets, Mountain, Layers, Edit, Save, Map } from "lucide-react"

export default function EditarDictamenPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const productorId = params.id as string
  const dictamenId = params.dictamenId as string
  const { productores } = useAppSelector((state) => state.productores)
  const { dictamenes } = useAppSelector((state) => state.dictamenes)

  const productor = productores.find((p) => p.id === productorId)
  const dictamenOriginal = dictamenes.find((d) => d.id === dictamenId)

  const [formData, setFormData] = useState({
    ciclo: "",
    fecha: "",
    ubicacion: "",
    tipoTenencia: "",
    predioRentado: "",
    propietarioPredio: "",
    cultivoSolicitado: "",
    superficie: "",
    plazoCultivo: "",
    sistemaRiego: "",
    unidadModulo: "",
    metodoRiego: "",
    topografia: "",
    profundidad: "",
    textura: "",
    cultivoAnterior: "",
    infestacionMalezas: "",
    subsoleo: "",
    siembra: "",
    marca: "",
    rastreo: "",
    aplicHerbicida: "",
    escarificacion: "",
    riego: "",
    barbecho: "",
    aplicInsecticida: "",
    fertilizacion: "",
    empareje: "",
    analisisSuelo: "",
    resultadoSupervision: "",
    planAccion: "",
    observaciones: "",
    recomendaciones: "",
  })

  const [showPolygonMap, setShowPolygonMap] = useState(false)
  const [polygonCoordinates, setPolygonCoordinates] = useState<Coordinate[] | null>(null)

  useEffect(() => {
    if (dictamenOriginal) {
      setFormData({
        ciclo: dictamenOriginal.ciclo,
        fecha: dictamenOriginal.fecha,
        ubicacion: dictamenOriginal.ubicacion,
        tipoTenencia: dictamenOriginal.tipoTenencia,
        predioRentado: dictamenOriginal.predioRentado,
        propietarioPredio: dictamenOriginal.propietarioPredio,
        cultivoSolicitado: dictamenOriginal.cultivoSolicitado,
        superficie: dictamenOriginal.superficie,
        plazoCultivo: dictamenOriginal.plazoCultivo,
        sistemaRiego: dictamenOriginal.sistemaRiego,
        unidadModulo: dictamenOriginal.unidadModulo,
        metodoRiego: dictamenOriginal.metodoRiego,
        topografia: dictamenOriginal.topografia,
        profundidad: dictamenOriginal.profundidad,
        textura: dictamenOriginal.textura,
        cultivoAnterior: dictamenOriginal.cultivoAnterior,
        infestacionMalezas: dictamenOriginal.infestacionMalezas,
        subsoleo: dictamenOriginal.avanceLabores.subsoleo,
        siembra: dictamenOriginal.avanceLabores.siembra,
        marca: dictamenOriginal.avanceLabores.marca,
        rastreo: dictamenOriginal.avanceLabores.rastreo,
        aplicHerbicida: dictamenOriginal.avanceLabores.aplicHerbicida,
        escarificacion: dictamenOriginal.avanceLabores.escarificacion,
        riego: dictamenOriginal.avanceLabores.riego,
        barbecho: dictamenOriginal.avanceLabores.barbecho,
        aplicInsecticida: dictamenOriginal.avanceLabores.aplicInsecticida,
        fertilizacion: dictamenOriginal.avanceLabores.fertilizacion,
        empareje: dictamenOriginal.avanceLabores.empareje,
        analisisSuelo: dictamenOriginal.avanceLabores.analisisSuelo,
        resultadoSupervision: dictamenOriginal.resultadoSupervision,
        planAccion: dictamenOriginal.planAccion,
        observaciones: dictamenOriginal.observaciones,
        recomendaciones: dictamenOriginal.recomendaciones,
      })
      setPolygonCoordinates(dictamenOriginal.polygonCoordinates)
    }
  }, [dictamenOriginal])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePolygonChange = (coordinates: Coordinate[] | null) => {
    setPolygonCoordinates(coordinates)
  }

  const handleSave = () => {
    if (!dictamenOriginal) return

    if (!formData.cultivoSolicitado || !formData.superficie) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const dictamenActualizado = {
      ...dictamenOriginal,
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
      sincronizado: false, // Marcar como no sincronizado al editar
    }

    dispatch(updateDictamen(dictamenActualizado))

    toast({
      title: "Dictamen actualizado",
      description: "Los cambios se han guardado correctamente",
    })

    router.push(`/productores/${productorId}/dictamenes`)
  }

  if (!productor || !dictamenOriginal) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header title="Dictamen no encontrado" showBack />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600 dark:text-gray-400">El dictamen no fue encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header title="Modificar Dictamen" showBack />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header del Dictamen */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <Edit className="h-6 w-6" />
                <div>
                  <CardTitle className="text-xl">Modificar Dictamen Técnico</CardTitle>
                  <p className="text-orange-100 text-sm">Ciclo: {formData.ciclo}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-600">Productor:</span>
                  <span className="font-medium">{productor.nombre}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-600">Fecha:</span>
                  <span className="font-medium">{formData.fecha}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-600">Superficie:</span>
                  <span className="font-medium">{formData.superficie}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Status: En Edición
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
                  />
                </div>
                <div>
                  <Label htmlFor="tipoTenencia">Tipo de Tenencia</Label>
                  <Select
                    value={formData.tipoTenencia}
                    onValueChange={(value) => handleInputChange("tipoTenencia", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pequeña-propiedad">Pequeña Propiedad</SelectItem>
                      <SelectItem value="ejidal">Ejidal</SelectItem>
                      <SelectItem value="comunal">Comunal</SelectItem>
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
                      <SelectValue />
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
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coordenadas */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-blue-500" />
                Coordenadas del Área
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {polygonCoordinates && polygonCoordinates.length > 0 ? (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-blue-800">Área delimitada correctamente</h4>
                    <Badge className="bg-blue-100 text-blue-800">{polygonCoordinates.length} puntos</Badge>
                  </div>
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
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Map className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <Button onClick={() => setShowPolygonMap(true)} className="bg-blue-500 hover:bg-blue-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    Delimitar Área
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
                      <SelectValue />
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
                      <SelectValue />
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
                      <SelectValue />
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
                      <SelectValue />
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
                      <SelectValue />
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
                      <SelectValue />
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
                  <Label htmlFor="infestacionMalezas">Infestación de Malezas</Label>
                  <Select
                    value={formData.infestacionMalezas}
                    onValueChange={(value) => handleInputChange("infestacionMalezas", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
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
                      max="100"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resultado de Supervisión */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" />
                Resultado de Supervisión
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POSITIVO">Positivo</SelectItem>
                    <SelectItem value="NEGATIVO">Negativo</SelectItem>
                    <SelectItem value="CONDICIONAL">Condicional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="planAccion">Plan de Acción</Label>
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
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="recomendaciones">Recomendaciones</Label>
                <Textarea
                  id="recomendaciones"
                  value={formData.recomendaciones}
                  onChange={(e) => handleInputChange("recomendaciones", e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Botón Guardar */}
          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              size="lg"
            >
              <Save className="h-5 w-5 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </div>
      </main>

      {/* Modal del mapa de polígonos */}
      {showPolygonMap && (
        <PolygonMapGoogle
          onPolygonChange={handlePolygonChange}
          initialPolygon={polygonCoordinates}
          onClose={() => setShowPolygonMap(false)}
        />
      )}
    </div>
  )
}
