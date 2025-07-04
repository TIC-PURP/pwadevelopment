"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { useSearchParams } from "next/navigation"

export default function EntradaPersonalPage() {
  const searchParams = useSearchParams()
  const [planta, setPlanta] = useState("")
  const [nombreVisitante, setNombreVisitante] = useState("")
  const [documento, setDocumento] = useState("Entrada personal")
  const [equipoFertilizantes, setEquipoFertilizantes] = useState(false)
  const [vehiculo, setVehiculo] = useState("")
  const [vehiculoDetalle, setVehiculoDetalle] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [fechaEntrada] = useState(new Date())
  const [horaEntrada] = useState("11:39")

  // Cargar datos del empleado desde QR
  useEffect(() => {
    const empleadoParam = searchParams.get("empleado")
    if (empleadoParam) {
      try {
        const empleado = JSON.parse(decodeURIComponent(empleadoParam))
        setNombreVisitante(empleado.nombre)
        // Pre-seleccionar planta por defecto
        setPlanta("burrion")
      } catch (error) {
        console.error("Error al parsear datos del empleado:", error)
      }
    } else {
      // Datos por defecto si no viene del QR
      setNombreVisitante("MARIO DANIEL ACOSTA GONZALEZ")
      setPlanta("burrion")
    }
  }, [searchParams])

  const plantas = [
    { value: "pinitos", label: "PINITOS" },
    { value: "burrion", label: "BURRIÓN" },
  ]

  const vehiculos = [
    { value: "vehiculo-purp", label: "VEHÍCULO PURP" },
    { value: "vehiculo-personal", label: "VEHÍCULO PERSONAL" },
    { value: "otro-vehiculo", label: "OTRO VEHÍCULO" },
    { value: "sin-vehiculo", label: "SIN VEHÍCULO" },
    { value: "vehiculo-anterior", label: "VEHÍCULO ANTERIOR" },
  ]

  const vehiculosDetalle = [
    { value: "attitude-rocio", label: "ATTITUD ROCIO -> VHV-022-C" },
    { value: "attitude-oficina", label: "ATTITUD OFICINA -> VHS-620-A" },
    { value: "grand-cherokee", label: "GRAND CHEROKEE -> VKR-940-B" },
    { value: "jeep-cherokee", label: "JEEP CHEROKEE JUAN GONZALO RODRIGUEZ -> VLD-658-C" },
    { value: "highlander-ricela", label: "HIGHLANDER RICELA -> VGJ-004-D" },
    { value: "kenworth-3", label: "KENWORTH #3 -> 143-EP-7" },
    { value: "kenworth-4", label: "KENWORTH #4 -> 144-EP-7" },
    { value: "kenworth-5", label: "KENWORTH #5 -> UG-81-376" },
    { value: "purp-journey", label: "PURP JOURNEY -> VNV-958-B" },
    { value: "ram-16-emeterio", label: "RAM 16 EMETERIO-> UJ-47-169" },
    { value: "ram-16-cesar", label: "RAM 16 CESAR -> UK-89-810" },
    { value: "frontier-paul", label: "FRONTIER PAUL-> UK1-417-3" },
  ]

  const handleRegistrarEntrada = () => {
    // Simular registro exitoso
    setShowSuccess(true)
  }

  const handleCloseSuccess = () => {
    setShowSuccess(false)
    // Limpiar formulario
    setPlanta("")
    setNombreVisitante("")
    setVehiculo("")
    setVehiculoDetalle("")
    setEquipoFertilizantes(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/operaciones/escaner-qr">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-5 w-5" />
                <span className="ml-2">Regresar</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-xl font-bold">Entrada de personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Planta */}
            <div className="space-y-2">
              <Label htmlFor="planta">Planta</Label>
              <Select value={planta} onValueChange={setPlanta}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona Planta" />
                </SelectTrigger>
                <SelectContent>
                  {plantas.map((plantaItem) => (
                    <SelectItem key={plantaItem.value} value={plantaItem.value}>
                      {plantaItem.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Fecha de entrada */}
            <div className="space-y-2">
              <Label>Fecha de entrada</Label>
              <Input value={format(fechaEntrada, "dd/MM/yyyy")} readOnly className="bg-gray-100" />
            </div>

            {/* Hora de entrada */}
            <div className="space-y-2">
              <Label>Hora de entrada</Label>
              <Input value={horaEntrada} readOnly className="bg-gray-100" />
            </div>

            {/* Nombre visitante */}
            <div className="space-y-2">
              <Label htmlFor="nombre-visitante">Nombre visitante</Label>
              <Input
                id="nombre-visitante"
                value={nombreVisitante}
                onChange={(e) => setNombreVisitante(e.target.value)}
                placeholder="Ingresa el nombre del visitante"
              />
            </div>

            {/* Documento */}
            <div className="space-y-2">
              <Label htmlFor="documento">Documento</Label>
              <Input
                id="documento"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                placeholder="Tipo de documento"
              />
            </div>

            {/* Entrada de equipo de fertilizantes */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="equipo-fertilizantes"
                checked={equipoFertilizantes}
                onCheckedChange={checked => setEquipoFertilizantes(checked === true)}
              />
              <Label htmlFor="equipo-fertilizantes">¿Entrada de equipo de fertilizantes?</Label>
            </div>

            {/* Vehículo */}
            <div className="space-y-2">
              <Label htmlFor="vehiculo">Vehículo</Label>
              <Select value={vehiculo} onValueChange={setVehiculo}>
                <SelectTrigger>
                  <SelectValue placeholder="SELECCIONA VEHÍCULO" />
                </SelectTrigger>
                <SelectContent>
                  {vehiculos.map((vehiculoItem) => (
                    <SelectItem key={vehiculoItem.value} value={vehiculoItem.value}>
                      {vehiculoItem.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Detalle del vehículo PURP */}
            {vehiculo === "vehiculo-purp" && (
              <div className="space-y-2">
                <Label htmlFor="vehiculo-detalle">Vehículo PURP</Label>
                <Select value={vehiculoDetalle} onValueChange={setVehiculoDetalle}>
                  <SelectTrigger>
                    <SelectValue placeholder="SELECCIONA VEHÍCULO" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehiculosDetalle.map((vehiculoItem) => (
                      <SelectItem key={vehiculoItem.value} value={vehiculoItem.value}>
                        {vehiculoItem.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Botón para registrar equipos de fertilizantes */}
            {equipoFertilizantes && (
              <Button variant="outline" className="w-full bg-transparent">
                Registrar equipos de fertilizantes
              </Button>
            )}

            {/* Botón registrar entrada */}
            <Button onClick={handleRegistrarEntrada} className="w-full mt-6">
              Registrar entrada
            </Button>
          </CardContent>
        </Card>

        {/* Dialog de éxito */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-green-600">Entrada a bodega exitosa</DialogTitle>
            </DialogHeader>
            <div className="text-center py-4">
              <p className="text-gray-600">Se genero correctamente la entrada de empleado.</p>
            </div>
            <Button onClick={handleCloseSuccess} className="w-full">
              ACEPTAR
            </Button>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
