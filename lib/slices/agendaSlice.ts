import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface EventoAgenda {
  id: string
  titulo: string
  descripcion: string
  fecha: string
  hora: string
  categoria: string
  completado: boolean
  recordatorio: boolean
}

interface AgendaState {
  eventos: EventoAgenda[]
  loading: boolean
}

const initialState: AgendaState = {
  eventos: [
    {
      id: "1",
      titulo: "COMPRAR CANALETA GRANDE",
      descripcion: "Adquirir canaleta para sistema de riego",
      fecha: new Date().toISOString().split("T")[0],
      hora: "09:00",
      categoria: "Visita de seguimiento",
      completado: false,
      recordatorio: true,
    },
    {
      id: "2",
      titulo: "Carta de responsabilidad",
      descripcion: "Elaborar carta de responsabilidad para nuevo productor",
      fecha: new Date().toISOString().split("T")[0],
      hora: "14:30",
      categoria: "Cita de trabajo",
      completado: false,
      recordatorio: true,
    },
    {
      id: "3",
      titulo: "Visita técnica - Finca El Paraíso",
      descripcion: "Inspección técnica programada",
      fecha: new Date().toISOString().split("T")[0],
      hora: "10:00",
      categoria: "Asesoría técnica",
      completado: false,
      recordatorio: true,
    },
  ],
  loading: false,
}

const agendaSlice = createSlice({
  name: "agenda",
  initialState,
  reducers: {
    addEvento: (state, action: PayloadAction<EventoAgenda>) => {
      state.eventos.push(action.payload)
    },
    updateEvento: (state, action: PayloadAction<EventoAgenda>) => {
      const index = state.eventos.findIndex((e) => e.id === action.payload.id)
      if (index !== -1) {
        state.eventos[index] = action.payload
      }
    },
    deleteEvento: (state, action: PayloadAction<string>) => {
      state.eventos = state.eventos.filter((e) => e.id !== action.payload)
    },
    toggleCompletado: (state, action: PayloadAction<string>) => {
      const evento = state.eventos.find((e) => e.id === action.payload)
      if (evento) {
        evento.completado = !evento.completado
      }
    },
  },
})

export const { addEvento, updateEvento, deleteEvento, toggleCompletado } = agendaSlice.actions
export default agendaSlice.reducer
