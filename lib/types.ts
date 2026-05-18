export type Sex = "F" | "M" | "X";

export type Patient = {
  id: string;
  name: string;
  age: number;
  sex: Sex;
  primaryCondition: string;
};

export type StructuredConsultation = {
  chiefComplaint: string | null;
  diagnosis: string | null;
  treatmentPlan: string[];
  medications: Medication[];
  followUp: string[];
};

export type Medication = {
  name: string;
  dose: string | null;
  frequency: string | null;
  duration: string | null;
};

export type ConsultationRecord = {
  id: string;
  patientId: string;
  doctorId: string | null;
  startedAt: string;
  endedAt: string | null;
  language: "es" | "en" | "mixed";
  transcript: string;
  structured: StructuredConsultation | null;
};

export const DEMO_PATIENTS: Patient[] = [
  {
    id: "maria-gonzalez",
    name: "María González",
    age: 34,
    sex: "F",
    primaryCondition: "Hipertensión",
  },
  {
    id: "carlos-ramirez",
    name: "Carlos Ramírez",
    age: 58,
    sex: "M",
    primaryCondition: "Diabetes tipo 2",
  },
  {
    id: "ana-patricia-lopez",
    name: "Ana Patricia López",
    age: 42,
    sex: "F",
    primaryCondition: "Migraña crónica",
  },
];
