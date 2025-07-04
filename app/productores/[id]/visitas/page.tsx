"use client"

import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/lib/hooks"
import { Plus, Calendar, Clock, MapPin, FileText, ArrowLeft, Users, Eye, Edit } from "lucide-react"
import Link from "next/link"

export default function VisitasProductorPage() {
  const params = useParams()
  const productorId = params.id as string
  const { productores } = useAppSelector((state) => state.productores)
  const { visitasCompletas } = useAppSelector((state) => state.visitas)

  const productor = productores.find((p) => p.id === productorId)
  const visitasProductor = visitasCompletas.filter((v) => v.productorId === productorId)

  const getTipoVisitaColor = (tipo: string) => {
    return tipo === "Comercial"
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
  }

  const getTipoVisitaIcon = (tipo: string) => {
    return tipo === "Comercial" ? Users : MapPin
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header personalizado */}
      <header className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white px-4 py-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-white hover:bg-white/10 rounded-full p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Visitas a productor</h1>
              <p className="text-blue-100 text-sm">Ciclo: 012425</p>
            </div>
          </div>

          <Link href={`/productores/${productorId}/visitas/nueva`}>
            <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Visita
            </Button>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Información del Productor */}
        <Card className="mb-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{productor.nombre}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  CC: {productor.cedula} • {visitasProductor.length} visitas realizadas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Visitas */}
        <div className="space-y-4">
          {visitasProductor.map((visita) => {
            const TipoIcon = getTipoVisitaIcon(visita.tipoVisita)

            return (
              <Card
                key={visita.id}
                className="hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:scale-[1.02]"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header de la visita */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${visita.tipoVisita === "Comercial" ? "bg-blue-500" : "bg-green-500"}`}
                        >
                          <TipoIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <Badge className={getTipoVisitaColor(visita.tipoVisita)}>{visita.tipoVisita}</Badge>
                          <h3 className="font-semibold text-gray-900 dark:text-white mt-1">{visita.asunto}</h3>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/productores/${productorId}/visitas/${visita.id}/ver`}>
                          <Button size="sm" variant="outline" title="Consultar">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/productores/${productorId}/visitas/${visita.id}/editar`}>
                          <Button size="sm" variant="outline" title="Modificar">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Información de la visita */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {visita.duracionVisita && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Duración visita
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="text-gray-900 dark:text-white">{visita.duracionVisita}</span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Fecha visita</p>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-green-500" />
                          <span className="text-gray-900 dark:text-white">
                            {new Date(visita.fecha).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {visita.proximaActividad.fecha && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Fecha actividad programada
                          </p>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-orange-500" />
                            <span className="text-gray-900 dark:text-white">
                              {new Date(visita.proximaActividad.fecha).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      )}

                      {visita.proximaActividad.asunto && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Asunto visita programada
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {visita.proximaActividad.asunto}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Cultivos */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Cultivos:</span>
                      <div className="flex flex-wrap gap-1">
                        {visita.cultivos.map((cultivo) => (
                          <Badge key={cultivo} variant="outline" className="text-xs">
                            {cultivo}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Estado de sincronización */}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">{visita.tipoContacto}</span>
                        </div>
                        <Badge variant={visita.sincronizado ? "default" : "secondary"} className="text-xs">
                          {visita.sincronizado ? "Sincronizado" : "Pendiente"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {visitasProductor.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No hay visitas registradas</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Aún no se han realizado visitas técnicas a este productor
            </p>
            <Link href={`/productores/${productorId}/visitas/nueva`}>
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Crear Primera Visita
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
