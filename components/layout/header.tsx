"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SyncButton } from "./sync-button"
import { ArrowLeft, Menu } from "lucide-react"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface HeaderProps {
  title: string
  showBack?: boolean
  showSync?: boolean
  showMenu?: boolean
  onMenuClick?: () => void
}

export function Header({ title, showBack = false, showSync = true, showMenu = false, onMenuClick }: HeaderProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleBack = () => {
    router.back()
  }

  const menuItems = [
    { label: "Inicio", href: "/" },
    { label: "Productores", href: "/productores" },
    { label: "Visitas", href: "/visitas/nueva" },
    { label: "Agenda", href: "/agenda" },
    { label: "CRM", href: "/crm" },
    { label: "Historial", href: "/historial" },
    { label: "Configuración", href: "/configuracion" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button variant="ghost" size="sm" onClick={handleBack} className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Volver</span>
            </Button>
          )}

          {showMenu && (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <nav className="flex flex-col gap-2 mt-6">
                  {menuItems.map((item) => (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className="justify-start"
                      onClick={() => {
                        router.push(item.href)
                        setIsMenuOpen(false)
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          )}

          <h1 className="text-lg font-semibold truncate">{title}</h1>
        </div>

        {showSync && (
          <div className="flex items-center gap-2">
            <SyncButton />
          </div>
        )}
      </div>
    </header>
  )
}
