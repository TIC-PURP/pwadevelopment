"use client"

import { Button } from "@/components/ui/button"
import { BarChart3, Database, Settings, Menu } from "lucide-react"
import { useRouter } from "next/navigation"

export function SidebarNavigation() {
  const router = useRouter()

  const navigationItems = [
    { icon: BarChart3, label: "Informes", active: true, onClick: () => {} },
    { icon: Database, label: "Datos", active: false, onClick: () => router.push("/") },
    { icon: Settings, label: "Ajustes", active: false, onClick: () => router.push("/configuracion") },
  ]

  return (
    <div className="absolute left-0 top-0 bottom-0 w-20 bg-slate-800/90 backdrop-blur-md z-30 flex flex-col items-center py-4 border-r border-slate-700/50">
      {/* Menu Button */}
      <Button variant="ghost" size="sm" className="w-12 h-12 mb-6 text-white hover:bg-white/10">
        <Menu className="h-5 w-5" />
      </Button>

      {/* Navigation Items */}
      <div className="flex flex-col gap-2">
        {navigationItems.map((item, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className={`w-12 h-12 flex flex-col items-center gap-1 text-xs transition-all duration-200 ${
              item.active
                ? "text-cyan-400 bg-cyan-400/20 border border-cyan-400/30 shadow-lg shadow-cyan-400/20"
                : "text-slate-400 hover:text-white hover:bg-white/10"
            }`}
            onClick={item.onClick}
          >
            <item.icon className="h-4 w-4" />
            <span className="text-[10px]">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}
