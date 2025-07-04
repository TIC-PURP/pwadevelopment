import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface User {
  id: string
  fullName: string
  email: string
  password: string
  role: "Manager" | "Admin" | "Usuario"
  permissions: {
    [key: string]: "sin acceso" | "lectura" | "editor"
  }
  createdAt: string
  updatedAt: string
}

interface UsersState {
  users: User[]
}

const initialState: UsersState = {
  users: [
    {
      id: "1",
      fullName: "Manager Principal",
      email: "manager@purp.com.mx",
      password: "hashed_password_here", // Esta será la contraseña encriptada
      role: "Manager",
      permissions: {
        agenda: "editor",
        crm: "editor",
        configuracion: "editor",
        productores: "editor",
        visitas: "editor",
        dictamenes: "editor",
        prospectos: "editor",
        reportesInspeccion: "editor",
        operaciones: "editor",
        sensores: "editor",
        monitoreoSatelital: "editor",
        diagnosticoIA: "editor",
        panelControl: "editor",
        historial: "editor",
        formularios: "editor",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
}

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload)
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex((user) => user.id === action.payload.id)
      if (index !== -1) {
        state.users[index] = action.payload
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload)
    },
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload
    },
  },
})

export const { addUser, updateUser, deleteUser, setUsers } = usersSlice.actions
export default usersSlice.reducer
