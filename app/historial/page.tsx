"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { deleteVisita } from "@/lib/slices/visitasSlice"
import { useToast } from "@/hooks/use-toast"
import { Search, Calendar, MapPin, Leaf, Edit, Trash2, FileDown, CheckCircle, Clock } from "lucide-react"
import { generateVisitaPDF } from "@/utils/pdf-generator"
import Link from "next/link"

export default function HistorialPage() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { visitas } = useAppSelector((state) => state.visitas)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "sincronizado" | "pendiente">("all")

  const filteredVisitas = visitas
    .filter((visita) => {
      const matchesSearch =
        visita.productorNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visita.cultivo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visita.predio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        visita.localidad.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "sincronizado" && visita.sincronizado) ||
        (filterStatus === "pendiente" && !visita.sincronizado)

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  const handleDelete = (visitaId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta visita?")) {
      dispatch(deleteVisita(visitaId))
      toast({
        title: "Visita eliminada",
        description: "La visita se ha eliminado correctamente",
      })
    }
  }

  const handleGeneratePDF = (visita: any) => {
    generateVisitaPDF(visita)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Historial de Visitas" showBack />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por productor, cultivo, predio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              Todas ({visitas.length})
            </Button>
            <Button
              variant={filterStatus === "sincronizado" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("sincronizado")}
            >
              Sincronizadas ({visitas.filter((v) => v.sincronizado).length})
            </Button>
            <Button
              variant={filterStatus === "pendiente" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("pendiente")}
            >
              Pendientes ({visitas.filter((v) => !v.sincronizado).length})
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredVisitas.length} de {visitas.length} visitas
          </p>
        </div>

        {/* Visitas List */}
        <div className="space-y-4">
          {filteredVisitas.map((visita) => (
            <Card key={visita.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{visita.productorNombre}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(visita.fecha).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Leaf className="h-4 w-4" />
                            {visita.cultivo}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant={visita.sincronizado ? "default" : "secondary"}
                        className="flex items-center gap-1"
                      >
                        {visita.sincronizado ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Sincronizado
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3" />
                            Pendiente
                          </>
                        )}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {visita.predio} - {visita.localidad}
                      </div>
                      <div>Superficie: {visita.superficieTotal} ha</div>
                    </div>

                    {visita.observaciones && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{visita.observaciones}</p>
                    )}
                  </div>

                  <div className="flex flex-row lg:flex-col gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleGeneratePDF(visita)}>
                      <FileDown className="h-4 w-4" />
                    </Button>
                    <Link href={`/visitas/editar/${visita.id}`}>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(visita.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVisitas.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No se encontraron visitas</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || filterStatus !== "all"
                ? "Intenta con otros términos de búsqueda o filtros"
                : "Aún no has realizado ninguna visita técnica"}
            </p>
            {!searchTerm && filterStatus === "all" && (
              <Link href="/visitas/nueva">
                <Button>Crear Primera Visita</Button>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
