"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Activity, AlertTriangle, Power } from "lucide-react"
import { toast } from "sonner"

interface Sensor {
  id: string
  name: string
  type: string
  location: string
  coordinates?: { lat: number; lng: number }
  status: "active" | "inactive" | "alert"
  batteryLevel: number
  signalStrength: number
  lastUpdate: string
  createdAt: string
}

export function SensorManagement() {
  const [sensors, setSensors] = useState<Sensor[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingSensor, setEditingSensor] = useState<Sensor | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    coordinates: { lat: 0, lng: 0 },
  })

  const sensorTypes = [
    { value: "temperature", label: "Temperatura" },
    { value: "humidity", label: "Humedad" },
    { value: "soil_moisture", label: "Humedad del Suelo" },
    { value: "wind_speed", label: "Velocidad del Viento" },
    { value: "wind_direction", label: "Dirección del Viento" },
    { value: "solar_radiation", label: "Radiación Solar" },
    { value: "precipitation", label: "Precipitación" },
    { value: "ph", label: "pH del Suelo" },
    { value: "conductivity", label: "Conductividad" },
    { value: "co2", label: "CO2" },
  ]

  // Cargar sensores desde localStorage
  useEffect(() => {
    const savedSensors = localStorage.getItem("sensors")
    if (savedSensors) {
      setSensors(JSON.parse(savedSensors))
    } else {
      // Datos iniciales simulados
      const initialSensors: Sensor[] = [
        {
          id: "sensor-001",
          name: "Estación Meteorológica Norte",
          type: "temperature",
          location: "Campo Norte - Sector A",
          coordinates: { lat: -34.6037, lng: -58.3816 },
          status: "active",
          batteryLevel: 85,
          signalStrength: 92,
          lastUpdate: "2024-01-15T10:30:00Z",
          createdAt: "2024-01-01T00:00:00Z",
        },
        {
          id: "sensor-002",
          name: "Sensor Humedad Suelo A",
          type: "soil_moisture",
          location: "Campo Sur - Sector B",
          coordinates: { lat: -34.6137, lng: -58.3916 },
          status: "active",
          batteryLevel: 72,
          signalStrength: 88,
          lastUpdate: "2024-01-15T10:25:00Z",
          createdAt: "2024-01-02T00:00:00Z",
        },
        {
          id: "sensor-003",
          name: "Anemómetro Principal",
          type: "wind_speed",
          location: "Campo Central",
          coordinates: { lat: -34.6087, lng: -58.3866 },
          status: "alert",
          batteryLevel: 45,
          signalStrength: 65,
          lastUpdate: "2024-01-15T09:45:00Z",
          createdAt: "2024-01-03T00:00:00Z",
        },
        {
          id: "sensor-004",
          name: "Sensor pH Suelo",
          type: "ph",
          location: "Campo Este - Invernadero",
          coordinates: { lat: -34.6057, lng: -58.3756 },
          status: "inactive",
          batteryLevel: 12,
          signalStrength: 0,
          lastUpdate: "2024-01-14T15:20:00Z",
          createdAt: "2024-01-04T00:00:00Z",
        },
      ]
      setSensors(initialSensors)
      localStorage.setItem("sensors", JSON.stringify(initialSensors))
    }
  }, [])

  // Guardar sensores en localStorage
  const saveSensors = (newSensors: Sensor[]) => {
    setSensors(newSensors)
    localStorage.setItem("sensors", JSON.stringify(newSensors))
  }

  const handleAddSensor = () => {
    if (!formData.name || !formData.type || !formData.location) {
      toast.error("Por favor completa todos los campos obligatorios")
      return
    }

    const newSensor: Sensor = {
      id: `sensor-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      location: formData.location,
      coordinates: formData.coordinates,
      status: "active",
      batteryLevel: 100,
      signalStrength: 95,
      lastUpdate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }

    const updatedSensors = [...sensors, newSensor]
    saveSensors(updatedSensors)

    setIsAddDialogOpen(false)
    setFormData({ name: "", type: "", location: "", coordinates: { lat: 0, lng: 0 } })
    toast.success("Sensor agregado exitosamente")
  }

  const handleEditSensor = () => {
    if (!editingSensor || !formData.name || !formData.type || !formData.location) {
      toast.error("Por favor completa todos los campos obligatorios")
      return
    }

    const updatedSensors = sensors.map((sensor) =>
      sensor.id === editingSensor.id
        ? {
            ...sensor,
            name: formData.name,
            type: formData.type,
            location: formData.location,
            coordinates: formData.coordinates,
          }
        : sensor,
    )

    saveSensors(updatedSensors)
    setIsEditDialogOpen(false)
    setEditingSensor(null)
    setFormData({ name: "", type: "", location: "", coordinates: { lat: 0, lng: 0 } })
    toast.success("Sensor actualizado exitosamente")
  }

  const handleDeleteSensor = (sensorId: string) => {
    const updatedSensors = sensors.filter((sensor) => sensor.id !== sensorId)
    saveSensors(updatedSensors)
    toast.success("Sensor eliminado exitosamente")
  }

  const openEditDialog = (sensor: Sensor) => {
    setEditingSensor(sensor)
    setFormData({
      name: sensor.name,
      type: sensor.type,
      location: sensor.location,
      coordinates: sensor.coordinates || { lat: 0, lng: 0 },
    })
    setIsEditDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "alert":
        return "destructive"
      case "inactive":
        return "secondary"
      default:
        return "secondary"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activo"
      case "alert":
        return "Alerta"
      case "inactive":
        return "Inactivo"
      default:
        return "Desconocido"
    }
  }

  const getSensorTypeLabel = (type: string) => {
    const sensorType = sensorTypes.find((t) => t.value === type)
    return sensorType ? sensorType.label : type
  }

  const stats = {
    total: sensors.length,
    active: sensors.filter((s) => s.status === "active").length,
    alert: sensors.filter((s) => s.status === "alert").length,
    inactive: sensors.filter((s) => s.status === "inactive").length,
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Sensores</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Activos</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Power className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">En Alerta</p>
                <p className="text-2xl font-bold text-red-600">{stats.alert}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Inactivos</p>
                <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
              </div>
              <div className="h-8 w-8 bg-gray-500 rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">I</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de sensores */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-600" />
                Gestión de Sensores
              </CardTitle>
              <CardDescription>Administra todos los sensores del sistema</CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar Sensor
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Sensor</DialogTitle>
                  <DialogDescription>Completa la información del nuevo sensor</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Nombre
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="col-span-3"
                      placeholder="Ej: Estación Meteorológica Norte"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Tipo
                    </Label>
                    <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {sensorTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Ubicación
                    </Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="col-span-3"
                      placeholder="Ej: Campo Norte - Sector A"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lat" className="text-right">
                      Latitud
                    </Label>
                    <Input
                      id="lat"
                      type="number"
                      step="any"
                      value={formData.coordinates.lat}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coordinates: { ...formData.coordinates, lat: Number.parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="col-span-3"
                      placeholder="-34.6037"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lng" className="text-right">
                      Longitud
                    </Label>
                    <Input
                      id="lng"
                      type="number"
                      step="any"
                      value={formData.coordinates.lng}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coordinates: { ...formData.coordinates, lng: Number.parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="col-span-3"
                      placeholder="-58.3816"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleAddSensor}>
                    Agregar Sensor
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Batería</TableHead>
                <TableHead>Señal</TableHead>
                <TableHead>Última Act.</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sensors.map((sensor) => (
                <TableRow key={sensor.id}>
                  <TableCell className="font-medium">{sensor.name}</TableCell>
                  <TableCell>{getSensorTypeLabel(sensor.type)}</TableCell>
                  <TableCell>{sensor.location}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(sensor.status)}>{getStatusText(sensor.status)}</Badge>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${
                        sensor.batteryLevel < 20
                          ? "text-red-500"
                          : sensor.batteryLevel < 50
                            ? "text-yellow-500"
                            : "text-green-500"
                      }`}
                    >
                      {sensor.batteryLevel}%
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${
                        sensor.signalStrength < 30
                          ? "text-red-500"
                          : sensor.signalStrength < 70
                            ? "text-yellow-500"
                            : "text-green-500"
                      }`}
                    >
                      {sensor.signalStrength}%
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(sensor.lastUpdate).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(sensor)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar sensor?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta acción no se puede deshacer. Se eliminará permanentemente el sensor "{sensor.name}" y
                              todos sus datos asociados.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteSensor(sensor.id)}>
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Sensor</DialogTitle>
            <DialogDescription>Modifica la información del sensor</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Nombre
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                Tipo
              </Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sensorTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-location" className="text-right">
                Ubicación
              </Label>
              <Input
                id="edit-location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-lat" className="text-right">
                Latitud
              </Label>
              <Input
                id="edit-lat"
                type="number"
                step="any"
                value={formData.coordinates.lat}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coordinates: { ...formData.coordinates, lat: Number.parseFloat(e.target.value) || 0 },
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-lng" className="text-right">
                Longitud
              </Label>
              <Input
                id="edit-lng"
                type="number"
                step="any"
                value={formData.coordinates.lng}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coordinates: { ...formData.coordinates, lng: Number.parseFloat(e.target.value) || 0 },
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEditSensor}>
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
