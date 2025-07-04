"use client"

import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/lib/hooks"
import { FileText, Calendar, Plus, Eye } from "lucide-react"
import Link from "next/link"

export default function InformesTecnicosPage() {
  const params = useParams()
  const productorId = params.id as string
  const reporteId = params.reporteId as string
  const { reportes, informes } = useAppSelector((state) => state.reportesInspeccion)
  const { productores } = useAppSelector((state) => state.productores)

  const reporte = reportes.find((r) => r.id === reporteId)
  const productor = productores.find((p) => p.id === productorId)
  const informesReporte = informes.filter((i) => i.reporteId === reporteId)

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Informes Técnicos" showBack />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Información del Reporte */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">Ciclo {reporte.ciclo}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{productor.nombre}</p>
                </div>
              </div>
              <Badge variant="secondary">{informesReporte.length} Informes</Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Cultivo:</span>
                <p className="text-gray-600 dark:text-gray-400">{reporte.cultivo}</p>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Ubicación:</span>
                <p className="text-gray-600 dark:text-gray-400">{reporte.ubicacion}</p>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Superficie:</span>
                <p className="text-gray-600 dark:text-gray-400">{reporte.superficie}</p>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Fecha Siembra:</span>
                <p className="text-gray-600 dark:text-gray-400">{reporte.fechaSiembra}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botón para crear nuevo informe */}
        <div className="mb-6">
          <Link href={`/productores/${productorId}/reportes-inspeccion/${reporteId}/informes/nuevo`}>
            <Button className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Crear Nuevo Informe Técnico
            </Button>
          </Link>
        </div>

        {/* Lista de Informes Técnicos */}
        <div className="space-y-4">
          {informesReporte.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No hay informes técnicos</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Aún no se han creado informes técnicos para este reporte de inspección.
                </p>
                <Link href={`/productores/${productorId}/reportes-inspeccion/${reporteId}/informes/nuevo`}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Primer Informe
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            informesReporte.map((informe) => (
              <Card key={informe.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                      Inspección Técnica #{informe.numeroInspeccion}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Fecha Elaboración Informe</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{informe.fechaElaboracion}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">Aspecto General:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">
                          {informe.aspectosGenerales.aspectoGeneral}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">Altura:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">
                          {informe.desarrolloVegetativo.altura} cm
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">Maleza:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">
                          {informe.aspectosGenerales.maleza}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">Plagas:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">
                          {informe.aspectosGenerales.plagas}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">Enfermedades:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">
                          {informe.aspectosGenerales.enfermedades}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">Próxima Visita:</span>
                        <span className="ml-2 text-gray-600 dark:text-gray-400">{informe.proximaVisita}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      href={`/productores/${productorId}/reportes-inspeccion/${reporteId}/informes/${informe.id}/ver`}
                    >
                      <Button size="sm" variant="outline" className="w-full bg-transparent">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Informe Completo
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
