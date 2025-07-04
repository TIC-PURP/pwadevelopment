import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PURP",
    short_name: "PURP",
    description: "Aplicación para técnicos agrícolas - Gestión de visitas y productores",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#16a34a",
    orientation: "portrait",
    categories: ["agriculture", "productivity", "business"],
    icons: [
      {
        src: "//icons/Espiga-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "//icons/Espiga-icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  }
}
