"use client"

import { useEffect } from "react"
import { useAppDispatch } from "@/lib/hooks"

export function StateLoader() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    try {
      const savedState = localStorage.getItem("agritech-state")
      if (savedState) {
        const parsedState = JSON.parse(savedState)
        // El estado se carga automáticamente desde localStorage
        // No necesitamos hacer dispatch manual aquí
        console.log("Estado cargado desde localStorage")
      }
    } catch (error) {
      console.error("Error loading state from localStorage:", error)
    }
  }, [dispatch])

  return null
}
