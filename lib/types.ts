export type Sex = "F" | "M" | "X";

export type Patient = {
  id: string;
  name: string;
  age: number;
  sex: Sex | string;
  language: string | null;
  medical_history: string | null;
  allergies: string | null;
  created_at?: string;
};

export type VitalSigns = {
  ta: string | null;
  fc: number | null;
  fr: number | null;
  temp: number | null;
  sato2: number | null;
  peso: number | null;
  talla: number | null;
  imc: number | null;
};

export type Receta = {
  medicamento: string;
  dosis: string | null;
  frecuencia: string | null;
  duracion: string | null;
};

export type SoapConsultation = {
  subjetivo: {
    motivo_consulta: string | null;
    sintomas: string[];
    sintomas_adicionales: string | null;
  };
  objetivo: {
    signos_vitales: VitalSigns;
    exploracion_fisica: string | null;
  };
  analisis: {
    diagnostico: string | null;
    cie10: string[];
  };
  plan: {
    tratamiento_general: string | null;
    recetas: Receta[];
    estudios_solicitados: string[];
    referencias: string[];
    seguimiento: string | null;
    proximos_pasos: string | null;
    notas_adicionales: string | null;
  };
  language_detected: "es" | "en" | "mixed";
};

export type ConsultationRow = {
  id: string;
  patient_id: string;
  doctor_name: string | null;
  started_at: string;
  ended_at: string | null;
  transcript: string;
  structured_data: SoapConsultation | null;
  original_extraction: SoapConsultation | null;
  edited: boolean;
  language_detected: string | null;
  synced_to_companion: boolean;
  synced_at: string | null;
  signed: boolean;
  signed_at: string | null;
};
