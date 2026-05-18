# AIFactory Consulta

> Bilingual Doctor Co-pilot for specialty clinics. Real-time consultation transcription + structured medical extraction.

AIFactory Consulta is a bilingual Doctor Co-pilot for specialty clinics. During patient consultations, doctors enable live transcription powered by Google's Gemini Live API. The system captures Spanish or English speech in real time, extracts structured medical data (chief complaint, diagnosis, treatment plan, medications, follow-up items), and syncs the structured output to AIFactory Health's **Patient Companion** — a production system already serving three specialty clinics in Mexico.

This closes the doctor-patient memory loop: the doctor never types post-consultation notes, and the patient receives a personalized post-appointment companion grounded in what the doctor actually said. The system is HIPAA-architected with BAA-eligible infrastructure, designed for expansion into US Hispanic-serving specialty practices in 2027.

Built solo in under 6 hours at **TechEx 2026**.

- Live demo: _(deploying soon)_
- Patient Companion: <https://patient-companion.butterbase.dev>
- Repo: <https://github.com/soyjavo/aifactory-consulta>

## Tech stack

- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui (neutral base, CSS variables)
- **Icons**: lucide-react
- **AI**: Google Gemini Live API (`@google/generative-ai`) — real-time transcription + structured extraction
- **Data**: Supabase (Postgres + service role) for consultation persistence
- **Sync target**: AIFactory Health Patient Companion (Butterbase-hosted)

## Setup

### 1. Install

```bash
npm install
```

### 2. Configure env

Copy `.env.example` to `.env.local` and fill:

```bash
GOOGLE_GEMINI_API_KEY=...        # Gemini API key (AI Studio)
NEXT_PUBLIC_SUPABASE_URL=...     # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=...    # Supabase service role key (server-only)
```

### 3. Supabase schema

The phase-2 schema (to be created in Supabase):

```sql
create table consultations (
  id uuid primary key default gen_random_uuid(),
  patient_id text not null,
  doctor_id text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  language text not null check (language in ('es','en','mixed')),
  transcript text not null default '',
  structured jsonb,
  created_at timestamptz not null default now()
);
```

### 4. Run

```bash
npm run dev
```

Open <http://localhost:3000>.

## Project structure

```
app/
  page.tsx                       Landing page with patient picker
  consult/[patientId]/page.tsx   Live consultation view
  summary/[id]/page.tsx          Completed consultation summary
  api/extract/route.ts           POST: transcript → structured JSON (Gemini)
  api/session/route.ts           POST: create consultation record (Supabase)
lib/
  supabase.ts                    Supabase server client
  gemini.ts                      Gemini client wrappers
  types.ts                       Shared TypeScript types
components/
  header.tsx
  patient-card.tsx
  transcript-panel.tsx
  structured-output-panel.tsx
  ui/                            shadcn primitives
```

## License

MIT. Built at TechEx 2026, May 18–19, San Jose. © AIFactory Systems LLC.
