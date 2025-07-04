"use client"

import type React from "react"

import { useEffect } from "react"
import { useAppDispatch } from "@/lib/hooks"
import { setOnlineStatus } from "@/lib/slices/appSlice"

export function OnlineStatusProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const updateOnlineStatus = () => {
      dispatch(setOnlineStatus(navigator.onLine))
    }

    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    // Set initial status
    updateOnlineStatus()

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [dispatch])

  return <>{children}</>
}
