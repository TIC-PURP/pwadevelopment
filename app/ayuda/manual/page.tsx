"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Header } from "@/components/layout/header"
import {
  BookOpen,
  Search,
  WifiOff,
  Download,
  Upload,
  RefreshCw,
  Smartphone,
  Users,
  Calendar,
  FileText,
  Satellite,
  Activity,
  Brain,
  QrCode,
  HelpCircle,
} from "lucide-react"

const helpArticles = [
  {
    id: "sync",
    title: "¿Cómo sincronizar datos con la nube?",
    category: "Sincronización",
    icon: RefreshCw,
    content: `
      La sincronización te permite mantener tus datos actualizados entre dispositivos:
      
      **Sincronización automática:**
      • Se ejecuta automáticamente cuando tienes conexión
      • Los datos se sincronizan en segundo plano
      
      **Sincronización manual:**
      1. Ve a Configuración
      2. En "Estado de conexión" presiona "Sincronizar datos"
      3. Espera a que termine el proceso
      
      **¿Qué se sincroniza?**
      • Productores y sus datos
      • Visitas realizadas
      • Dictámenes creados
      • Agenda y citas
      • Configuraciones de la app
    `,
    tags: ["sincronización", "nube", "datos"],
  },
  {
    id: "offline",
    title: "¿Qué pasa si trabajo en modo offline?",
    category: "Modo Offline",
    icon: WifiOff,
    content: `
      El modo offline te permite trabajar sin conexión a internet:
      
      **Funciones disponibles offline:**
      • Crear y editar productores
      • Registrar visitas
      • Crear dictámenes
      • Tomar fotos y firmas
      • Consultar datos guardados
      
      **Limitaciones offline:**
      • No se pueden sincronizar datos
      • Mapas satelitales no se actualizan
      • Diagnóstico IA no funciona
      
      **Activar modo offline forzado:**
      1. Ve a Configuración
      2. Activa "Modo offline forzado"
      3. La app funcionará sin conexión
    `,
    tags: ["offline", "sin conexión", "trabajo"],
  },
  {
    id: "export",
    title: "¿Cómo exportar mis datos localmente?",
    category: "Gestión de Datos",
    icon: Download,
    content: `
      Puedes exportar todos tus datos para hacer respaldos:
      
      **Pasos para exportar:**
      1. Ve a Configuración
      2. En "Gestión de datos" presiona "Exportar datos"
      3. Se descargará un archivo JSON con todos tus datos
      4. Guarda el archivo en un lugar seguro
      
      **¿Qué incluye la exportación?**
      • Todos los productores
      • Historial de visitas
      • Dictámenes y reportes
      • Configuraciones personales
      • Datos de agenda y CRM
      
      **Recomendación:**
      Exporta tus datos regularmente como respaldo
    `,
    tags: ["exportar", "respaldo", "datos"],
  },
  {
    id: "import",
    title: "¿Cómo importar datos desde un respaldo?",
    category: "Gestión de Datos",
    icon: Upload,
    content: `
      Restaura tus datos desde un archivo de respaldo:
      
      **Pasos para importar:**
      1. Ve a Configuración
      2. En "Gestión de datos" presiona "Importar datos"
      3. Selecciona el archivo JSON de respaldo
      4. Confirma la importación
      5. La app se recargará automáticamente
      
      **⚠️ Importante:**
      • La importación sobrescribe todos los datos actuales
      • Asegúrate de tener un respaldo antes de importar
      • Solo acepta archivos JSON válidos
      
      **Casos de uso:**
      • Restaurar datos después de reinstalar
      • Migrar datos entre dispositivos
      • Recuperar información perdida
    `,
    tags: ["importar", "restaurar", "respaldo"],
  },
  {
    id: "producers",
    title: "¿Cómo gestionar productores?",
    category: "Productores",
    icon: Users,
    content: `
      Los productores son el núcleo de tu gestión agrícola:
      
      **Crear un productor:**
      1. Ve a la sección "Productores"
      2. Presiona el botón "+"
      3. Completa la información básica
      4. Agrega ubicación en el mapa
      5. Guarda los cambios
      
      **Información que puedes registrar:**
      • Datos personales y de contacto
      • Ubicación geográfica
      • Tipo de cultivos
      • Historial de visitas
      • Dictámenes técnicos
      
      **Funciones adicionales:**
      • Buscar productores por nombre
      • Filtrar por ubicación
      • Ver historial completo
      • Generar reportes
    `,
    tags: ["productores", "gestión", "agricultores"],
  },
  {
    id: "visits",
    title: "¿Cómo registrar visitas técnicas?",
    category: "Visitas",
    icon: Calendar,
    content: `
      Registra y documenta todas tus visitas técnicas:
      
      **Crear una visita:**
      1. Selecciona un productor
      2. Ve a "Visitas" y presiona "Nueva visita"
      3. Completa los detalles de la visita
      4. Toma fotos si es necesario
      5. Registra observaciones
      6. Guarda la visita
      
      **Información a registrar:**
      • Fecha y hora de la visita
      • Propósito de la visita
      • Observaciones técnicas
      • Fotografías del cultivo
      • Recomendaciones
      • Firma del productor
      
      **Beneficios:**
      • Historial completo de actividades
      • Seguimiento de recomendaciones
      • Documentación legal
    `,
    tags: ["visitas", "técnicas", "registro"],
  },
  {
    id: "dictamenes",
    title: "¿Cómo crear dictámenes técnicos?",
    category: "Dictámenes",
    icon: FileText,
    content: `
      Los dictámenes son documentos técnicos oficiales:
      
      **Crear un dictamen:**
      1. Desde un productor, ve a "Dictámenes"
      2. Presiona "Nuevo dictamen"
      3. Selecciona el tipo de dictamen
      4. Completa toda la información técnica
      5. Agrega fotografías y evidencias
      6. Genera el PDF final
      
      **Tipos de dictamen:**
      • Evaluación de cultivos
      • Certificación orgánica
      • Análisis de suelos
      • Recomendaciones técnicas
      
      **Características:**
      • Formato profesional
      • Exportación a PDF
      • Firma digital
      • Numeración automática
      • Validez legal
    `,
    tags: ["dictámenes", "técnicos", "documentos"],
  },
  {
    id: "satellite",
    title: "¿Cómo usar el monitoreo satelital?",
    category: "Monitoreo",
    icon: Satellite,
    content: `
      El monitoreo satelital te permite analizar cultivos desde el espacio:
      
      **Acceder al monitoreo:**
      1. Ve a "Monitoreo Satelital"
      2. Selecciona la parcela a analizar
      3. Elige el tipo de análisis
      4. Configura las fechas
      5. Visualiza los resultados
      
      **Tipos de análisis disponibles:**
      • NDVI (Índice de vegetación)
      • Análisis de humedad
      • Detección de estrés
      • Comparación temporal
      
      **Beneficios:**
      • Monitoreo remoto de cultivos
      • Detección temprana de problemas
      • Optimización de recursos
      • Análisis histórico
      
      **Requisitos:**
      • Conexión a internet
      • Coordenadas GPS precisas
    `,
    tags: ["satelital", "monitoreo", "NDVI"],
  },
  {
    id: "sensors",
    title: "¿Cómo configurar sensores IoT?",
    category: "Sensores",
    icon: Activity,
    content: `
      Los sensores IoT proporcionan datos en tiempo real:
      
      **Configurar sensores:**
      1. Ve a la sección "Sensores"
      2. Presiona "Agregar sensor"
      3. Configura el tipo de sensor
      4. Establece ubicación
      5. Define alertas y umbrales
      
      **Tipos de sensores:**
      • Humedad del suelo
      • Temperatura ambiente
      • pH del suelo
      • Conductividad eléctrica
      • Radiación solar
      
      **Funciones:**
      • Monitoreo en tiempo real
      • Alertas automáticas
      • Gráficos históricos
      • Exportación de datos
      
      **Configuración de alertas:**
      • Define valores mínimos y máximos
      • Recibe notificaciones push
      • Programa acciones automáticas
    `,
    tags: ["sensores", "IoT", "tiempo real"],
  },
  {
    id: "ai-diagnosis",
    title: "¿Cómo usar el diagnóstico con IA?",
    category: "Inteligencia Artificial",
    icon: Brain,
    content: `
      El diagnóstico con IA identifica problemas en cultivos:
      
      **Usar el diagnóstico:**
      1. Ve a "Diagnóstico IA"
      2. Selecciona el tipo de cultivo
      3. Toma una foto clara de la planta
      4. Espera el análisis automático
      5. Revisa los resultados y recomendaciones
      
      **Cultivos soportados:**
      • Maíz
      • Trigo
      • Soja
      • Tomate
      • Café
      • Y más...
      
      **Qué puede detectar:**
      • Enfermedades fungales
      • Plagas comunes
      • Deficiencias nutricionales
      • Estrés hídrico
      
      **Consejos para mejores resultados:**
      • Usa buena iluminación
      • Enfoca bien la imagen
      • Incluye hojas afectadas
      • Evita sombras excesivas
      
      **Limitaciones:**
      • Requiere conexión a internet
      • Precisión del 85-90%
      • Siempre consulta con un experto
    `,
    tags: ["IA", "diagnóstico", "cultivos"],
  },
  {
    id: "qr-operations",
    title: "¿Cómo usar el sistema de QR para operaciones?",
    category: "Operaciones",
    icon: QrCode,
    content: `
      El sistema QR facilita el control de entrada y salida:
      
      **Escanear códigos QR:**
      1. Ve a "Operaciones"
      2. Selecciona "Escáner QR"
      3. Apunta la cámara al código QR
      4. El sistema detectará automáticamente si es entrada o salida
      5. Completa el formulario correspondiente
      
      **Tipos de operación:**
      • Entrada de personal
      • Salida de personal
      • Registro de visitantes
      • Control de acceso
      
      **Información registrada:**
      • Fecha y hora exacta
      • Datos del personal
      • Tipo de operación
      • Ubicación GPS
      
      **Beneficios:**
      • Control automático
      • Registro preciso
      • Reducción de errores
      • Trazabilidad completa
      
      **Requisitos:**
      • Cámara del dispositivo
      • Códigos QR válidos
      • Permisos de cámara activados
    `,
    tags: ["QR", "operaciones", "control"],
  },
  {
    id: "pwa-install",
    title: "¿Cómo instalar la app en mi dispositivo?",
    category: "Instalación",
    icon: Smartphone,
    content: `
      Instala la app como una aplicación nativa:
      
      **En Android (Chrome):**
      1. Abre la app en Chrome
      2. Toca el menú (3 puntos)
      3. Selecciona "Instalar aplicación"
      4. Confirma la instalación
      5. La app aparecerá en tu pantalla de inicio
      
      **En iOS (Safari):**
      1. Abre la app en Safari
      2. Toca el botón de compartir
      3. Selecciona "Agregar a pantalla de inicio"
      4. Confirma el nombre de la app
      5. Toca "Agregar"
      
      **Ventajas de instalar:**
      • Acceso directo desde pantalla de inicio
      • Funciona offline
      • Notificaciones push
      • Experiencia como app nativa
      • Menos consumo de batería
      
      **Requisitos:**
      • Navegador compatible
      • Conexión a internet para la instalación inicial
    `,
    tags: ["PWA", "instalación", "móvil"],
  },
]

export default function ManualAyudaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = ["all", ...Array.from(new Set(helpArticles.map((article) => article.category)))]

  const filteredArticles = helpArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <Header title="Manual de ayuda" showBack />

      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-500" />
              Servicios de ayuda
            </CardTitle>
            <CardDescription>
              Encuentra respuestas a las preguntas más frecuentes sobre el uso de la aplicación
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Búsqueda y filtros */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar en el manual..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-xs"
                >
                  {category === "all" ? "Todas" : category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="space-y-4">
          {filteredArticles.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No se encontraron resultados</h3>
                <p className="text-muted-foreground">
                  Intenta con otros términos de búsqueda o selecciona una categoría diferente
                </p>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredArticles.map((article) => {
                const IconComponent = article.icon
                return (
                  <Card key={article.id}>
                    <AccordionItem value={article.id} className="border-none">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          <IconComponent className="h-5 w-5 text-blue-500 flex-shrink-0" />
                          <div>
                            <h3 className="font-semibold">{article.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {article.category}
                              </Badge>
                              <div className="flex gap-1">
                                {article.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="prose prose-sm max-w-none">
                          {article.content.split("\n").map((paragraph, index) => {
                            if (paragraph.trim() === "") return null

                            if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                              return (
                                <h4 key={index} className="font-semibold text-foreground mt-4 mb-2">
                                  {paragraph.replace(/\*\*/g, "")}
                                </h4>
                              )
                            }

                            if (paragraph.startsWith("•")) {
                              return (
                                <li key={index} className="ml-4 text-muted-foreground">
                                  {paragraph.substring(1).trim()}
                                </li>
                              )
                            }

                            if (paragraph.match(/^\d+\./)) {
                              return (
                                <li key={index} className="ml-4 text-muted-foreground list-decimal">
                                  {paragraph.replace(/^\d+\.\s*/, "")}
                                </li>
                              )
                            }

                            return (
                              <p key={index} className="text-muted-foreground mb-2">
                                {paragraph}
                              </p>
                            )
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Card>
                )
              })}
            </Accordion>
          )}
        </div>

        {/* Footer con estadísticas */}
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">
              {filteredArticles.length} de {helpArticles.length} artículos mostrados
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              ¿No encuentras lo que buscas? Usa el buzón de ayuda para contactarnos
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
