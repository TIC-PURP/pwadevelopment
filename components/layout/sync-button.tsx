"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { setSyncing, setLastSync } from "@/lib/slices/appSlice"
import { useToast } from "@/hooks/use-toast"
import { RefreshCw, Wifi, WifiOff } from "lucide-react"

export function SyncButton() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { syncing, isOnline } = useAppSelector((state) => state.app)
  const [isLoading, setIsLoading] = useState(false)

  const handleSync = async () => {
    if (!isOnline) {
      toast({
        title: "Sin conexión",
        description: "No se puede sincronizar sin conexión a internet",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    dispatch(setSyncing(true))

    try {
      // Simular sincronización
      await new Promise((resolve) => setTimeout(resolve, 2000))

      dispatch(setLastSync(new Date().toISOString()))
      toast({
        title: "Sincronización completada",
        description: "Los datos se han sincronizado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error de sincronización",
        description: "No se pudieron sincronizar los datos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      dispatch(setSyncing(false))
    }
  }

  return (
    <Button
      onClick={handleSync}
      disabled={syncing || isLoading}
      variant="ghost"
      size="sm"
      className="flex items-center gap-2"
    >
      {syncing || isLoading ? (
        <RefreshCw className="h-4 w-4 animate-spin" />
      ) : isOnline ? (
        <Wifi className="h-4 w-4 text-green-500" />
      ) : (
        <WifiOff className="h-4 w-4 text-red-500" />
      )}
      {syncing || isLoading ? "Sincronizando..." : "Sincronizar"}
    </Button>
  )
}
