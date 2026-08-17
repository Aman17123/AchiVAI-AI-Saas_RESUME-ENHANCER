// Template names keyed by ID — update if you add more templates
const TEMPLATE_NAMES = {
  classic: "Classic",
  modern: "Modern",
  minimal: "Minimal",
  executive: "Executive",
};

export async function generateMetadata({ params }) {
  const { id } = await params;
  const name = TEMPLATE_NAMES[id] ?? id;
  return {
    title: `${name} Resume Template \u2014 AchiVAI Editor`,
    description: `Edit your ${name} resume with AchiVAI's online builder. Add experience, education, skills and projects, then export a clean ATS-friendly PDF in one click.`,
    alternates: { canonical: `/template/${id}` },
    // Editor pages are app-state pages — not useful for Google to index
    robots: { index: false, follow: false },
  };
}

export default function EditorLayout({ children }) {
  return children;
}