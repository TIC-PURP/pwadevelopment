"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, Leaf, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function DiagnosticoIAPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-green-200/50 dark:border-green-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">PURP</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Diagnóstico IA</p>
              </div>
            </Link>
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
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 rounded-full">
                <Camera className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-full">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Diagnóstico Inteligente de Cultivos
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Detecta enfermedades y plagas en tus plantas con inteligencia artificial
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/diagnostico-ia/seleccionar-cultivo">
              <Button
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Iniciar diagnóstico
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-green-200/50 dark:border-green-800/50">
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full w-fit mx-auto mb-4">
                <Camera className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Análisis Instantáneo</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Toma una foto y obtén resultados en segundos</p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-green-200/50 dark:border-green-800/50">
            <CardContent className="p-6 text-center">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-full w-fit mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">IA Avanzada</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Tecnología de reconocimiento de última generación
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-green-200/50 dark:border-green-800/50">
            <CardContent className="p-6 text-center">
              <div className="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-full w-fit mx-auto mb-4">
                <Leaf className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Tratamientos</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Recomendaciones específicas para cada problema</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Supported Crops */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cultivos Soportados</h2>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {["Maíz", "Frijol", "Garbanzo", "Sorgo"].map((crop, index) => (
              <div key={crop} className="flex flex-col items-center">
                <div className="bg-white/80 dark:bg-gray-800/80 p-4 rounded-full shadow-md mb-2">
                  <Leaf className="h-8 w-8 text-green-500" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{crop}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
