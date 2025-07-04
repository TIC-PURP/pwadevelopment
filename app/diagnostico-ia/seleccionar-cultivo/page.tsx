"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Leaf } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const cultivos = [
  {
    id: "maiz",
    nombre: "Maíz",
    descripcion: "Zea mays",
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
  },
  {
    id: "frijol",
    nombre: "Frijol",
    descripcion: "Phaseolus vulgaris",
    color: "from-red-400 to-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    borderColor: "border-red-200 dark:border-red-800",
  },
  {
    id: "garbanzo",
    nombre: "Garbanzo",
    descripcion: "Cicer arietinum",
    color: "from-amber-400 to-yellow-600",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  {
    id: "sorgo",
    nombre: "Sorgo",
    descripcion: "Sorghum bicolor",
    color: "from-purple-400 to-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
]

export default function SeleccionarCultivoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-green-200/50 dark:border-green-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/diagnostico-ia">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">PURP</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Seleccionar Cultivo</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Selecciona el tipo de cultivo
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Elige el cultivo que deseas analizar para obtener un diagnóstico más preciso
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cultivos.map((cultivo, index) => (
            <motion.div
              key={cultivo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={`/diagnostico-ia/diagnostico/${cultivo.id}`}>
                <Card
                  className={`${cultivo.bgColor} ${cultivo.borderColor} border-2 hover:shadow-lg transition-all duration-300 cursor-pointer`}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`bg-gradient-to-r ${cultivo.color} p-6 rounded-full w-fit mx-auto mb-6`}>
                      <Leaf className="h-12 w-12 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{cultivo.nombre}</h3>
                    <p className="text-gray-600 dark:text-gray-300 italic mb-4">{cultivo.descripcion}</p>
                    <Button
                      variant="outline"
                      className={`${cultivo.borderColor} hover:bg-gradient-to-r hover:${cultivo.color} hover:text-white hover:border-transparent transition-all duration-300`}
                    >
                      Seleccionar
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
