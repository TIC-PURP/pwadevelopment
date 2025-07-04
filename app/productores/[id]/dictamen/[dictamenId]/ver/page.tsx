"use client"

import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/lib/hooks"
import { Calendar, User, MapPin, Droplets, Mountain, Layers, FileText, Map } from "lucide-react"

export default function VerDictamenPage() {
  const params = useParams()
  const productorId = params.id as string
  const dictamenId = params.dictamenId as string
  const { productores } = useAppSelector((state) => state.productores)
  const { dictamenes } = useAppSelector((state) => state.dictamenes)

  const productor = productores.find((p) => p.id === productorId)
  const dictamen = dictamenes.find((d) => d.id === dictamenId)

  if (!productor || !dictamen) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header title="Dictamen no encontrado" showBack />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600 dark:text-gray-400">El dictamen no fue encontrado</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Liberado":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "En Proceso":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Pendiente":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header title="Consultar Dictamen" showBack />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header del Dictamen */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6" />
                  <div>
                    <CardTitle className="text-xl">Dictamen Técnico</CardTitle>
                    <p className="text-blue-100 text-sm">Ciclo: {dictamen.ciclo}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(dictamen.status)} variant="secondary">
                  {dictamen.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Productor:</span>
                  <span className="font-medium">{dictamen.productorNombre}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Fecha:</span>
                  <span className="font-medium">{new Date(dictamen.fecha).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Superficie:</span>
                  <span className="font-medium">{dictamen.superficie}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Ubicación:</span>
                  <span className="font-medium">{dictamen.ubicacion}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Datos Generales */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Datos Generales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo de Tenencia</h4>
                  <p className="capitalize">{dictamen.tipoTenencia.replace("-", " ")}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Predio Rentado</h4>
                  <p className="capitalize">{dictamen.predioRentado}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Propietario del Predio</h4>
                  <p>{dictamen.propietarioPredio}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Cultivo Solicitado</h4>
                  <Badge variant="outline" className="capitalize">
                    {dictamen.cultivoSolicitado}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Plazo de Cultivo</h4>
                  <p>{dictamen.plazoCultivo}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coordenadas del Área */}
          {dictamen.polygonCoordinates && dictamen.polygonCoordinates.length > 0 && (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-blue-500" />
                  Área Delimitada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-blue-800">Polígono de coordenadas GPS</h4>
                    <Badge className="bg-blue-100 text-blue-800">{dictamen.polygonCoordinates.length} puntos</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                    {dictamen.polygonCoordinates.map((coord, index) => (
                      <div key={index} className="flex justify-between bg-white p-2 rounded">
                        <span className="font-medium">Punto {index + 1}:</span>
                        <span className="text-gray-600">
                          {coord.lat.toFixed(6)}, {coord.lng.toFixed(6)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Régimen de Riego */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                Régimen de Riego
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Sistema de Riego</h4>
                  <p className="capitalize">{dictamen.sistemaRiego}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Unidad o Módulo</h4>
                  <p className="uppercase">{dictamen.unidadModulo}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Método de Riego</h4>
                  <p className="capitalize">{dictamen.metodoRiego}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Características del Suelo */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mountain className="h-5 w-5 text-amber-500" />
                Características del Suelo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Topografía</h4>
                  <p className="capitalize">{dictamen.topografia}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Profundidad</h4>
                  <p className="capitalize">{dictamen.profundidad}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Textura</h4>
                  <p className="capitalize">{dictamen.textura}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Cultivo Anterior</h4>
                  <p className="capitalize">{dictamen.cultivoAnterior}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Infestación de Malezas</h4>
                  <Badge
                    variant={dictamen.infestacionMalezas === "LIBRE" ? "default" : "destructive"}
                    className="capitalize"
                  >
                    {dictamen.infestacionMalezas}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Avance de Labores */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-500" />
                Avance de Labores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(dictamen.avanceLabores).map(([labor, porcentaje]) => (
                  <div key={labor} className="text-center">
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600">{porcentaje}%</div>
                      <div className="text-xs text-gray-600 capitalize">
                        {labor.replace(/([A-Z])/g, " $1").toLowerCase()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resultado de Supervisión */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-500" />
                Resultado de Supervisión
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Resultado</h4>
                <Badge
                  variant={dictamen.resultadoSupervision === "POSITIVO" ? "default" : "destructive"}
                  className="text-sm"
                >
                  {dictamen.resultadoSupervision}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Plan de Acción</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{dictamen.planAccion}</p>
              </div>
            </CardContent>
          </Card>

          {/* Observaciones y Recomendaciones */}
          {(dictamen.observaciones || dictamen.recomendaciones) && (
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-500" />
                  Observaciones y Recomendaciones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {dictamen.observaciones && (
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Observaciones</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{dictamen.observaciones}</p>
                  </div>
                )}
                {dictamen.recomendaciones && (
                  <div>
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Recomendaciones</h4>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{dictamen.recomendaciones}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
