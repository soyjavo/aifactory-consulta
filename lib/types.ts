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

export type StructuredConsultation = {
  chief_complaint: string;
  diagnosis: string;
  treatment_plan: string;
  medications: Medication[];
  follow_up_items: string[];
  language_detected: "es" | "en" | "mixed";
};

export type Medication = {
  name: string;
  dose: string | null;
  frequency: string | null;
  duration: string | null;
};

export type ConsultationRow = {
  id: string;
  patient_id: string;
  doctor_name: string | null;
  started_at: string;
  ended_at: string | null;
  transcript: string;
  structured_data: StructuredConsultation | null;
  language_detected: string | null;
  synced_to_companion: boolean;
  synced_at: string | null;
};
