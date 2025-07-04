"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAppDispatch } from "@/lib/hooks"
import { addEvento } from "@/lib/slices/agendaSlice"
import { useToast } from "@/hooks/use-toast"
import type { EventoAgenda } from "@/lib/slices/agendaSlice"
import { ChevronLeft, ChevronRight, Calendar, Clock, Save } from "lucide-react"

export default function NuevoEventoPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedCategory, setSelectedCategory] = useState("")
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    hora: "09:00",
  })

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const categories = [
    { name: "Visita de seguimiento", color: "bg-yellow-400 hover:bg-yellow-500", textColor: "text-yellow-800" },
    { name: "Negociación", color: "bg-orange-400 hover:bg-orange-500", textColor: "text-orange-800" },
    { name: "Cita de trabajo", color: "bg-blue-400 hover:bg-blue-500", textColor: "text-blue-800" },
    { name: "Asesoría técnica", color: "bg-emerald-400 hover:bg-emerald-500", textColor: "text-emerald-800" },
    { name: "Otro", color: "bg-gray-400 hover:bg-gray-500", textColor: "text-gray-800" },
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7

    const days = []
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }
    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const selectDay = (day: number) => {
    const newDate = new Date(selectedDate)
    newDate.setDate(day)
    setSelectedDate(newDate)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (!formData.titulo || !selectedCategory) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa el título y selecciona una categoría",
        variant: "destructive",
      })
      return
    }

    const evento: EventoAgenda = {
      id: Date.now().toString(),
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      fecha: selectedDate.toISOString().split("T")[0],
      hora: formData.hora,
      categoria: selectedCategory,
      completado: false,
      recordatorio: true,
    }

    dispatch(addEvento(evento))

    toast({
      title: "Evento creado",
      description: "El evento se ha guardado correctamente en tu agenda",
    })

    router.push("/agenda")
  }

  const days = getDaysInMonth(selectedDate)
  const today = new Date().getDate()
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const isCurrentMonth = selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header title="Nuevo Evento" showBack />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Calendario compacto */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-gray-800">Seleccionar Fecha</h3>
              </div>

              {/* Navegación del mes */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("prev")}
                  className="hover:bg-gray-100 rounded-full p-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h4 className="font-semibold text-gray-700">
                  {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth("next")}
                  className="hover:bg-gray-100 rounded-full p-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Mini calendario */}
              <div className="grid grid-cols-7 gap-1 text-xs">
                {["L", "M", "M", "J", "V", "S", "D"].map((day) => (
                  <div key={day} className="text-center font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
                {days.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => day && selectDay(day)}
                    className={`
                      aspect-square flex items-center justify-center text-sm rounded-lg transition-all
                      ${day ? "hover:bg-gray-100 cursor-pointer" : ""}
                      ${day === selectedDate.getDate() ? "bg-gradient-to-br from-blue-400 to-blue-500 text-white font-bold" : ""}
                      ${day === today && isCurrentMonth && day !== selectedDate.getDate() ? "bg-amber-100 text-amber-700 font-medium" : ""}
                    `}
                  >
                    {day}
                  </button>
                ))}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Fecha seleccionada:</strong> {selectedDate.toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Formulario del evento */}
          <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="titulo" className="text-sm font-medium text-gray-700">
                    Título del Evento *
                  </Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => handleInputChange("titulo", e.target.value)}
                    placeholder="Ej: Visita técnica a Finca El Paraíso"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="hora" className="text-sm font-medium text-gray-700">
                    Hora
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <Input
                      id="hora"
                      type="time"
                      value={formData.hora}
                      onChange={(e) => handleInputChange("hora", e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">Categoría *</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category.name}
                        variant={selectedCategory === category.name ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.name)}
                        className={`
                          ${
                            selectedCategory === category.name
                              ? `${category.color} ${category.textColor} border-0`
                              : "hover:bg-gray-50"
                          }
                          transition-all duration-200
                        `}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
                    Descripción
                  </Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange("descripcion", e.target.value)}
                    placeholder="Escribe comentarios del evento..."
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botón crear evento */}
          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <Save className="h-5 w-5 mr-2" />
            Crear Evento
          </Button>
        </div>
      </main>
    </div>
  )
}
