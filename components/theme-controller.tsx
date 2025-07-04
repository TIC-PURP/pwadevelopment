"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setDarkMode } from "@/lib/slices/appSlice"

export function ThemeController() {
  const { setTheme } = useTheme()
  const dispatch = useAppDispatch()
  const darkMode = useAppSelector((state) => state.app.darkMode)
  const isInitialized = useRef(false)

  // Solo sincronizar Redux -> next-themes, no al revés para evitar bucles
  useEffect(() => {
    if (isInitialized.current) {
      const newTheme = darkMode ? "dark" : "light"
      setTheme(newTheme)
    } else {
      // Inicialización: leer del localStorage o usar el valor por defecto
      const savedTheme = localStorage.getItem("theme")
      if (savedTheme) {
        const isDark = savedTheme === "dark"
        dispatch(setDarkMode(isDark))
        setTheme(savedTheme)
      } else {
        // Usar el valor actual de Redux
        setTheme(darkMode ? "dark" : "light")
      }
      isInitialized.current = true
    }
  }, [darkMode, setTheme, dispatch])

  return null
}
