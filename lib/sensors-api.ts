interface SensorData {
  id: string
  name: string
  type: string
  value: number
  unit: string
  status: "active" | "inactive" | "alert"
  battery: number
  signal: number
  lastUpdate: string
  coordinates?: { lat: number; lng: number }
}

interface HistoricalData {
  timestamp: string
  temperature: number
  humidity: number
  wind_speed: number
  solar_radiation: number
  soil_humidity: number
  precipitation: number
}

// Simulación de datos de sensores
export async function fetchSensorsData(fieldId: string): Promise<SensorData[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const baseData = [
    {
      id: "temp-001",
      name: "Temperatura Ambiente",
      type: "temperature",
      unit: "°C",
      coordinates: { lat: -34.6037, lng: -58.3816 },
    },
    {
      id: "hum-001",
      name: "Humedad Relativa",
      type: "humidity",
      unit: "%",
      coordinates: { lat: -34.6047, lng: -58.3826 },
    },
    {
      id: "wind-001",
      name: "Velocidad del Viento",
      type: "wind_speed",
      unit: "km/h",
      coordinates: { lat: -34.6057, lng: -58.3836 },
    },
    {
      id: "wind-dir-001",
      name: "Dirección del Viento",
      type: "wind_direction",
      unit: "° (SO)",
      coordinates: { lat: -34.6057, lng: -58.3836 },
    },
    {
      id: "solar-001",
      name: "Radiación Solar",
      type: "solar_radiation",
      unit: "W/m²",
      coordinates: { lat: -34.6067, lng: -58.3846 },
    },
    {
      id: "rain-001",
      name: "Precipitación",
      type: "precipitation",
      unit: "mm",
      coordinates: { lat: -34.6077, lng: -58.3856 },
    },
    {
      id: "soil-001",
      name: "Humedad del Suelo",
      type: "soil_humidity",
      unit: "%",
      coordinates: { lat: -34.6087, lng: -58.3866 },
    },
  ]

  return baseData.map((sensor) => ({
    ...sensor,
    value: generateRealisticValue(sensor.type),
    status: Math.random() > 0.8 ? "alert" : Math.random() > 0.1 ? "active" : "inactive",
    battery: Math.floor(Math.random() * 40) + 60, // 60-100%
    signal: Math.floor(Math.random() * 30) + 70, // 70-100%
    lastUpdate: `Hace ${Math.floor(Math.random() * 10) + 1} min`,
  })) as SensorData[]
}

function generateRealisticValue(type: string): number {
  const now = new Date()
  const hour = now.getHours()

  switch (type) {
    case "temperature":
      // Temperatura más alta durante el día
      const baseTemp = 20 + Math.sin(((hour - 6) * Math.PI) / 12) * 8
      return Math.round((baseTemp + Math.random() * 4 - 2) * 10) / 10

    case "humidity":
      // Humedad más alta en la noche
      const baseHumidity = 60 - Math.sin(((hour - 6) * Math.PI) / 12) * 15
      return Math.round(baseHumidity + Math.random() * 10 - 5)

    case "wind_speed":
      return Math.round((Math.random() * 15 + 5) * 10) / 10

    case "wind_direction":
      return Math.floor(Math.random() * 360)

    case "solar_radiation":
      // Radiación solar solo durante el día
      if (hour < 6 || hour > 18) return Math.round(Math.random() * 50)
      const baseSolar = Math.sin(((hour - 6) * Math.PI) / 12) * 800 + 200
      return Math.round(baseSolar + Math.random() * 100 - 50)

    case "precipitation":
      return Math.round(Math.random() * 5 * 10) / 10

    case "soil_humidity":
      return Math.round((40 + Math.random() * 20) * 10) / 10

    default:
      return Math.round(Math.random() * 100 * 10) / 10
  }
}

export async function fetchHistoricalData(
  sensorIds: string[],
  startDate: Date,
  endDate: Date,
): Promise<HistoricalData[]> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 800))

  const data: HistoricalData[] = []
  const now = new Date()

  // Generar datos para las últimas 24 horas
  for (let i = 23; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
    data.push({
      timestamp: timestamp.toISOString(),
      temperature: generateRealisticValue("temperature"),
      humidity: generateRealisticValue("humidity"),
      wind_speed: generateRealisticValue("wind_speed"),
      solar_radiation: generateRealisticValue("solar_radiation"),
      soil_humidity: generateRealisticValue("soil_humidity"),
      precipitation: generateRealisticValue("precipitation"),
    })
  }

  return data
}

export async function updateSensorConfiguration(sensorId: string, config: Partial<SensorData>): Promise<boolean> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Simular éxito/fallo
  return Math.random() > 0.1
}

export async function calibrateSensor(sensorId: string): Promise<boolean> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Simular éxito/fallo
  return Math.random() > 0.05
}

export async function testSensorConnection(sensorId: string): Promise<{
  success: boolean
  latency: number
  signalStrength: number
}> {
  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1500))

  return {
    success: Math.random() > 0.1,
    latency: Math.floor(Math.random() * 200) + 50, // 50-250ms
    signalStrength: Math.floor(Math.random() * 30) + 70, // 70-100%
  }
}
