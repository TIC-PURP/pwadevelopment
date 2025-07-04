import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Coordinate {
  lat: number
  lng: number
}

export interface DictamenTecnico {
  id: string
  productorId: string
  productorNombre: string
  ciclo: string
  fecha: string
  ubicacion: string
  tipoTenencia: string
  predioRentado: string
  propietarioPredio: string
  cultivoSolicitado: string
  superficie: string
  plazoCultivo: string
  sistemaRiego: string
  unidadModulo: string
  metodoRiego: string
  topografia: string
  profundidad: string
  textura: string
  cultivoAnterior: string
  infestacionMalezas: string
  avanceLabores: {
    subsoleo: string
    siembra: string
    marca: string
    rastreo: string
    aplicHerbicida: string
    escarificacion: string
    riego: string
    barbecho: string
    aplicInsecticida: string
    fertilizacion: string
    empareje: string
    analisisSuelo: string
  }
  resultadoSupervision: string
  planAccion: string
  observaciones: string
  recomendaciones: string
  polygonCoordinates: Coordinate[] | null
  status: "Liberado" | "En Proceso" | "Pendiente"
  sincronizado: boolean
}

interface DictamenesState {
  dictamenes: DictamenTecnico[]
  loading: boolean
  currentDictamen: DictamenTecnico | null
}

const initialState: DictamenesState = {
  dictamenes: [
    {
      id: "1",
      productorId: "1",
      productorNombre: "Juan Pérez García",
      ciclo: "012425",
      fecha: "2024-06-24",
      ubicacion: "PINITOS",
      tipoTenencia: "pequeña-propiedad",
      predioRentado: "no",
      propietarioPredio: "CARLOS EDUARDO ZAMORA SALCEDO",
      cultivoSolicitado: "maiz",
      superficie: "25-00-00",
      plazoCultivo: "7 Meses",
      sistemaRiego: "canal",
      unidadModulo: "guasave",
      metodoRiego: "gravedad",
      topografia: "plana",
      profundidad: "profundo",
      textura: "aluvion",
      cultivoAnterior: "frijol",
      infestacionMalezas: "LIBRE",
      avanceLabores: {
        subsoleo: "100",
        siembra: "0",
        marca: "100",
        rastreo: "100",
        aplicHerbicida: "0",
        escarificacion: "0",
        riego: "0",
        barbecho: "100",
        aplicInsecticida: "0",
        fertilizacion: "0",
        empareje: "100",
        analisisSuelo: "100",
      },
      resultadoSupervision: "POSITIVO",
      planAccion: "TERRENO APTO PARA ESTABLECER EL CULTIVO SOLICITADO",
      observaciones: "Terreno en excelentes condiciones para el cultivo de maíz",
      recomendaciones: "Continuar con las labores de preparación según cronograma",
      polygonCoordinates: [
        { lat: 25.5428, lng: -108.4687 },
        { lat: 25.543, lng: -108.4685 },
        { lat: 25.5425, lng: -108.468 },
        { lat: 25.542, lng: -108.4682 },
      ],
      status: "Liberado",
      sincronizado: true,
    },
    {
      id: "2",
      productorId: "1",
      productorNombre: "Juan Pérez García",
      ciclo: "012324",
      fecha: "2024-03-15",
      ubicacion: "EL PROGRESO",
      tipoTenencia: "ejidal",
      predioRentado: "si",
      propietarioPredio: "CARLOS EDUARDO ZAMORA SALCEDO",
      cultivoSolicitado: "frijol",
      superficie: "15-00-00",
      plazoCultivo: "5 Meses",
      sistemaRiego: "bomba",
      unidadModulo: "bamoa",
      metodoRiego: "aspersion",
      topografia: "semiplana",
      profundidad: "semiprofundo",
      textura: "franco",
      cultivoAnterior: "sorgo",
      infestacionMalezas: "LEVE",
      avanceLabores: {
        subsoleo: "80",
        siembra: "100",
        marca: "100",
        rastreo: "100",
        aplicHerbicida: "50",
        escarificacion: "0",
        riego: "30",
        barbecho: "100",
        aplicInsecticida: "0",
        fertilizacion: "25",
        empareje: "100",
        analisisSuelo: "100",
      },
      resultadoSupervision: "POSITIVO",
      planAccion: "CONTINUAR CON RIEGO Y FERTILIZACIÓN",
      observaciones: "Cultivo en desarrollo normal, requiere seguimiento de riego",
      recomendaciones: "Aplicar fertilización foliar en próxima semana",
      polygonCoordinates: null,
      status: "En Proceso",
      sincronizado: false,
    },
  ],
  loading: false,
  currentDictamen: null,
}

const dictamenesSlice = createSlice({
  name: "dictamenes",
  initialState,
  reducers: {
    addDictamen: (state, action: PayloadAction<DictamenTecnico>) => {
      state.dictamenes.push(action.payload)
    },
    updateDictamen: (state, action: PayloadAction<DictamenTecnico>) => {
      const index = state.dictamenes.findIndex((d) => d.id === action.payload.id)
      if (index !== -1) {
        state.dictamenes[index] = action.payload
      }
    },
    deleteDictamen: (state, action: PayloadAction<string>) => {
      state.dictamenes = state.dictamenes.filter((d) => d.id !== action.payload)
    },
    setCurrentDictamen: (state, action: PayloadAction<DictamenTecnico | null>) => {
      state.currentDictamen = action.payload
    },
    markDictamenAsSincronizado: (state, action: PayloadAction<string>) => {
      const dictamen = state.dictamenes.find((d) => d.id === action.payload)
      if (dictamen) {
        dictamen.sincronizado = true
      }
    },
  },
})

export const { addDictamen, updateDictamen, deleteDictamen, setCurrentDictamen, markDictamenAsSincronizado } =
  dictamenesSlice.actions
export default dictamenesSlice.reducer
