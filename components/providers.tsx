"use client"

import type React from "react"

import { Provider } from "react-redux"
import { store } from "@/lib/store"
import { ThemeProvider } from "@/components/theme-provider"
import { OnlineStatusProvider } from "@/components/online-status-provider"
import { Toaster } from "@/components/ui/toaster"
import { StateLoader } from "@/components/state-loader"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <OnlineStatusProvider>
          <StateLoader />
          {children}
          <Toaster />
        </OnlineStatusProvider>
      </ThemeProvider>
    </Provider>
  )
}
