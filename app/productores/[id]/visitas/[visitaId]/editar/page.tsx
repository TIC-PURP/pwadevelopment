"use client"

import { useState, useEffect } from "react"
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
import { updateVisitaCompleta } from "@/lib/slices/visitasSlice"
import { useToast } from "@/hooks/use-toast"
import { Clock, MapPin, Users, Save, Edit } from "lucide-react"

export default function EditarVisitaPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const productorId = params.id as string
  const visitaId = params.visitaId as string
  const { productores } = useAppSelector((state) => state.productores)
  const { visitasCompletas } = useAppSelector((state) => state.visitas)

  const productor = productores.find((p) => p.id === productorId)
  const visitaOriginal = visitasCompletas.find((v) => v.id === visitaId)

  const [formData, setFormData] = useState({
    fecha: "",
    ciclo: "",
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

  useEffect(() => {
    if (visitaOriginal) {
      setFormData({
        fecha: visitaOriginal.fecha,
        ciclo: visitaOriginal.ciclo,
        cultivos: visitaOriginal.cultivos,
        hectareas: visitaOriginal.hectareas?.toString() || "",
        hectareasPotenciales: visitaOriginal.hectareasPotenciales?.toString() || "",
        hectareasProspectadas: visitaOriginal.hectareasProspectadas?.toString() || "",
        asunto: visitaOriginal.asunto,
        tipoContacto: visitaOriginal.tipoContacto,
        duracionVisita: visitaOriginal.duracionVisita || "",
        generoVenta: visitaOriginal.generoVenta,
        queSeVendio: visitaOriginal.queSeVendio || "",
        productos: visitaOriginal.productos || "",
        anotaciones: visitaOriginal.anotaciones,
        proximaActividad: visitaOriginal.proximaActividad,
      })
    }
  }, [visitaOriginal])

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

  const handleSave = () => {
    if (!visitaOriginal) return

    if (!formData.asunto || formData.cultivos.length === 0) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const visitaActualizada = {
      ...visitaOriginal,
      fecha: formData.fecha,
      ciclo: formData.ciclo,
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
      sincronizado: false, // Marcar como no sincronizado al editar
    }

    dispatch(updateVisitaCompleta(visitaActualizada))

    toast({
      title: "Visita actualizada",
      description: "Los cambios se han guardado correctamente",
    })

    router.push(`/productores/${productorId}/visitas`)
  }

  if (!productor || !visitaOriginal) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header title="Visita no encontrada" showBack />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600 dark:text-gray-400">La visita no fue encontrada</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header title="Modificar Visita" showBack />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header de la visita */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Modificar Visita
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

          {/* Tipo de Visita (solo lectura) */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <Label className="text-base font-medium mb-4 block">Tipo de Visita</Label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  {visitaOriginal.tipoVisita === "Comercial" ? (
                    <Users className="h-5 w-5 text-blue-500" />
                  ) : (
                    <MapPin className="h-5 w-5 text-green-500" />
                  )}
                  <span className="font-medium">{visitaOriginal.tipoVisita}</span>
                </div>
              </div>
            </CardContent>
          </Card>

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
              {visitaOriginal.tipoVisita === "Comercial" ? (
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
                    {(visitaOriginal.tipoVisita === "Comercial" ? asuntosComercial : asuntosInspeccion).map(
                      (asunto) => (
                        <SelectItem key={asunto} value={asunto}>
                          {asunto}
                        </SelectItem>
                      ),
                    )}
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

              {visitaOriginal.tipoVisita === "Inspección Técnica" && (
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
            </CardContent>
          </Card>

          {/* Botones de acción */}
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
    </div>
  )
}
