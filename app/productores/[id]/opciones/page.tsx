"use client"

import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/lib/hooks"
import { ClipboardList, FileText, Search, UserCheck, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function OpcionesProductorPage() {
  const params = useParams()
  const productorId = params.id as string
  const { productores } = useAppSelector((state) => state.productores)

  const productor = productores.find((p) => p.id === productorId)

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

  const opciones = [
    {
      title: "Visita a Productor",
      description: "Ver historial y realizar nuevas visitas técnicas",
      icon: ClipboardList,
      color: "bg-green-500",
      href: `/productores/${productorId}/visitas`,
      available: true,
    },
    {
      title: "Dictamen Técnico",
      description: "Generar dictamen técnico especializado",
      icon: FileText,
      color: "bg-green-500",
      href: `/productores/${productorId}/dictamenes`,
      available: true,
    },
    {
      title: "Reporte Inspección Técnica",
      description: "Crear reporte de inspección detallado",
      icon: Search,
      color: "bg-purple-500",
      href: `/productores/${productorId}/reportes-inspeccion`,
      available: true,
    },
    {
      title: "Traspaso de Productor",
      description: "Transferir productor a otro técnico",
      icon: UserCheck,
      color: "bg-orange-500",
      href: "#",
      available: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Opciones de Asesoría" showBack />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Información del Productor */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <UserCheck className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">{productor.nombre}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">CC: {productor.cedula}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Opciones de Asesoría */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {opciones.map((opcion) => (
            <Card
              key={opcion.title}
              className={`hover:shadow-lg transition-all duration-200 ${
                opcion.available ? "hover:scale-105 cursor-pointer" : "opacity-60 cursor-not-allowed"
              }`}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className={`${opcion.color} p-3 rounded-lg ${!opcion.available && "grayscale"}`}>
                      <opcion.icon className={`h-6 w-6 text-white`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{opcion.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{opcion.description}</p>
                    </div>
                  </div>

                  <div className="pt-2">
                    {opcion.available ? (
                      <Link href={opcion.href}>
                        <Button className="w-full group">
                          <span>Continuar</span>
                          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    ) : (
                      <Button disabled className="w-full">
                        Próximamente
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Información adicional */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Selecciona el tipo de asesoría técnica que deseas realizar para{" "}
                <span className="font-medium text-gray-900 dark:text-white">{productor.nombre}</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
