import { createClient } from "./supabase";

// Saves a resume to the logged-in user's Supabase account.
// Falls back to localStorage if not signed in.
export async function saveResumeToCloud({ name, template, data }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      auth: true,
      message: "Please sign in to save your resume to the cloud.",
    };
  }

  let resumeId = null;
  try {
    resumeId = sessionStorage.getItem("achivai_resume_id");
  } catch {}

  const payload = {
    user_id: user.id,
    name,
    template,
    data,
    updated_at: new Date().toISOString(),
  };

  try {
    if (resumeId) {
      const { error } = await supabase
        .from("resumes")
        .update(payload)
        .eq("id", resumeId)
        .eq("user_id", user.id);
      if (error) return { ok: false, auth: false, message: error.message };
    } else {
      const { data: inserted, error } = await supabase
        .from("resumes")
        .insert(payload)
        .select("id")
        .single();
      if (error) return { ok: false, auth: false, message: error.message };
      try {
        sessionStorage.setItem("achivai_resume_id", inserted.id);
      } catch {}
    }
    return { ok: true, auth: false, message: "Resume saved to your account!" };
  } catch (err) {
    return { ok: false, auth: false, message: err.message || "Save failed." };
  }
}