"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useAppDispatch } from "@/lib/hooks"
import { addProspecto } from "@/lib/slices/prospectosSlice"
import { useToast } from "@/hooks/use-toast"
import type { Prospecto } from "@/lib/slices/prospectosSlice"
import { User, Save } from "lucide-react"

export default function NuevoProspectoPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    nombre: "",
    empresa: "",
    telefono: "",
    email: "",
    ubicacion: "",
    estado: "Contacto inicial" as const,
    prioridad: "Media" as const,
    cultivos: [] as string[],
    notas: "",
  })

  const cultivosDisponibles = ["Frijol", "Maíz", "Sorgo", "Garbanzo"]

  const handleInputChange = (field: string, value: string) => {
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

  const handleSave = () => {
    if (!formData.nombre || !formData.empresa || !formData.telefono) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa nombre, empresa y teléfono",
        variant: "destructive",
      })
      return
    }

    const prospecto: Prospecto = {
      id: Date.now().toString(),
      ...formData,
      ultimoContacto: new Date().toISOString().split("T")[0],
      fechaCreacion: new Date().toISOString().split("T")[0],
    }

    dispatch(addProspecto(prospecto))

    toast({
      title: "Prospecto creado",
      description: "El prospecto se ha guardado correctamente",
    })

    router.push("/crm")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Nuevo Prospecto" showBack />

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-500" />
              Información Personal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input id="nombre" value={formData.nombre} onChange={(e) => handleInputChange("nombre", e.target.value)} />
            </div>

            <div>
              <Label htmlFor="empresa">Empresa *</Label>
              <Input id="empresa" value={formData.empresa} onChange={(e) => handleInputChange("empresa", e.target.value)} />
            </div>

            <div>
              <Label htmlFor="telefono">Teléfono *</Label>
              <Input id="telefono" value={formData.telefono} onChange={(e) => handleInputChange("telefono", e.target.value)} />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
            </div>

            <div>
              <Label htmlFor="ubicacion">Ubicación</Label>
              <Input id="ubicacion" value={formData.ubicacion} onChange={(e) => handleInputChange("ubicacion", e.target.value)} />
            </div>

            <div>
              <Label>Cultivos</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {cultivosDisponibles.map((cultivo) => (
                  <Button
                    key={cultivo}
                    variant={formData.cultivos.includes(cultivo) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCultivoToggle(cultivo)}
                  >
                    {cultivo}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="notas">Notas</Label>
              <Textarea id="notas" rows={3} value={formData.notas} onChange={(e) => handleInputChange("notas", e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Save className="h-5 w-5 mr-2" />
          Guardar Prospecto
        </Button>
      </main>
    </div>
  )
}
