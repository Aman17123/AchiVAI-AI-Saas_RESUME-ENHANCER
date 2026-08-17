export const metadata = {
  title: "My Resumes — Dashboard",
  description:
    "Manage all your AchiVAI resumes in one place — edit, download, duplicate, or delete.",
  alternates: { canonical: "/dashboard" },
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }) {
  return children;
}