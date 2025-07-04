import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface AppState {
  darkMode: boolean
  isOnline: boolean
  syncing: boolean
  lastSync: string | null
  isLoading: boolean
  error: string | null
}

const initialState: AppState = {
  darkMode: false,
  isOnline: true,
  syncing: false,
  lastSync: null,
  isLoading: false,
  error: null,
}

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload
    },
    setSyncing: (state, action: PayloadAction<boolean>) => {
      state.syncing = action.payload
    },
    setLastSync: (state, action: PayloadAction<string>) => {
      state.lastSync = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setAppState: (state, action: PayloadAction<Partial<AppState>>) => {
      return { ...state, ...action.payload }
    },
  },
})

export const {
  toggleDarkMode,
  setDarkMode,
  setOnlineStatus,
  setSyncing,
  setLastSync,
  setLoading,
  setError,
  setAppState,
} = appSlice.actions

export default appSlice.reducer
