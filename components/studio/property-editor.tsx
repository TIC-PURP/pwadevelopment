"use client"
import { useStudioStore } from "@/lib/stores/useStudioStore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { X, Settings, Palette, Layout } from "lucide-react"

export function PropertyEditor() {
  const { selectedComponent, components, updateComponent, setShowPropertyEditor, showPropertyEditor } = useStudioStore()

  const component = components.find((c) => c.id === selectedComponent)

  if (!showPropertyEditor || !component) {
    return null
  }

  const handlePropChange = (key: string, value: any) => {
    updateComponent(component.id, {
      props: { ...component.props, [key]: value },
    })
  }

  const handlePositionChange = (key: "x" | "y", value: number) => {
    updateComponent(component.id, { [key]: Math.max(0, value) })
  }

  const handleSizeChange = (key: "width" | "height", value: number) => {
    updateComponent(component.id, { [key]: Math.max(key === "width" ? 50 : 30, value) })
  }

  const renderTypeSpecificProps = () => {
    switch (component.type) {
      case "text":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="content">Contenido</Label>
              <Textarea
                id="content"
                value={component.props.content || ""}
                onChange={(e) => handlePropChange("content", e.target.value)}
                placeholder="Ingresa el texto..."
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="fontSize">Tamaño</Label>
                <Select
                  value={component.props.fontSize || "14px"}
                  onValueChange={(value) => handlePropChange("fontSize", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="12px">12px</SelectItem>
                    <SelectItem value="14px">14px</SelectItem>
                    <SelectItem value="16px">16px</SelectItem>
                    <SelectItem value="18px">18px</SelectItem>
                    <SelectItem value="20px">20px</SelectItem>
                    <SelectItem value="24px">24px</SelectItem>
                    <SelectItem value="32px">32px</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="fontWeight">Peso</Label>
                <Select
                  value={component.props.fontWeight || "normal"}
                  onValueChange={(value) => handlePropChange("fontWeight", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="bold">Negrita</SelectItem>
                    <SelectItem value="lighter">Ligero</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="textAlign">Alineación</Label>
              <Select
                value={component.props.textAlign || "left"}
                onValueChange={(value) => handlePropChange("textAlign", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Izquierda</SelectItem>
                  <SelectItem value="center">Centro</SelectItem>
                  <SelectItem value="right">Derecha</SelectItem>
                  <SelectItem value="justify">Justificado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case "input":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="placeholder">Placeholder</Label>
              <Input
                id="placeholder"
                value={component.props.placeholder || ""}
                onChange={(e) => handlePropChange("placeholder", e.target.value)}
                placeholder="Texto de ayuda..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="name">Nombre del campo</Label>
              <Input
                id="name"
                value={component.props.name || ""}
                onChange={(e) => handlePropChange("name", e.target.value)}
                placeholder="nombre_campo"
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={component.props.type || "text"}
                  onValueChange={(value) => handlePropChange("type", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="password">Contraseña</SelectItem>
                    <SelectItem value="number">Número</SelectItem>
                    <SelectItem value="tel">Teléfono</SelectItem>
                    <SelectItem value="url">URL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 mt-6">
                <Switch
                  id="required"
                  checked={component.props.required || false}
                  onCheckedChange={(checked) => handlePropChange("required", checked)}
                />
                <Label htmlFor="required">Requerido</Label>
              </div>
            </div>
          </div>
        )

      case "button":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Texto del botón</Label>
              <Input
                id="text"
                value={component.props.text || ""}
                onChange={(e) => handlePropChange("text", e.target.value)}
                placeholder="Texto del botón..."
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="variant">Estilo</Label>
                <Select
                  value={component.props.variant || "default"}
                  onValueChange={(value) => handlePropChange("variant", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Primario</SelectItem>
                    <SelectItem value="secondary">Secundario</SelectItem>
                    <SelectItem value="outline">Contorno</SelectItem>
                    <SelectItem value="ghost">Fantasma</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="size">Tamaño</Label>
                <Select
                  value={component.props.size || "default"}
                  onValueChange={(value) => handlePropChange("size", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Pequeño</SelectItem>
                    <SelectItem value="default">Normal</SelectItem>
                    <SelectItem value="lg">Grande</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="onClick">Acción (JavaScript)</Label>
              <Textarea
                id="onClick"
                value={component.props.onClick || ""}
                onChange={(e) => handlePropChange("onClick", e.target.value)}
                placeholder="alert('¡Hola mundo!')"
                className="mt-1 font-mono text-sm"
              />
            </div>
          </div>
        )

      case "container":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="padding">Espaciado interno</Label>
              <Select
                value={component.props.padding || "16px"}
                onValueChange={(value) => handlePropChange("padding", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0px">Sin espaciado</SelectItem>
                  <SelectItem value="8px">Pequeño (8px)</SelectItem>
                  <SelectItem value="16px">Normal (16px)</SelectItem>
                  <SelectItem value="24px">Grande (24px)</SelectItem>
                  <SelectItem value="32px">Extra grande (32px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="borderRadius">Bordes redondeados</Label>
              <Select
                value={component.props.borderRadius || "8px"}
                onValueChange={(value) => handlePropChange("borderRadius", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0px">Sin redondeo</SelectItem>
                  <SelectItem value="4px">Pequeño (4px)</SelectItem>
                  <SelectItem value="8px">Normal (8px)</SelectItem>
                  <SelectItem value="12px">Grande (12px)</SelectItem>
                  <SelectItem value="16px">Extra grande (16px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      default:
        return <div className="text-gray-500">No hay propiedades específicas para este componente.</div>
    }
  }

  return (
    <Card className="w-80 h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings size={18} />
            Propiedades
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowPropertyEditor(false)}>
            <X size={16} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Component Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="text-sm font-medium text-gray-700 capitalize">{component.type}</div>
          <div className="text-xs text-gray-500">ID: {component.id.slice(-8)}</div>
        </div>

        {/* Position & Size */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Layout size={16} />
            <Label className="font-medium">Posición y Tamaño</Label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="x" className="text-xs">
                X
              </Label>
              <Input
                id="x"
                type="number"
                value={component.x}
                onChange={(e) => handlePositionChange("x", Number.parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="y" className="text-xs">
                Y
              </Label>
              <Input
                id="y"
                type="number"
                value={component.y}
                onChange={(e) => handlePositionChange("y", Number.parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="width" className="text-xs">
                Ancho
              </Label>
              <Input
                id="width"
                type="number"
                value={component.width}
                onChange={(e) => handleSizeChange("width", Number.parseInt(e.target.value) || 50)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-xs">
                Alto
              </Label>
              <Input
                id="height"
                type="number"
                value={component.height}
                onChange={(e) => handleSizeChange("height", Number.parseInt(e.target.value) || 30)}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Appearance */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Palette size={16} />
            <Label className="font-medium">Apariencia</Label>
          </div>
          <div className="space-y-3">
            <div>
              <Label htmlFor="color" className="text-xs">
                Color de texto
              </Label>
              <Input
                id="color"
                type="color"
                value={component.props.color || "#333333"}
                onChange={(e) => handlePropChange("color", e.target.value)}
                className="mt-1 h-10"
              />
            </div>
            <div>
              <Label htmlFor="backgroundColor" className="text-xs">
                Color de fondo
              </Label>
              <Input
                id="backgroundColor"
                type="color"
                value={component.props.backgroundColor || "#ffffff"}
                onChange={(e) => handlePropChange("backgroundColor", e.target.value)}
                className="mt-1 h-10"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Type-specific properties */}
        <div>
          <Label className="font-medium">Propiedades específicas</Label>
          <div className="mt-3">{renderTypeSpecificProps()}</div>
        </div>
      </CardContent>
    </Card>
  )
}
