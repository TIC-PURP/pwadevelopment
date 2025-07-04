"use client"

import type React from "react"
import { useDraggable } from "@dnd-kit/core"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Type, Square, MousePointer, Container, Plus, FileText, Folder } from "lucide-react"
import { useStudioStore } from "@/lib/stores/useStudioStore"

interface DraggableComponentProps {
  id: string
  type: "text" | "input" | "button" | "container"
  icon: React.ReactNode
  label: string
  description: string
}

function DraggableComponent({ id, type, icon, label, description }: DraggableComponentProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    data: { type },
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        group flex flex-col gap-2 p-4 bg-white border-2 border-dashed border-gray-300 
        rounded-lg cursor-grab hover:border-blue-400 hover:bg-blue-50 transition-all duration-200
        ${isDragging ? "opacity-50 cursor-grabbing shadow-lg" : "hover:shadow-md"}
      `}
    >
      <div className="flex items-center gap-3">
        <div className="text-gray-600 group-hover:text-blue-600 transition-colors">{icon}</div>
        <div className="flex-1">
          <div className="font-medium text-gray-800 text-sm">{label}</div>
          <div className="text-xs text-gray-500">{description}</div>
        </div>
      </div>
    </div>
  )
}

export function Sidebar() {
  const { savedPages, createNewPage, loadPage, currentPage } = useStudioStore()

  const components = [
    {
      id: "text",
      type: "text" as const,
      icon: <Type size={20} />,
      label: "Texto",
      description: "Etiqueta o párrafo",
    },
    {
      id: "input",
      type: "input" as const,
      icon: <Square size={20} />,
      label: "Campo de texto",
      description: "Input para datos",
    },
    {
      id: "button",
      type: "button" as const,
      icon: <MousePointer size={20} />,
      label: "Botón",
      description: "Acción o envío",
    },
    {
      id: "container",
      type: "container" as const,
      icon: <Container size={20} />,
      label: "Contenedor",
      description: "Agrupa elementos",
    },
  ]

  const handleCreateNewPage = () => {
    const name = prompt("Nombre de la nueva página:")
    if (name) {
      const slug = name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
      createNewPage(name, slug)
    }
  }

  return (
    <div className="w-80 h-full flex flex-col gap-4">
      {/* Page Management */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Folder size={18} />
            Páginas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={handleCreateNewPage} className="w-full justify-start bg-transparent" variant="outline">
            <Plus size={16} className="mr-2" />
            Nueva Página
          </Button>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {savedPages.map((page) => (
              <div
                key={page.id}
                className={`
                  p-3 rounded-lg border cursor-pointer transition-colors
                  ${
                    currentPage?.id === page.id
                      ? "bg-blue-50 border-blue-300"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }
                `}
                onClick={() => loadPage(page.id)}
              >
                <div className="flex items-center gap-2">
                  <FileText size={14} />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{page.name}</div>
                    <div className="text-xs text-gray-500">{page.components.length} componentes</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {savedPages.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">No hay páginas guardadas</div>
          )}
        </CardContent>
      </Card>

      {/* Components */}
      <Card className="flex-1">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Componentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">Arrastra los componentes al canvas para crear tu diseño</p>
          {components.map((component) => (
            <DraggableComponent
              key={component.id}
              id={component.id}
              type={component.type}
              icon={component.icon}
              label={component.label}
              description={component.description}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
