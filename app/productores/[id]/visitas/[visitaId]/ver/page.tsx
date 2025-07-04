"use client"

import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/lib/hooks"
import { Calendar, Clock, MapPin, Users, FileText, Camera, CheckCircle } from "lucide-react"

export default function VerVisitaPage() {
  const params = useParams()
  const productorId = params.id as string
  const visitaId = params.visitaId as string
  const { productores } = useAppSelector((state) => state.productores)
  const { visitasCompletas } = useAppSelector((state) => state.visitas)

  const productor = productores.find((p) => p.id === productorId)
  const visita = visitasCompletas.find((v) => v.id === visitaId)

  if (!productor || !visita) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header title="Visita no encontrada" showBack />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600 dark:text-gray-400">La visita no fue encontrada</p>
        </div>
      </div>
    )
  }

  const getTipoVisitaColor = (tipo: string) => {
    return tipo === "Comercial"
      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header title="Consultar Visita" showBack />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header de la visita */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    {visita.tipoVisita === "Comercial" ? <Users className="h-6 w-6" /> : <MapPin className="h-6 w-6" />}
                  </div>
                  <div>
                    <CardTitle className="text-xl">Visita - {visita.asunto}</CardTitle>
                    <p className="text-blue-100 text-sm">Ciclo: {visita.ciclo}</p>
                  </div>
                </div>
                <Badge className={getTipoVisitaColor(visita.tipoVisita)} variant="secondary">
                  {visita.tipoVisita}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Fecha:</span>
                  <span className="font-medium">{new Date(visita.fecha).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Productor:</span>
                  <span className="font-medium">{visita.productorNombre}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Contacto:</span>
                  <span className="font-medium">{visita.tipoContacto}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de Cultivos y Hectáreas */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                Información de Cultivos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Cultivos Trabajados</h4>
                <div className="flex flex-wrap gap-2">
                  {visita.cultivos.map((cultivo) => (
                    <Badge key={cultivo} variant="outline">
                      {cultivo}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {visita.tipoVisita === "Comercial" ? (
                  <>
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Hectáreas Potenciales</h4>
                      <p className="text-2xl font-bold text-blue-600">{visita.hectareasPotenciales} ha</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Hectáreas Prospectadas</h4>
                      <p className="text-2xl font-bold text-green-600">{visita.hectareasProspectadas} ha</p>
                    </div>
                  </>
                ) : (
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Hectáreas</h4>
                    <p className="text-2xl font-bold text-green-600">{visita.hectareas} ha</p>
                  </div>
                )}
                {visita.duracionVisita && (
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Duración</h4>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <p className="text-lg font-semibold">{visita.duracionVisita}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Información de Ventas */}
          {visita.generoVenta && (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  Información de Venta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Producto Vendido</h4>
                    <Badge className="bg-green-100 text-green-800">{visita.queSeVendio}</Badge>
                  </div>
                  {visita.productos && (
                    <div>
                      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Especificación</h4>
                      <p className="font-medium">{visita.productos}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Anotaciones */}
          {visita.anotaciones && (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-500" />
                  Anotaciones de la Visita
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{visita.anotaciones}</p>
              </CardContent>
            </Card>
          )}

          {/* Fotografías */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-indigo-500" />
                Evidencias Fotográficas
                <Badge variant="secondary">{visita.fotos.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {visita.fotos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {visita.fotos.map((foto, index) => (
                    <div key={index} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Camera className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-500">No se agregaron fotografías a esta visita</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Próxima Actividad */}
          {visita.proximaActividad.asunto && (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-500" />
                  Próxima Actividad Programada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Asunto</h4>
                    <Badge variant="outline">{visita.proximaActividad.asunto}</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Fecha Programada</h4>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">
                        {new Date(visita.proximaActividad.fecha).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Estado de Sincronización */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado de Sincronización</span>
                <Badge variant={visita.sincronizado ? "default" : "secondary"}>
                  {visita.sincronizado ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Sincronizado
                    </>
                  ) : (
                    <>
                      <Clock className="h-3 w-3 mr-1" />
                      Pendiente
                    </>
                  )}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
