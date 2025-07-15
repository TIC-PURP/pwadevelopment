// layout.tsx: layout global aplicado a todas las rutas. Se usa para envolver la app con providers como AuthProvider.

"use client"
import type React from "react"
// import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeController } from "@/components/theme-controller"
import { VoiceAssistant } from "@/components/ai-assistant/voice-assistant"
import { usePathname } from "next/navigation"

const inter = Inter({ subsets: ["latin"] })

/* export const metadata: Metadata = {
  title: "PURP AgriTech",
  description: "Aplicación de gestión agrícola",
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  generator: "v0.dev",
} */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
          <Providers>
            <ThemeController />
            {children}
            {pathname !== "/login" && <VoiceAssistant />}
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
