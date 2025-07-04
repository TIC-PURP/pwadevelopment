"use client"

import { useRef, useEffect } from "react"

interface SiriOrbProps {
  activo: boolean
  modo: "normal" | "susurro" | "grito"
  audioLevel?: number
}

export function SiriOrb({ activo, modo, audioLevel = 0 }: SiriOrbProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animate = () => {
      const width = canvas.width
      const height = canvas.height
      const centerX = width / 2
      const centerY = height / 2

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Base radius and animation parameters
      let baseRadius = activo ? 60 : 40
      let pulseIntensity = activo ? 0.3 : 0.1
      let waveCount = 3

      // Adjust based on mode
      switch (modo) {
        case "susurro":
          baseRadius *= 0.8
          pulseIntensity *= 0.5
          waveCount = 2
          break
        case "grito":
          baseRadius *= 1.3
          pulseIntensity *= 2
          waveCount = 5
          break
      }

      // React to audio level
      const audioReaction = audioLevel * 20
      baseRadius += audioReaction

      // Create multiple layers for depth
      for (let layer = 0; layer < 3; layer++) {
        const layerRadius = baseRadius - layer * 15
        const layerAlpha = 0.8 - layer * 0.2

        // Create gradient
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, layerRadius + 20)

        if (activo) {
          gradient.addColorStop(0, `rgba(147, 51, 234, ${layerAlpha})`) // Purple
          gradient.addColorStop(0.3, `rgba(59, 130, 246, ${layerAlpha * 0.8})`) // Blue
          gradient.addColorStop(0.6, `rgba(236, 72, 153, ${layerAlpha * 0.6})`) // Pink
          gradient.addColorStop(1, `rgba(147, 51, 234, 0)`)
        } else {
          gradient.addColorStop(0, `rgba(100, 116, 139, ${layerAlpha * 0.5})`) // Gray
          gradient.addColorStop(0.5, `rgba(71, 85, 105, ${layerAlpha * 0.3})`)
          gradient.addColorStop(1, `rgba(71, 85, 105, 0)`)
        }

        ctx.fillStyle = gradient

        // Draw animated waves
        ctx.beginPath()
        for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
          const wave1 = Math.sin(timeRef.current * 0.02 + angle * waveCount) * pulseIntensity
          const wave2 = Math.cos(timeRef.current * 0.03 + angle * (waveCount + 1)) * pulseIntensity * 0.5
          const radius = layerRadius + wave1 * 10 + wave2 * 5

          const x = centerX + Math.cos(angle) * radius
          const y = centerY + Math.sin(angle) * radius

          if (angle === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()
        ctx.fill()

        // Add glow effect
        if (layer === 0 && activo) {
          ctx.shadowColor = modo === "grito" ? "#ec4899" : "#3b82f6"
          ctx.shadowBlur = 20
          ctx.shadowOffsetX = 0
          ctx.shadowOffsetY = 0
          ctx.fill()
          ctx.shadowBlur = 0
        }
      }

      // Update time without triggering React re-render
      timeRef.current += 1
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [activo, modo, audioLevel])

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={200} height={200} className="w-32 h-32 md:w-40 md:h-40" />
      {activo && <div className="absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-20" />}
    </div>
  )
}
