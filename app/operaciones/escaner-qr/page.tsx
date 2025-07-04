"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Camera, Scan, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

// Datos simulados de empleados
const empleadosDB = {
  "NSS:26190189451": {
    nombre: "MARIO DANIEL ACOSTA GONZALEZ",
    nss: "26190189451",
    telefono: "(687) 872 4548",
    tieneEntrada: false,
    vehiculoEntrada: null,
    horaEntrada: null,
  },
  "NSS:12345678901": {
    nombre: "JUAN CARLOS RODRIGUEZ LOPEZ",
    nss: "12345678901",
    telefono: "(687) 123 4567",
    tieneEntrada: true,
    vehiculoEntrada: "PURP JOURNEY -> VNV-958-B",
    horaEntrada: "09:30",
  },
}

export default function EscanerQRPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()

  useEffect(() => {
    requestCameraPermission()
    return () => {
      stopCamera()
    }
  }, [])

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      setHasPermission(true)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      setHasPermission(false)
      setError("No se pudo acceder a la cámara. Por favor, permite el acceso.")
    }
  }

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
    }
  }

  const simulateQRScan = () => {
    setIsScanning(true)

    // Simular escaneo de QR después de 2 segundos
    setTimeout(() => {
      // Alternar entre dos empleados para demostrar ambos flujos
      const qrCodes = ["NSS:26190189451", "NSS:12345678901"]
      const randomQR = qrCodes[Math.floor(Math.random() * qrCodes.length)]

      const empleado = empleadosDB[randomQR as keyof typeof empleadosDB]

      if (empleado) {
        stopCamera()

        if (empleado.tieneEntrada) {
          // Redirigir a salida con datos pre-llenados
          const params = new URLSearchParams({
            nombre: empleado.nombre,
            nss: empleado.nss,
            telefono: empleado.telefono,
            vehiculoEntrada: empleado.vehiculoEntrada || "",
            horaEntrada: empleado.horaEntrada || "",
          })
          router.push(`/operaciones/salida-personal?${params.toString()}`)
        } else {
          // Redirigir a entrada con datos pre-llenados
          const params = new URLSearchParams({
            nombre: empleado.nombre,
            nss: empleado.nss,
            telefono: empleado.telefono,
          })
          router.push(`/operaciones/entrada-personal?${params.toString()}`)
        }
      }
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-blue-200/50 dark:border-blue-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/operaciones">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Escáner QR</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Entrada/Salida de Personal</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-blue-200/50 dark:border-blue-800/50">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                  <Scan className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Escanear Código QR</h2>
                  <p className="text-gray-600 dark:text-gray-300">Apunta la cámara hacia el código QR del empleado</p>
                </div>

                {/* Camera View */}
                <div className="relative">
                  {hasPermission === null && (
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-500" />
                      <p className="text-gray-500 mt-2">Solicitando permisos de cámara...</p>
                    </div>
                  )}

                  {hasPermission === false && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8">
                      <Camera className="h-8 w-8 mx-auto text-red-500 mb-2" />
                      <p className="text-red-600 dark:text-red-400">{error}</p>
                      <Button onClick={requestCameraPermission} className="mt-4 bg-transparent" variant="outline">
                        Intentar de nuevo
                      </Button>
                    </div>
                  )}

                  {hasPermission === true && (
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                      />

                      {/* Overlay de escaneo */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="border-2 border-blue-500 rounded-lg w-48 h-48 relative">
                          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Scan Button */}
                {hasPermission === true && (
                  <Button
                    onClick={simulateQRScan}
                    disabled={isScanning}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Escaneando...
                      </>
                    ) : (
                      <>
                        <Scan className="mr-2 h-5 w-5" />
                        Escanear QR
                      </>
                    )}
                  </Button>
                )}

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>El sistema detectará automáticamente si es entrada o salida</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
