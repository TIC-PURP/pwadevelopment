import jsPDF from "jspdf"
import type { Visita } from "@/lib/slices/visitasSlice"

export const generateVisitaPDF = (visita: Visita) => {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(20)
  doc.text("DICTAMEN TÉCNICO AGRÍCOLA", 20, 20)

  doc.setFontSize(12)
  doc.text(`Fecha: ${new Date(visita.fecha).toLocaleDateString()}`, 20, 35)
  doc.text(`ID Visita: ${visita.id}`, 20, 45)

  // Información del Productor
  doc.setFontSize(16)
  doc.text("INFORMACIÓN DEL PRODUCTOR", 20, 65)

  doc.setFontSize(12)
  doc.text(`Nombre: ${visita.productorNombre}`, 20, 80)
  doc.text(`Predio: ${visita.predio}`, 20, 90)
  doc.text(`Localidad: ${visita.localidad}`, 20, 100)

  // Información del Cultivo
  doc.setFontSize(16)
  doc.text("INFORMACIÓN DEL CULTIVO", 20, 120)

  doc.setFontSize(12)
  doc.text(`Cultivo Principal: ${visita.cultivo}`, 20, 135)
  doc.text(`Superficie Total: ${visita.superficieTotal} ha`, 20, 145)
  doc.text(`Superficie Habilitada: ${visita.superficieHabilitada} ha`, 20, 155)
  doc.text(`Tipo de Riego: ${visita.tipoRiego}`, 20, 165)
  doc.text(`Disponibilidad de Agua: ${visita.disponibilidadAgua}`, 20, 175)
  doc.text(`Estado Fenológico: ${visita.estadoFenologico}`, 20, 185)

  // Observaciones Técnicas
  doc.setFontSize(16)
  doc.text("OBSERVACIONES TÉCNICAS", 20, 205)

  doc.setFontSize(12)
  if (visita.plagas) {
    doc.text(`Plagas: ${visita.plagas}`, 20, 220)
  }
  if (visita.enfermedades) {
    doc.text(`Enfermedades: ${visita.enfermedades}`, 20, 230)
  }
  if (visita.observaciones) {
    const splitObservaciones = doc.splitTextToSize(visita.observaciones, 170)
    doc.text(`Observaciones: ${splitObservaciones}`, 20, 240)
  }

  // Coordenadas GPS
  if (visita.coordenadas) {
    doc.text(`Coordenadas GPS:`, 20, 260)
    doc.text(`Latitud: ${visita.coordenadas.lat.toFixed(6)}`, 30, 270)
    doc.text(`Longitud: ${visita.coordenadas.lng.toFixed(6)}`, 30, 280)
  }

  // Footer
  doc.setFontSize(10)
  doc.text("Documento generado por AgriTech - Sistema de Gestión Agrícola", 20, 290)

  // Save the PDF
  doc.save(`dictamen-${visita.productorNombre}-${visita.fecha}.pdf`)
}
