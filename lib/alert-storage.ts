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

const ALERT_SETTINGS_KEY = "alertSettings"
const ALERT_HISTORY_KEY = "alertHistory"

export function getAlertSettings(): AlertSetting[] {
  if (typeof window === "undefined") return []

  const settings = localStorage.getItem(ALERT_SETTINGS_KEY)
  return settings ? JSON.parse(settings) : []
}

export function saveAlertSettings(settings: AlertSetting[]): void {
  if (typeof window === "undefined") return

  localStorage.setItem(ALERT_SETTINGS_KEY, JSON.stringify(settings))
}

export function getAlertHistory(): AlertHistory[] {
  if (typeof window === "undefined") return []

  const history = localStorage.getItem(ALERT_HISTORY_KEY)
  return history ? JSON.parse(history) : []
}

export function saveAlertHistory(history: AlertHistory[]): void {
  if (typeof window === "undefined") return

  localStorage.setItem(ALERT_HISTORY_KEY, JSON.stringify(history))
}

export function addAlert(alert: Omit<AlertHistory, "id">): void {
  const history = getAlertHistory()
  const newAlert: AlertHistory = {
    ...alert,
    id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  }

  history.unshift(newAlert)
  saveAlertHistory(history)
}

export function resolveAlert(alertId: string): void {
  const history = getAlertHistory()
  const updatedHistory = history.map((alert) =>
    alert.id === alertId ? { ...alert, status: "resolved" as const, resolvedAt: new Date().toISOString() } : alert,
  )

  saveAlertHistory(updatedHistory)
}

export function checkAlertConditions(sensorData: any, settings: AlertSetting[]): AlertHistory[] {
  const newAlerts: AlertHistory[] = []

  settings.forEach((setting) => {
    if (!setting.enabled) return

    const value = sensorData[setting.parameter]
    if (value === undefined) return

    if (value < setting.minValue) {
      newAlerts.push({
        id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sensorId: sensorData.id,
        sensorName: sensorData.name,
        parameter: setting.parameter,
        value,
        threshold: setting.minValue,
        type: "min",
        status: "active",
        timestamp: new Date().toISOString(),
      })
    }

    if (value > setting.maxValue) {
      newAlerts.push({
        id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sensorId: sensorData.id,
        sensorName: sensorData.name,
        parameter: setting.parameter,
        value,
        threshold: setting.maxValue,
        type: "max",
        status: "active",
        timestamp: new Date().toISOString(),
      })
    }
  })

  return newAlerts
}
