"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { addVisitaCompleta } from "@/lib/slices/visitasSlice"
import { addEvento } from "@/lib/slices/agendaSlice"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Clock, MapPin, Users, Camera, Save, CheckCircle } from "lucide-react"
import type { VisitaCompleta } from "@/lib/slices/visitasSlice"
import type { EventoAgenda } from "@/lib/slices/agendaSlice"

export default function NuevaVisitaPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const productorId = params.id as string
  const { productores } = useAppSelector((state) => state.productores)

  const productor = productores.find((p) => p.id === productorId)

  const [tipoVisita, setTipoVisita] = useState<"Comercial" | "Inspección Técnica" | null>(null)
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    ciclo: "012425",
    cultivos: [] as string[],
    hectareas: "",
    hectareasPotenciales: "",
    hectareasProspectadas: "",
    asunto: "",
    tipoContacto: "",
    duracionVisita: "",
    generoVenta: false,
    queSeVendio: "",
    productos: "",
    anotaciones: "",
    proximaActividad: {
      asunto: "",
      fecha: "",
    },
  })

  const [fotos, setFotos] = useState<string[]>([])
  const [showSuccess, setShowSuccess] = useState(false)

  const cultivosDisponibles = ["MAÍZ", "FRIJOL", "SORGO", "GARBANZO", "OTRO"]

  const asuntosComercial = ["PROSPECCIÓN", "VENTA", "POST-VENTA", "COMPRA COSECHA", "COBRANZA"]

  const asuntosInspeccion = ["ASESORÍA TÉCNICA", "SUPERVISIÓN", "APLICACIÓN (DRON)"]

  const tiposContacto = [
    "VISITA EN PREDIO",
    "VISITA EN OFICINA PURP",
    "VISITA EN HOGAR DE PRODUCTOR",
    "COMUNICACIÓN POR WHATSAPP",
    "LLAMADA TELEFÓNICA",
  ]

  const duraciones = [
    "30 Mins",
    "1 Hr",
    "1 Hr 30 Mins",
    "2 Hrs",
    "2 Hrs 30 Mins",
    "3 Hrs",
    "3 Hrs 30 Mins",
    "4 Hrs",
    "4 Hrs 30 Mins",
    "5 Hrs",
    "Todo el día",
  ]

  const productosVenta = ["SEMILLA", "AGROQUÍMICO", "FERTILIZANTE"]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCultivoToggle = (cultivo: string) => {
    setFormData((prev) => ({
      ...prev,
      cultivos: prev.cultivos.includes(cultivo)
        ? prev.cultivos.filter((c) => c !== cultivo)
        : [...prev.cultivos, cultivo],
    }))
  }

  const handleProximaActividadChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      proximaActividad: { ...prev.proximaActividad, [field]: value },
    }))
  }

  const handleSave = async () => {
    if (!tipoVisita || !formData.asunto || formData.cultivos.length === 0) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    // Simular guardado
    setShowSuccess(true)

    setTimeout(() => {
      const visita: VisitaCompleta = {
        id: Date.now().toString(),
        productorId,
        productorNombre: productor?.nombre || "",
        fecha: formData.fecha,
        ciclo: formData.ciclo,
        tipoVisita,
        cultivos: formData.cultivos,
        hectareas: Number.parseFloat(formData.hectareas) || undefined,
        hectareasPotenciales: Number.parseFloat(formData.hectareasPotenciales) || undefined,
        hectareasProspectadas: Number.parseFloat(formData.hectareasProspectadas) || undefined,
        asunto: formData.asunto,
        tipoContacto: formData.tipoContacto,
        duracionVisita: formData.duracionVisita || undefined,
        generoVenta: formData.generoVenta,
        queSeVendio: formData.queSeVendio || undefined,
        productos: formData.productos || undefined,
        anotaciones: formData.anotaciones,
        proximaActividad: formData.proximaActividad,
        fotos,
        sincronizado: false,
      }

      dispatch(addVisitaCompleta(visita))

      // Agregar evento a la agenda si hay próxima actividad programada
      if (formData.proximaActividad.asunto && formData.proximaActividad.fecha) {
        const evento: EventoAgenda = {
          id: Date.now().toString() + "_agenda",
          titulo: `${formData.proximaActividad.asunto} - ${productor?.nombre}`,
          descripcion: `Actividad programada desde visita: ${formData.asunto}`,
          fecha: formData.proximaActividad.fecha,
          hora: "09:00",
          categoria: tipoVisita === "Comercial" ? "Negociación" : "Asesoría técnica",
          completado: false,
          recordatorio: true,
        }

        dispatch(addEvento(evento))

        toast({
          title: "Visita creada y evento agendado",
          description: "La visita se ha guardado y la próxima actividad se agregó a tu agenda",
        })
      } else {
        toast({
          title: "Visita creada",
          description: "La visita se ha guardado correctamente",
        })
      }

      router.push(`/productores/${productorId}/visitas`)
    }, 2000)
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

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Creación Exitosa</h3>
              <p className="text-gray-600 dark:text-gray-400">La visita fue creada con éxito.</p>
              {formData.proximaActividad.asunto && formData.proximaActividad.fecha && (
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                  ✓ Próxima actividad agregada a la agenda
                </p>
              )}
            </div>
            <div className="text-sm text-gray-500 mb-4">Guardando Visita...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header title="Nueva Visita" showBack />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header de la visita */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Nueva Visita
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <Label htmlFor="ciclo">Ciclo</Label>
                  <Input
                    id="ciclo"
                    value={formData.ciclo}
                    onChange={(e) => handleInputChange("ciclo", e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Productor</Label>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900">{productor.nombre}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tipo de Visita */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <Label className="text-base font-medium mb-4 block">Tipo de Visita</Label>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant={tipoVisita === "Comercial" ? "default" : "outline"}
                  onClick={() => setTipoVisita("Comercial")}
                  className="h-16 flex flex-col gap-2"
                >
                  <Users className="h-5 w-5" />
                  Comercial
                </Button>
                <Button
                  variant={tipoVisita === "Inspección Técnica" ? "default" : "outline"}
                  onClick={() => setTipoVisita("Inspección Técnica")}
                  className="h-16 flex flex-col gap-2"
                >
                  <MapPin className="h-5 w-5" />
                  Inspección Técnica
                </Button>
              </div>
            </CardContent>
          </Card>

          {tipoVisita && (
            <>
              {/* Cultivos */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <Label className="text-base font-medium mb-4 block">Cultivos</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {cultivosDisponibles.map((cultivo) => (
                      <div key={cultivo} className="flex items-center space-x-2">
                        <Checkbox
                          id={cultivo}
                          checked={formData.cultivos.includes(cultivo)}
                          onCheckedChange={() => handleCultivoToggle(cultivo)}
                        />
                        <Label htmlFor={cultivo} className="text-sm font-medium">
                          {cultivo}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {formData.cultivos.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.cultivos.map((cultivo) => (
                        <Badge key={cultivo} variant="secondary">
                          {cultivo}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Campos específicos por tipo */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6 space-y-4">
                  {tipoVisita === "Comercial" ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="hectareasPotenciales">Hectáreas Potenciales</Label>
                          <Input
                            id="hectareasPotenciales"
                            type="number"
                            step="0.01"
                            value={formData.hectareasPotenciales}
                            onChange={(e) => handleInputChange("hectareasPotenciales", e.target.value)}
                            placeholder="00.00"
                          />
                        </div>
                        <div>
                          <Label htmlFor="hectareasProspectadas">Hectáreas Prospectadas</Label>
                          <Input
                            id="hectareasProspectadas"
                            type="number"
                            step="0.01"
                            value={formData.hectareasProspectadas}
                            onChange={(e) => handleInputChange("hectareasProspectadas", e.target.value)}
                            placeholder="00.00"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <Label htmlFor="hectareas">Hectáreas</Label>
                      <Input
                        id="hectareas"
                        type="number"
                        step="0.01"
                        value={formData.hectareas}
                        onChange={(e) => handleInputChange("hectareas", e.target.value)}
                        placeholder="00.00"
                      />
                    </div>
                  )}

                  <div>
                    <Label htmlFor="asunto">Asunto</Label>
                    <Select value={formData.asunto} onValueChange={(value) => handleInputChange("asunto", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona asunto" />
                      </SelectTrigger>
                      <SelectContent>
                        {(tipoVisita === "Comercial" ? asuntosComercial : asuntosInspeccion).map((asunto) => (
                          <SelectItem key={asunto} value={asunto}>
                            {asunto}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tipoContacto">Tipo de contacto</Label>
                    <Select
                      value={formData.tipoContacto}
                      onValueChange={(value) => handleInputChange("tipoContacto", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona asistencia" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposContacto.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {tipoVisita === "Inspección Técnica" && (
                    <div>
                      <Label htmlFor="duracionVisita">Duración de visita</Label>
                      <Select
                        value={formData.duracionVisita}
                        onValueChange={(value) => handleInputChange("duracionVisita", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona duración" />
                        </SelectTrigger>
                        <SelectContent>
                          {duraciones.map((duracion) => (
                            <SelectItem key={duracion} value={duracion}>
                              {duracion}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="generoVenta"
                      checked={formData.generoVenta}
                      onCheckedChange={(checked) => handleInputChange("generoVenta", checked)}
                    />
                    <Label htmlFor="generoVenta">¿Generó una Venta?</Label>
                  </div>

                  {formData.generoVenta && (
                    <>
                      <div>
                        <Label htmlFor="queSeVendio">¿Qué se vendió?</Label>
                        <Select
                          value={formData.queSeVendio}
                          onValueChange={(value) => handleInputChange("queSeVendio", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un producto" />
                          </SelectTrigger>
                          <SelectContent>
                            {productosVenta.map((producto) => (
                              <SelectItem key={producto} value={producto}>
                                {producto}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="productos">Productos</Label>
                        <Input
                          id="productos"
                          value={formData.productos}
                          onChange={(e) => handleInputChange("productos", e.target.value)}
                          placeholder="Especifica el producto"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="anotaciones">Anotaciones de la Visita</Label>
                    <Textarea
                      id="anotaciones"
                      value={formData.anotaciones}
                      onChange={(e) => handleInputChange("anotaciones", e.target.value)}
                      placeholder="Escribe tus observaciones..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Fotografías */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-medium">Fotografías</Label>
                    <Badge variant="secondary">{fotos.length}</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Agregar Fotografías
                  </Button>
                </CardContent>
              </Card>

              {/* Programación Próxima Actividad */}
              <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    Programación Próxima Actividad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="proximoAsunto">Asunto de próxima actividad</Label>
                    <Select
                      value={formData.proximaActividad.asunto}
                      onValueChange={(value) => handleProximaActividadChange("asunto", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona asunto" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...asuntosComercial, ...asuntosInspeccion].map((asunto) => (
                          <SelectItem key={asunto} value={asunto}>
                            {asunto}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="proximaFecha">Fecha</Label>
                    <Input
                      id="proximaFecha"
                      type="date"
                      value={formData.proximaActividad.fecha}
                      onChange={(e) => handleProximaActividadChange("fecha", e.target.value)}
                    />
                  </div>
                  {formData.proximaActividad.asunto && formData.proximaActividad.fecha && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">✓ Esta actividad se agregará automáticamente a tu agenda</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Botón Crear Visita */}
              <Button
                onClick={handleSave}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
              >
                <Save className="h-5 w-5 mr-2" />
                Crear Visita
              </Button>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
