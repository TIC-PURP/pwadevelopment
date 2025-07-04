"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  ArrowLeft,
  Camera,
  Upload,
  ImageIcon,
  Loader2,
  CheckCircle,
  RotateCw,
  ZoomIn,
  Pencil,
  Type,
  Smile,
  Save,
  Undo,
  X,
  CameraOff,
} from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useParams } from "next/navigation"

const cultivoNames = {
  maiz: "Maíz",
  frijol: "Frijol",
  garbanzo: "Garbanzo",
  sorgo: "Sorgo",
}

const simulatedResults = {
  maiz: {
    enfermedad: "Tizón foliar del maíz",
    confianza: 87,
    tratamiento: {
      producto: "Fungicida Azoxistrobina",
      dosis: "200-300 ml por hectárea",
      aplicacion: "Aplicar por aspersión foliar en las primeras horas de la mañana",
      disponibilidad: "Disponible en tiendas agrícolas",
      recomendacion: "Repetir aplicación cada 15 días si persisten las condiciones húmedas",
    },
  },
  frijol: {
    enfermedad: "Roya del frijol",
    confianza: 92,
    tratamiento: {
      producto: "Fungicida Tebuconazol",
      dosis: "150-200 ml por hectárea",
      aplicacion: "Aplicar preventivamente cuando aparezcan los primeros síntomas",
      disponibilidad: "Disponible en distribuidores autorizados",
      recomendacion: "Mejorar ventilación del cultivo y evitar riego por aspersión",
    },
  },
  garbanzo: {
    enfermedad: "Marchitez del garbanzo",
    confianza: 89,
    tratamiento: {
      producto: "Fungicida Carbendazim",
      dosis: "250-300 ml por hectárea",
      aplicacion: "Aplicar al suelo y follaje durante las primeras etapas",
      disponibilidad: "Disponible en tiendas especializadas",
      recomendacion: "Mejorar drenaje del suelo y rotar cultivos",
    },
  },
  sorgo: {
    enfermedad: "Antracnosis del sorgo",
    confianza: 85,
    tratamiento: {
      producto: "Fungicida Mancozeb",
      dosis: "2-3 kg por hectárea",
      aplicacion: "Aplicar preventivamente cada 10-14 días",
      disponibilidad: "Ampliamente disponible",
      recomendacion: "Eliminar residuos de cosecha y usar semilla certificada",
    },
  },
}

const emojis = [
  "🌱",
  "🌿",
  "🍃",
  "🌾",
  "🌽",
  "🥬",
  "🥕",
  "🍅",
  "🌶️",
  "🥒",
  "🧄",
  "🧅",
  "🥔",
  "🍄",
  "🌰",
  "🥜",
  "🌻",
  "🌺",
  "🌸",
  "🌼",
  "🌷",
  "🌹",
  "🏵️",
  "💐",
  "🌲",
  "🌳",
  "🌴",
  "🌵",
  "🌊",
  "☀️",
  "🌤️",
  "⛅",
  "🌦️",
  "🌧️",
  "⛈️",
  "🌩️",
  "❄️",
  "☔",
  "💧",
  "💦",
]

export default function DiagnosticoPage() {
  const params = useParams()
  const cultivo = params.cultivo as string
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [editedImage, setEditedImage] = useState<string | null>(null)
  const [showEditor, setShowEditor] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [editorTool, setEditorTool] = useState<"crop" | "rotate" | "zoom" | "draw" | "text" | "emoji">("draw")
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 })
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawColor, setDrawColor] = useState("#ff0000")
  const [drawSize, setDrawSize] = useState(3)
  const [textInput, setTextInput] = useState("")
  const [textPosition, setTextPosition] = useState({ x: 50, y: 50 })
  const [selectedEmoji, setSelectedEmoji] = useState("")
  const [emojiPosition, setEmojiPosition] = useState({ x: 50, y: 50 })
  const [editHistory, setEditHistory] = useState<string[]>([])

  const cultivoName = cultivoNames[cultivo as keyof typeof cultivoNames] || "Cultivo"
  const result = simulatedResults[cultivo as keyof typeof simulatedResults]

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [cameraStream])

  // Initialize canvas when image is loaded
  useEffect(() => {
    if (selectedImage && showEditor && canvasRef.current) {
      initializeCanvas()
    }
  }, [selectedImage, showEditor])

  const initializeCanvas = () => {
    if (!canvasRef.current || !selectedImage) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width
      canvas.height = img.height

      // Draw the image
      ctx?.drawImage(img, 0, 0)

      // Save initial state
      const initialState = canvas.toDataURL()
      setEditHistory([initialState])
      setEditedImage(initialState)
    }

    img.src = selectedImage
  }

  const saveCurrentState = () => {
    if (!canvasRef.current) return

    const currentState = canvasRef.current.toDataURL()
    setEditHistory((prev) => [...prev, currentState])
    setEditedImage(currentState)
  }

  const undoLastEdit = () => {
    if (editHistory.length <= 1) return

    const newHistory = [...editHistory]
    newHistory.pop() // Remove current state
    const previousState = newHistory[newHistory.length - 1]

    setEditHistory(newHistory)
    setEditedImage(previousState)

    // Redraw canvas with previous state
    if (canvasRef.current && previousState) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      const img = new Image()

      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)
      }

      img.src = previousState
    }
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
      setCameraStream(stream)
      setShowCamera(true)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("No se pudo acceder a la cámara. Por favor, verifica los permisos.")
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
    setShowCamera(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    // Set canvas size to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    ctx?.drawImage(video, 0, 0)

    // Get image data
    const imageData = canvas.toDataURL("image/jpeg", 0.8)

    setSelectedImage(imageData)
    setOriginalImage(imageData)
    setEditedImage(imageData)
    stopCamera()
    setShowEditor(true)
    setShowResult(false)
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setSelectedImage(imageUrl)
        setOriginalImage(imageUrl)
        setEditedImage(imageUrl)
        setShowEditor(true)
        setShowResult(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!editedImage) return

    setIsAnalyzing(true)
    setShowEditor(false)
    // Simular análisis de IA
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsAnalyzing(false)
    setShowResult(true)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const applyRotation = () => {
    if (!canvasRef.current || !editedImage) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      const { width, height } = img

      // Calculate new canvas dimensions for rotation
      const radians = (rotation * Math.PI) / 180
      const cos = Math.abs(Math.cos(radians))
      const sin = Math.abs(Math.sin(radians))
      const newWidth = width * cos + height * sin
      const newHeight = width * sin + height * cos

      canvas.width = newWidth
      canvas.height = newHeight

      ctx?.save()
      ctx?.translate(newWidth / 2, newHeight / 2)
      ctx?.rotate(radians)
      ctx?.drawImage(img, -width / 2, -height / 2)
      ctx?.restore()

      saveCurrentState()
    }

    img.src = editedImage
  }

  const applyZoom = () => {
    if (!canvasRef.current || !editedImage) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      const newWidth = img.width * zoom
      const newHeight = img.height * zoom

      canvas.width = newWidth
      canvas.height = newHeight

      ctx?.drawImage(img, 0, 0, newWidth, newHeight)
      saveCurrentState()
    }

    img.src = editedImage
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (editorTool !== "draw") return
    setIsDrawing(true)

    const canvas = canvasRef.current
    const rect = canvas?.getBoundingClientRect()
    if (!canvas || !rect) return

    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.strokeStyle = drawColor
      ctx.lineWidth = drawSize
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || editorTool !== "draw") return

    const canvas = canvasRef.current
    const rect = canvas?.getBoundingClientRect()
    if (!canvas || !rect) return

    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      saveCurrentState()
    }
  }

  const addText = () => {
    if (!canvasRef.current || !textInput) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (ctx) {
      ctx.font = "24px Arial"
      ctx.fillStyle = drawColor
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2

      // Add text with outline for better visibility
      ctx.strokeText(textInput, textPosition.x, textPosition.y)
      ctx.fillText(textInput, textPosition.x, textPosition.y)

      saveCurrentState()
      setTextInput("")
    }
  }

  const addEmoji = () => {
    if (!canvasRef.current || !selectedEmoji) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (ctx) {
      ctx.font = "32px Arial"
      ctx.fillText(selectedEmoji, emojiPosition.x, emojiPosition.y)
      saveCurrentState()
      setSelectedEmoji("")
    }
  }

  const resetToOriginal = () => {
    if (originalImage) {
      setSelectedImage(originalImage)
      setEditedImage(originalImage)
      setEditHistory([])
      initializeCanvas()
    }
  }

  const saveEdits = () => {
    setShowEditor(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-green-200/50 dark:border-green-800/50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/diagnostico-ia/seleccionar-cultivo">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Diagnóstico de {cultivoName}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Análisis con IA</p>
            </div>
          </div>
        </div>
      </header>

      {/* Camera Modal */}
      <AnimatePresence>
        {showCamera && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col"
          >
            <div className="flex-1 relative">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />

              {/* Camera Controls */}
              <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-8">
                <Button
                  onClick={stopCamera}
                  variant="outline"
                  size="lg"
                  className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30"
                >
                  <X className="h-6 w-6" />
                </Button>

                <Button
                  onClick={capturePhoto}
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 w-16 h-16 rounded-full p-0"
                >
                  <Camera className="h-8 w-8" />
                </Button>

                <Button
                  onClick={stopCamera}
                  variant="outline"
                  size="lg"
                  className="bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30"
                >
                  <CameraOff className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Diagnóstico de {cultivoName}
          </h1>

          {/* Image Upload Section */}
          {!showEditor && (
            <Card className="mb-8 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-green-200/50 dark:border-green-800/50">
              <CardContent className="p-8">
                <div className="text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />

                  {!selectedImage ? (
                    <div className="border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg p-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                          <Camera className="h-12 w-12 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                          Captura o sube una imagen
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 max-w-md">
                          Toma una foto clara de la planta afectada o sube una imagen desde tu dispositivo
                        </p>
                        <div className="flex gap-4">
                          <Button onClick={startCamera} className="bg-green-500 hover:bg-green-600">
                            <Camera className="mr-2 h-4 w-4" />
                            Tomar foto
                          </Button>
                          <Button onClick={triggerFileInput} variant="outline">
                            <Upload className="mr-2 h-4 w-4" />
                            Subir imagen
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="relative">
                        <img
                          src={editedImage || selectedImage}
                          alt="Imagen editada"
                          className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                        />
                      </div>
                      <div className="flex gap-4 justify-center flex-wrap">
                        <Button onClick={startCamera} variant="outline">
                          <Camera className="mr-2 h-4 w-4" />
                          Nueva foto
                        </Button>
                        <Button onClick={triggerFileInput} variant="outline">
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Cambiar imagen
                        </Button>
                        <Button onClick={() => setShowEditor(true)} variant="outline">
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar imagen
                        </Button>
                        <Button
                          onClick={handleAnalyze}
                          disabled={isAnalyzing}
                          className="bg-green-500 hover:bg-green-600"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Analizando...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Analizar imagen
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Image Editor */}
          <AnimatePresence>
            {showEditor && selectedImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
                  {/* Editor Header */}
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Editor de Imagen</h3>
                      <div className="flex gap-2">
                        <Button onClick={undoLastEdit} variant="outline" size="sm" disabled={editHistory.length <= 1}>
                          <Undo className="mr-2 h-4 w-4" />
                          Deshacer
                        </Button>
                        <Button onClick={resetToOriginal} variant="outline" size="sm">
                          Restaurar original
                        </Button>
                        <Button onClick={saveEdits} className="bg-green-500 hover:bg-green-600">
                          <Save className="mr-2 h-4 w-4" />
                          Guardar
                        </Button>
                        <Button onClick={() => setShowEditor(false)} variant="outline">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex h-[calc(90vh-80px)]">
                    {/* Tools Sidebar */}
                    <div className="w-64 p-4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
                      <div className="space-y-4">
                        {/* Tool Selection */}
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Herramientas</h4>
                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant={editorTool === "draw" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setEditorTool("draw")}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={editorTool === "rotate" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setEditorTool("rotate")}
                            >
                              <RotateCw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={editorTool === "zoom" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setEditorTool("zoom")}
                            >
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={editorTool === "text" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setEditorTool("text")}
                            >
                              <Type className="h-4 w-4" />
                            </Button>
                            <Button
                              variant={editorTool === "emoji" ? "default" : "outline"}
                              size="sm"
                              onClick={() => setEditorTool("emoji")}
                            >
                              <Smile className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Tool-specific controls */}
                        {editorTool === "rotate" && (
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Rotación</h4>
                            <Slider
                              value={[rotation]}
                              onValueChange={(value) => setRotation(value[0])}
                              max={360}
                              step={15}
                              className="mb-2"
                            />
                            <p className="text-sm text-gray-600 dark:text-gray-400">{rotation}°</p>
                            <Button onClick={applyRotation} size="sm" className="mt-2 w-full">
                              Aplicar rotación
                            </Button>
                          </div>
                        )}

                        {editorTool === "zoom" && (
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Zoom</h4>
                            <Slider
                              value={[zoom]}
                              onValueChange={(value) => setZoom(value[0])}
                              min={0.5}
                              max={3}
                              step={0.1}
                              className="mb-2"
                            />
                            <p className="text-sm text-gray-600 dark:text-gray-400">{zoom}x</p>
                            <Button onClick={applyZoom} size="sm" className="mt-2 w-full">
                              Aplicar zoom
                            </Button>
                          </div>
                        )}

                        {editorTool === "draw" && (
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Dibujar</h4>
                            <div className="space-y-3">
                              <div>
                                <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Color</label>
                                <input
                                  type="color"
                                  value={drawColor}
                                  onChange={(e) => setDrawColor(e.target.value)}
                                  className="w-full h-10 rounded border cursor-pointer"
                                />
                              </div>
                              <div>
                                <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                                  Tamaño: {drawSize}px
                                </label>
                                <Slider
                                  value={[drawSize]}
                                  onValueChange={(value) => setDrawSize(value[0])}
                                  min={1}
                                  max={20}
                                  step={1}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {editorTool === "text" && (
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Texto</h4>
                            <div className="space-y-3">
                              <Input
                                placeholder="Escribe tu texto"
                                value={textInput}
                                onChange={(e) => setTextInput(e.target.value)}
                              />
                              <div>
                                <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Color</label>
                                <input
                                  type="color"
                                  value={drawColor}
                                  onChange={(e) => setDrawColor(e.target.value)}
                                  className="w-full h-10 rounded border cursor-pointer"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">X</label>
                                  <Input
                                    type="number"
                                    value={textPosition.x}
                                    onChange={(e) =>
                                      setTextPosition((prev) => ({ ...prev, x: Number(e.target.value) }))
                                    }
                                  />
                                </div>
                                <div>
                                  <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Y</label>
                                  <Input
                                    type="number"
                                    value={textPosition.y}
                                    onChange={(e) =>
                                      setTextPosition((prev) => ({ ...prev, y: Number(e.target.value) }))
                                    }
                                  />
                                </div>
                              </div>
                              <Button onClick={addText} size="sm" disabled={!textInput} className="w-full">
                                Añadir texto
                              </Button>
                            </div>
                          </div>
                        )}

                        {editorTool === "emoji" && (
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Emojis</h4>
                            <div className="grid grid-cols-6 gap-1 max-h-40 overflow-y-auto mb-3">
                              {emojis.map((emoji, index) => (
                                <button
                                  key={index}
                                  onClick={() => setSelectedEmoji(emoji)}
                                  className={`p-1 text-lg hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
                                    selectedEmoji === emoji ? "bg-blue-100 dark:bg-blue-900" : ""
                                  }`}
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                            {selectedEmoji && (
                              <>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                  <div>
                                    <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">X</label>
                                    <Input
                                      type="number"
                                      value={emojiPosition.x}
                                      onChange={(e) =>
                                        setEmojiPosition((prev) => ({ ...prev, x: Number(e.target.value) }))
                                      }
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-600 dark:text-gray-400 block mb-1">Y</label>
                                    <Input
                                      type="number"
                                      value={emojiPosition.y}
                                      onChange={(e) =>
                                        setEmojiPosition((prev) => ({ ...prev, y: Number(e.target.value) }))
                                      }
                                    />
                                  </div>
                                </div>
                                <Button onClick={addEmoji} size="sm" className="w-full">
                                  Añadir {selectedEmoji}
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Canvas Area */}
                    <div className="flex-1 p-4 overflow-auto bg-gray-50 dark:bg-gray-900">
                      <div className="flex items-center justify-center min-h-full">
                        <canvas
                          ref={canvasRef}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          className="max-w-full max-h-full border border-gray-300 dark:border-gray-600 rounded shadow-lg bg-white"
                          style={{
                            cursor: editorTool === "draw" ? "crosshair" : "default",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analysis Progress */}
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">Analizando imagen con IA...</h3>
                        <p className="text-blue-700 dark:text-blue-300">
                          Detectando enfermedades y plagas en tu cultivo de {cultivoName.toLowerCase()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Section */}
          <AnimatePresence>
            {showResult && result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Diagnosis Result */}
                <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-green-200/50 dark:border-green-800/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                        <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Diagnóstico Completado</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Cultivo</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{cultivoName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Problema detectado</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{result.enfermedad}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Nivel de confianza</p>
                            <div className="flex items-center gap-2">
                              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 flex-1">
                                <div
                                  className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                                  style={{ width: `${result.confianza}%` }}
                                />
                              </div>
                              <span className="font-semibold text-green-600 dark:text-green-400">
                                {result.confianza}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Treatment Recommendation */}
                <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-amber-900 dark:text-amber-100 mb-4">
                      Tratamiento Recomendado
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Producto</p>
                          <p className="text-amber-900 dark:text-amber-100">{result.tratamiento.producto}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Dosis sugerida</p>
                          <p className="text-amber-900 dark:text-amber-100">{result.tratamiento.dosis}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Disponibilidad</p>
                          <p className="text-amber-900 dark:text-amber-100">{result.tratamiento.disponibilidad}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Modo de aplicación</p>
                          <p className="text-amber-900 dark:text-amber-100">{result.tratamiento.aplicacion}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                            Recomendación adicional
                          </p>
                          <p className="text-amber-900 dark:text-amber-100">{result.tratamiento.recomendacion}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center flex-wrap">
                  <Button
                    onClick={() => {
                      setSelectedImage(null)
                      setOriginalImage(null)
                      setEditedImage(null)
                      setShowResult(false)
                      setEditHistory([])
                    }}
                    variant="outline"
                  >
                    Nuevo análisis
                  </Button>
                  <Link href="/diagnostico-ia/seleccionar-cultivo">
                    <Button variant="outline">Cambiar cultivo</Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  )
}
