# AchiVAI — Full SaaS Implementation Plan

> Product name: **AchiVAI** · AI: **Google Gemini** · Auth/DB: **Supabase** · Payments: **Razorpay**
> Stack: Next.js 16 (App Router) / React 19 / Zustand / Tailwind v4 / Supabase
> Last updated: 2026-08-07

---

## 1. True current state (verified against code, not assumptions)

### What already works
- Landing page (`src/app/page.jsx` + `_component/*`) renders.
- Template selector (`/template`) with 4 preview cards — **preview images exist** in `/public/template-previews/`.
- Dynamic editor route `/template/[id]` loads JSON, form → store → preview + PDF.
- Zustand store (`src/store/resumeStore.js`) has full CRUD + **working `saveResume` → localStorage** (line 72).
- `ResumeForm.jsx` is complete and is the **source of truth for the data schema** (see §2).
- Classic / Minimal / Professional renderers already match that schema.
- PDF export (`src/utils/downloadPDF.js` + `PDFTemplateFactory.jsx`) works for all 4 templates.

### What is broken / fake
- `ModernTemplate.jsx` uses a **different schema** (`contact`, `workExperience`, `skills.professional`) → always shows placeholder data. Only broken template.
- `upload/page.jsx:23` — YouTube prank redirect on invalid file (must delete).
- `template/[id]/page.jsx:548` — `<style jsx global>` is invalid in App Router → hydration error.
- `template/[id]/page.jsx:487` — "Change Template" is hardcoded to `"classic"`.
- Share / Duplicate buttons show fake toasts, do nothing.
- Login page — no form submit, no auth logic, "shadcn/studio" branding remnants.
- No Supabase client, no middleware, no cloud saves, no dashboard, no AI API.

### What does not exist at all
- `src/lib/supabase.js`, `src/middleware.js`, `src/app/api/**`, `/dashboard`, `/analysis`, auth session, payments, SEO files, logo, env files.

---

## 2. Data schema — THE single source of truth

Everything must read/write this shape (already what `ResumeForm` + store produce):

```js
{
  _template: "classic|minimal|professional|modern",
  name, title, email, phone,
  country, state, city,
  websiteOrGithub, linkedin,
  summary,
  experience: [{ title, company, location, startDate, endDate, description }],
  education: [{ institution, degree, fieldOfStudy, location, startDate, endDate, description, cgpa }],
  skills: [{ skillName, description }],
  languages: [{ language, proficiency }],
  projects: [{ projectName, technologies, startDate, endDate, projectUrl, description }],
  certifications: [{ certificationName, issuer, date, credentialId, credentialUrl }],
  customSections: [{ sectionName, content }],
}
```

**Rule:** all 4 renderers + all PDF templates must consume exactly this. Only `ModernTemplate` violates it.

---

## 3. Phase 0 — Stabilize (day 1)

### 3.1 Rewrite ModernTemplate (`src/components/ResumeRenderers/ModernTemplate.jsx`)
Consume the flat schema above like the other 3 renderers. Keep the two-column visual (left contact/summary, right experience/education/skills).

### 3.2 Fix upload page (`src/app/upload/page.jsx`)
- Delete YouTube redirect (line 23) → show inline error message instead.
- Show file preview + "Analyze with AI" button (stub until Phase 2).
- Reject >5MB with a friendly error.

### 3.3 Fix editor page (`src/app/template/[id]/page.jsx`)
- Move `.custom-scrollbar` + fade-in keyframes from `<style jsx global>` into `globals.css`.
- "Change Template" → open a modal/dropdown listing the 4 templates (`classic`, `minimal`, `professional`, `modern`), call `handleTemplateChange(id)`.
- Make Duplicate actually clone store data with a `(copy)` title. Make Share copy a public share URL (Phase 1+ → generate via Supabase row).

### 3.4 Branding pass (small)
- Replace "Logo" in `Navbar.jsx:35`, `Footer.jsx:17` with **AchiVAI** text logo.
- Replace "Lorem Ipsum" in `HoverResume.jsx:35`.
- Footer right: `© {year} AchiVAI — All Rights Reserved` + a line: **"Made by Aman17123"** (link to their GitHub).

---

## 4. Phase 1 — Auth + cloud saves (days 2–3)

### 4.1 Dependencies
```bash
cd frontend
npm i @supabase/supabase-js @supabase/ssr @google/generative-ai pdf-parse mammoth
npm i -D @types/pdf-parse
```

### 4.2 Environment (`frontend/.env.local`) — never commit
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
GEMINI_API_KEY=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
(All `*_KEY_SECRET`/`SERVICE_ROLE` values are server-only — no `NEXT_PUBLIC_` prefix.)

### 4.3 Supabase client
- `src/lib/supabase.js` — browser client using `createBrowserClient` from `@supabase/ssr`.
- `src/lib/supabaseServer.js` — `createServerClient` reading cookies for server components / API routes.

### 4.4 Auth UI (`src/app/login/page.jsx`)
- Remove shadcn branding, keep the design.
- Wire form `onSubmit` → `supabase.auth.signInWithPassword`.
- "Sign in with Google" → `supabase.auth.signInWithOAuth({ provider: "google" })`.
- "Create an account" → `signUp`. "Forgot password" → `resetPasswordForEmail`.
- Add `src/app/auth/callback/route.js` for OAuth redirect handling.
- Show real errors, loading states, redirect to `/dashboard` on success.

### 4.5 Middleware (`src/middleware.js`)
- Refresh session (`@supabase/ssr` `updateSession`).
- Protect `/template/[id]`, `/dashboard`, `/analysis` → redirect to `/login` when logged out.
- Allow `/`, `/template`, `/upload`, `/login`, `/pricing` public.

### 4.6 Cloud save
- New Supabase table `resumes` (see §7). Editor "Save" button upserts row. Dashboard lists them.
- `saveResume` in store → localStorage first (offline), then try Supabase upsert.

### 4.7 Dashboard (`src/app/dashboard/page.jsx`)
- Grid of saved resumes: name, template, updated_at, thumbnail.
- Actions: edit (→ `/template/[id]`), download PDF, duplicate, delete.

---

## 5. Phase 2 — AI analysis engine (days 4–6)

### 5.1 File parsing helpers (`src/lib/fileParsers.js`)
- PDF → `pdf-parse`. DOCX → `mammoth.extractRawText` (runs on server; note Node polyfill for `mammoth` if needed).
- Cap at ~5MB, return raw text.

### 5.2 Gemini client (`src/app/api/analyze-resume/route.js`)
- Route handler accepts `FormData` (file + optional `jobDescription`).
- Extract text → build prompt (see 5.3) → `response_mime_type: "application/json"` via `@google/generative-ai`.
- Return `{ atsScore, matchedKeywords, missingKeywords, feedback, suggestions, sectionsAnalyzed }`.
- Validate Gemini's JSON (fallback to a deterministic regex/word-match scoring if JSON parse fails).
- **Never** expose `GEMINI_API_KEY` to the client.

### 5.3 Prompt design (put in `src/lib/prompt.js`)
System: "You are an ATS resume reviewer. Score 0–100, list matched/missing keywords vs the job description, give section-by-section feedback and 3–5 actionable suggestions. Return strict JSON."

### 5.4 Results page (`src/app/analysis/page.jsx`)
- Pass results via `sessionStorage` / URL param from upload page.
- UI: animated ATS score ring, keyword chips (green = matched, red = missing), feedback cards per section, suggestion list.
- "Improve my resume" → prefill a new `/template/new` editor with AI-suggested text (optional stretch).

### 5.5 Wire upload page
- Real POST to `/api/analyze-resume`, real loading state, navigate to `/analysis`.
- Add optional **Job Description textarea** for keyword matching.

---

## 6. Phase 3 — Razorpay payments (days 7–8)

### 6.1 Plan model
- **Free:** build, save (cloud, limited), download PDF, 2 AI analyses / month.
- **Premium ₹₹ (one-time or monthly):** unlimited AI analysis + all templates + unlimited saves.

### 6.2 Flow
1. User clicks "Go Premium" → `POST /api/razorpay/create-order` (server, `RAZORPAY_KEY_SECRET`).
2. Load Razorpay checkout script (`https://checkout.razorpay.com/v1/checkout.js`) on the client.
3. `new Razorpay(options)` → on success send `razorpay_payment_id` to `/api/razorpay/verify`.
4. Verify signature server-side (`crypto.createHmac`), then upsert `user_subscriptions` row + mark user as premium.
5. Webhook `POST /api/razorpay/webhook` (payment/refund) to keep status in sync.

### 6.3 Enforcement
- Middleware / server route checks: AI analysis route refuses non-premium users past free quota (check `usage_events` table).
- Pricing page `src/app/pricing/page.jsx` with the two plans.

---

## 7. Supabase schema

```sql
-- profiles (mirrors auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text, full_name text, created_at timestamptz default now()
);

-- resumes
create table resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text, template text, data jsonb not null default '{}',
  share_token text unique, created_at timestamptz default now(), updated_at timestamptz default now()
);

-- subscriptions
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  plan text default 'free', status text default 'active',
  razorpay_subscription_id text, current_period_end timestamptz,
  created_at timestamptz default now()
);

-- usage_events (AI quota)
create table usage_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  kind text default 'analysis', created_at timestamptz default now()
);

-- RLS: enable on all; policy = auth.uid() = user_id (read/write own rows).
-- Share: resumes.get shareable row by share_token via a SECURITY DEFINER function.
```

---

## 8. Phase 4 — SEO, logo, polish (days 9–10)

### 8.1 SEO
- `src/app/layout.js` → replace metadata: title **"AchiVAI — AI Resume Builder"**, real description, `metadataBase`, OpenGraph/Twitter, theme-color.
- Add `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.png` (generated from logo).
- Per-page metadata: `/template`, `/pricing`, `/login`, `/upload` via `generateMetadata` or static `metadata` export.
- JSON-LD `SoftwareApplication` script in layout/landing for rich results.

### 8.2 Logo
- `public/logo.svg` — simple "A" monogram + wordmark **AchiVAI** (use in Navbar, Footer, favicon `src/app/icon.svg`, OpenGraph).

### 8.3 Footer
- `Footer.jsx`: logo + tagline, quick links (Templates, Pricing, Login, Upload), © line, **"Developed by Aman Nakoti"**.

### 8.4 Error/loading states
- Add `src/app/error.js` (client error boundary) and `src/app/loading.js` at route groups that need it.
- `not-found.js` exists already.

### 8.5 Cleanup
- Remove `@` (shadcn leftovers) folder and unused imports if unreferenced.
- Remove duplicate Josefin Google Fonts `@import` in `globals.css` (already loaded via `next/font`).
- Remove `next-themes` if unused (or wire dark mode as a stretch).

---

## 9. Testing checklist (before launch)
- [ ] All 4 templates show real form data in preview AND PDF.
- [ ] PDF export multi-page correct for a long resume.
- [ ] Upload accepts PDF/DOCX, rejects others gracefully (no YouTube).
- [ ] AI analysis returns valid JSON; job-description keywords correct.
- [ ] Google login + email login create a Supabase user; protected routes redirect.
- [ ] Saved resumes persist, appear in dashboard, edit/delete work.
- [ ] Razorpay order → payment → verification → premium flag; webhook tested.
- [ ] Free quota enforced (2 AI analyses), premium unlimited.
- [ ] `npm run lint` + `next build` pass with zero errors.
- [ ] No API keys in browser bundle (`NEXT_PUBLIC_` only for URL/anon key).
- [ ] `.env.local` gitignored and never committed.

## 10. Deployment
- **Vercel**: set all env vars in dashboard (server-only ones without `NEXT_PUBLIC_`), build command `npm run build`.
- Add Vercel domain to Supabase Auth redirect allowlist (`https://yourdomain/auth/callback`).
- Razorpay webhook URL → `https://yourdomain/api/razorpay/webhook`.
- Enable RLS before going live.

## 11. Delivery order (do this exactly)
1. Phase 0 (bug fixes + branding) → ~half a day
2. Phase 1 (auth + dashboard + cloud save) → 2 days
3. Phase 2 (AI analysis) → 2–3 days
4. Phase 3 (Razorpay) → 2 days
5. Phase 4 (SEO/logo/polish) → 1–2 days
6. Deploy + test checklist

Estimated total: **~10 working days** to a shippable SaaS.
