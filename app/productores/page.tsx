"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setSearchTerm } from "@/lib/slices/productoresSlice"
import { Search, Phone, Mail, MapPin, Leaf, ArrowRight, Calendar, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProductoresPage() {
  const dispatch = useAppDispatch()
  const { productores, searchTerm } = useAppSelector((state) => state.productores)

  const filteredProductores = productores.filter(
    (productor) =>
      productor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      productor.cedula.includes(searchTerm) ||
      productor.cultivos.some((cultivo) => cultivo.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header con botones adicionales */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Asesoría Técnica</h1>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/agenda">
              <Button variant="ghost" size="sm" className="p-2">
                <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Button>
            </Link>
            <Link href="/crm">
              <Button variant="ghost" size="sm" className="p-2">
                <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Título y Asesor */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Catálogo de Productores</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            <span className="font-medium">Asesor:</span> Pruebas TIC
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nombre, cédula o cultivo..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="pl-10"
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredProductores.length} de {productores.length} productores
          </p>
        </div>

        {/* Productores List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProductores.map((productor, index) => (
            <Card key={productor.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{productor.nombre}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">CC: {productor.cedula}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Phone className="h-4 w-4" />
                      {productor.telefono}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4" />
                      {productor.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4" />
                      {productor.direccion}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium">Cultivos:</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {productor.cultivos.map((cultivo) => (
                        <Badge key={cultivo} variant="secondary" className="text-xs">
                          {cultivo}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link href={`/productores/${productor.id}/opciones`}>
                      <Button className="w-full" size="sm" variant="outline">
                        <span>Abrir Productor</span>
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProductores.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No se encontraron productores</h3>
            <p className="text-gray-600 dark:text-gray-400">Intenta con otros términos de búsqueda</p>
          </div>
        )}
      </main>
    </div>
  )
}
