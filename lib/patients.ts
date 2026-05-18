import type { Lang } from "./i18n";
import type { Patient } from "./types";

type PatientI18nOverride = {
  medical_history: { en: string; es: string };
  allergies: { en: string; es: string };
};

const SEEDED_TRANSLATIONS: Record<string, PatientI18nOverride> = {
  "María González": {
    medical_history: {
      es: "Hipertensión controlada con losartán 50mg diario. Antecedente familiar de diabetes.",
      en: "Hypertension controlled with losartan 50mg daily. Family history of diabetes.",
    },
    allergies: {
      es: "Penicilina",
      en: "Penicillin",
    },
  },
  "Carlos Ramírez": {
    medical_history: {
      es: "Diabetes tipo 2 desde hace 8 años. Retinopatía diabética leve diagnosticada 2024. HbA1c 7.2.",
      en: "Type 2 diabetes for 8 years. Mild diabetic retinopathy diagnosed 2024. HbA1c 7.2.",
    },
    allergies: {
      es: "Ninguna conocida",
      en: "None known",
    },
  },
  "Ana Patricia López": {
    medical_history: {
      es: "Migraña crónica con aura desde la adolescencia. Tratamiento profiláctico con topiramato.",
      en: "Chronic migraine with aura since adolescence. Prophylactic treatment with topiramate.",
    },
    allergies: {
      es: "AINEs (ibuprofeno, naproxeno)",
      en: "NSAIDs (ibuprofen, naproxen)",
    },
  },
};

export function patientWithTranslations(patient: Patient, lang: Lang): Patient {
  const override = SEEDED_TRANSLATIONS[patient.name];
  if (!override) return patient;
  return {
    ...patient,
    medical_history: override.medical_history[lang] ?? patient.medical_history,
    allergies: override.allergies[lang] ?? patient.allergies,
  };
}
