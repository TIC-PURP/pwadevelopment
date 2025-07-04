"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Settings, AlertTriangle, CheckCircle, Clock, Mail, MessageSquare } from "lucide-react"
import { toast } from "sonner"
import { getAlertSettings, saveAlertSettings, getAlertHistory } from "@/lib/alert-storage"

interface AlertSetting {
  id: string
  sensorType: string
  parameter: string
  minValue: number
  maxValue: number
  enabled: boolean
  notificationMethods: string[]
}

interface AlertHistory {
  id: string
  sensorId: string
  sensorName: string
  parameter: string
  value: number
  threshold: number
  type: "min" | "max"
  status: "active" | "resolved"
  timestamp: string
  resolvedAt?: string
}

export function AlertsNotifications() {
  const [alertSettings, setAlertSettings] = useState<AlertSetting[]>([])
  const [alertHistory, setAlertHistory] = useState<AlertHistory[]>([])
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    push: true,
    emailAddress: "",
    phoneNumber: "",
  })

  const sensorParameters = [
    { value: "temperature", label: "Temperatura", unit: "°C", defaultMin: 10, defaultMax: 35 },
    { value: "humidity", label: "Humedad", unit: "%", defaultMin: 40, defaultMax: 80 },
    { value: "soil_moisture", label: "Humedad del Suelo", unit: "%", defaultMin: 30, defaultMax: 70 },
    { value: "wind_speed", label: "Velocidad del Viento", unit: "km/h", defaultMin: 0, defaultMax: 50 },
    { value: "solar_radiation", label: "Radiación Solar", unit: "W/m²", defaultMin: 200, defaultMax: 1200 },
    { value: "precipitation", label: "Precipitación", unit: "mm", defaultMin: 0, defaultMax: 100 },
    { value: "ph", label: "pH del Suelo", unit: "pH", defaultMin: 6.0, defaultMax: 7.5 },
    { value: "conductivity", label: "Conductividad", unit: "µS/cm", defaultMin: 100, defaultMax: 2000 },
  ]

  useEffect(() => {
    // Cargar configuraciones de alertas
    const settings = getAlertSettings()
    if (settings.length === 0) {
      // Configuraciones por defecto
      const defaultSettings: AlertSetting[] = sensorParameters.map((param, index) => ({
        id: `alert-${index + 1}`,
        sensorType: "all",
        parameter: param.value,
        minValue: param.defaultMin,
        maxValue: param.defaultMax,
        enabled: true,
        notificationMethods: ["push", "email"],
      }))
      setAlertSettings(defaultSettings)
      saveAlertSettings(defaultSettings)
    } else {
      setAlertSettings(settings)
    }

    // Cargar historial de alertas
    setAlertHistory(getAlertHistory())

    // Cargar configuraciones de notificaciones desde localStorage
    const savedNotificationSettings = localStorage.getItem("notificationSettings")
    if (savedNotificationSettings) {
      setNotificationSettings(JSON.parse(savedNotificationSettings))
    }
  }, [])

  const handleSaveAlertSettings = () => {
    saveAlertSettings(alertSettings)
    toast.success("Configuración de alertas guardada")
  }

  const handleSaveNotificationSettings = () => {
    localStorage.setItem("notificationSettings", JSON.stringify(notificationSettings))
    toast.success("Configuración de notificaciones guardada")
  }

  const updateAlertSetting = (id: string, updates: Partial<AlertSetting>) => {
    setAlertSettings((prev) => prev.map((setting) => (setting.id === id ? { ...setting, ...updates } : setting)))
  }

  const resolveAlert = (alertId: string) => {
    setAlertHistory((prev) =>
      prev.map((alert) =>
        alert.id === alertId ? { ...alert, status: "resolved", resolvedAt: new Date().toISOString() } : alert,
      ),
    )
    toast.success("Alerta marcada como resuelta")
  }

  const getParameterLabel = (parameter: string) => {
    const param = sensorParameters.find((p) => p.value === parameter)
    return param ? param.label : parameter
  }

  const getParameterUnit = (parameter: string) => {
    const param = sensorParameters.find((p) => p.value === parameter)
    return param ? param.unit : ""
  }

  const activeAlerts = alertHistory.filter((alert) => alert.status === "active")
  const resolvedAlerts = alertHistory.filter((alert) => alert.status === "resolved")

  // Simular algunas alertas para demostración
  useEffect(() => {
    if (alertHistory.length === 0) {
      const mockAlerts: AlertHistory[] = [
        {
          id: "alert-hist-1",
          sensorId: "sensor-003",
          sensorName: "Estación Sur",
          parameter: "temperature",
          value: 38.5,
          threshold: 35,
          type: "max",
          status: "active",
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
        {
          id: "alert-hist-2",
          sensorId: "sensor-002",
          sensorName: "Sensor Suelo A",
          parameter: "soil_moisture",
          value: 25,
          threshold: 30,
          type: "min",
          status: "active",
          timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        },
        {
          id: "alert-hist-3",
          sensorId: "sensor-001",
          sensorName: "Estación Norte",
          parameter: "humidity",
          value: 85,
          threshold: 80,
          type: "max",
          status: "resolved",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        },
      ]
      setAlertHistory(mockAlerts)
    }
  }, [alertHistory.length])

  return (
    <div className="space-y-6">
      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Alertas Activas</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          {/* Resumen de alertas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Alertas Activas</p>
                    <p className="text-2xl font-bold text-red-600">{activeAlerts.length}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Resueltas Hoy</p>
                    <p className="text-2xl font-bold text-green-600">{resolvedAlerts.length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Configuraciones</p>
                    <p className="text-2xl font-bold text-blue-600">{alertSettings.filter((s) => s.enabled).length}</p>
                  </div>
                  <Settings className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de alertas activas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-red-600" />
                Alertas Activas
              </CardTitle>
              <CardDescription>Alertas que requieren atención inmediata</CardDescription>
            </CardHeader>
            <CardContent>
              {activeAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-500">No hay alertas activas</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {activeAlerts.map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                      >
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {alert.sensorName} - {getParameterLabel(alert.parameter)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Valor: {alert.value} {getParameterUnit(alert.parameter)}
                              {alert.type === "max" ? " (máximo: " : " (mínimo: "}
                              {alert.threshold} {getParameterUnit(alert.parameter)})
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              {new Date(alert.timestamp).toLocaleString("es-ES")}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="destructive">Activa</Badge>
                          <Button size="sm" variant="outline" onClick={() => resolveAlert(alert.id)}>
                            Resolver
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Configuración de límites de alertas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Configuración de Límites
              </CardTitle>
              <CardDescription>Define los rangos aceptables para cada parámetro</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {alertSettings.map((setting) => (
                  <div key={setting.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={setting.enabled}
                          onCheckedChange={(enabled) => updateAlertSetting(setting.id, { enabled })}
                        />
                        <div>
                          <div className="font-medium">{getParameterLabel(setting.parameter)}</div>
                          <div className="text-sm text-gray-500">Unidad: {getParameterUnit(setting.parameter)}</div>
                        </div>
                      </div>
                      <Badge variant={setting.enabled ? "default" : "secondary"}>
                        {setting.enabled ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>

                    {setting.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`min-${setting.id}`}>Valor Mínimo</Label>
                          <Input
                            id={`min-${setting.id}`}
                            type="number"
                            step="any"
                            value={setting.minValue}
                            onChange={(e) =>
                              updateAlertSetting(setting.id, {
                                minValue: Number.parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor={`max-${setting.id}`}>Valor Máximo</Label>
                          <Input
                            id={`max-${setting.id}`}
                            type="number"
                            step="any"
                            value={setting.maxValue}
                            onChange={(e) =>
                              updateAlertSetting(setting.id, {
                                maxValue: Number.parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex justify-end">
                  <Button onClick={handleSaveAlertSettings}>Guardar Configuración</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuración de notificaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Configuración de Notificaciones
              </CardTitle>
              <CardDescription>Configura cómo y dónde recibir las alertas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Notificaciones Push</div>
                        <div className="text-sm text-gray-500">Alertas en tiempo real en la aplicación</div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.push}
                      onCheckedChange={(push) => setNotificationSettings((prev) => ({ ...prev, push }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium">Notificaciones por Email</div>
                        <div className="text-sm text-gray-500">Recibir alertas por correo electrónico</div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.email}
                      onCheckedChange={(email) => setNotificationSettings((prev) => ({ ...prev, email }))}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Notificaciones SMS</div>
                        <div className="text-sm text-gray-500">Recibir alertas por mensaje de texto</div>
                      </div>
                    </div>
                    <Switch
                      checked={notificationSettings.sms}
                      onCheckedChange={(sms) => setNotificationSettings((prev) => ({ ...prev, sms }))}
                    />
                  </div>
                </div>

                {notificationSettings.email && (
                  <div>
                    <Label htmlFor="email">Dirección de Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={notificationSettings.emailAddress}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          emailAddress: e.target.value,
                        }))
                      }
                      placeholder="tu@email.com"
                    />
                  </div>
                )}

                {notificationSettings.sms && (
                  <div>
                    <Label htmlFor="phone">Número de Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={notificationSettings.phoneNumber}
                      onChange={(e) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }))
                      }
                      placeholder="+54 9 11 1234-5678"
                    />
                  </div>
                )}

                <div className="flex justify-end">
                  <Button onClick={handleSaveNotificationSettings}>Guardar Configuración</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-600" />
                Historial de Alertas
              </CardTitle>
              <CardDescription>Registro completo de todas las alertas del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {alertHistory.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 border rounded-lg ${
                        alert.status === "active"
                          ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                          : "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          {alert.status === "active" ? (
                            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          )}
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {alert.sensorName} - {getParameterLabel(alert.parameter)}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Valor: {alert.value} {getParameterUnit(alert.parameter)}
                              {alert.type === "max" ? " (máximo: " : " (mínimo: "}
                              {alert.threshold} {getParameterUnit(alert.parameter)})
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Iniciada: {new Date(alert.timestamp).toLocaleString("es-ES")}
                              {alert.resolvedAt && (
                                <span className="ml-2">
                                  • Resuelta: {new Date(alert.resolvedAt).toLocaleString("es-ES")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge variant={alert.status === "active" ? "destructive" : "default"}>
                          {alert.status === "active" ? "Activa" : "Resuelta"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
