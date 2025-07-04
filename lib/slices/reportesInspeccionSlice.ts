import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface RecomendacionQuimica {
  id: string
  producto: string
  dosis: string
  metodo: string
}

export interface InformeTecnico {
  id: string
  reporteId: string
  numeroInspeccion: number
  fechaElaboracion: string
  datosGenerales: {
    fecha: string
    ciclo: string
    productor: string
    ubicacion: string
    cultivo: string
    superficie: string
  }
  siembra: {
    fechaSiembra: string
    variedad: string
    metodo: string
    densidad: string
    marcaAnchoSurco: string
    poblacion: string
    fertilizacionInicial: string
  }
  desarrolloVegetativo: {
    altura: string
    numeroHojas: string
    cultivos: string
  }
  laboresCulturales: {
    numeroRiegos: string
    limpiasManuales: string
    humedad: string
  }
  aspectosGenerales: {
    aspectoGeneral: string
    maleza: string
    plagas: string
    enfermedades: string
  }
  recomendaciones: {
    culturales: string
    quimicas: RecomendacionQuimica[]
  }
  evidenciasFotograficas: string[]
  proximaVisita: string
  createdAt: string
  updatedAt: string
}

export interface ReporteInspeccion {
  id: string
  productorId: string
  ciclo: string
  superficie: string
  ubicacion: string
  cultivo: string
  fechaSiembra: string
  informesRealizados: number
  ultimoInforme: string
  siguienteVisita: string
  createdAt: string
  updatedAt: string
}

interface ReportesInspeccionState {
  reportes: ReporteInspeccion[]
  informes: InformeTecnico[]
  loading: boolean
  error: string | null
}

const initialState: ReportesInspeccionState = {
  reportes: [
    {
      id: "reporte-1",
      productorId: "1",
      ciclo: "012425",
      superficie: "15000-00-00",
      ubicacion: "GUASAVE",
      cultivo: "GARBANZO",
      fechaSiembra: "25/6/2025",
      informesRealizados: 2,
      ultimoInforme: "25/06/2025",
      siguienteVisita: "25/06/2025",
      createdAt: "2025-06-25T10:00:00Z",
      updatedAt: "2025-06-25T10:00:00Z",
    },
    {
      id: "reporte-2",
      productorId: "1",
      ciclo: "012425",
      superficie: "25000-00-00",
      ubicacion: "PINITOS",
      cultivo: "MAIZ",
      fechaSiembra: "1/6/2025",
      informesRealizados: 1,
      ultimoInforme: "24/06/2025",
      siguienteVisita: "24/06/2025",
      createdAt: "2025-06-01T10:00:00Z",
      updatedAt: "2025-06-24T10:00:00Z",
    },
  ],
  informes: [
    {
      id: "informe-1",
      reporteId: "reporte-1",
      numeroInspeccion: 1,
      fechaElaboracion: "24/06/2025",
      datosGenerales: {
        fecha: "24/06/2025",
        ciclo: "012425",
        productor: "CARLOS EDUARDO ZAMORA SALCEDO",
        ubicacion: "GUASAVE",
        cultivo: "GARBANZO",
        superficie: "15000-00-00",
      },
      siembra: {
        fechaSiembra: "25/6/2025",
        variedad: "Jumbo",
        metodo: "Tradicional",
        densidad: "258 Sem/Mts",
        marcaAnchoSurco: "76 Cm",
        poblacion: "3,379 Ptas/Ha",
        fertilizacionInicial: "DAP",
      },
      desarrolloVegetativo: {
        altura: "145",
        numeroHojas: "87",
        cultivos: "1",
      },
      laboresCulturales: {
        numeroRiegos: "2do Auxilio",
        limpiasManuales: "2",
        humedad: "Regular",
      },
      aspectosGenerales: {
        aspectoGeneral: "Bueno",
        maleza: "Libre",
        plagas: "Libre",
        enfermedades: "Libre",
      },
      recomendaciones: {
        culturales: "Continuar con el programa de riego establecido",
        quimicas: [],
      },
      evidenciasFotograficas: [],
      proximaVisita: "01/07/2025",
      createdAt: "2025-06-24T10:00:00Z",
      updatedAt: "2025-06-24T10:00:00Z",
    },
    {
      id: "informe-2",
      reporteId: "reporte-1",
      numeroInspeccion: 2,
      fechaElaboracion: "24/06/2025",
      datosGenerales: {
        fecha: "24/06/2025",
        ciclo: "012425",
        productor: "CARLOS EDUARDO ZAMORA SALCEDO",
        ubicacion: "GUASAVE",
        cultivo: "GARBANZO",
        superficie: "15000-00-00",
      },
      siembra: {
        fechaSiembra: "25/6/2025",
        variedad: "Jumbo",
        metodo: "Tradicional",
        densidad: "258 Sem/Mts",
        marcaAnchoSurco: "76 Cm",
        poblacion: "3,379 Ptas/Ha",
        fertilizacionInicial: "DAP",
      },
      desarrolloVegetativo: {
        altura: "150",
        numeroHojas: "92",
        cultivos: "1",
      },
      laboresCulturales: {
        numeroRiegos: "3er Auxilio",
        limpiasManuales: "3",
        humedad: "Buena",
      },
      aspectosGenerales: {
        aspectoGeneral: "Excelente",
        maleza: "Libre",
        plagas: "Libre",
        enfermedades: "Libre",
      },
      recomendaciones: {
        culturales: "Mantener programa de fertilización",
        quimicas: [],
      },
      evidenciasFotograficas: [],
      proximaVisita: "08/07/2025",
      createdAt: "2025-06-24T14:00:00Z",
      updatedAt: "2025-06-24T14:00:00Z",
    },
  ],
  loading: false,
  error: null,
}

const reportesInspeccionSlice = createSlice({
  name: "reportesInspeccion",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    addReporte: (state, action: PayloadAction<ReporteInspeccion>) => {
      state.reportes.push(action.payload)
    },
    updateReporte: (state, action: PayloadAction<ReporteInspeccion>) => {
      const index = state.reportes.findIndex((r) => r.id === action.payload.id)
      if (index !== -1) {
        state.reportes[index] = action.payload
      }
    },
    deleteReporte: (state, action: PayloadAction<string>) => {
      state.reportes = state.reportes.filter((r) => r.id !== action.payload)
      state.informes = state.informes.filter((i) => i.reporteId !== action.payload)
    },
    addInforme: (state, action: PayloadAction<InformeTecnico>) => {
      state.informes.push(action.payload)
      // Actualizar contador de informes en el reporte
      const reporte = state.reportes.find((r) => r.id === action.payload.reporteId)
      if (reporte) {
        reporte.informesRealizados += 1
        reporte.ultimoInforme = action.payload.fechaElaboracion
        reporte.updatedAt = new Date().toISOString()
      }
    },
    updateInforme: (state, action: PayloadAction<InformeTecnico>) => {
      const index = state.informes.findIndex((i) => i.id === action.payload.id)
      if (index !== -1) {
        state.informes[index] = action.payload
      }
    },
    deleteInforme: (state, action: PayloadAction<string>) => {
      const informe = state.informes.find((i) => i.id === action.payload)
      if (informe) {
        state.informes = state.informes.filter((i) => i.id !== action.payload)
        // Actualizar contador de informes en el reporte
        const reporte = state.reportes.find((r) => r.id === informe.reporteId)
        if (reporte && reporte.informesRealizados > 0) {
          reporte.informesRealizados -= 1
          reporte.updatedAt = new Date().toISOString()
        }
      }
    },
  },
})

export const {
  setLoading,
  setError,
  addReporte,
  updateReporte,
  deleteReporte,
  addInforme,
  updateInforme,
  deleteInforme,
} = reportesInspeccionSlice.actions

export default reportesInspeccionSlice.reducer
