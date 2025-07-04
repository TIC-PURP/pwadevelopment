import { configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { combineReducers } from "@reduxjs/toolkit"

import authSlice from "./slices/authSlice"
import appSlice from "./slices/appSlice"
import agendaSlice from "./slices/agendaSlice"
import productoresSlice from "./slices/productoresSlice"
import visitasSlice from "./slices/visitasSlice"
import dictamenesSlice from "./slices/dictamenesSlice"
import prospectosSlice from "./slices/prospectosSlice"
import reportesInspeccionSlice from "./slices/reportesInspeccionSlice"
import usersSlice from "./slices/usersSlice"
import assistantSlice from "./slices/assistantSlice"

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "agenda", "productores", "visitas", "dictamenes", "prospectos", "reportesInspeccion", "users"],
}

const rootReducer = combineReducers({
  auth: authSlice,
  app: appSlice,
  agenda: agendaSlice,
  productores: productoresSlice,
  visitas: visitasSlice,
  dictamenes: dictamenesSlice,
  prospectos: prospectosSlice,
  reportesInspeccion: reportesInspeccionSlice,
  users: usersSlice,
  assistant: assistantSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
