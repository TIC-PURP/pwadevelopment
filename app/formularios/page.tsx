"use client"

import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Clipboard, BarChart3, Shield, Leaf, Droplets, Bug, Thermometer } from "lucide-react"
import Link from "next/link"

export default function FormulariosPage() {
  const formularios = [
    {
      id: "ipp-basico",
      title: "IPP Básico",
      description: "Formulario de Inspección de Plagas y Patógenos básico",
      icon: Bug,
      color: "bg-red-500",
      status: "Disponible",
      href: "/formularios/ipp-basico",
    },
    {
      id: "ipp-avanzado",
      title: "IPP Avanzado",
      description: "Formulario completo de Inspección de Plagas y Patógenos",
      icon: Shield,
      color: "bg-orange-500",
      status: "Disponible",
      href: "/formularios/ipp-avanzado",
    },
    {
      id: "calidad-suelo",
      title: "Calidad de Suelo",
      description: "Evaluación de características físicas y químicas del suelo",
      icon: Leaf,
      color: "bg-green-500",
      status: "Disponible",
      href: "/formularios/calidad-suelo",
    },
    {
      id: "recursos-hidricos",
      title: "Recursos Hídricos",
      description: "Evaluación de disponibilidad y calidad del agua",
      icon: Droplets,
      color: "bg-blue-500",
      status: "Disponible",
      href: "/formularios/recursos-hidricos",
    },
    {
      id: "clima-meteorologia",
      title: "Clima y Meteorología",
      description: "Registro de condiciones climáticas y meteorológicas",
      icon: Thermometer,
      color: "bg-purple-500",
      status: "Próximamente",
      href: "#",
    },
    {
      id: "rendimiento-cultivo",
      title: "Rendimiento de Cultivo",
      description: "Análisis de productividad y rendimiento por hectárea",
      icon: BarChart3,
      color: "bg-yellow-500",
      status: "Próximamente",
      href: "#",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header title="Formularios IPP" showBack />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Formularios especializados para inspección y evaluación técnica agrícola
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formularios.map((formulario) => (
            <Card key={formulario.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`${formulario.color} p-3 rounded-lg`}>
                    <formulario.icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant={formulario.status === "Disponible" ? "default" : "secondary"}>
                    {formulario.status}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{formulario.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{formulario.description}</p>

                {formulario.status === "Disponible" ? (
                  <Link href={formulario.href}>
                    <Button className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      Abrir Formulario
                    </Button>
                  </Link>
                ) : (
                  <Button disabled className="w-full">
                    <Clipboard className="h-4 w-4 mr-2" />
                    Próximamente
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Información adicional */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Información sobre Formularios IPP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
              <p>
                Los formularios de Inspección de Plagas y Patógenos (IPP) son herramientas especializadas para la
                evaluación técnica de cultivos y condiciones agrícolas.
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>Todos los formularios funcionan completamente offline</li>
                <li>Los datos se sincronizan automáticamente cuando hay conexión</li>
                <li>Cada formulario genera reportes en PDF</li>
                <li>Incluyen captura de coordenadas GPS y fotografías</li>
                <li>Permiten firmas digitales para validación</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
