"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ArrowLeft, FileText, Truck, Factory, File } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function OperacionesPage() {
  const [currentView, setCurrentView] = useState<"main" | "documentos" | "consulta" | "pedidos">("main")
  const [tipoDocumento, setTipoDocumento] = useState("")
  const [estadoDocumento, setEstadoDocumento] = useState("")
  const [planta, setPlanta] = useState("")
  const [estatusEquipo, setEstatusEquipo] = useState("")
  const [fechaDesde, setFechaDesde] = useState<Date>()
  const [fechaHasta, setFechaHasta] = useState<Date>()
  const [resultados, setResultados] = useState<any[]>([])
  const [mostrarResultados, setMostrarResultados] = useState(false)

  const tiposDocumento = [
    { value: "bitacora", label: "Bitácora" },
    { value: "reporte-excel", label: "Reporte EXCEL" },
  ]

  const estadosDocumento = [
    { value: "bitacoras-empleados", label: "Bitácoras Empleados" },
    { value: "equipos-fertilizantes", label: "Equipos de fertilizantes" },
    { value: "activas", label: "Activas" },
    { value: "en-espera", label: "En Espera" },
    { value: "finalizados", label: "Finalizados" },
    { value: "todos", label: "Todos" },
  ]

  const plantas = [
    { value: "pinitos", label: "Pinitos" },
    { value: "burrion", label: "Burrión" },
  ]

  const estatusEquipos = [
    { value: "estado-actual", label: "Estado actual" },
    { value: "todos-estados", label: "Todos los estados" },
    { value: "en-planta", label: "En planta" },
    { value: "en-campo", label: "En campo" },
    { value: "en-mantenimiento", label: "En mantenimiento" },
    { value: "pendiente-revision", label: "Pendiente de revisión" },
  ]

  const handleBuscar = () => {
    const resultadosSimulados = [
      {
        id: 1,
        equipo: "NODRIZA-1",
        estatus: "DISPONIBLE",
        tipo: "Fertilizantes",
        fechaSalida: null,
      },
      {
        id: 2,
        equipo: "NODRIZA-2",
        estatus: "DISPONIBLE",
        tipo: "Fertilizantes",
        fechaSalida: null,
      },
      {
        id: 3,
        equipo: "NODRIZA-3",
        estatus: "DISPONIBLE",
        tipo: "Fertilizantes",
        fechaSalida: null,
      },
      {
        id: 4,
        equipo: "NODRIZA-4",
        estatus: "DISPONIBLE",
        tipo: "Fertilizantes",
        fechaSalida: null,
      },
      {
        id: 5,
        equipo: "NODRIZA-5",
        estatus: "DISPONIBLE",
        tipo: "Fertilizantes",
        fechaSalida: null,
      },
      {
        id: 6,
        equipo: "NODRIZA-6",
        estatus: "EN CAMPO",
        tipo: "Fertilizantes",
        fechaSalida: "07/12/2024 - 14:10",
      },
      {
        id: 7,
        equipo: "NODRIZA-7",
        estatus: "DISPONIBLE",
        tipo: "Fertilizantes",
        fechaSalida: null,
      },
      {
        id: 8,
        equipo: "NODRIZA-8",
        estatus: "DISPONIBLE",
        tipo: "Fertilizantes",
        fechaSalida: null,
      },
    ]

    setResultados(resultadosSimulados)
    setMostrarResultados(true)
  }

  const renderMainMenu = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Control de Operaciones</h2>
        <p className="text-gray-600 dark:text-gray-400">Bienvenido, CARLOS EDUARDO ZAMORA SALCEDO</p>
      </div>

      <div className="space-y-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView("documentos")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-500 p-3 rounded-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Documentos de Control</h3>
                <p className="text-gray-600 dark:text-gray-400">Gestión y control de documentación operativa</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView("consulta")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-500 p-3 rounded-lg">
                <File className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Consulta de documentos</h3>
                <p className="text-gray-600 dark:text-gray-400">Búsqueda y consulta de documentos del sistema</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView("pedidos")}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-orange-500 p-3 rounded-lg">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Control de Pedidos</h3>
                <p className="text-gray-600 dark:text-gray-400">Gestión de pedidos y órdenes de trabajo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderDocumentosMenu = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Documentos de Control</h2>
      </div>

      <div className="space-y-3">
        <Link href="/operaciones/escaner-qr">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="text-center">
                <span className="text-lg font-medium text-gray-900 dark:text-white">Entrada / Salida</span>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="text-center">
              <span className="text-lg font-medium text-gray-900 dark:text-white">Administrativo</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="text-center">
              <span className="text-lg font-medium text-gray-900 dark:text-white">Calidad</span>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="text-center">
              <span className="text-lg font-medium text-gray-900 dark:text-white">Carga/Descarga</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderConsultaDocumentos = () => (
    <div className="space-y-6">
      {!mostrarResultados ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Consultas de documentos</CardTitle>
            <div className="text-center">
              <div className="bg-blue-600 text-white px-4 py-1 rounded-full inline-block text-sm font-semibold">
                PURP
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tipo-documento">Tipo de documento</Label>
              <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona Documento" />
                </SelectTrigger>
                <SelectContent>
                  {tiposDocumento.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado-documento">Estado del documento</Label>
              <Select value={estadoDocumento} onValueChange={setEstadoDocumento}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona Documento" />
                </SelectTrigger>
                <SelectContent>
                  {estadosDocumento.map((estado) => (
                    <SelectItem key={estado.value} value={estado.value}>
                      {estado.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {estadoDocumento === "bitacoras-empleados" && (
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
            )}

            {estadoDocumento === "bitacoras-empleados" && (
              <>
                <div className="space-y-2">
                  <Label>Fecha desde</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !fechaDesde && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fechaDesde ? format(fechaDesde, "dd/MM/yyyy") : "Pulsa aquí"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={fechaDesde} onSelect={setFechaDesde} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Fecha hasta</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !fechaHasta && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fechaHasta ? format(fechaHasta, "dd/MM/yyyy") : "Pulsa aquí"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={fechaHasta} onSelect={setFechaHasta} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}

            {estadoDocumento === "equipos-fertilizantes" && (
              <div className="space-y-2">
                <Label htmlFor="estatus-equipo">Estatus de equipo</Label>
                <Select value={estatusEquipo} onValueChange={setEstatusEquipo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un Estatus" />
                  </SelectTrigger>
                  <SelectContent>
                    {estatusEquipos.map((estatus) => (
                      <SelectItem key={estatus.value} value={estatus.value}>
                        {estatus.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button onClick={handleBuscar} className="w-full mt-6">
              Buscar
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Resultados de búsqueda: {resultados.length}</h2>
            <Button variant="outline" onClick={() => setMostrarResultados(false)}>
              Nueva Búsqueda
            </Button>
          </div>

          <div className="space-y-3">
            {resultados.map((resultado) => (
              <Card key={resultado.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-500 p-2 rounded-lg">
                      <Factory className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-gray-600">Equipo</span>
                      </div>
                      <div className="font-bold text-lg mb-2">{resultado.equipo}</div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-600">Estatus</span>
                        </div>
                        <Badge variant={resultado.estatus === "DISPONIBLE" ? "default" : "secondary"}>
                          {resultado.estatus}
                        </Badge>
                        {resultado.fechaSalida && (
                          <div className="flex flex-col">
                            <span className="text-gray-600 text-xs">Fecha Salida</span>
                            <span className="text-sm">{resultado.fechaSalida}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderSubMenu = (title: string, options: string[]) => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
      </div>

      <div className="space-y-3">
        {options.map((option, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="text-center">
                <span className="text-lg font-medium text-gray-900 dark:text-white">{option}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {currentView !== "main" ? (
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => {
                  setCurrentView("main")
                  setMostrarResultados(false)
                }}
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="ml-2">Regresar</span>
              </Button>
            ) : (
              <Link href="/">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="h-5 w-5" />
                  <span className="ml-2">Regresar</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-8">
        {currentView === "main" && renderMainMenu()}
        {currentView === "documentos" && renderDocumentosMenu()}
        {currentView === "consulta" && renderConsultaDocumentos()}
        {currentView === "pedidos" &&
          renderSubMenu("Control de Pedidos", [
            "Pedidos Pendientes",
            "Pedidos en Proceso",
            "Pedidos Completados",
            "Historial de Pedidos",
          ])}
      </main>
    </div>
  )
}
