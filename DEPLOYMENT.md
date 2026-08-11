# AchiVAI — Deployment & Go-Live Checklist

Stack: Next.js 16 (App Router) / Supabase / Gemini / Razorpay. Recommended host: **Vercel**.

---

## 1. Pre-deploy verification (run locally first)

- [ ] `npm run lint` → 0 errors (1 pre-existing warning in ResumeForm is harmless)
- [ ] `npm run build` → succeeds with no errors
- [ ] `/login` → "Continue with Google" logs in and lands on `/dashboard`
- [ ] `/template/[id]` editor → preview shows real data for all 4 templates
- [ ] Editor **Save** → resume appears in `/dashboard`
- [ ] `/upload` → PDF/DOCX analyzes via AI, results render on `/analysis`
- [ ] `/pricing` → Go Premium opens Razorpay checkout (test mode)
- [ ] Free plan blocks a 3rd AI analysis this month with "Upgrade" message

---

## 2. Environment variables (`frontend/.env.local` → Vercel)

Copy to **Vercel → Project → Settings → Environment Variables**. Never add
`SUPABASE_SERVICE_ROLE_KEY` / `RAZORPAY_KEY_SECRET` / `GEMINI_API_KEY` with a
`NEXT_PUBLIC_` prefix (they must stay server-only).

| Variable | Where to get it | Public? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | ✅ safe |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | ✅ safe |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API | ❌ server-only |
| `GEMINI_API_KEY` | aistudio.google.com/apikey | ❌ server-only |
| `RAZORPAY_KEY_ID` | Razorpay Dashboard → Settings → API Keys | ✅ safe (publishable) |
| `RAZORPAY_KEY_SECRET` | Razorpay Dashboard → Settings → API Keys | ❌ server-only |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Dashboard → Webhooks (optional) | ❌ server-only |
| `NEXT_PUBLIC_APP_URL` | Your live URL e.g. `https://achivai.vercel.app` | ✅ safe |

> Set `NEXT_PUBLIC_APP_URL` to the real domain or the `metadataBase` warning
> appears and OG/social images may not resolve.

---

## 3. Supabase production setup

- [ ] Run `scripts/supabase.sql` in the SQL Editor (tables: profiles, resumes,
      subscriptions, usage_events + RLS policies)
- [ ] **Auth → Providers → Google**: confirm redirect URL is the **production**
      URL `https://<your-domain>/auth/callback` (not just localhost)
- [ ] **Auth → URL Configuration**: add production site URL
- [ ] Verify RLS is enabled (tables should error for logged-out queries)
- [ ] Test that a second user cannot read/delete another user's resumes

---

## 4. Razorpay live mode

- [ ] Finish KYC → move from Test Mode to **Live Mode**
- [ ] Copy **Live** Key ID/Secret into env vars
- [ ] (Optional) Create a webhook → URL `https://<your-domain>/api/razorpay/webhook`
      → events: `payment.captured`, `payment.failed`, `payment.refunded`
      → paste the secret into `RAZORPAY_WEBHOOK_SECRET`
- [ ] Make a test ₹2 payment with a live card to confirm verify + premium flag

---

## 5. Deploy to Vercel

- [ ] Push the repo to GitHub
- [ ] Import repo into Vercel → Framework: **Next.js** → Build: `npm run build`
- [ ] Add all env vars (Production + Preview)
- [ ] Deploy → confirm the site loads at your domain
- [ ] Attach a custom domain and set it as `NEXT_PUBLIC_APP_URL`
- [ ] Confirm `/sitemap.xml` and `/robots.txt` return 200 on the live domain
- [ ] Check `/opengraph-image` renders (shares preview on LinkedIn/X)

---

## 6. Post-launch smoke test (production)

- [ ] Google login works on the live domain
- [ ] Upload + AI analysis completes (2 free then blocks on 3rd)
- [ ] Save to cloud → appears in dashboard → edit persists
- [ ] Premium purchase marks the user premium instantly
- [ ] `/analysis` page shows score ring + keywords
- [ ] No API keys appear in browser DevTools → Network tab responses

---

## 7. Security checklist (must-do)

- [ ] `.env.local` is NOT in git (`git status` clean of it) ✅ verified
- [ ] Service role key only used server-side (`src/lib/supabaseAdmin.js`)
- [ ] Razorpay webhook verifies signature before trusting events
- [ ] Payment `verify` checks HMAC signature AND `payment.status === captured`
- [ ] AI analysis route requires auth + enforces free quota
- [ ] All env values used in client code are `NEXT_PUBLIC_`-prefixed

---

## Notes / known follow-ups (optional)

- `metadataBase` warning disappears once `NEXT_PUBLIC_APP_URL` is set
- `ResumeForm.jsx:615` has a benign `react-hooks/exhaustive-deps` warning
- `next-themes` / `zod` in `node_modules` are orphaned (not in package.json) — safe to `npm prune`
