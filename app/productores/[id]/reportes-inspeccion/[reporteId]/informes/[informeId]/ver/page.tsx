"use client"

import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/lib/hooks"
import { FileText, Calendar, MapPin, User, Edit, Download } from "lucide-react"
import Link from "next/link"

export default function VerInformeTecnicoPage() {
  const params = useParams()
  const productorId = params.id as string
  const reporteId = params.reporteId as string
  const informeId = params.informeId as string

  const { reportes, informes } = useAppSelector((state) => state.reportesInspeccion)
  const { productores } = useAppSelector((state) => state.productores)

  const reporte = reportes.find((r) => r.id === reporteId)
  const productor = productores.find((p) => p.id === productorId)
  const informe = informes.find((i) => i.id === informeId)

  if (!reporte || !productor || !informe) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header title="Informe no encontrado" showBack />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-600 dark:text-gray-400">El informe no fue encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Informe Técnico" showBack />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Header del Informe */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Inspección Técnica #{informe.numeroInspeccion}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    Ciclo {reporte.ciclo} - {reporte.cultivo}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Fecha Elaboración:</span>
                <span>{informe.fechaElaboracion}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Productor:</span>
                <span>{productor.nombre}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="font-medium">Ubicación:</span>
                <span>{reporte.ubicacion}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Datos Generales */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Datos Generales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Fecha:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{informe.datosGenerales.fecha}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Ciclo:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{informe.datosGenerales.ciclo}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Productor:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{informe.datosGenerales.productor}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Ubicación:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{informe.datosGenerales.ubicacion}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Cultivo:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{informe.datosGenerales.cultivo}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Superficie:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{informe.datosGenerales.superficie}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Siembra */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Siembra</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Fecha de Siembra:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{informe.siembra.fechaSiembra}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Variedad/Híbrido:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{informe.siembra.variedad}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Método:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{informe.siembra.metodo}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Densidad:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{informe.siembra.densidad}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Marca/Ancho Surco:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{informe.siembra.marcaAnchoSurco}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Población:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{informe.siembra.poblacion}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Fertilización Inicial:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">{informe.siembra.fertilizacionInicial}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Desarrollo Vegetativo */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Desarrollo Vegetativo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Altura:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{informe.desarrolloVegetativo.altura} cm</span>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Número de Hojas:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {informe.desarrolloVegetativo.numeroHojas}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Cultivos:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{informe.desarrolloVegetativo.cultivos}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Labores Culturales */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Labores Culturales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Número de Riegos:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{informe.laboresCulturales.numeroRiegos}</span>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Limpias Manuales:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">
                  {informe.laboresCulturales.limpiasManuales}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Humedad:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-400">{informe.laboresCulturales.humedad}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aspectos Generales */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Aspectos Generales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Aspecto General del Cultivo:</span>
                  <Badge variant="outline" className="ml-2">
                    {informe.aspectosGenerales.aspectoGeneral}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Maleza:</span>
                  <Badge
                    variant={informe.aspectosGenerales.maleza === "Libre" ? "default" : "destructive"}
                    className="ml-2"
                  >
                    {informe.aspectosGenerales.maleza}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Plagas:</span>
                  <Badge
                    variant={informe.aspectosGenerales.plagas === "Libre" ? "default" : "destructive"}
                    className="ml-2"
                  >
                    {informe.aspectosGenerales.plagas}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">Enfermedades:</span>
                  <Badge
                    variant={informe.aspectosGenerales.enfermedades === "Libre" ? "default" : "destructive"}
                    className="ml-2"
                  >
                    {informe.aspectosGenerales.enfermedades}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recomendaciones */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Recomendaciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {informe.recomendaciones.culturales && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Culturales:</h4>
                <p className="text-blue-800 dark:text-blue-200">{informe.recomendaciones.culturales}</p>
              </div>
            )}

            {informe.recomendaciones.quimicas.length > 0 && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-3">Químicas:</h4>
                <div className="space-y-2">
                  {informe.recomendaciones.quimicas.map((quimica, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border"
                    >
                      <div>
                        <span className="font-medium text-green-800 dark:text-green-200">{quimica.producto}</span>
                        <span className="text-green-700 dark:text-green-300 ml-2">- {quimica.dosis}</span>
                      </div>
                      <Badge variant="outline" className="text-green-700 border-green-300">
                        {quimica.metodo}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Programación Próxima Visita */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Programación Próxima Visita</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-900 dark:text-white">Fecha:</span>
              <span className="text-gray-600 dark:text-gray-400">{informe.proximaVisita}</span>
            </div>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex gap-4 justify-end">
          <Link href={`/productores/${productorId}/reportes-inspeccion/${reporteId}/informes`}>
            <Button variant="outline">Volver a Informes</Button>
          </Link>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Editar Informe
          </Button>
        </div>
      </main>
    </div>
  )
}
