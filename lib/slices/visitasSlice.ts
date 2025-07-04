import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface VisitaCompleta {
  id: string
  productorId: string
  productorNombre: string
  fecha: string
  ciclo: string
  tipoVisita: "Comercial" | "Inspección Técnica"
  cultivos: string[]
  hectareas?: number
  hectareasPotenciales?: number
  hectareasProspectadas?: number
  asunto: string
  tipoContacto: string
  duracionVisita?: string
  generoVenta: boolean
  queSeVendio?: string
  productos?: string
  anotaciones: string
  proximaActividad: {
    asunto: string
    fecha: string
  }
  fotos: string[]
  sincronizado: boolean
}

export interface Visita {
  id: string
  productorId: string
  productorNombre: string
  cultivo: string
  predio: string
  localidad: string
  superficieTotal: number
  superficieHabilitada: number
  tipoRiego: string
  disponibilidadAgua: string
  estadoFenologico: string
  plagas: string
  enfermedades: string
  observaciones: string
  coordenadas: {
    lat: number
    lng: number
  } | null
  firmasTecnico: string | null
  firmasProductor: string | null
  foto: string | null
  fecha: string
  sincronizado: boolean
}

interface VisitasState {
  visitas: Visita[]
  visitasCompletas: VisitaCompleta[]
  loading: boolean
  currentVisita: Visita | null
  currentVisitaCompleta: VisitaCompleta | null
}

const initialState: VisitasState = {
  visitas: [],
  visitasCompletas: [
    {
      id: "1",
      productorId: "1",
      productorNombre: "Juan Pérez García",
      fecha: "2025-01-28",
      ciclo: "012425",
      tipoVisita: "Comercial",
      cultivos: ["MAÍZ", "FRIJOL"],
      hectareasPotenciales: 50,
      hectareasProspectadas: 47,
      asunto: "VISITA DE SEGUIMIENTO",
      tipoContacto: "VISITA EN PREDIO",
      generoVenta: false,
      anotaciones: "Visita de seguimiento exitosa. El productor muestra interés en nuevos productos.",
      proximaActividad: {
        asunto: "CIERRE DE VENTA",
        fecha: "2025-02-15",
      },
      fotos: [],
      sincronizado: true,
    },
    {
      id: "2",
      productorId: "1",
      productorNombre: "Juan Pérez García",
      fecha: "2025-04-28",
      ciclo: "012425",
      tipoVisita: "Comercial",
      cultivos: ["SORGO"],
      hectareasPotenciales: 30,
      hectareasProspectadas: 30,
      asunto: "CIERRE DE VENTA",
      tipoContacto: "VISITA EN OFICINA PURP",
      generoVenta: true,
      queSeVendio: "AGROQUÍMICO",
      productos: "TORDON 2,4-D",
      anotaciones: "Venta exitosa de agroquímicos. Cliente satisfecho con el servicio.",
      proximaActividad: {
        asunto: "POST-VENTA",
        fecha: "2025-05-15",
      },
      fotos: [],
      sincronizado: true,
    },
    {
      id: "3",
      productorId: "1",
      productorNombre: "Juan Pérez García",
      fecha: "2025-06-16",
      ciclo: "012425",
      tipoVisita: "Inspección Técnica",
      cultivos: ["GARBANZO"],
      hectareas: 25,
      asunto: "ASESORÍA TÉCNICA",
      tipoContacto: "VISITA EN PREDIO",
      duracionVisita: "3 Hrs",
      generoVenta: false,
      anotaciones: "Inspección técnica completa. Se identificaron oportunidades de mejora en el sistema de riego.",
      proximaActividad: {
        asunto: "SUPERVISIÓN",
        fecha: "2025-07-01",
      },
      fotos: [],
      sincronizado: false,
    },
  ],
  loading: false,
  currentVisita: null,
  currentVisitaCompleta: null,
}

const visitasSlice = createSlice({
  name: "visitas",
  initialState,
  reducers: {
    addVisita: (state, action: PayloadAction<Visita>) => {
      state.visitas.push(action.payload)
    },
    addVisitaCompleta: (state, action: PayloadAction<VisitaCompleta>) => {
      state.visitasCompletas.push(action.payload)
    },
    updateVisita: (state, action: PayloadAction<Visita>) => {
      const index = state.visitas.findIndex((v) => v.id === action.payload.id)
      if (index !== -1) {
        state.visitas[index] = action.payload
      }
    },
    updateVisitaCompleta: (state, action: PayloadAction<VisitaCompleta>) => {
      const index = state.visitasCompletas.findIndex((v) => v.id === action.payload.id)
      if (index !== -1) {
        state.visitasCompletas[index] = action.payload
      }
    },
    deleteVisita: (state, action: PayloadAction<string>) => {
      state.visitas = state.visitas.filter((v) => v.id !== action.payload)
      state.visitasCompletas = state.visitasCompletas.filter((v) => v.id !== action.payload)
    },
    setCurrentVisita: (state, action: PayloadAction<Visita | null>) => {
      state.currentVisita = action.payload
    },
    setCurrentVisitaCompleta: (state, action: PayloadAction<VisitaCompleta | null>) => {
      state.currentVisitaCompleta = action.payload
    },
    markAsSincronizado: (state, action: PayloadAction<string>) => {
      const visita = state.visitas.find((v) => v.id === action.payload)
      if (visita) {
        visita.sincronizado = true
      }
      const visitaCompleta = state.visitasCompletas.find((v) => v.id === action.payload)
      if (visitaCompleta) {
        visitaCompleta.sincronizado = true
      }
    },
    markAllAsSincronizado: (state) => {
      state.visitas.forEach((visita) => {
        visita.sincronizado = true
      })
      state.visitasCompletas.forEach((visita) => {
        visita.sincronizado = true
      })
    },
    setVisitas: (state, action: PayloadAction<VisitasState>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const {
  addVisita,
  addVisitaCompleta,
  updateVisita,
  updateVisitaCompleta,
  deleteVisita,
  setCurrentVisita,
  setCurrentVisitaCompleta,
  markAsSincronizado,
  markAllAsSincronizado,
  setVisitas,
} = visitasSlice.actions
export default visitasSlice.reducer
