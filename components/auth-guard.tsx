"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAppSelector } from "@/lib/hooks"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    // Si no está autenticado y no está en la página de login, redirigir al login
    if (!isAuthenticated && pathname !== "/login") {
      router.push("/login")
    }
    // Si está autenticado y está en la página de login, redirigir al home
    else if (isAuthenticated && pathname === "/login") {
      router.push("/")
    }
  }, [isAuthenticated, pathname, router])

  // Si no está autenticado y no está en login, no mostrar nada (se está redirigiendo)
  if (!isAuthenticated && pathname !== "/login") {
    return null
  }

  // Si está autenticado y está en login, no mostrar nada (se está redirigiendo)
  if (isAuthenticated && pathname === "/login") {
    return null
  }

  return <>{children}</>
}
