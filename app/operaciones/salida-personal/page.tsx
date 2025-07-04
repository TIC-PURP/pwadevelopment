"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { useSearchParams } from "next/navigation"

export default function SalidaPersonalPage() {
  const searchParams = useSearchParams()
  const [planta, setPlanta] = useState("")
  const [nombreVisitante, setNombreVisitante] = useState("")
  const [vehiculoEntrada, setVehiculoEntrada] = useState("")
  const [documento, setDocumento] = useState("Entrada personal")
  const [vehiculoSalida, setVehiculoSalida] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [fechaSalida] = useState(new Date())
  const [horaSalida] = useState("11:42")

  // Cargar datos del empleado desde QR
  useEffect(() => {
    const empleadoParam = searchParams.get("empleado")
    if (empleadoParam) {
      try {
        const empleado = JSON.parse(decodeURIComponent(empleadoParam))
        setNombreVisitante(empleado.nombre)
        setPlanta("burrion")
        // Si tiene entrada registrada, mostrar datos de entrada
        if (empleado.tieneEntrada) {
          setVehiculoEntrada(empleado.vehiculoEntrada || "PURP JOURNEY -> VNV-958-B")
        }
      } catch (error) {
        console.error("Error al parsear datos del empleado:", error)
      }
    } else {
      // Datos por defecto si no viene del QR
      setNombreVisitante("MARIO DANIEL ACOSTA GONZALEZ")
      setPlanta("burrion")
      setVehiculoEntrada("PURP JOURNEY -> VNV-958-B")
    }
  }, [searchParams])

  const plantas = [
    { value: "pinitos", label: "PINITOS" },
    { value: "burrion", label: "BURRIÓN" },
  ]

  const vehiculosSalida = [
    { value: "mismo-vehiculo", label: "MISMO VEHÍCULO DE ENTRADA" },
    { value: "vehiculo-purp", label: "VEHÍCULO PURP" },
    { value: "vehiculo-personal", label: "VEHÍCULO PERSONAL" },
    { value: "otro-vehiculo", label: "OTRO VEHÍCULO" },
    { value: "sin-vehiculo", label: "SIN VEHÍCULO" },
    { value: "vehiculo-anterior", label: "VEHÍCULO ANTERIOR" },
  ]

  const handleRegistrarSalida = () => {
    // Simular registro exitoso
    setShowSuccess(true)
  }

  const handleCloseSuccess = () => {
    setShowSuccess(false)
    // Limpiar formulario
    setPlanta("")
    setNombreVisitante("")
    setVehiculoSalida("")
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
            <CardTitle className="text-center text-xl font-bold">Salida de personal</CardTitle>
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

            {/* Fecha de salida */}
            <div className="space-y-2">
              <Label>Fecha de salida</Label>
              <Input value={format(fechaSalida, "dd/MM/yyyy")} readOnly className="bg-gray-100" />
            </div>

            {/* Hora de salida */}
            <div className="space-y-2">
              <Label>Hora de salida</Label>
              <Input value={horaSalida} readOnly className="bg-gray-100" />
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

            {/* Vehículo entrada */}
            <div className="space-y-2">
              <Label htmlFor="vehiculo-entrada">Vehículo entrada</Label>
              <Input id="vehiculo-entrada" value={vehiculoEntrada} readOnly className="bg-gray-100" />
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

            {/* Vehículo salida */}
            <div className="space-y-2">
              <Label htmlFor="vehiculo-salida">Vehículo salida</Label>
              <Select value={vehiculoSalida} onValueChange={setVehiculoSalida}>
                <SelectTrigger>
                  <SelectValue placeholder="SELECCIONA VEHÍCULO" />
                </SelectTrigger>
                <SelectContent>
                  {vehiculosSalida.map((vehiculoItem) => (
                    <SelectItem key={vehiculoItem.value} value={vehiculoItem.value}>
                      {vehiculoItem.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Botón registrar salida */}
            <Button onClick={handleRegistrarSalida} className="w-full mt-6">
              Registrar salida
            </Button>
          </CardContent>
        </Card>

        {/* Dialog de éxito */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="max-w-sm mx-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-green-600">Salida a bodega exitosa</DialogTitle>
            </DialogHeader>
            <div className="text-center py-4">
              <p className="text-gray-600">Se genero correctamente la salida de empleado.</p>
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
