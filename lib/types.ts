// /lib/types.ts

export const cultivosDisponibles = ["maiz", "frijol", "garbanzo", "sorgo"] as const;
export type Cultivo = typeof cultivosDisponibles[number];

export type CultivoInfo = {
  enfermedad: string;
  confianza: number;
  tratamiento: {
    producto: string;
    dosis: string;
    aplicacion: string;
    disponibilidad: string;
    recomendacion: string;
  };
};

export const cultivoNames: Record<Cultivo, string> = {
  maiz: "Maíz",
  frijol: "Frijol",
  garbanzo: "Garbanzo",
  sorgo: "Sorgo",
};

export type MiDocumento = {
  _id: string;
  _rev?: string;
  tipo: "registro";
  usuario: string;
  nombre: string;
  // Agrega más campos si los necesitas
};
