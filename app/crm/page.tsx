"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { deleteProspecto } from "@/lib/slices/prospectosSlice"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Phone, Mail, MapPin, Calendar, User, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

export default function CRMPage() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { prospectos } = useAppSelector((state) => state.prospectos)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProspectos = prospectos.filter(
    (prospecto) =>
      prospecto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospecto.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospecto.cultivos.some((cultivo) => cultivo.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este prospecto?")) {
      dispatch(deleteProspecto(id))
      toast({
        title: "Prospecto eliminado",
        description: "El prospecto se ha eliminado correctamente",
      })
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "Contacto inicial":
        return "bg-blue-100 text-blue-800"
      case "Propuesta enviada":
        return "bg-yellow-100 text-yellow-800"
      case "Seguimiento":
        return "bg-green-100 text-green-800"
      case "Cerrado":
        return "bg-emerald-100 text-emerald-800"
      case "Perdido":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad) {
      case "Alta":
        return "bg-red-100 text-red-800"
      case "Media":
        return "bg-yellow-100 text-yellow-800"
      case "Baja":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="CRM - Prospectos" showBack />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Header con estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Prospectos</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{prospectos.length}</p>
                </div>
                <User className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Contacto Inicial</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {prospectos.filter((p) => p.estado === "Contacto inicial").length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-blue-500 rounded flex items-center justify-center">
                  <span className="text-white text-sm font-bold">C</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Propuestas</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {prospectos.filter((p) => p.estado === "Propuesta enviada").length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-yellow-500 rounded flex items-center justify-center">
                  <span className="text-white text-sm font-bold">P</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Seguimiento</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {prospectos.filter((p) => p.estado === "Seguimiento").length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white text-sm font-bold">S</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Barra de búsqueda y botón nuevo */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar prospectos por nombre, empresa o cultivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Link href="/crm/nuevo">
            <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600">
              <Plus className="h-4 w-4" />
              Nuevo Prospecto
            </Button>
          </Link>
        </div>

        {/* Lista de prospectos */}
        <div className="space-y-4">
          {filteredProspectos.map((prospecto) => (
            <Card key={prospecto.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Información principal */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{prospecto.nombre}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{prospecto.empresa}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="h-4 w-4" />
                        {prospecto.telefono}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-4 w-4" />
                        {prospecto.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4" />
                        {prospecto.ubicacion}
                      </div>
                    </div>
                  </div>

                  {/* Estado y prioridad */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Estado</p>
                      <Badge className={getEstadoColor(prospecto.estado)}>{prospecto.estado}</Badge>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Prioridad</p>
                      <Badge className={getPrioridadColor(prospecto.prioridad)}>{prospecto.prioridad}</Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Último contacto: {new Date(prospecto.ultimoContacto).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Cultivos y acciones */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cultivos de interés</p>
                      <div className="flex flex-wrap gap-1">
                        {prospecto.cultivos.map((cultivo) => (
                          <Badge key={cultivo} variant="secondary" className="text-xs">
                            {cultivo}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Link href={`/crm/${prospecto.id}/editar`}>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(prospecto.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Notas */}
                {prospecto.notas && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notas:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{prospecto.notas}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProspectos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No se encontraron prospectos</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm ? "Intenta con otros términos de búsqueda" : "Aún no tienes prospectos registrados"}
            </p>
            <Link href="/crm/nuevo">
              <Button className="bg-blue-500 hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Prospecto
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
