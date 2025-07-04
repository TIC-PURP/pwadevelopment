"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useStudioStore, type StudioComponent } from "@/lib/stores/useStudioStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { X, Edit3, Copy, GripHorizontal } from "lucide-react"

interface ComponentRendererProps {
  component: StudioComponent
  isPreviewMode: boolean
}

export function ComponentRenderer({ component, isPreviewMode }: ComponentRendererProps) {
  const {
    selectedComponent,
    selectComponent,
    deleteComponent,
    updateComponent,
    moveComponent,
    resizeComponent,
    duplicateComponent,
  } = useStudioStore()

  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(component.props.content || component.props.text || "")
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, mouseX: 0, mouseY: 0 })

  const componentRef = useRef<HTMLDivElement>(null)
  const isSelected = selectedComponent === component.id && !isPreviewMode

  // Handle component dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPreviewMode || isEditing) return

    e.preventDefault()
    e.stopPropagation()

    setIsDragging(true)
    setDragStart({
      x: e.clientX - component.x,
      y: e.clientY - component.y,
    })
    selectComponent(component.id)
  }

  // Handle component resizing
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    if (isPreviewMode) return

    e.preventDefault()
    e.stopPropagation()

    setIsResizing(true)
    setResizeStart({
      width: component.width,
      height: component.height,
      mouseX: e.clientX,
      mouseY: e.clientY,
    })
  }

  // Mouse move handler for dragging and resizing
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = Math.max(0, e.clientX - dragStart.x)
      const newY = Math.max(0, e.clientY - dragStart.y)
      moveComponent(component.id, newX, newY)
    } else if (isResizing) {
      const deltaX = e.clientX - resizeStart.mouseX
      const deltaY = e.clientY - resizeStart.mouseY
      const newWidth = Math.max(50, resizeStart.width + deltaX)
      const newHeight = Math.max(30, resizeStart.height + deltaY)
      resizeComponent(component.id, newWidth, newHeight)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, isResizing, dragStart, resizeStart])

  // Handle content editing
  const handleSaveEdit = () => {
    const propKey = component.type === "button" ? "text" : "content"
    updateComponent(component.id, {
      props: { ...component.props, [propKey]: editContent },
    })
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditContent(component.props.content || component.props.text || "")
    setIsEditing(false)
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!isPreviewMode && !isEditing) {
      selectComponent(component.id)
    }
  }

  const renderComponent = () => {
    const baseStyles: React.CSSProperties = {
      width: component.width,
      height: component.type === "container" ? component.height : "auto",
      minHeight: component.type === "container" ? component.height : "auto",
      fontSize: component.props.fontSize || "14px",
      color: component.props.color || "#333333",
      backgroundColor: component.props.backgroundColor || "transparent",
      padding: component.props.padding || "8px",
      borderRadius: component.props.borderRadius || "4px",
      border: component.props.border || "none",
      textAlign: component.props.textAlign || "left",
      fontWeight: component.props.fontWeight || "normal",
    }

    switch (component.type) {
      case "text":
        return isEditing ? (
          <div className="space-y-2 p-2 bg-white border rounded shadow-lg">
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full min-h-[80px]"
              autoFocus
              placeholder="Ingresa tu texto..."
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleSaveEdit}>
                Guardar
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div style={baseStyles} className="whitespace-pre-wrap break-words">
            {component.props.content || "Texto vacío"}
          </div>
        )

      case "input":
        return (
          <Input
            placeholder={component.props.placeholder || "Ingresa texto..."}
            type={component.props.type || "text"}
            required={component.props.required || false}
            name={component.props.name || "input_field"}
            style={baseStyles}
            disabled={!isPreviewMode}
            className={!isPreviewMode ? "cursor-pointer" : ""}
          />
        )

      case "button":
        const buttonVariant =
          component.props.variant === "secondary"
            ? "secondary"
            : component.props.variant === "outline"
              ? "outline"
              : "default"

        return (
          <Button
            style={baseStyles}
            variant={buttonVariant}
            size={component.props.size || "default"}
            disabled={!isPreviewMode}
            className={!isPreviewMode ? "cursor-pointer" : ""}
            onClick={isPreviewMode ? () => eval(component.props.onClick || "") : undefined}
          >
            {component.props.text || "Botón"}
          </Button>
        )

      case "container":
        return (
          <div style={baseStyles} className="relative overflow-hidden">
            {!isPreviewMode && (
              <div className="absolute top-2 left-2 text-xs text-gray-500 bg-white/80 px-2 py-1 rounded">
                Contenedor
              </div>
            )}
            {component.children &&
              component.children.map((child) => (
                <ComponentRenderer key={child.id} component={child} isPreviewMode={isPreviewMode} />
              ))}
          </div>
        )

      default:
        return <div className="p-2 bg-red-100 text-red-600 rounded">Componente desconocido: {component.type}</div>
    }
  }

  return (
    <div
      ref={componentRef}
      className={`
        absolute select-none group
        ${!isPreviewMode ? "hover:ring-2 hover:ring-blue-300" : ""}
        ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}
        ${isDragging ? "z-50 cursor-grabbing" : !isPreviewMode ? "cursor-grab" : ""}
        ${isResizing ? "cursor-nw-resize" : ""}
      `}
      style={{
        left: component.x,
        top: component.y,
        width: component.width,
        zIndex: isSelected ? 10 : 1,
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      {renderComponent()}

      {/* Selection Controls */}
      {isSelected && !isEditing && (
        <>
          {/* Action Buttons */}
          <div className="absolute -top-10 -right-2 flex gap-1 bg-white shadow-lg rounded-lg p-1 border">
            {(component.type === "text" || component.type === "button") && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                  setEditContent(component.props.content || component.props.text || "")
                }}
                title="Editar contenido"
              >
                <Edit3 size={12} />
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                duplicateComponent(component.id)
              }}
              title="Duplicar"
            >
              <Copy size={12} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
              onClick={(e) => {
                e.stopPropagation()
                deleteComponent(component.id)
              }}
              title="Eliminar"
            >
              <X size={12} />
            </Button>
          </div>

          {/* Resize Handle */}
          <div
            className="absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded cursor-nw-resize shadow-lg hover:bg-blue-600"
            onMouseDown={handleResizeMouseDown}
            title="Redimensionar"
          >
            <GripHorizontal size={8} className="text-white" />
          </div>

          {/* Position Indicator */}
          <div className="absolute -top-6 left-0 text-xs text-gray-500 bg-white/90 px-2 py-1 rounded shadow">
            {component.x}, {component.y}
          </div>
        </>
      )}
    </div>
  )
}
