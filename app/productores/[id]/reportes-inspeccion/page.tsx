"use client"

import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/lib/hooks"
import { Search, Calendar, MapPin, Wheat, Eye, Plus } from "lucide-react"
import Link from "next/link"

export default function ReportesInspeccionPage() {
  const params = useParams()
  const productorId = params.id as string
  const { productores } = useAppSelector((state) => state.productores)
  const { reportes } = useAppSelector((state) => state.reportesInspeccion)

  const productor = productores.find((p) => p.id === productorId)
  const reportesProductor = reportes.filter((r) => r.productorId === productorId)

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Reportes de Inspección" showBack />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Información del Productor */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">{productor.nombre}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">CC: {productor.cedula}</p>
                </div>
              </div>
              <Badge variant="secondary">{reportesProductor.length} Reportes</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Reportes */}
        <div className="space-y-4">
          {reportesProductor.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No hay reportes de inspección
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Aún no se han creado reportes de inspección para este productor.
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Primer Reporte
                </Button>
              </CardContent>
            </Card>
          ) : (
            reportesProductor.map((reporte) => (
              <Card key={reporte.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      {reporte.ciclo}
                    </CardTitle>
                    <Badge variant={reporte.informesRealizados > 0 ? "default" : "secondary"}>
                      {reporte.informesRealizados} Informes
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Superficie:</span>
                        <span className="text-gray-600 dark:text-gray-400">{reporte.superficie}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-3 w-3 text-gray-500" />
                        <span className="font-medium">Ubicación:</span>
                        <span className="text-gray-600 dark:text-gray-400">{reporte.ubicacion}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Wheat className="h-3 w-3 text-gray-500" />
                        <span className="font-medium">Cultivo:</span>
                        <span className="text-gray-600 dark:text-gray-400">{reporte.cultivo}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-gray-500" />
                        <span className="font-medium">Fecha de Siembra:</span>
                        <span className="text-gray-600 dark:text-gray-400">{reporte.fechaSiembra}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-medium">Informes Realizados:</span>
                        <span className="text-gray-600 dark:text-gray-400">{reporte.informesRealizados}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="font-medium">Último Informe:</span>
                        <span className="text-gray-600 dark:text-gray-400">{reporte.ultimoInforme}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Siguiente visita: <span className="font-medium">{reporte.siguienteVisita}</span>
                    </div>
                    <Link href={`/productores/${productorId}/reportes-inspeccion/${reporte.id}/informes`}>
                      <Button size="sm" className="group">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Informes
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
