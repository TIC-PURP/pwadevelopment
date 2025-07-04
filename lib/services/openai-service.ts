interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export class OpenAIService {
  private apiKey: string | null = null

  constructor() {
    // En producción, esto vendría de variables de entorno
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || null
  }

  async processQuery(query: string): Promise<string> {
    if (!this.apiKey) {
      return "Lo siento, el servicio de IA no está configurado correctamente."
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "Eres un asistente para una aplicación agrícola PWA. Responde de manera concisa y útil sobre temas relacionados con agricultura, gestión de cultivos, y el uso de la aplicación.",
            },
            {
              role: "user",
              content: query,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error("Error en la respuesta de OpenAI")
      }

      const data: OpenAIResponse = await response.json()
      return data.choices[0]?.message?.content || "No pude procesar tu consulta."
    } catch (error) {
      console.error("Error al consultar OpenAI:", error)
      return "Lo siento, no pude procesar tu consulta en este momento."
    }
  }

  // Simulación offline
  getOfflineResponse(query: string): string {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("sincronizar") || lowerQuery.includes("sync")) {
      return "Para sincronizar datos, ve a Configuración > Estado de conexión > Sincronizar datos."
    }

    if (lowerQuery.includes("offline") || lowerQuery.includes("sin conexión")) {
      return "El modo offline te permite trabajar sin internet. Los datos se sincronizarán cuando tengas conexión."
    }

    if (lowerQuery.includes("exportar") || lowerQuery.includes("export")) {
      return "Puedes exportar tus datos desde Configuración > Gestión de datos > Exportar datos."
    }

    if (lowerQuery.includes("productor") || lowerQuery.includes("cliente")) {
      return "Para gestionar productores, ve a la sección Productores desde el menú principal."
    }

    return "Lo siento, no tengo información específica sobre eso. Intenta ser más específico o consulta el manual de ayuda."
  }
}
