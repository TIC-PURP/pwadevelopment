import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Prospecto {
  id: string
  nombre: string
  empresa: string
  telefono: string
  email: string
  ubicacion: string
  estado: "Contacto inicial" | "Propuesta enviada" | "Seguimiento" | "Cerrado" | "Perdido"
  prioridad: "Alta" | "Media" | "Baja"
  ultimoContacto: string
  cultivos: string[]
  notas: string
  fechaCreacion: string
}

interface ProspectosState {
  prospectos: Prospecto[]
  loading: boolean
  currentProspecto: Prospecto | null
}

const initialState: ProspectosState = {
  prospectos: [
    {
      id: "1",
      nombre: "Carlos Rodríguez",
      empresa: "Finca El Paraíso",
      telefono: "+57 320 456 7890",
      email: "carlos.rodriguez@email.com",
      ubicacion: "Vereda La Esperanza",
      estado: "Contacto inicial",
      prioridad: "Alta",
      ultimoContacto: "2024-12-20",
      cultivos: ["Frijol", "Maíz"],
      notas: "Interesado en asesoría técnica para cultivo de frijol",
      fechaCreacion: "2024-12-15",
    },
    {
      id: "2",
      nombre: "Ana María López",
      empresa: "Cultivos San José",
      telefono: "+57 315 789 0123",
      email: "ana.lopez@email.com",
      ubicacion: "Municipio Verde",
      estado: "Propuesta enviada",
      prioridad: "Media",
      ultimoContacto: "2024-12-18",
      cultivos: ["Sorgo", "Garbanzo"],
      notas: "Propuesta enviada para programa de mejoramiento de suelos",
      fechaCreacion: "2024-12-10",
    },
    {
      id: "3",
      nombre: "Miguel Torres",
      empresa: "Hacienda Los Robles",
      telefono: "+57 301 234 5678",
      email: "miguel.torres@email.com",
      ubicacion: "Vereda El Progreso",
      estado: "Seguimiento",
      prioridad: "Baja",
      ultimoContacto: "2024-12-15",
      cultivos: ["Maíz", "Frijol"],
      notas: "En proceso de evaluación de propuesta",
      fechaCreacion: "2024-12-05",
    },
  ],
  loading: false,
  currentProspecto: null,
}

const prospectosSlice = createSlice({
  name: "prospectos",
  initialState,
  reducers: {
    addProspecto: (state, action: PayloadAction<Prospecto>) => {
      state.prospectos.push(action.payload)
    },
    updateProspecto: (state, action: PayloadAction<Prospecto>) => {
      const index = state.prospectos.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.prospectos[index] = action.payload
      }
    },
    deleteProspecto: (state, action: PayloadAction<string>) => {
      state.prospectos = state.prospectos.filter((p) => p.id !== action.payload)
    },
    setCurrentProspecto: (state, action: PayloadAction<Prospecto | null>) => {
      state.currentProspecto = action.payload
    },
  },
})

export const { addProspecto, updateProspecto, deleteProspecto, setCurrentProspecto } = prospectosSlice.actions
export default prospectosSlice.reducer
