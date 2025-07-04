"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SignaturePad } from "@/components/signature-pad"
import { MapPicker } from "@/components/map-picker"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { addVisita } from "@/lib/slices/visitasSlice"
import { useToast } from "@/hooks/use-toast"
import { Save, FileDown } from "lucide-react"
import { generateVisitaPDF } from "@/utils/pdf-generator"
import type { Visita } from "@/lib/slices/visitasSlice"

export default function NuevaVisitaPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { productores } = useAppSelector((state) => state.productores)

  const productorId = searchParams.get("productorId")
  const selectedProductor = productorId ? productores.find((p) => p.id === productorId) : null

  const [formData, setFormData] = useState({
    productorId: productorId || "",
    productorNombre: selectedProductor?.nombre || "",
    cultivo: "",
    predio: "",
    localidad: "",
    superficieTotal: "",
    superficieHabilitada: "",
    tipoRiego: "",
    disponibilidadAgua: "",
    estadoFenologico: "",
    plagas: "",
    enfermedades: "",
    observaciones: "",
  })

  const [coordenadas, setCoordenadas] = useState<{ lat: number; lng: number } | null>(null)
  const [firmasTecnico, setFirmasTecnico] = useState<string | null>(null)
  const [firmasProductor, setFirmasProductor] = useState<string | null>(null)
  const [foto, setFoto] = useState<string | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleProductorChange = (productorId: string) => {
    const productor = productores.find((p) => p.id === productorId)
    setFormData((prev) => ({
      ...prev,
      productorId,
      productorNombre: productor?.nombre || "",
    }))
  }

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setFoto(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (!formData.productorId || !formData.cultivo || !formData.predio) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive",
      })
      return
    }

    const visita: Visita = {
      id: Date.now().toString(),
      ...formData,
      superficieTotal: Number.parseFloat(formData.superficieTotal) || 0,
      superficieHabilitada: Number.parseFloat(formData.superficieHabilitada) || 0,
      coordenadas,
      firmasTecnico,
      firmasProductor,
      foto,
      fecha: new Date().toISOString(),
      sincronizado: false,
    }

    dispatch(addVisita(visita))

    toast({
      title: "Visita guardada",
      description: "La visita se ha guardado correctamente",
    })

    router.push("/historial")
  }

  const handleGeneratePDF = () => {
    if (!formData.productorId || !formData.cultivo || !formData.predio) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa los campos obligatorios antes de generar el PDF",
        variant: "destructive",
      })
      return
    }

    const visita: Visita = {
      id: Date.now().toString(),
      ...formData,
      superficieTotal: Number.parseFloat(formData.superficieTotal) || 0,
      superficieHabilitada: Number.parseFloat(formData.superficieHabilitada) || 0,
      coordenadas,
      firmasTecnico,
      firmasProductor,
      foto,
      fecha: new Date().toISOString(),
      sincronizado: false,
    }

    generateVisitaPDF(visita)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Nueva Visita Técnica" showBack />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Información del Productor */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Productor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="productor">Productor *</Label>
                <Select value={formData.productorId} onValueChange={handleProductorChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar productor" />
                  </SelectTrigger>
                  <SelectContent>
                    {productores.map((productor) => (
                      <SelectItem key={productor.id} value={productor.id}>
                        {productor.nombre} - {productor.cedula}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="predio">Predio *</Label>
                  <Input
                    id="predio"
                    value={formData.predio}
                    onChange={(e) => handleInputChange("predio", e.target.value)}
                    placeholder="Nombre del predio"
                  />
                </div>
                <div>
                  <Label htmlFor="localidad">Localidad</Label>
                  <Input
                    id="localidad"
                    value={formData.localidad}
                    onChange={(e) => handleInputChange("localidad", e.target.value)}
                    placeholder="Localidad o vereda"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información del Cultivo */}
          <Card>
            <CardHeader>
              <CardTitle>Información del Cultivo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="cultivo">Cultivo Principal *</Label>
                <Select value={formData.cultivo} onValueChange={(value) => handleInputChange("cultivo", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cultivo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Maíz">Maíz</SelectItem>
                    <SelectItem value="Frijol">Frijol</SelectItem>
                    <SelectItem value="Garbanzo">Garbanzo</SelectItem>
                    <SelectItem value="Sorgo">Sorgo</SelectItem>
                    <SelectItem value="Otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="superficieTotal">Superficie Total (ha)</Label>
                  <Input
                    id="superficieTotal"
                    type="number"
                    step="0.1"
                    value={formData.superficieTotal}
                    onChange={(e) => handleInputChange("superficieTotal", e.target.value)}
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <Label htmlFor="superficieHabilitada">Superficie Habilitada (ha)</Label>
                  <Input
                    id="superficieHabilitada"
                    type="number"
                    step="0.1"
                    value={formData.superficieHabilitada}
                    onChange={(e) => handleInputChange("superficieHabilitada", e.target.value)}
                    placeholder="0.0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tipoRiego">Tipo de Riego</Label>
                  <Select value={formData.tipoRiego} onValueChange={(value) => handleInputChange("tipoRiego", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Goteo">Goteo</SelectItem>
                      <SelectItem value="Aspersión">Aspersión</SelectItem>
                      <SelectItem value="Gravedad">Gravedad</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="Sin riego">Sin riego</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="disponibilidadAgua">Disponibilidad de Agua</Label>
                  <Select
                    value={formData.disponibilidadAgua}
                    onValueChange={(value) => handleInputChange("disponibilidadAgua", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar disponibilidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Abundante">Abundante</SelectItem>
                      <SelectItem value="Suficiente">Suficiente</SelectItem>
                      <SelectItem value="Escasa">Escasa</SelectItem>
                      <SelectItem value="Muy escasa">Muy escasa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="estadoFenologico">Estado Fenológico</Label>
                <Input
                  id="estadoFenologico"
                  value={formData.estadoFenologico}
                  onChange={(e) => handleInputChange("estadoFenologico", e.target.value)}
                  placeholder="Ej: Floración, Fructificación, etc."
                />
              </div>
            </CardContent>
          </Card>

          {/* Observaciones Técnicas */}
          <Card>
            <CardHeader>
              <CardTitle>Observaciones Técnicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="plagas">Plagas Identificadas</Label>
                <Textarea
                  id="plagas"
                  value={formData.plagas}
                  onChange={(e) => handleInputChange("plagas", e.target.value)}
                  placeholder="Describir plagas encontradas..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="enfermedades">Enfermedades Identificadas</Label>
                <Textarea
                  id="enfermedades"
                  value={formData.enfermedades}
                  onChange={(e) => handleInputChange("enfermedades", e.target.value)}
                  placeholder="Describir enfermedades encontradas..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="observaciones">Observaciones Generales</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange("observaciones", e.target.value)}
                  placeholder="Observaciones adicionales, recomendaciones, etc..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Ubicación GPS */}
          <MapPicker onLocationChange={setCoordenadas} initialLocation={coordenadas} />

          {/* Fotografía */}
          <Card>
            <CardHeader>
              <CardTitle>Fotografía del Predio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input type="file" accept="image/*" capture="environment" onChange={handlePhotoCapture} />
                {foto && (
                  <div className="mt-4">
                    <img
                      src={foto || "/placeholder.svg"}
                      alt="Foto del predio"
                      className="max-w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Firmas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SignaturePad
              title="Firma del Técnico"
              onSignatureChange={setFirmasTecnico}
              initialSignature={firmasTecnico}
            />
            <SignaturePad
              title="Firma del Productor"
              onSignatureChange={setFirmasProductor}
              initialSignature={firmasProductor}
            />
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button onClick={handleSave} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Guardar Visita
            </Button>
            <Button onClick={handleGeneratePDF} variant="outline" className="flex-1">
              <FileDown className="h-4 w-4 mr-2" />
              Generar PDF
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
