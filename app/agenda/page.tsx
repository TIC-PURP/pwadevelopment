"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/lib/hooks"
import { Plus, ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import Link from "next/link"

export default function AgendaPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { eventos } = useAppSelector((state) => state.agenda)

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

  const dayNames = ["LUN", "MAR", "MIE", "JUE", "VIE", "SAB", "DOM"]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7 // Adjust for Monday start

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const days = getDaysInMonth(currentDate)
  const today = new Date().getDate()
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const isCurrentMonth = currentDate.getMonth() === currentMonth && currentDate.getFullYear() === currentYear

  const eventosHoy = eventos.filter((evento) => evento.fecha === new Date().toISOString().split("T")[0])

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case "Visita de seguimiento":
        return "bg-emerald-500"
      case "Negociación":
        return "bg-orange-500"
      case "Cita de trabajo":
        return "bg-violet-500"
      case "Asesoría técnica":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header moderno con gradiente */}
      <header className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 text-white px-4 py-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-white hover:bg-white/10 rounded-full p-2"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-200" />
              <h1 className="text-xl font-bold">Mi Agenda</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-6">
        {/* Tarjeta del calendario */}
        <Card className="mb-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            {/* Navegación del calendario */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth("prev")}
                className="hover:bg-gray-100 rounded-full p-2"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </Button>

              <h2 className="text-2xl font-bold text-gray-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth("next")}
                className="hover:bg-gray-100 rounded-full p-2"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </Button>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendario */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`
                    aspect-square flex items-center justify-center text-sm rounded-xl transition-all duration-200
                    ${day ? "hover:bg-gray-100 cursor-pointer text-gray-700" : ""}
                    ${day === today && isCurrentMonth ? "bg-gradient-to-br from-blue-400 to-blue-500 text-white font-bold shadow-md" : ""}
                    ${day === 25 ? "bg-gradient-to-br from-amber-400 to-amber-500 text-white font-bold shadow-md" : ""}
                    ${day && day !== today && day !== 25 ? "hover:scale-105" : ""}
                  `}
                >
                  {day}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sección de eventos */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full"></div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Eventos de Hoy</h3>
          </div>

          {eventosHoy.map((evento) => (
            <Card
              key={evento.id}
              className="hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm hover:scale-[1.02]"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-1.5 h-16 ${getCategoryColor(evento.categoria)} rounded-full shadow-sm`}></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {evento.categoria.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-400">{evento.hora}</span>
                    </div>
                    <h4 className="text-base font-semibold text-gray-800 mb-1">{evento.titulo}</h4>
                    <p className="text-sm text-gray-600 mb-2">{evento.descripcion}</p>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 ${getCategoryColor(evento.categoria)} rounded-full`}></div>
                      <span className="text-xs text-gray-500">
                        {evento.recordatorio ? "Recordatorio activo" : "Sin recordatorio"}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {eventosHoy.length === 0 && (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h4 className="font-medium text-gray-900 mb-2">No hay eventos para hoy</h4>
              <p className="text-sm text-gray-600 mb-4">Crea un nuevo evento para organizar tu día</p>
              <Link href="/agenda/nuevo">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Evento
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Botón flotante moderno */}
        <Link href="/agenda/nuevo">
          <Button
            size="lg"
            className="fixed bottom-6 right-6 rounded-full w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
          >
            <Plus className="h-7 w-7" />
          </Button>
        </Link>
      </main>
    </div>
  )
}
