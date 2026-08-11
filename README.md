<div align="center">

<img src="https://raw.githubusercontent.com/Aman17123/AchiVAI-AI-Saas_RESUME-ENHANCER/main/public/logo.svg" alt="AchiVAI Logo" width="200" />

# ? AchiVAI � AI Resume Enhancer

**Beat the ATS. Get hired faster.**

An AI-powered SaaS that analyzes your resume against job descriptions, gives you an ATS compatibility score, finds missing keywords, and helps you land more interviews.

<br/>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-arcivai.vercel.app-021F81?style=for-the-badge&logo=vercel)](https://arcivai.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini%203.6%20Flash-AI-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-072654?style=for-the-badge&logo=razorpay)](https://razorpay.com/)

<br/>

> ?? **Live at:** [https://arcivai.vercel.app](https://arcivai.vercel.app)

</div>

---

## ? Features

### ?? AI-Powered Resume Analysis
- Upload your resume as **PDF or DOCX**
- Paste any job description to match against
- Get an instant **ATS compatibility score out of 100**
- See **matched and missing keywords** at a glance
- Receive **section-by-section feedback** (Summary, Skills, Experience, Education)
- Powered by **Google Gemini 3.6 Flash**

### ?? Resume Builder
- Build resumes from scratch using a structured form
- Choose from **multiple ATS-friendly templates** (Classic, Modern)
- Live preview of your resume as you type
- **One-click PDF export** � print-ready and ATS-safe
- Resumes auto-saved to your account

### ?? Authentication
- **Google OAuth** sign-in via Supabase
- Email/password sign-up and login
- Magic link (passwordless) login
- Password reset via email
- Session management with secure HTTP-only cookies

### ?? Monetization
- **Free Plan**: 2 AI analyses per month, all templates, unlimited PDF downloads
- **Premium Plan (?499 one-time)**: Unlimited AI analyses, all features, priority support
- Seamless **Razorpay** payment integration with webhook verification
- Per-user quota tracking with `usage_events` table

### ? Performance & SEO
- Server-side rendering with Next.js App Router
- Full **Schema.org structured data** (SoftwareApplication, FAQ, Organization)
- Open Graph & Twitter Card metadata
- Sitemap + robots.txt auto-generated
- Optimized fonts: Geist Sans, Geist Mono, Josefin Sans

---

## ??? Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Webpack) |
| **UI** | React 19, Tailwind CSS v4, Framer Motion |
| **Icons** | Lucide React |
| **AI** | Google Gemini 3.6 Flash (`@google/generative-ai`) |
| **Auth & DB** | Supabase (PostgreSQL + Row Level Security) |
| **Payments** | Razorpay (order creation + webhook verification) |
| **PDF Parsing** | `pdf-parse` + `pdfjs-dist`, `mammoth` (DOCX) |
| **PDF Export** | `jspdf` + `html2canvas` |
| **State** | Zustand |
| **Deployment** | Vercel |

---

## ?? Project Structure

```
ai_resume/
+-- public/
�   +-- images/              # Static assets (bg, logos)
�   +-- template-previews/   # Resume template preview images
+-- scripts/
�   +-- supabase.sql         # Full DB schema for Supabase
+-- src/
�   +-- app/
�   �   +-- _component/      # Shared UI (Navbar, Footer, Hero, FAQ, Plans...)
�   �   +-- analysis/        # AI analysis results page
�   �   +-- api/
�   �   �   +-- analyze-resume/   # Core AI analysis endpoint (POST)
�   �   �   +-- razorpay/         # Payment routes (create-order, verify, webhook)
�   �   �   +-- user/             # User plan API
�   �   +-- auth/callback/   # Supabase OAuth callback handler
�   �   +-- dashboard/       # User saved resumes dashboard
�   �   +-- login/           # Auth page (Google, email, magic link)
�   �   +-- pricing/         # Pricing page + Razorpay checkout
�   �   +-- template/        # Resume builder (template list + [id] editor)
�   �   +-- upload/          # Resume upload + AI analysis trigger
�   +-- components/
�   �   +-- Editor/          # ResumeForm � structured input form
�   �   +-- PDFTemplates/    # PDF-specific template renderer
�   �   +-- ResumeRenderers/ # Classic & Modern live preview templates
�   +-- data/                # Universities dataset
�   +-- lib/
�   �   +-- fileParsers.js     # PDF/DOCX text extraction
�   �   +-- prompt.js          # Gemini AI prompt builder
�   �   +-- razorpayServer.js  # Razorpay server utils + quota config
�   �   +-- resumeService.js   # Supabase resume CRUD operations
�   �   +-- supabase.js        # Client-side Supabase client
�   �   +-- supabaseAdmin.js   # Admin Supabase client (service role key)
�   �   +-- supabaseServer.js  # Server-side Supabase client (SSR cookies)
�   +-- middleware.js          # Edge auth guard + route protection
�   +-- store/
�   �   +-- resumeStore.js     # Zustand global state for resume data
�   +-- templates/             # Resume JSON schemas (classic, modern)
+-- next.config.mjs
+-- package.json
```

---

## ??? Database Schema

The full schema is in [`scripts/supabase.sql`](./scripts/supabase.sql). Run it once in your Supabase SQL Editor.

| Table | Purpose |
|---|---|
| `profiles` | User profile � synced from `auth.users` via DB trigger on signup |
| `resumes` | Stores resume JSON data with template name & unique share token |
| `subscriptions` | Tracks user plan (`free` / `premium`) and Razorpay subscription ID |
| `usage_events` | Per-user AI analysis count for enforcing the free monthly quota |

All tables have **Row Level Security (RLS)** enabled � users can only read/write their own rows.

---

## ?? Getting Started

### Prerequisites
- Node.js 18+
- A [Supabase](https://supabase.com) project
- A [Google Cloud](https://console.cloud.google.com) project with OAuth 2.0 credentials
- A [Google AI Studio](https://ai.google.dev) API key (Gemini)
- A [Razorpay](https://razorpay.com) account

### 1. Clone the repo

```bash
git clone https://github.com/Aman17123/AchiVAI-AI-Saas_RESUME-ENHANCER.git
cd AchiVAI-AI-Saas_RESUME-ENHANCER
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file at the root:

```env
# Supabase � Dashboard ? Project Settings ? API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google Gemini AI � https://ai.google.dev
GEMINI_API_KEY=your-gemini-api-key

# Razorpay � https://dashboard.razorpay.com
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-razorpay-webhook-secret

# App URL � use your live Vercel URL in production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set up the database

1. Go to **Supabase Dashboard ? SQL Editor**
2. Paste the contents of [`scripts/supabase.sql`](./scripts/supabase.sql) and click **Run**
3. Go to **Authentication ? Providers ? Google** and enable Google OAuth
4. Copy the **Callback URL** shown in Supabase
5. In **Google Cloud Console ? Credentials ? OAuth 2.0 Client**, add it as an **Authorized Redirect URI**:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) ??

---

## ?? Deployment on Vercel

1. Push your code to GitHub
2. Import your repository at [vercel.com](https://vercel.com)
3. In **Vercel ? Project ? Settings ? Environment Variables**, add all variables from `.env.local`
4. Set `NEXT_PUBLIC_APP_URL` to your live Vercel URL (e.g., `https://arcivai.vercel.app`)
5. Click **Deploy** ?

---

## ?? How the AI Analysis Works

```
User uploads Resume (PDF/DOCX)
         �
         ?
  fileParsers.js extracts raw text
         �
         ?
  prompt.js builds a structured Gemini prompt
  (resume text + optional job description)
         �
         ?
  Gemini 3.6 Flash returns structured JSON:
  { atsScore, matchedKeywords, missingKeywords,
    sectionsAnalyzed, feedback, suggestions, suggestedRole }
         �
         ?
  Results displayed on /analysis page
  (ATS score gauge, keyword chips, section breakdown)
```

---

## ?? Pricing

| Feature | Free | Premium (?499 one-time) |
|---|:---:|:---:|
| AI Resume Analyses | 2 / month | Unlimited |
| ATS-Friendly Templates | All | All |
| PDF Download | ? | ? |
| Cloud Save | ? | ? |
| Job Description Matching | ? | ? |
| Priority Support | ? | ? |
| Price | ?0 / forever | ?499 one-time |

---

## ?? Security

- Protected routes (`/dashboard`, `/analysis`, `/template/[id]`) guarded by **server-side middleware**
- **Row Level Security (RLS)** enforced at DB level � no accidental data leaks
- Razorpay webhook payloads verified with **HMAC signature** before processing
- `SUPABASE_SERVICE_ROLE_KEY` is **server-only** � never exposed to the browser
- `.env.local` is gitignored � secrets are never committed

---

## ?? Contributing

Pull requests are welcome! For major changes, please open an issue first.

1. Fork the project
2. Create your feature branch: `git checkout -b feat/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feat/amazing-feature`
5. Open a Pull Request

---

## ????? Author

**Aman Nakoti**
- GitHub: [@Aman17123](https://github.com/Aman17123)
- Live Project: [arcivai.vercel.app](https://arcivai.vercel.app)

---

## ?? License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p>Made with ?? and a lot of Gemini API calls.</p>
  <p>If this helped you, please ? star the repo!</p>
</div>
