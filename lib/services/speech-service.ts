// TypeScript may not have SpeechRecognition in the global scope, so declare it if missing
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }

  // Add missing SpeechRecognitionEvent and SpeechRecognitionAlternative types if not present
  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number
    readonly results: SpeechRecognitionResultList
  }

  interface SpeechRecognitionResultList {
    readonly length: number
    [index: number]: SpeechRecognitionResult
  }

  interface SpeechRecognitionResult {
    readonly length: number
    readonly isFinal: boolean
    [index: number]: SpeechRecognitionAlternative
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string
    readonly confidence: number
  }

  // Add missing SpeechRecognitionErrorEvent type
  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string
    readonly message: string
  }
}

type SpeechRecognition = typeof window.SpeechRecognition extends undefined
  ? any
  : InstanceType<typeof window.SpeechRecognition>

export class SpeechService {
  private recognition: SpeechRecognition | null = null
  private synthesis: SpeechSynthesis | null = null
  private isSupported = false

  constructor() {
    if (typeof window !== "undefined") {
      // Check for speech recognition support
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition()
        this.recognition.continuous = true
        this.recognition.interimResults = true
        this.recognition.lang = "es-ES"
        this.isSupported = true
      }

      // Check for speech synthesis support
      if (window.speechSynthesis) {
        this.synthesis = window.speechSynthesis
      }
    }
  }

  isRecognitionSupported(): boolean {
    return this.isSupported && this.recognition !== null
  }

  isSynthesisSupported(): boolean {
    return this.synthesis !== null
  }

  startListening(onResult: (transcript: string, isFinal: boolean) => void, onError: (error: string) => void): void {
    if (!this.recognition) {
      onError("Reconocimiento de voz no soportado")
      return
    }

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript: string = ""
      let isFinal: boolean = false

      for (let i: number = event.resultIndex; i < event.results.length; i++) {
      transcript += (event.results[i][0] as SpeechRecognitionAlternative).transcript
      if (event.results[i].isFinal) {
        isFinal = true
      }
      }

      onResult(transcript, isFinal)
    }

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      onError(`Error de reconocimiento: ${event.error}`)
    }

    this.recognition.start()
  }

  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop()
    }
  }

  speak(text: string, onEnd?: () => void): void {
    if (!this.synthesis) {
      console.warn("Síntesis de voz no soportada")
      onEnd?.()
      return
    }

    // Cancel any ongoing speech
    this.synthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "es-ES"
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 0.8

    if (onEnd) {
      utterance.onend = onEnd
    }

    this.synthesis.speak(utterance)
  }

  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  }
}
