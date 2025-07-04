"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { addUser, updateUser, deleteUser } from "@/lib/slices/usersSlice"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff, Users, Shield, Settings, RefreshCw } from "lucide-react"
import Link from "next/link"
import { hashPassword, generateRandomPassword, validatePasswordStrength } from "@/lib/crypto"
import type { User } from "@/lib/slices/usersSlice"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

const modules = [
  { key: "agenda", name: "Agenda" },
  { key: "crm", name: "CRM" },
  { key: "configuracion", name: "Configuración" },
  { key: "productores", name: "Productores" },
  { key: "visitas", name: "Visitas" },
  { key: "dictamenes", name: "Dictámenes" },
  { key: "prospectos", name: "Prospectos" },
  { key: "reportesInspeccion", name: "Reportes de Inspección" },
  { key: "operaciones", name: "Operaciones" },
  { key: "sensores", name: "Sensores" },
  { key: "monitoreoSatelital", name: "Monitoreo Satelital" },
  { key: "diagnosticoIA", name: "Diagnóstico IA" },
  { key: "panelControl", name: "Panel de Control" },
  { key: "historial", name: "Historial" },
  { key: "formularios", name: "Formularios" },
]

const permissionLevels = [
  { value: "sin acceso", label: "Sin Acceso", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  {
    value: "lectura",
    label: "Lectura",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  { value: "editor", label: "Editor", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
]

export default function PanelControlPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { userRole } = useAppSelector((state) => state.auth)
  const { users } = useAppSelector((state) => state.users)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState({ isValid: false, errors: [] as string[] })

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "Usuario" as "Manager" | "Admin" | "Usuario",
    permissions: {} as { [key: string]: "sin acceso" | "lectura" | "editor" },
  })

  // Verificar acceso
  useEffect(() => {
    if (userRole !== "Manager") {
      toast({
        title: "Acceso denegado",
        description: "No tienes permisos para acceder al Panel de Control",
        variant: "destructive",
      })
      router.push("/")
    }
  }, [userRole, router, toast])

  // Inicializar permisos por defecto
  useEffect(() => {
    const defaultPermissions: { [key: string]: "sin acceso" | "lectura" | "editor" } = {}
    modules.forEach((module) => {
      defaultPermissions[module.key] = "sin acceso"
    })

    if (Object.keys(formData.permissions).length === 0) {
      setFormData((prev) => ({ ...prev, permissions: defaultPermissions }))
    }
  }, [])

  // Validar fortaleza de contraseña
  useEffect(() => {
    if (formData.password) {
      setPasswordStrength(validatePasswordStrength(formData.password))
    } else {
      setPasswordStrength({ isValid: false, errors: [] })
    }
  }, [formData.password])

  const resetForm = () => {
    const defaultPermissions: { [key: string]: "sin acceso" | "lectura" | "editor" } = {}
    modules.forEach((module) => {
      defaultPermissions[module.key] = "sin acceso"
    })

    setFormData({
      fullName: "",
      email: "",
      password: "",
      role: "Usuario",
      permissions: defaultPermissions,
    })
    setEditingUser(null)
    setShowPassword(false)
    setPasswordStrength({ isValid: false, errors: [] })
  }

  const handleNewUser = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      fullName: user.fullName,
      email: user.email,
      password: "", // No mostrar contraseña actual
      role: user.role,
      permissions: { ...user.permissions },
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (userId: string) => {
    dispatch(deleteUser(userId))
    toast({
      title: "Usuario eliminado",
      description: "El usuario ha sido eliminado correctamente",
    })
  }

  const generatePassword = () => {
    const newPassword = generateRandomPassword(12)
    setFormData((prev) => ({ ...prev, password: newPassword }))
    toast({
      title: "Contraseña generada",
      description: "Se ha generado una contraseña segura automáticamente",
    })
  }

  const setRolePermissions = (role: "Manager" | "Admin" | "Usuario") => {
    const newPermissions: { [key: string]: "sin acceso" | "lectura" | "editor" } = {}

    modules.forEach((module) => {
      if (role === "Manager") {
        newPermissions[module.key] = "editor"
      } else if (role === "Admin") {
        newPermissions[module.key] = module.key === "panelControl" ? "sin acceso" : "editor"
      } else {
        newPermissions[module.key] = module.key === "panelControl" ? "sin acceso" : "lectura"
      }
    })

    setFormData((prev) => ({ ...prev, permissions: newPermissions }))

    toast({
      title: "Permisos configurados",
      description: `Se han aplicado los permisos por defecto para el rol ${role}`,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validaciones
    if (!formData.fullName || !formData.email || (!formData.password && !editingUser)) {
      toast({
        title: "Campos requeridos",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Validar email único (excepto al editar el mismo usuario)
    const emailExists = users.some((user) => user.email === formData.email && user.id !== editingUser?.id)
    if (emailExists) {
      toast({
        title: "Email ya existe",
        description: "Ya existe un usuario con este correo electrónico",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // Validar fortaleza de contraseña si se proporciona
    if (formData.password && !passwordStrength.isValid) {
      toast({
        title: "Contraseña débil",
        description: "La contraseña no cumple con los requisitos de seguridad",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    try {
      let hashedPassword = editingUser?.password || ""

      // Solo encriptar si se proporciona nueva contraseña
      if (formData.password) {
        hashedPassword = await hashPassword(formData.password)
      }

      const userData: User = {
        id: editingUser?.id || Date.now().toString(),
        fullName: formData.fullName,
        email: formData.email,
        password: hashedPassword,
        role: formData.role,
        permissions: formData.permissions,
        createdAt: editingUser?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      if (editingUser) {
        dispatch(updateUser(userData))
        toast({
          title: "Usuario actualizado",
          description: "Los datos del usuario han sido actualizados correctamente",
        })
      } else {
        dispatch(addUser(userData))
        toast({
          title: "Usuario creado",
          description: `Usuario ${userData.fullName} creado exitosamente`,
        })
      }

      setIsDialogOpen(false)
      resetForm()
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar la solicitud",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updatePermission = (moduleKey: string, permission: "sin acceso" | "lectura" | "editor") => {
    setFormData((prev) => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [moduleKey]: permission,
      },
    }))
  }

  if (userRole !== "Manager") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Volver
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Panel de Control</h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Gestión de usuarios y permisos</p>
                </div>
              </div>
            </div>

            <Button onClick={handleNewUser}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </div>
        </div>
      </header>

      {/* Dialog para crear/editar usuario */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{editingUser ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
            <DialogDescription>
              {editingUser
                ? "Modifica los datos del usuario y sus permisos de acceso al sistema"
                : "Completa los datos del nuevo usuario y configura sus permisos de acceso"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Datos básicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre Completo *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Ej: Juan Pérez García"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="usuario@purp.com.mx"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">
                    Contraseña {editingUser ? "(dejar vacío para mantener actual)" : "*"}
                  </Label>
                  <Button type="button" variant="outline" size="sm" onClick={generatePassword} disabled={isSubmitting}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Generar
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    placeholder={editingUser ? "Nueva contraseña (opcional)" : "Contraseña segura"}
                    disabled={isSubmitting}
                    required={!editingUser}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                {/* Indicador de fortaleza de contraseña */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-full rounded-full ${
                          passwordStrength.isValid ? "bg-green-200" : "bg-red-200"
                        }`}
                      >
                        <div
                          className={`h-full rounded-full transition-all ${
                            passwordStrength.isValid ? "bg-green-500 w-full" : "bg-red-500 w-1/3"
                          }`}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          passwordStrength.isValid ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {passwordStrength.isValid ? "Segura" : "Débil"}
                      </span>
                    </div>

                    {passwordStrength.errors.length > 0 && (
                      <div className="text-xs text-red-600 space-y-1">
                        {passwordStrength.errors.map((error, index) => (
                          <p key={index}>• {error}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rol del Usuario *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "Manager" | "Admin" | "Usuario") => {
                    setFormData((prev) => ({ ...prev, role: value }))
                    setRolePermissions(value)
                  }}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-500" />
                        <span>Manager - Acceso total</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Admin">
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-purple-500" />
                        <span>Admin - Acceso administrativo</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Usuario">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>Usuario - Acceso básico</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Permisos por módulo */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-gray-600" />
                  <Label className="text-lg font-semibold">Permisos por Módulo</Label>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setRolePermissions(formData.role)}
                    disabled={isSubmitting}
                  >
                    Aplicar permisos por rol
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {modules.map((module) => (
                  <Card key={module.key} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Label className="font-medium text-sm">{module.name}</Label>
                      <Badge
                        className={
                          permissionLevels.find((p) => p.value === formData.permissions[module.key])?.color ||
                          "bg-gray-100 text-gray-800"
                        }
                      >
                        {permissionLevels.find((p) => p.value === formData.permissions[module.key])?.label ||
                          "Sin Acceso"}
                      </Badge>
                    </div>
                    <Select
                      value={formData.permissions[module.key] || "sin acceso"}
                      onValueChange={(value: "sin acceso" | "lectura" | "editor") =>
                        updatePermission(module.key, value)
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {permissionLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value}>
                            {level.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Card>
                ))}
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting || (!!formData.password && !passwordStrength.isValid)}>
                {isSubmitting
                  ? editingUser
                    ? "Actualizando..."
                    : "Creando..."
                  : editingUser
                    ? "Actualizar Usuario"
                    : "Crear Usuario"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Usuarios</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{users.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Managers</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {users.filter((u) => u.role === "Manager").length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Admins</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {users.filter((u) => u.role === "Admin").length}
                  </p>
                </div>
                <Settings className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Usuarios</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {users.filter((u) => u.role === "Usuario").length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Lista de Usuarios ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Usuario</th>
                    <th className="text-left py-3 px-4 font-semibold">Rol</th>
                    <th className="text-left py-3 px-4 font-semibold">Permisos Activos</th>
                    <th className="text-left py-3 px-4 font-semibold">Creado</th>
                    <th className="text-left py-3 px-4 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{user.fullName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          className={
                            user.role === "Manager"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : user.role === "Admin"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(user.permissions)
                            .filter(([_, permission]) => permission !== "sin acceso")
                            .slice(0, 2)
                            .map(([module, permission]) => (
                              <Badge key={module} variant="outline" className="text-xs">
                                {modules.find((m) => m.key === module)?.name}: {permission}
                              </Badge>
                            ))}
                          {Object.values(user.permissions).filter((p) => p !== "sin acceso").length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{Object.values(user.permissions).filter((p) => p !== "sin acceso").length - 2} más
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>

                          {user.email !== "manager@purp.com.mx" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente el usuario
                                    <strong> {user.fullName}</strong> y todos sus permisos de acceso.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(user.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Eliminar Usuario
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
