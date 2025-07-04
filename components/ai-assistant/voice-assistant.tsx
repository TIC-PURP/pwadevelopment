"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { Mic, MicOff, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SiriOrb } from "./siri-orb"
import { OpenAIService } from "@/lib/services/openai-service"
import { SpeechService } from "@/lib/services/speech-service"
import {
  activateAssistant,
  deactivateAssistant,
  startListening,
  stopListening,
  setMode,
  setAudioLevel,
  setResponse,
  setProcessing,
  setError,
} from "@/lib/slices/assistantSlice"
import type { RootState } from "@/lib/store"

export function VoiceAssistant() {
  const dispatch = useDispatch()
  const router = useRouter()
  const assistant = useSelector((state: RootState) => state.assistant)
  const isOnline = useSelector((state: RootState) => state.app.isOnline)

  const openAIService = useRef(new OpenAIService())
  const speechService = useRef(new SpeechService())
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [transcript, setTranscript] = useState("")
  const [showInterface, setShowInterface] = useState(false)

  // Audio level monitoring
  useEffect(() => {
    if (assistant.isListening && assistant.isActive) {
      startAudioMonitoring()
    } else {
      stopAudioMonitoring()
    }

    return () => stopAudioMonitoring()
  }, [assistant.isListening, assistant.isActive])

  const startAudioMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      microphoneRef.current = audioContextRef.current.createMediaStreamSource(stream)

      microphoneRef.current.connect(analyserRef.current)
      analyserRef.current.fftSize = 256

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)

      const updateAudioLevel = () => {
        if (analyserRef.current && assistant.isListening) {
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length
          const normalizedLevel = Math.min(average / 128, 1)
          dispatch(setAudioLevel(normalizedLevel))
          requestAnimationFrame(updateAudioLevel)
        }
      }

      updateAudioLevel()
    } catch (error) {
      console.error("Error accessing microphone:", error)
      dispatch(setError("No se pudo acceder al micrófono"))
    }
  }

  const stopAudioMonitoring = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    microphoneRef.current = null
    analyserRef.current = null
    dispatch(setAudioLevel(0))
  }

  const handleMicClick = () => {
    if (!assistant.isActive) {
      dispatch(activateAssistant())
      setShowInterface(true)
      startVoiceRecognition()
    } else {
      handleDeactivate()
    }
  }

  const handleDeactivate = () => {
    dispatch(deactivateAssistant())
    setShowInterface(false)
    setTranscript("")
    speechService.current.stopListening()
    speechService.current.stopSpeaking()
    stopAudioMonitoring()
  }

  const startVoiceRecognition = () => {
    if (!speechService.current.isRecognitionSupported()) {
      dispatch(setError("Reconocimiento de voz no soportado"))
      return
    }

    dispatch(startListening())

    speechService.current.startListening(
      (transcript, isFinal) => {
        setTranscript(transcript)

        if (isFinal) {
          processVoiceCommand(transcript.toLowerCase().trim())
        }
      },
      (error) => {
        dispatch(setError(error))
      },
    )
  }

  const processVoiceCommand = async (command: string) => {
    dispatch(stopListening())
    dispatch(setProcessing(true))

    // Check for activation word
    if (command.includes("asistente") && !assistant.isActive) {
      dispatch(activateAssistant())
      speechService.current.speak("¿En qué puedo ayudarte?")
      setTimeout(() => startVoiceRecognition(), 2000)
      return
    }

    // Check for deactivation
    if (command.includes("finaliza") || command.includes("termina") || command.includes("cierra")) {
      speechService.current.speak("Hasta luego", () => {
        handleDeactivate()
      })
      return
    }

    // Navigation commands
    if (command.includes("ir a") || command.includes("navegar a") || command.includes("abrir")) {
      const route = extractRoute(command)
      if (route) {
        speechService.current.speak(`Navegando a ${route}`, () => {
          router.push(route)
          handleDeactivate()
        })
        return
      }
    }

    // Query commands
    if (
      command.includes("consulta") ||
      command.includes("pregunta") ||
      command.includes("qué") ||
      command.includes("cómo")
    ) {
      let response: string

      if (isOnline) {
        response = await openAIService.current.processQuery(command)
      } else {
        response = openAIService.current.getOfflineResponse(command)
      }

      dispatch(setResponse(response))
      speechService.current.speak(response, () => {
        setTimeout(() => startVoiceRecognition(), 1000)
      })
      return
    }

    // Default response
    speechService.current.speak(
      'No entendí el comando. Puedes decir "ir a" seguido de una sección, hacer una consulta, o decir "finaliza" para cerrar.',
      () => {
        setTimeout(() => startVoiceRecognition(), 2000)
      },
    )
    dispatch(setProcessing(false))
  }

  const extractRoute = (command: string): string | null => {
    const routes: { [key: string]: string } = {
      productores: "/productores",
      productor: "/productores",
      agenda: "/agenda",
      visitas: "/visitas",
      visita: "/visitas",
      crm: "/crm",
      historial: "/historial",
      configuración: "/configuracion",
      configuracion: "/configuracion",
      sensores: "/sensores",
      sensor: "/sensores",
      monitoreo: "/monitoreo-satelital",
      satelital: "/monitoreo-satelital",
      diagnóstico: "/diagnostico-ia",
      diagnostico: "/diagnostico-ia",
      operaciones: "/operaciones",
      operacion: "/operaciones",
      formularios: "/formularios",
      formulario: "/formularios",
      inicio: "/",
      principal: "/",
      home: "/",
    }

    for (const [key, route] of Object.entries(routes)) {
      if (command.includes(key)) {
        return route
      }
    }

    return null
  }

  // Determine mode based on audio level
  useEffect(() => {
    if (assistant.audioLevel > 0.7) {
      dispatch(setMode("grito"))
    } else if (assistant.audioLevel > 0.3) {
      dispatch(setMode("normal"))
    } else if (assistant.audioLevel > 0.1) {
      dispatch(setMode("susurro"))
    } else {
      dispatch(setMode("normal"))
    }
  }, [assistant.audioLevel, dispatch])

  return (
    <>
      {/* Floating Mic Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={handleMicClick}
          size="lg"
          className={`rounded-full w-16 h-16 shadow-lg transition-all duration-300 ${
            assistant.isActive ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {assistant.isActive ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
        </Button>
      </div>

      {/* Assistant Interface */}
      {showInterface && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 space-y-6 bg-transparent">
            <div className="flex justify-end">
              <Button variant="ghost" size="sm" onClick={handleDeactivate} className="text-white hover:bg-white/20">
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex justify-center">
              <SiriOrb activo={assistant.isActive} modo={assistant.mode} audioLevel={assistant.audioLevel} />
            </div>

            <div className="text-center space-y-2">
              {!assistant.isActive && <p className="text-sm text-white/70">Diga "asistente" para comenzar...</p>}

              {assistant.isListening && <p className="text-sm text-blue-300 animate-pulse">Escuchando...</p>}

              {assistant.isProcessing && <p className="text-sm text-yellow-300">Procesando...</p>}

              {transcript && (
                <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg border border-white/20">
                  <p className="text-sm text-white">{transcript}</p>
                </div>
              )}

              {assistant.lastResponse && (
                <div className="bg-blue-500/20 backdrop-blur-sm p-3 rounded-lg border border-blue-300/30">
                  <p className="text-sm text-blue-100">{assistant.lastResponse}</p>
                </div>
              )}

              {assistant.error && (
                <div className="bg-red-500/20 backdrop-blur-sm p-3 rounded-lg border border-red-300/30">
                  <p className="text-sm text-red-100">{assistant.error}</p>
                </div>
              )}
            </div>

            <div className="text-xs text-center text-white/60 space-y-1">
              <p>Comandos disponibles:</p>
              <p>"Ir a [sección]" • "Consulta [pregunta]" • "Finaliza"</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
