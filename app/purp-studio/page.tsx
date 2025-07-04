"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent } from "@dnd-kit/core"
import { useAppSelector } from "@/lib/hooks"
import { Sidebar } from "@/components/studio/sidebar"
import { Canvas } from "@/components/studio/canvas"
import { Toolbar } from "@/components/studio/toolbar"
import { PropertyEditor } from "@/components/studio/property-editor"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Palette, Sparkles, Type, Square, MousePointer, Layout } from "lucide-react"
import { toast } from "sonner"

export default function PurpStudioPage() {
  const router = useRouter()
  const { userRole } = useAppSelector((state) => state.auth)
  const [draggedItem, setDraggedItem] = useState<any>(null)

  // Check manager access
  useEffect(() => {
    if (userRole !== "Manager") {
      toast.error("Acceso denegado. Solo usuarios Manager pueden acceder a PURP Studio.")
      router.push("/")
      return
    }
  }, [userRole, router])

  const handleDragStart = (event: DragStartEvent) => {
    setDraggedItem(event.active)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggedItem(null)

    // Dispatch custom event for canvas to handle
    if (event.over?.id === "canvas") {
      const customEvent = new CustomEvent("studio-drop", {
        detail: event,
      })
      window.dispatchEvent(customEvent)
    }
  }

  if (userRole !== "Manager") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Acceso Restringido</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Solo usuarios con rol <span className="font-semibold text-purple-600">Manager</span> pueden acceder a PURP
              Studio.
            </p>
            <Button onClick={() => router.push("/")} className="w-full">
              Volver al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
                <ArrowLeft size={16} className="mr-2" />
                Volver
              </Button>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="p-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-xl shadow-lg">
                    <Palette size={24} className="text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1">
                    <Sparkles size={16} className="text-yellow-400" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    PURP STUDIO
                  </h1>
                  <p className="text-sm text-gray-600">Editor visual drag & drop • Low-code platform</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                Usuario: <span className="font-medium text-purple-600">Manager</span>
              </div>
              <div className="h-8 w-px bg-gray-300" />
              <div className="text-sm text-gray-500">v1.0.0</div>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-4 bg-white/50 backdrop-blur-sm border-b border-gray-200">
        <Toolbar />
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 h-[calc(100vh-240px)]">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Canvas */}
            <div className="flex-1 relative">
              <Canvas />
            </div>

            {/* Right Property Editor */}
            <PropertyEditor />
          </div>

          {/* Drag Overlay */}
          <DragOverlay>
            {draggedItem ? (
              <div className="bg-white border-2 border-blue-400 rounded-lg p-3 shadow-lg opacity-90">
                <div className="flex items-center gap-2">
                  <div className="text-blue-600">
                    {draggedItem.data?.current?.type === "text" && <Type size={16} />}
                    {draggedItem.data?.current?.type === "input" && <Square size={16} />}
                    {draggedItem.data?.current?.type === "button" && <MousePointer size={16} />}
                    {draggedItem.data?.current?.type === "container" && <Layout size={16} />}
                  </div>
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {draggedItem.data?.current?.type || "Componente"}
                  </span>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>© 2024 PURP Studio</span>
            <span>•</span>
            <span>Plataforma Low-Code</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Atajos: Ctrl+S (Guardar), Ctrl+Z (Deshacer)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
