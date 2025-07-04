// Environment variables validation and type safety
export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL || "",

  // Authentication
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  JWT_SECRET: process.env.JWT_SECRET || "",

  // Google Maps
  GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",

  // API Configuration
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  API_SECRET_KEY: process.env.API_SECRET_KEY || "",

  // PWA Configuration
  PWA_NAME: process.env.NEXT_PUBLIC_PWA_NAME || "PWA Development",
  PWA_SHORT_NAME: process.env.NEXT_PUBLIC_PWA_SHORT_NAME || "PWADev",
  PWA_DESCRIPTION: process.env.NEXT_PUBLIC_PWA_DESCRIPTION || "Progressive Web Application",

  // File Upload
  UPLOAD_URL: process.env.NEXT_PUBLIC_UPLOAD_URL || "/api/upload",
  UPLOAD_SECRET: process.env.UPLOAD_SECRET || "",

  // PDF Generation
  PDF_SERVICE_URL: process.env.PDF_SERVICE_URL || "/api/pdf",
  PDF_API_KEY: process.env.PDF_API_KEY || "",

  // Sync Configuration
  SYNC_INTERVAL: Number.parseInt(process.env.NEXT_PUBLIC_SYNC_INTERVAL || "30000"),
  SYNC_SECRET: process.env.SYNC_SECRET || "",

  // Environment
  NODE_ENV: process.env.NODE_ENV || "development",
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || "development",

  // Cache
  CACHE_VERSION: process.env.NEXT_PUBLIC_CACHE_VERSION || "1.0.0",
  OFFLINE_ENABLED: process.env.NEXT_PUBLIC_OFFLINE_ENABLED === "true",

  // Notifications
  VAPID_PUBLIC_KEY: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY || "",
  VAPID_SUBJECT: process.env.VAPID_SUBJECT || "",

  // External Services
  EXTERNAL_API_URL: process.env.EXTERNAL_API_URL || "",
  EXTERNAL_API_KEY: process.env.EXTERNAL_API_KEY || "",

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE === "true",
} as const

// Type for environment variables
export type EnvConfig = typeof env

// Validation function
export function validateEnv() {
  const requiredVars = ["DATABASE_URL", "NEXTAUTH_SECRET", "JWT_SECRET"]

  const missing = requiredVars.filter((varName) => !process.env[varName])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }
}

// Helper to check if we're in development
export const isDevelopment = env.NODE_ENV === "development"
export const isProduction = env.NODE_ENV === "production"
export const isTest = env.NODE_ENV === "test"
