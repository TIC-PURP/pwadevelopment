"use client"

import { useState } from "react"
import { useStudioStore } from "@/lib/stores/useStudioStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Eye, EyeOff, Trash2, Download, Upload, Smartphone, Monitor, Tablet } from "lucide-react"
import { toast } from "sonner"

export function Toolbar() {
  const {
    components,
    isPreviewMode,
    setPreviewMode,
    clearCanvas,
    exportPage,
    importPage,
    savePage,
    currentPage,
    deletePage,
  } = useStudioStore()

  const [exportData, setExportData] = useState("")
  const [importData, setImportData] = useState("")
  const [viewportMode, setViewportMode] = useState<"desktop" | "tablet" | "mobile">("desktop")

  const handleSave = () => {
    if (!currentPage) {
      toast.error("No hay página activa para guardar")
      return
    }

    savePage()
    toast.success(`Página "${currentPage.name}" guardada correctamente`)
  }

  const handleExport = () => {
    if (!currentPage) {
      toast.error("No hay página para exportar")
      return
    }

    const data = exportPage()
    setExportData(data)

    // Download as file
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${currentPage.slug}-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast.success("Página exportada correctamente")
  }

  const handleImport = () => {
    if (!importData.trim()) {
      toast.error("Por favor, pega el JSON de la página")
      return
    }

    try {
      importPage(importData)
      setImportData("")
      toast.success("Página importada correctamente")
    } catch (error) {
      toast.error("Error al importar la página. Verifica el formato JSON.")
    }
  }

  const handleClear = () => {
    if (components.length === 0) {
      toast.info("El canvas ya está vacío")
      return
    }

    if (confirm("¿Estás seguro de que quieres borrar todos los componentes?")) {
      clearCanvas()
      toast.success("Canvas limpiado")
    }
  }

  const handleDeletePage = () => {
    if (!currentPage) {
      toast.error("No hay página activa para eliminar")
      return
    }

    if (confirm(`¿Estás seguro de que quieres eliminar la página "${currentPage.name}"?`)) {
      deletePage(currentPage.id)
      toast.success("Página eliminada")
    }
  }

  const getViewportClass = () => {
    switch (viewportMode) {
      case "mobile":
        return "max-w-sm"
      case "tablet":
        return "max-w-2xl"
      default:
        return "max-w-full"
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left Section - Main Actions */}
          <div className="flex items-center gap-2">
            <Button onClick={handleSave} size="sm" disabled={!currentPage}>
              <Save size={16} className="mr-2" />
              Guardar
            </Button>

            <Button
              onClick={() => setPreviewMode(!isPreviewMode)}
              variant={isPreviewMode ? "default" : "outline"}
              size="sm"
            >
              {isPreviewMode ? (
                <>
                  <EyeOff size={16} className="mr-2" />
                  Editar
                </>
              ) : (
                <>
                  <Eye size={16} className="mr-2" />
                  Vista Previa
                </>
              )}
            </Button>

            {/* Viewport Controls */}
            <div className="flex items-center gap-1 ml-4">
              <Button
                variant={viewportMode === "desktop" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewportMode("desktop")}
                title="Vista Desktop"
              >
                <Monitor size={16} />
              </Button>
              <Button
                variant={viewportMode === "tablet" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewportMode("tablet")}
                title="Vista Tablet"
              >
                <Tablet size={16} />
              </Button>
              <Button
                variant={viewportMode === "mobile" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewportMode("mobile")}
                title="Vista Mobile"
              >
                <Smartphone size={16} />
              </Button>
            </div>
          </div>

          {/* Center Section - Page Info */}
          <div className="flex items-center gap-4">
            {currentPage && (
              <div className="text-center">
                <div className="text-sm font-medium text-gray-700">{currentPage.name}</div>
                <div className="text-xs text-gray-500">
                  {components.length} componente{components.length !== 1 ? "s" : ""}
                </div>
              </div>
            )}
          </div>

          {/* Right Section - File Operations */}
          <div className="flex items-center gap-2">
            {/* Export Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={!currentPage}>
                  <Download size={16} className="mr-2" />
                  Exportar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Exportar Página</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Button onClick={handleExport} className="w-full">
                    Generar y Descargar JSON
                  </Button>
                  {exportData && (
                    <div>
                      <Label className="text-sm font-medium">JSON de la página:</Label>
                      <Textarea
                        value={exportData}
                        readOnly
                        className="mt-2 h-40 font-mono text-xs"
                        onClick={(e) => e.currentTarget.select()}
                      />
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Import Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload size={16} className="mr-2" />
                  Importar
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Importar Página</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Pega el JSON de la página:</Label>
                    <Textarea
                      value={importData}
                      onChange={(e) => setImportData(e.target.value)}
                      placeholder="Pega aquí el JSON exportado..."
                      className="mt-2 h-40 font-mono text-xs"
                    />
                  </div>
                  <Button onClick={handleImport} className="w-full">
                    Importar Página
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button onClick={handleClear} variant="outline" size="sm" disabled={components.length === 0}>
              <Trash2 size={16} className="mr-2" />
              Limpiar
            </Button>

            {currentPage && (
              <Button onClick={handleDeletePage} variant="destructive" size="sm">
                <Trash2 size={16} className="mr-2" />
                Eliminar Página
              </Button>
            )}
          </div>
        </div>

        {/* Second Row - Additional Info */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t">
          <div className="text-xs text-gray-500">
            Modo: {isPreviewMode ? "Vista Previa" : "Edición"} | Viewport: {viewportMode} | Canvas: 1200x800px
          </div>

          {currentPage && (
            <div className="text-xs text-gray-500">
              Última actualización: {new Date(currentPage.updatedAt).toLocaleString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
