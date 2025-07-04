"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { addInforme, type InformeTecnico, type RecomendacionQuimica } from "@/lib/slices/reportesInspeccionSlice"
import { Calendar, Plus, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function NuevoInformeTecnicoPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const productorId = params.id as string
  const reporteId = params.reporteId as string

  const { reportes, informes } = useAppSelector((state) => state.reportesInspeccion)
  const { productores } = useAppSelector((state) => state.productores)

  const reporte = reportes.find((r) => r.id === reporteId)
  const productor = productores.find((p) => p.id === productorId)
  const informesReporte = informes.filter((i) => i.reporteId === reporteId)

  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split("T")[0],
    fechaSiembra: reporte?.fechaSiembra || "",
    variedad: "",
    metodo: "",
    densidad: "",
    marcaAnchoSurco: "",
    poblacion: "",
    fertilizacionInicial: "",
    altura: "",
    numeroHojas: "",
    cultivos: "1",
    numeroRiegos: "",
    limpiasManuales: "",
    humedad: "",
    aspectoGeneral: "",
    maleza: "",
    plagas: "",
    enfermedades: "",
    culturales: "",
    proximaVisita: "",
  })

  const [recomendacionesQuimicas, setRecomendacionesQuimicas] = useState<RecomendacionQuimica[]>([])

  if (!reporte || !productor) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header title="Reporte no encontrado" showBack />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600 dark:text-gray-400">El reporte no fue encontrado</p>
        </div>
      </div>
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const agregarRecomendacionQuimica = () => {
    const nuevaRecomendacion: RecomendacionQuimica = {
      id: Date.now().toString(),
      producto: "",
      dosis: "",
      metodo: "",
    }
    setRecomendacionesQuimicas((prev) => [...prev, nuevaRecomendacion])
  }

  const actualizarRecomendacionQuimica = (id: string, field: keyof RecomendacionQuimica, value: string) => {
    setRecomendacionesQuimicas((prev) => prev.map((rec) => (rec.id === id ? { ...rec, [field]: value } : rec)))
  }

  const eliminarRecomendacionQuimica = (id: string) => {
    setRecomendacionesQuimicas((prev) => prev.filter((rec) => rec.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const nuevoInforme: InformeTecnico = {
      id: `informe-${Date.now()}`,
      reporteId: reporteId,
      numeroInspeccion: informesReporte.length + 1,
      fechaElaboracion: new Date().toLocaleDateString("es-ES"),
      datosGenerales: {
        fecha: new Date(formData.fecha).toLocaleDateString("es-ES"),
        ciclo: reporte.ciclo,
        productor: productor.nombre,
        ubicacion: reporte.ubicacion,
        cultivo: reporte.cultivo,
        superficie: reporte.superficie,
      },
      siembra: {
        fechaSiembra: formData.fechaSiembra,
        variedad: formData.variedad,
        metodo: formData.metodo,
        densidad: formData.densidad,
        marcaAnchoSurco: formData.marcaAnchoSurco,
        poblacion: formData.poblacion,
        fertilizacionInicial: formData.fertilizacionInicial,
      },
      desarrolloVegetativo: {
        altura: formData.altura,
        numeroHojas: formData.numeroHojas,
        cultivos: formData.cultivos,
      },
      laboresCulturales: {
        numeroRiegos: formData.numeroRiegos,
        limpiasManuales: formData.limpiasManuales,
        humedad: formData.humedad,
      },
      aspectosGenerales: {
        aspectoGeneral: formData.aspectoGeneral,
        maleza: formData.maleza,
        plagas: formData.plagas,
        enfermedades: formData.enfermedades,
      },
      recomendaciones: {
        culturales: formData.culturales,
        quimicas: recomendacionesQuimicas.filter((rec) => rec.producto && rec.dosis),
      },
      evidenciasFotograficas: [],
      proximaVisita: formData.proximaVisita,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    dispatch(addInforme(nuevoInforme))

    toast({
      title: "Informe creado",
      description: "El informe técnico se ha creado exitosamente.",
    })

    router.push(`/productores/${productorId}/reportes-inspeccion/${reporteId}/informes`)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Nuevo Reporte de Inspección Técnica" showBack />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Datos Generales */}
          <Card>
            <CardHeader>
              <CardTitle>Datos Generales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => handleInputChange("fecha", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Ciclo</Label>
                  <Input value={reporte.ciclo} disabled />
                </div>
                <div>
                  <Label>Productor</Label>
                  <Input value={productor.nombre} disabled />
                </div>
                <div>
                  <Label>Ubicación</Label>
                  <Input value={reporte.ubicacion} disabled />
                </div>
                <div>
                  <Label>Cultivo</Label>
                  <Input value={reporte.cultivo} disabled />
                </div>
                <div>
                  <Label>Superficie</Label>
                  <Input value={reporte.superficie} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Siembra */}
          <Card>
            <CardHeader>
              <CardTitle>Siembra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fechaSiembra">Fecha de Siembra</Label>
                  <Input
                    id="fechaSiembra"
                    value={formData.fechaSiembra}
                    onChange={(e) => handleInputChange("fechaSiembra", e.target.value)}
                    placeholder="25/6/2025"
                  />
                </div>
                <div>
                  <Label htmlFor="variedad">Variedad/Híbrido</Label>
                  <Select onValueChange={(value) => handleInputChange("variedad", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona Variedad/Híbrido" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Blanco Sinaloa">Blanco Sinaloa</SelectItem>
                      <SelectItem value="Jumbo">Jumbo</SelectItem>
                      <SelectItem value="Blanoro">Blanoro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="metodo">Método</Label>
                  <Select onValueChange={(value) => handleInputChange("metodo", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona Método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tradicional">Tradicional</SelectItem>
                      <SelectItem value="Doble Hilera">Doble Hilera</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="densidad">Densidad (Sem/Mts)</Label>
                  <Input
                    id="densidad"
                    value={formData.densidad}
                    onChange={(e) => handleInputChange("densidad", e.target.value)}
                    placeholder="258"
                  />
                </div>
                <div>
                  <Label htmlFor="marcaAnchoSurco">Marca/Ancho Surco</Label>
                  <Select onValueChange={(value) => handleInputChange("marcaAnchoSurco", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona Marca/Ancho Surco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="80 Cm">80 Cm</SelectItem>
                      <SelectItem value="76 Cm">76 Cm</SelectItem>
                      <SelectItem value="75 Cm">75 Cm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="poblacion">Población</Label>
                  <Input
                    id="poblacion"
                    value={formData.poblacion}
                    onChange={(e) => handleInputChange("poblacion", e.target.value)}
                    placeholder="3,379 Ptas/Ha"
                  />
                </div>
                <div>
                  <Label htmlFor="fertilizacionInicial">Fertilización Inicial</Label>
                  <Input
                    id="fertilizacionInicial"
                    value={formData.fertilizacionInicial}
                    onChange={(e) => handleInputChange("fertilizacionInicial", e.target.value)}
                    placeholder="DAP"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Desarrollo Vegetativo */}
          <Card>
            <CardHeader>
              <CardTitle>Desarrollo Vegetativo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="altura">Altura (cm)</Label>
                  <Input
                    id="altura"
                    value={formData.altura}
                    onChange={(e) => handleInputChange("altura", e.target.value)}
                    placeholder="145"
                  />
                </div>
                <div>
                  <Label htmlFor="numeroHojas">Número de Hojas</Label>
                  <Input
                    id="numeroHojas"
                    value={formData.numeroHojas}
                    onChange={(e) => handleInputChange("numeroHojas", e.target.value)}
                    placeholder="87"
                  />
                </div>
                <div>
                  <Label htmlFor="cultivos">Cultivos</Label>
                  <Input
                    id="cultivos"
                    value={formData.cultivos}
                    onChange={(e) => handleInputChange("cultivos", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Labores Culturales */}
          <Card>
            <CardHeader>
              <CardTitle>Labores Culturales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="numeroRiegos">Número de Riegos</Label>
                  <Select onValueChange={(value) => handleInputChange("numeroRiegos", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona Opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Riego de Asiento">Riego de Asiento</SelectItem>
                      <SelectItem value="1er Auxilio">1er Auxilio</SelectItem>
                      <SelectItem value="2do Auxilio">2do Auxilio</SelectItem>
                      <SelectItem value="3er Auxilio">3er Auxilio</SelectItem>
                      <SelectItem value="4to Auxilio">4to Auxilio</SelectItem>
                      <SelectItem value="5to Auxilio">5to Auxilio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="limpiasManuales">Limpias Manuales</Label>
                  <Select onValueChange={(value) => handleInputChange("limpiasManuales", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona # de Limpias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0</SelectItem>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="humedad">Humedad</Label>
                  <Select onValueChange={(value) => handleInputChange("humedad", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona Opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mala">Mala</SelectItem>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="Buena">Buena</SelectItem>
                      <SelectItem value="Excelente">Excelente</SelectItem>
                      <SelectItem value="Excesiva">Excesiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Aspectos Generales */}
          <Card>
            <CardHeader>
              <CardTitle>Aspectos Generales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="aspectoGeneral">Aspecto General del Cultivo</Label>
                  <Select onValueChange={(value) => handleInputChange("aspectoGeneral", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona Opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mala">Mala</SelectItem>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="Bueno">Bueno</SelectItem>
                      <SelectItem value="Excelente">Excelente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="maleza">Maleza</Label>
                  <Select onValueChange={(value) => handleInputChange("maleza", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona Opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Libre">Libre</SelectItem>
                      <SelectItem value="Hay Presencia">Hay Presencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="plagas">Plagas</Label>
                  <Select onValueChange={(value) => handleInputChange("plagas", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona Opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Libre">Libre</SelectItem>
                      <SelectItem value="Hay Presencia">Hay Presencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="enfermedades">Enfermedades</Label>
                  <Select onValueChange={(value) => handleInputChange("enfermedades", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona Opción" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Libre">Libre</SelectItem>
                      <SelectItem value="Hay Presencia">Hay Presencia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recomendaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="culturales">Culturales</Label>
                <Textarea
                  id="culturales"
                  value={formData.culturales}
                  onChange={(e) => handleInputChange("culturales", e.target.value)}
                  placeholder="Ingresa recomendaciones culturales..."
                  rows={3}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Químicas</Label>
                  <Button type="button" onClick={agregarRecomendacionQuimica} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Agrega Recomendación Química
                  </Button>
                </div>

                {recomendacionesQuimicas.map((rec) => (
                  <div key={rec.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 border rounded-lg">
                    <Input
                      placeholder="Producto"
                      value={rec.producto}
                      onChange={(e) => actualizarRecomendacionQuimica(rec.id, "producto", e.target.value)}
                    />
                    <Input
                      placeholder="Dosis por Ha"
                      value={rec.dosis}
                      onChange={(e) => actualizarRecomendacionQuimica(rec.id, "dosis", e.target.value)}
                    />
                    <Input
                      placeholder="Método"
                      value={rec.metodo}
                      onChange={(e) => actualizarRecomendacionQuimica(rec.id, "metodo", e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => eliminarRecomendacionQuimica(rec.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Evidencias Fotográficas */}
          <Card>
            <CardHeader>
              <CardTitle>Evidencias Fotográficas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <p className="text-gray-500">Funcionalidad de fotos próximamente</p>
              </div>
            </CardContent>
          </Card>

          {/* Programación Próxima Visita */}
          <Card>
            <CardHeader>
              <CardTitle>Programación Próxima Visita</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="proximaVisita">Fecha</Label>
                <Input
                  id="proximaVisita"
                  type="date"
                  value={formData.proximaVisita}
                  onChange={(e) => handleInputChange("proximaVisita", e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Botón de envío */}
          <div className="flex justify-end">
            <Button type="submit" size="lg" className="min-w-48">
              <Calendar className="h-4 w-4 mr-2" />
              Crear Reporte de Inspección
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
