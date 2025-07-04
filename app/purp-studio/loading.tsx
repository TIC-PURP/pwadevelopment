import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Palette } from "lucide-react"

export default function PurpStudioLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Skeleton */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-16" />
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-xl shadow-lg">
                  <Palette size={24} className="text-white" />
                </div>
                <div>
                  <Skeleton className="h-8 w-40 mb-1" />
                  <Skeleton className="h-4 w-60" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar Skeleton */}
      <div className="px-6 py-4 bg-white/50 backdrop-blur-sm border-b border-gray-200">
        <Card className="w-full">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </div>
              <Skeleton className="h-6 w-32" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Skeleton */}
      <div className="px-6 py-6">
        <div className="flex gap-6 h-[calc(100vh-240px)]">
          {/* Left Sidebar Skeleton */}
          <div className="w-80 h-full flex flex-col gap-4">
            <Card>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-24 mb-4" />
                <Skeleton className="h-10 w-full mb-3" />
                <div className="space-y-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </CardContent>
            </Card>
            <Card className="flex-1">
              <CardContent className="p-4">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="space-y-3">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Canvas Skeleton */}
          <Card className="flex-1 h-full">
            <CardContent className="p-6 h-full">
              <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Cargando PURP Studio...</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Editor Skeleton */}
          <Card className="w-80 h-full">
            <CardContent className="p-4">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="px-6 py-3 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
      </div>
    </div>
  )
}
