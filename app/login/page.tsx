"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { login } from "@/lib/slices/authSlice"
import { useToast } from "@/hooks/use-toast"
import { Leaf, Mail, Lock } from "lucide-react"
import { verifyPassword, hashPassword } from "@/lib/crypto"

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const { users } = useAppSelector((state) => state.users)

  const [isLoading, setIsLoading] = useState(false)
  const [emailForm, setEmailForm] = useState({
    email: "",
    password: "",
  })

  // Inicializar contraseña del manager si no existe
  useEffect(() => {
    const initializeManagerPassword = async () => {
      const manager = users.find((u) => u.email === "manager@purp.com.mx")
      if (manager && manager.password === "hashed_password_here") {
        // Encriptar la contraseña inicial
        const hashedPassword = await hashPassword("purp2025@")
        // Aquí normalmente actualizarías en la base de datos
        // Por ahora solo mostramos en consola para desarrollo
        console.log("Manager password hash:", hashedPassword)
      }
    }
    initializeManagerPassword()
  }, [users])

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, router])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Buscar usuario por email
      const user = users.find((u) => u.email === emailForm.email)

      if (!user) {
        toast({
          title: "Usuario no encontrado",
          description: "No existe un usuario con este correo electrónico",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Verificar contraseña
      let passwordValid = false

      // Para el manager inicial, verificar contraseña directa
      if (user.email === "manager@purp.com.mx" && emailForm.password === "purp2025@") {
        passwordValid = true
      } else {
        // Para otros usuarios, verificar hash
        passwordValid = await verifyPassword(emailForm.password, user.password)
      }

      if (!passwordValid) {
        toast({
          title: "Contraseña incorrecta",
          description: "La contraseña ingresada no es correcta",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Login exitoso
      dispatch(
        login({
          email: user.email,
          role: user.role,
        }),
      )

      toast({
        title: "Bienvenido",
        description: `Has iniciado sesión como ${user.role}`,
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al iniciar sesión",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-500 p-3 rounded-full">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">PURP AgriTech</CardTitle>
          <CardDescription>Inicia sesión para acceder al sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@purp.com.mx"
                  value={emailForm.email}
                  onChange={(e) => setEmailForm((prev) => ({ ...prev, email: e.target.value }))}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  value={emailForm.password}
                  onChange={(e) => setEmailForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
