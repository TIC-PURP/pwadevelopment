import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Productor {
  id: string
  nombre: string
  cedula: string
  telefono: string
  email: string
  direccion: string
  cultivos: string[]
  fechaRegistro: string
}

interface ProductoresState {
  productores: Productor[]
  loading: boolean
  searchTerm: string
}

const initialState: ProductoresState = {
  productores: [
    {
      id: "1",
      nombre: "Juan Pérez García",
      cedula: "12345678",
      telefono: "+57 300 123 4567",
      email: "juan.perez@email.com",
      direccion: "Vereda El Progreso, Municipio Agrícola",
      cultivos: ["Garbanzo", "Sorgo"],
      fechaRegistro: "2024-01-15",
    },
    {
      id: "2",
      nombre: "María González López",
      cedula: "87654321",
      telefono: "+57 310 987 6543",
      email: "maria.gonzalez@email.com",
      direccion: "Finca La Esperanza, Vereda San José",
      cultivos: ["Maíz", "Frijol"],
      fechaRegistro: "2024-02-20",
    },
  ],
  loading: false,
  searchTerm: "",
}

const productoresSlice = createSlice({
  name: "productores",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
    },
    addProductor: (state, action: PayloadAction<Productor>) => {
      state.productores.push(action.payload)
    },
    updateProductor: (state, action: PayloadAction<Productor>) => {
      const index = state.productores.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.productores[index] = action.payload
      }
    },
    deleteProductor: (state, action: PayloadAction<string>) => {
      state.productores = state.productores.filter((p) => p.id !== action.payload)
    },
    setProductores: (state, action: PayloadAction<ProductoresState>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { setSearchTerm, addProductor, updateProductor, deleteProductor, setProductores } =
  productoresSlice.actions
export default productoresSlice.reducer
