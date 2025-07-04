import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  isAuthenticated: boolean
  userCode: string | null
  userEmail: string | null
  userRole: "Manager" | "Admin" | "Usuario" | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  userCode: null,
  userEmail: null,
  userRole: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ code?: string; email?: string; role: "Manager" | "Admin" | "Usuario" }>) => {
      state.isAuthenticated = true
      state.userCode = action.payload.code || null
      state.userEmail = action.payload.email || null
      state.userRole = action.payload.role
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.userCode = null
      state.userEmail = null
      state.userRole = null
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
