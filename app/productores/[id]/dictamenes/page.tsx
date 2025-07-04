"use client"

import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppSelector } from "@/lib/hooks"
import { FileText, Calendar, MapPin, User, Eye, Edit, ClipboardCheck } from "lucide-react"
import Link from "next/link"

export default function DictamenesPage() {
  const params = useParams()
  const productorId = params.id as string
  const { productores } = useAppSelector((state) => state.productores)
  const { dictamenes } = useAppSelector((state) => state.dictamenes)

  const productor = productores.find((p) => p.id === productorId)
  const dictamenesProductor = dictamenes.filter((d) => d.productorId === productorId)

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Liberado":
        return "●"
      case "En Proceso":
        return "●"
      case "Pendiente":
        return "●"
      default:
        return "●"
    }
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Dictámenes Técnicos" showBack />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Información del Productor */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500 p-2 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">{productor.nombre}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  CC: {productor.cedula} • {dictamenesProductor.length} dictámenes técnicos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Dictámenes */}
        {dictamenesProductor.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Historial de Dictámenes</h3>

            {dictamenesProductor.map((dictamen) => (
              <Card key={dictamen.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header del dictamen */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white">Ciclo: {dictamen.ciclo}</h4>
                          <Badge className={getStatusColor(dictamen.status)}>
                            <span className="mr-1">{getStatusIcon(dictamen.status)}</span>
                            {dictamen.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>Superficie: {dictamen.superficie}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>Ubicación: {dictamen.ubicacion}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(dictamen.fecha).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <User className="h-4 w-4" />
                          <span>Propietario: {dictamen.propietarioPredio}</span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium">Cultivo solicitado:</span> {dictamen.cultivoSolicitado}
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex gap-2">
                        <Link href={`/productores/${productorId}/dictamen/${dictamen.id}/ver`}>
                          <Button size="sm" variant="outline" title="Consultar">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/productores/${productorId}/dictamen/${dictamen.id}/editar`}>
                          <Button size="sm" variant="outline" title="Modificar">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/productores/${productorId}/reportes-inspeccion`}>
                          <Button size="sm" variant="outline" title="Crear Reporte de Inspección">
                            <ClipboardCheck className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FileText className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No hay dictámenes técnicos registrados
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Aún no se han creado dictámenes técnicos para este productor
            </p>
            <Link href={`/productores/${productorId}/dictamen`}>
              <Button className="bg-blue-500 hover:bg-blue-600">Crear Primer Dictamen</Button>
            </Link>
          </div>
        )}

        {/* Botón flotante para nuevo dictamen */}
        <Link href={`/productores/${productorId}/dictamen`}>
          <Button
            size="lg"
            className="fixed bottom-6 right-6 rounded-full w-16 h-16 bg-blue-500 hover:bg-blue-600 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
          >
            <FileText className="h-7 w-7" />
          </Button>
        </Link>
      </main>
    </div>
  )
}
