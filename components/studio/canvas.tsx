"use client"

import React from "react"
import { useDroppable } from "@dnd-kit/core"
import { useStudioStore } from "@/lib/stores/useStudioStore"
import { ComponentRenderer } from "./component-renderer"
import { Card } from "@/components/ui/card"

export function Canvas() {
  const { components, isPreviewMode, canvasSize, addComponent, selectComponent, currentPage } = useStudioStore()

  const { isOver, setNodeRef } = useDroppable({
    id: "canvas",
  })

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if clicking on empty canvas area
    if (e.target === e.currentTarget) {
      selectComponent(null)
    }
  }

  const handleDrop = React.useCallback(
    (event: any) => {
      const { active, delta } = event

      const defaultProps = {
        text: {
          content: "Texto de ejemplo",
          fontSize: "16px",
          color: "#333333",
          fontWeight: "normal",
          textAlign: "left",
        },
        input: {
          placeholder: "Ingresa tu texto aquí",
          type: "text",
          required: false,
          name: "input_field",
        },
        button: {
          text: "Botón",
          variant: "primary",
          size: "medium",
          onClick: "alert('Botón clickeado')",
        },
        container: {
          backgroundColor: "#f8f9fa",
          padding: "16px",
          borderRadius: "8px",
          border: "2px dashed #dee2e6",
        },
      }

      const defaultSize = {
        text: { width: 200, height: 40 },
        input: { width: 250, height: 40 },
        button: { width: 120, height: 40 },
        container: { width: 300, height: 200 },
      }

      type ComponentType = keyof typeof defaultSize

      const componentType = active.data.current?.type as ComponentType | undefined

      if (componentType && componentType in defaultSize && componentType in defaultProps) {
        // Calculate drop position relative to canvas
        const x = Math.max(0, Math.min(canvasSize.width - 200, Math.abs(delta.x) + 50))
        const y = Math.max(0, Math.min(canvasSize.height - 100, Math.abs(delta.y) + 50))

        addComponent({
          type: componentType,
          x,
          y,
          width: defaultSize[componentType].width,
          height: defaultSize[componentType].height,
          props: defaultProps[componentType],
          children: [],
        })
      }
    },
    [canvasSize, addComponent],
  )

  // Handle drop from DndContext
  React.useEffect(() => {
    const handleGlobalDrop = (event: CustomEvent) => {
      if (event.detail?.over?.id === "canvas") {
        handleDrop(event.detail)
      }
    }

    window.addEventListener("studio-drop" as any, handleGlobalDrop)
    return () => window.removeEventListener("studio-drop" as any, handleGlobalDrop)
  }, [handleDrop])

  return (
    <Card className="flex-1 h-full relative overflow-hidden">
      <div
        ref={setNodeRef}
        className={`
          w-full h-full relative bg-white
          ${isOver ? "bg-blue-50 border-2 border-blue-300 border-dashed" : ""}
          ${!isPreviewMode ? "cursor-crosshair" : ""}
        `}
        style={{
          minHeight: canvasSize.height,
          minWidth: canvasSize.width,
        }}
        onClick={handleCanvasClick}
      >
        {/* Canvas Header */}
        {!isPreviewMode && (
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm border">
            <div className="text-sm font-medium text-gray-700">{currentPage ? currentPage.name : "Sin título"}</div>
            <div className="text-xs text-gray-500">
              {components.length} componente{components.length !== 1 ? "s" : ""}
            </div>
          </div>
        )}

        {/* Grid Background (only in edit mode) */}
        {!isPreviewMode && (
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: "20px 20px",
            }}
          />
        )}

        {/* Empty State */}
        {components.length === 0 && !isPreviewMode && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-gray-500 max-w-md">
              <div className="text-6xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Canvas vacío</h3>
              <p className="text-sm leading-relaxed">
                Arrastra componentes desde la barra lateral para comenzar a diseñar tu página. Puedes crear formularios,
                dashboards o cualquier interfaz que necesites.
              </p>
            </div>
          </div>
        )}

        {/* Components */}
        {components.map((component) => (
          <ComponentRenderer key={component.id} component={component} isPreviewMode={isPreviewMode} />
        ))}

        {/* Drop Indicator */}
        {isOver && !isPreviewMode && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">Suelta aquí el componente</div>
          </div>
        )}
      </div>
    </Card>
  )
}
