# AI Resume Studio

A frontend-only resume builder with multiple templates, live preview, and PDF export.

## Features

- 🎨 **Multiple Resume Templates** — Classic, Modern, Minimal, and Professional designs
- ✏️ **Resume Builder** — Interactive editor with live preview
- 📄 **PDF Export** — Download your resume as a PDF
- 📱 **Responsive Design** — Works on desktop and mobile

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend | Next.js / React / Tailwind CSS |
| State | Zustand |
| Animations | Framer Motion |
| PDF | html2canvas + jsPDF |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
```

## Project Structure

```
src/
  app/              # Pages and layouts
  components/       # Reusable components
  store/            # Zustand state management
  templates/        # Resume template JSON data
  utils/            # Utility functions
  data/             # Static data
  lib/              # Library utilities
public/             # Static assets
```
