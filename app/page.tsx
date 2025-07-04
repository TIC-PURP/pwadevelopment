"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { logout } from "@/lib/slices/authSlice"
import { SyncButton } from "@/components/layout/sync-button"
import { Users, Leaf, Settings, LogOut, Shield, Factory, Satellite, Camera, Radio, Palette } from "lucide-react"
import Link from "next/link"
import { InstallPrompt } from "@/components/install-prompt"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isOnline } = useAppSelector((state: any) => state.app)
  const { visitas } = useAppSelector((state) => state.visitas)
  const { productores } = useAppSelector((state) => state.productores)
  const { userRole, userEmail } = useAppSelector((state) => state.auth)

  const pendingVisitas = visitas.filter((v) => !v.sincronizado).length

   if (!userEmail) {
    if (typeof window !== "undefined") {
      router.replace("/login")
    }
    return null
  }
  const handleLogout = () => {
    if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      dispatch(logout())
    }
  }

  const modules = [
    {
      title: "Asesoría Técnica",
      description: `${productores.length} productores registrados`,
      icon: Users,
      href: "/productores",
      color: "bg-green-500",
      available: true,
    },
    {
      title: "Diagnóstico IA",
      description: "Detecta enfermedades y plagas con inteligencia artificial",
      icon: Camera,
      href: "/diagnostico-ia",
      color: "bg-emerald-500",
      available: true,
    },
    {
      title: "Sensores",
      description: "Monitoreo en tiempo real de condiciones agrícolas",
      icon: Radio,
      href: "/sensores",
      color: "bg-cyan-500",
      available: true,
    },
    {
      title: "Monitoreo Satelital",
      description: "Análisis geoespacial y seguimiento de cultivos",
      icon: Satellite,
      href: "/monitoreo-satelital",
      color: "bg-purple-500",
      available: true,
    },
    {
      title: "PURP STUDIO",
      description: "Editor visual drag & drop para crear interfaces",
      icon: Palette,
      href: "/purp-studio",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      available: userRole === "Manager",
      disabled: false,
      isNew: true,
    },
    {
      title: "Panel de Control",
      description: "Gestión de usuarios y administración del sistema",
      icon: Shield,
      href: "/panel-control",
      color: "bg-blue-500",
      available: userRole === "Manager",
      disabled: false,
    },
    {
      title: "Operaciones",
      description: "Gestión de operaciones y procesos industriales",
      icon: Factory,
      href: "/operaciones",
      color: "bg-indigo-500",
      available: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-2 rounded-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">PURP</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">PURP SA de CV</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant={isOnline ? "default" : "destructive"}>{isOnline ? "Online" : "Offline"}</Badge>
              {pendingVisitas > 0 && <Badge variant="secondary">{pendingVisitas} pendientes</Badge>}
              {userRole && (
                <Badge variant="outline" className="text-xs">
                  {userRole === "Manager" ? "Manager" : "Técnico"}
                </Badge>
              )}
              {userEmail && <span className="text-xs text-gray-600 dark:text-gray-400">{userEmail}</span>}
              <Link href="/configuracion">
                <Button variant="ghost" size="sm" className="p-2">
                  <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="p-2" onClick={handleLogout}>
                <LogOut className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {modules.map((module) => (
            <div key={module.title} className="relative">
              {module.available ? (
                <Link href={module.href}>
                  <Card
                    className={`hover:shadow-lg transition-all duration-300 cursor-pointer h-full transform hover:scale-105 ${
                      module.disabled ? "opacity-60 cursor-not-allowed" : ""
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`${module.color} p-3 rounded-lg shadow-md`}>
                          <module.icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">{module.title}</h3>
                            {module.isNew && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
                              >
                                NUEVO
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{module.description}</p>
                          {module.disabled && (
                            <Badge variant="secondary" className="mt-2 text-xs">
                              Próximamente
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <Card className="opacity-50 cursor-not-allowed h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-gray-400 p-3 rounded-lg">
                        <module.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-500 mb-1">{module.title}</h3>
                        <p className="text-sm text-gray-400">{module.description}</p>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          Acceso restringido
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Productores</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{productores.length}</p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Visitas Realizadas</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{visitas.length}</p>
                </div>
                <div className="h-8 w-8 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white text-sm font-bold">V</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pendientes Sync</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingVisitas}</p>
                </div>
                <div className="h-8 w-8 bg-orange-500 rounded flex items-center justify-center">
                  <span className="text-white text-sm font-bold">P</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <SyncButton />
      <InstallPrompt />
    </div>
  )
}
