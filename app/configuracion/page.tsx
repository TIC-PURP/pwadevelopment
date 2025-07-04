"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { toggleDarkMode, setOnlineStatus, setLastSync } from "@/lib/slices/appSlice"
import { useToast } from "@/hooks/use-toast"
import { Header } from "@/components/layout/header"
import {
  Moon,
  Sun,
  Wifi,
  WifiOff,
  Database,
  Trash2,
  Download,
  Upload,
  Settings,
  Info,
  RefreshCw,
  BookOpen,
  Mail,
  Bug,
  HelpCircle,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ConfiguracionPage() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { darkMode, isOnline, lastSync } = useAppSelector((state) => state.app)
  const [mounted, setMounted] = useState(false)
  const [isForceOffline, setIsForceOffline] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [helpForm, setHelpForm] = useState({ name: "", email: "", message: "" })
  const [reportForm, setReportForm] = useState({
    location: "",
    description: "",
    activity: "",
    isOffline: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Verificar si hay un estado de offline forzado guardado
    const savedOfflineState = localStorage.getItem("forceOffline")
    if (savedOfflineState === "true") {
      setIsForceOffline(true)
      dispatch(setOnlineStatus(false))
    }
  }, [dispatch])

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode())
    // Guardar en localStorage
    localStorage.setItem("theme", !darkMode ? "dark" : "light")
    toast({
      title: !darkMode ? "Modo oscuro activado" : "Modo claro activado",
      description: `Has cambiado al tema ${!darkMode ? "oscuro" : "claro"}`,
    })
  }

  const handleToggleOfflineMode = (checked: boolean) => {
    setIsForceOffline(checked)
    localStorage.setItem("forceOffline", checked.toString())

    if (checked) {
      // Forzar modo offline
      dispatch(setOnlineStatus(false))
      toast({
        title: "Modo offline activado",
        description: "La aplicación funcionará sin conexión",
        variant: "default",
      })
    } else {
      // Permitir modo online (verificar conexión real)
      const actualOnlineStatus = navigator.onLine
      dispatch(setOnlineStatus(actualOnlineStatus))
      toast({
        title: "Modo online activado",
        description: actualOnlineStatus ? "Conexión restaurada" : "Sin conexión a internet",
        variant: actualOnlineStatus ? "default" : "destructive",
      })
    }
  }

  const handleSync = async () => {
    if (!isOnline && !isForceOffline) {
      toast({
        title: "Sin conexión",
        description: "No se puede sincronizar sin conexión a internet",
        variant: "destructive",
      })
      return
    }

    setIsSyncing(true)

    try {
      // Simular sincronización
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const now = new Date().toISOString()
      dispatch(setLastSync(now))

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
      setIsSyncing(false)
    }
  }

  const handleClearData = () => {
    if (confirm("¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.")) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const handleExportData = () => {
    try {
      const data = localStorage.getItem("agritech-state")
      if (data) {
        const blob = new Blob([data], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `agritech-backup-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast({
          title: "Datos exportados",
          description: "Los datos se han exportado correctamente",
        })
      }
    } catch (error) {
      toast({
        title: "Error al exportar",
        description: "No se pudieron exportar los datos",
        variant: "destructive",
      })
    }
  }

  const handleImportData = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            const data = e.target?.result as string
            JSON.parse(data) // Validate JSON
            localStorage.setItem("agritech-state", data)
            toast({
              title: "Datos importados",
              description: "Los datos se han importado correctamente. Recargando...",
            })
            setTimeout(() => window.location.reload(), 1000)
          } catch (error) {
            toast({
              title: "Error al importar",
              description: "El archivo no es válido",
              variant: "destructive",
            })
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleHelpServices = () => {
    router.push("/ayuda/manual")
  }

  const handleHelpMailbox = () => {
    setShowHelpModal(true)
  }

  const handleReportProblem = () => {
    setReportForm((prev) => ({ ...prev, isOffline: !isOnline }))
    setShowReportModal(true)
  }

  const handleSubmitHelp = async () => {
    if (!helpForm.name || !helpForm.email || !helpForm.message) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const helpRequest = {
        ...helpForm,
        timestamp: new Date().toISOString(),
        type: "help_request",
      }

      if (isOnline) {
        // Simular envío a API
        await new Promise((resolve) => setTimeout(resolve, 1500))
        toast({
          title: "Solicitud enviada",
          description: "Tu consulta ha sido enviada correctamente",
        })
      } else {
        // Guardar offline
        const savedRequests = JSON.parse(localStorage.getItem("pending_help_requests") || "[]")
        savedRequests.push(helpRequest)
        localStorage.setItem("pending_help_requests", JSON.stringify(savedRequests))
        toast({
          title: "Solicitud guardada",
          description: "Se enviará cuando tengas conexión",
        })
      }

      setHelpForm({ name: "", email: "", message: "" })
      setShowHelpModal(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la solicitud",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReport = async () => {
    if (!reportForm.location || !reportForm.description || !reportForm.activity) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const bugReport = {
        ...reportForm,
        timestamp: new Date().toISOString(),
        type: "bug_report",
        userAgent: navigator.userAgent,
      }

      if (isOnline) {
        // Simular envío a API
        await new Promise((resolve) => setTimeout(resolve, 1500))
        toast({
          title: "Reporte enviado",
          description: "Tu reporte ha sido enviado al equipo técnico",
        })
      } else {
        // Guardar offline
        const savedReports = JSON.parse(localStorage.getItem("pending_bug_reports") || "[]")
        savedReports.push(bugReport)
        localStorage.setItem("pending_bug_reports", JSON.stringify(savedReports))
        toast({
          title: "Reporte guardado",
          description: "Se enviará cuando tengas conexión",
        })
      }

      setReportForm({ location: "", description: "", activity: "", isOffline: false })
      setShowReportModal(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el reporte",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background">
        <Header title="Configuración" showBack />
        <div className="container mx-auto p-4 space-y-6">
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded-lg"></div>
            <div className="h-24 bg-muted rounded-lg"></div>
            <div className="h-24 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Configuración" showBack />

      <div className="container mx-auto p-4 space-y-6">
        {/* Tema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Apariencia
            </CardTitle>
            <CardDescription>Personaliza la apariencia de la aplicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="h-5 w-5 text-blue-500" /> : <Sun className="h-5 w-5 text-yellow-500" />}
                <div>
                  <Label htmlFor="dark-mode" className="text-base font-medium">
                    Modo oscuro
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {darkMode ? "Tema oscuro activado" : "Tema claro activado"}
                  </p>
                </div>
              </div>
              <Switch id="dark-mode" checked={darkMode} onCheckedChange={handleToggleDarkMode} />
            </div>
          </CardContent>
        </Card>

        {/* Estado de conexión */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isOnline ? <Wifi className="h-5 w-5 text-green-500" /> : <WifiOff className="h-5 w-5 text-red-500" />}
              Estado de conexión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{isOnline ? "Conectado" : "Sin conexión"}</p>
                <p className="text-sm text-muted-foreground">
                  {lastSync ? `Última sincronización: ${new Date(lastSync).toLocaleString()}` : "No se ha sincronizado"}
                </p>
              </div>
              <Badge variant={isOnline ? "default" : "destructive"}>{isOnline ? "Online" : "Offline"}</Badge>
            </div>

            <Separator />

            {/* Control de modo offline */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <WifiOff className="h-5 w-5 text-orange-500" />
                <div>
                  <Label htmlFor="offline-mode" className="text-base font-medium">
                    Modo offline forzado
                  </Label>
                  <p className="text-sm text-muted-foreground">Fuerza la aplicación a trabajar sin conexión</p>
                </div>
              </div>
              <Switch id="offline-mode" checked={isForceOffline} onCheckedChange={handleToggleOfflineMode} />
            </div>

            <Separator />

            {/* Botón de sincronizar */}
            <Button
              onClick={handleSync}
              disabled={isSyncing || (!isOnline && isForceOffline)}
              className="w-full flex items-center gap-2 bg-transparent"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Sincronizando..." : "Sincronizar datos"}
            </Button>
          </CardContent>
        </Card>

        {/* Gestión de datos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Gestión de datos
            </CardTitle>
            <CardDescription>Exporta, importa o borra los datos de la aplicación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button onClick={handleExportData} variant="outline" className="flex items-center gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Exportar datos
              </Button>

              <Button onClick={handleImportData} variant="outline" className="flex items-center gap-2 bg-transparent">
                <Upload className="h-4 w-4" />
                Importar datos
              </Button>
            </div>

            <Separator />

            <Button onClick={handleClearData} variant="destructive" className="w-full flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Borrar todos los datos
            </Button>
          </CardContent>
        </Card>

        {/* Información de la app */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Información
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Versión:</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Última actualización:</span>
              <span>2024-01-15</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Desarrollado por:</span>
              <span>AgriTech Team</span>
            </div>
          </CardContent>
        </Card>

        {/* Ayuda y soporte técnico */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Ayuda y soporte técnico
            </CardTitle>
            <CardDescription>Accede a recursos de ayuda y reporta problemas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <Button
                onClick={handleHelpServices}
                variant="outline"
                className="flex items-center gap-2 bg-transparent justify-start h-auto p-4"
              >
                <BookOpen className="h-5 w-5 text-blue-500" />
                <div className="text-left">
                  <div className="font-medium">Servicios de ayuda</div>
                  <div className="text-sm text-muted-foreground">Acceso a manuales o guías de uso</div>
                </div>
              </Button>

              <Button
                onClick={handleHelpMailbox}
                variant="outline"
                className="flex items-center gap-2 bg-transparent justify-start h-auto p-4"
              >
                <Mail className="h-5 w-5 text-green-500" />
                <div className="text-left">
                  <div className="font-medium">Buzón de ayuda</div>
                  <div className="text-sm text-muted-foreground">Envía una solicitud o consulta</div>
                </div>
              </Button>

              <Button
                onClick={handleReportProblem}
                variant="outline"
                className="flex items-center gap-2 bg-transparent justify-start h-auto p-4"
              >
                <Bug className="h-5 w-5 text-red-500" />
                <div className="text-left">
                  <div className="font-medium">Reportar un problema</div>
                  <div className="text-sm text-muted-foreground">Levanta un error o bug encontrado</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Modal Buzón de ayuda */}
      <Dialog open={showHelpModal} onOpenChange={setShowHelpModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-500" />
              Buzón de ayuda
            </DialogTitle>
            <DialogDescription>Envíanos tu consulta y te responderemos lo antes posible</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="help-name">Nombre</Label>
              <Input
                id="help-name"
                value={helpForm.name}
                onChange={(e) => setHelpForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Tu nombre completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="help-email">Correo electrónico</Label>
              <Input
                id="help-email"
                type="email"
                value={helpForm.email}
                onChange={(e) => setHelpForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="tu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="help-message">Mensaje</Label>
              <Textarea
                id="help-message"
                value={helpForm.message}
                onChange={(e) => setHelpForm((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="Describe tu consulta o solicitud..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHelpModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitHelp} disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Enviar solicitud"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Reportar problema */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bug className="h-5 w-5 text-red-500" />
              Reportar un problema
            </DialogTitle>
            <DialogDescription>Ayúdanos a mejorar reportando errores o problemas encontrados</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="report-location">¿En qué parte ocurrió el error?</Label>
              <Select onValueChange={(value) => setReportForm((prev) => ({ ...prev, location: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la sección" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inicio">Página de inicio</SelectItem>
                  <SelectItem value="productores">Productores</SelectItem>
                  <SelectItem value="visitas">Visitas</SelectItem>
                  <SelectItem value="dictamenes">Dictámenes</SelectItem>
                  <SelectItem value="agenda">Agenda</SelectItem>
                  <SelectItem value="crm">CRM</SelectItem>
                  <SelectItem value="monitoreo">Monitoreo Satelital</SelectItem>
                  <SelectItem value="sensores">Sensores</SelectItem>
                  <SelectItem value="diagnostico">Diagnóstico IA</SelectItem>
                  <SelectItem value="operaciones">Operaciones</SelectItem>
                  <SelectItem value="configuracion">Configuración</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-activity">¿Qué estabas haciendo?</Label>
              <Input
                id="report-activity"
                value={reportForm.activity}
                onChange={(e) => setReportForm((prev) => ({ ...prev, activity: e.target.value }))}
                placeholder="Ej: Creando un nuevo productor..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="report-description">Descripción del problema</Label>
              <Textarea
                id="report-description"
                value={reportForm.description}
                onChange={(e) => setReportForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe detalladamente qué pasó, qué esperabas que pasara..."
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={reportForm.isOffline ? "destructive" : "default"}>
                {reportForm.isOffline ? "Modo Offline" : "Modo Online"}
              </Badge>
              <span className="text-sm text-muted-foreground">Estado de conexión actual</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReportModal(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitReport} disabled={isSubmitting}>
              {isSubmitting ? "Enviando..." : "Reportar problema"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
