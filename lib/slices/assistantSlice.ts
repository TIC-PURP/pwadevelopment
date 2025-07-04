import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface AssistantState {
  isActive: boolean
  isListening: boolean
  mode: "normal" | "susurro" | "grito"
  audioLevel: number
  lastResponse: string | null
  isProcessing: boolean
  error: string | null
}

const initialState: AssistantState = {
  isActive: false,
  isListening: false,
  mode: "normal",
  audioLevel: 0,
  lastResponse: null,
  isProcessing: false,
  error: null,
}

const assistantSlice = createSlice({
  name: "assistant",
  initialState,
  reducers: {
    activateAssistant: (state) => {
      state.isActive = true
      state.error = null
    },
    deactivateAssistant: (state) => {
      state.isActive = false
      state.isListening = false
      state.isProcessing = false
      state.error = null
    },
    startListening: (state) => {
      state.isListening = true
      state.error = null
    },
    stopListening: (state) => {
      state.isListening = false
    },
    setMode: (state, action: PayloadAction<"normal" | "susurro" | "grito">) => {
      state.mode = action.payload
    },
    setAudioLevel: (state, action: PayloadAction<number>) => {
      state.audioLevel = action.payload
    },
    setResponse: (state, action: PayloadAction<string>) => {
      state.lastResponse = action.payload
      state.isProcessing = false
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.isProcessing = false
      state.isListening = false
    },
  },
})

export const {
  activateAssistant,
  deactivateAssistant,
  startListening,
  stopListening,
  setMode,
  setAudioLevel,
  setResponse,
  setProcessing,
  setError,
} = assistantSlice.actions

export default assistantSlice.reducer
