"use client";

import React from "react";

export default function ModernTemplate({ data }) {
  const {
    name = "",
    title = "",
    email = "",
    phone = "",
    location = "",
    linkedin = "",
    websiteOrGithub = "",
    summary = "",
    experience = [],
    education = [],
    skills = [],
    languages = [],
    projects = [],
    certifications = [],
    customSections = [],
  } = data || {};

  // Extract initials for modern badge
  const initials = name
    ? name
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "CV";

  // Normalize skills
  const normalizedSkills = (skills || [])
    .map((s) => {
      if (!s) return null;
      if (typeof s === "string") return s.trim();
      return s.skillName || s.name || s.value || "";
    })
    .filter(Boolean);

  // Normalize languages
  const languageList = (languages || [])
    .map((l) => {
      if (!l) return null;
      if (typeof l === "string") return l.trim();
      return [l.language || l.name, l.proficiency].filter(Boolean).join(" — ");
    })
    .filter(Boolean);

  const contactList = [
    location && { icon: "📍", text: location },
    phone && { icon: "📞", text: phone },
    email && { icon: "✉️", text: email },
    websiteOrGithub && { icon: "🌐", text: formatUrlDisplay(websiteOrGithub) },
    linkedin && { icon: "💼", text: formatUrlDisplay(linkedin) },
  ].filter(Boolean);

  return (
    <div className="w-full flex font-sans text-slate-800 bg-white min-h-[297mm] shadow-sm">
      {/* ==================== LEFT SIDEBAR ==================== */}
      <div className="w-[34%] bg-slate-900 text-slate-100 p-6 flex flex-col justify-between">
        <div>
          {/* Avatar Initials Badge */}
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold text-white shadow-md mb-4 tracking-wider">
            {initials}
          </div>

          {/* Name & Title */}
          <h1 className="text-xl font-bold text-center text-white tracking-tight leading-snug">
            {name || "Your Name"}
          </h1>

          {title && (
            <p className="text-center text-blue-300 text-xs font-medium mt-1">
              {title}
            </p>
          )}

          {/* Contact Details */}
          {contactList.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-800">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Contact
              </h3>
              <div className="space-y-2 text-[11px] text-slate-300">
                {contactList.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-[12px] opacity-80">{c.icon}</span>
                    <span className="truncate">{c.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills (Sidebar Chips) */}
          {normalizedSkills.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-800">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Skills & Tools
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {normalizedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-slate-800 text-slate-200 text-[10.5px] rounded-md border border-slate-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languageList.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-800">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Languages
              </h3>
              <div className="space-y-1.5 text-[11px] text-slate-300">
                {languageList.map((lang, index) => (
                  <p key={index} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                    {lang}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Certifications in Sidebar */}
          {certifications && certifications.length > 0 && (
            <div className="mt-6 pt-5 border-t border-slate-800">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Certifications
              </h3>
              <div className="space-y-2 text-[11px]">
                {certifications.map((cert, index) => (
                  <div key={cert.id || index} className="text-slate-300">
                    <p className="font-semibold text-white text-[11px]">
                      {cert.certificationName}
                    </p>
                    {cert.issuer && (
                      <p className="text-slate-400 text-[10px]">{cert.issuer}</p>
                    )}
                    {cert.date && (
                      <p className="text-slate-500 text-[9.5px]">{cert.date}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Brand stamp */}
        <div className="pt-6 text-center text-[10px] text-slate-600">
          Professional CV
        </div>
      </div>

      {/* ==================== RIGHT CONTENT ==================== */}
      <div className="w-[66%] p-7 bg-white flex flex-col justify-between">
        <div>
          {/* Summary */}
          {summary && (
            <div className="mb-6">
              <h2 className="pdf-section-start text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2 mb-2">
                <span className="w-1.5 h-3.5 bg-blue-600 rounded-sm"></span>
                Profile Summary
              </h2>
              <p className="text-[12px] text-slate-700 leading-relaxed whitespace-pre-line text-justify">
                {summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {experience && experience.length > 0 && (
            <div className="mb-6">
              <h2 className="pdf-section-start text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2 mb-3">
                <span className="w-1.5 h-3.5 bg-blue-600 rounded-sm"></span>
                Work Experience
              </h2>

              <div className="space-y-4">
                {experience.map((job, index) => {
                  if (!job.title && !job.company && !job.description) return null;
                  return (
                    <div key={job.id || index} className="break-inside-avoid relative pl-3.5 border-l-2 border-slate-200">
                      <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-blue-500"></div>

                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-[13px] text-slate-900">
                          {job.title || "Job Title"}
                        </h4>
                        <span className="text-[10.5px] font-medium text-slate-500">
                          {[job.startDate, job.endDate || "Present"].filter(Boolean).join(" – ")}
                        </span>
                      </div>

                      <p className="text-[11.5px] font-medium text-slate-600 mb-1">
                        {[job.company, job.location].filter(Boolean).join(" • ")}
                      </p>

                      {job.description && (
                        <p className="text-[11.5px] text-slate-700 whitespace-pre-line leading-relaxed">
                          {job.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <div className="mb-6">
              <h2 className="pdf-section-start text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2 mb-3">
                <span className="w-1.5 h-3.5 bg-blue-600 rounded-sm"></span>
                Education
              </h2>

              <div className="space-y-3">
                {education.map((edu, index) => {
                  if (!edu.institution && !edu.degree) return null;
                  return (
                    <div key={edu.id || index} className="break-inside-avoid relative pl-3.5 border-l-2 border-slate-200">
                      <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-slate-400"></div>

                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold text-[12.5px] text-slate-900">
                          {edu.institution || edu.school || "Institution"}
                        </h4>
                        <span className="text-[10.5px] text-slate-500">
                          {[edu.startDate, edu.endDate || edu.year].filter(Boolean).join(" – ")}
                        </span>
                      </div>

                      <p className="text-[11.5px] text-slate-600">
                        {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(", ")}
                        {edu.cgpa && ` | GPA: ${edu.cgpa}`}
                      </p>

                      {edu.description && (
                        <p className="text-[11px] text-slate-600 mt-0.5 whitespace-pre-line">
                          {edu.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div className="mb-6">
              <h2 className="pdf-section-start text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2 mb-3">
                <span className="w-1.5 h-3.5 bg-blue-600 rounded-sm"></span>
                Projects
              </h2>

              <div className="space-y-3">
                {projects.map((proj, index) => {
                  if (!proj.projectName && !proj.description) return null;
                  return (
                    <div key={proj.id || index} className="break-inside-avoid">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-[12.5px] text-slate-900">
                          {proj.projectName}
                          {proj.projectUrl && (
                            <span className="text-[10.5px] font-normal text-blue-600 ml-1.5">
                              ({formatUrlDisplay(proj.projectUrl)})
                            </span>
                          )}
                        </span>
                        {[proj.startDate, proj.endDate].some(Boolean) && (
                          <span className="text-[10.5px] text-slate-500">
                            {[proj.startDate, proj.endDate].filter(Boolean).join(" – ")}
                          </span>
                        )}
                      </div>

                      {proj.technologies && (
                        <p className="text-[11px] font-medium text-slate-500">
                          {proj.technologies}
                        </p>
                      )}

                      {proj.description && (
                        <p className="text-[11.5px] text-slate-700 mt-0.5 whitespace-pre-line leading-relaxed">
                          {proj.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Sections */}
          {customSections && customSections.length > 0 && (
            <div>
              {customSections.map((sec, index) => {
                if (!sec.sectionName && !sec.content) return null;
                return (
                  <div key={sec.id || index} className="mb-5 break-inside-avoid">
                    <h2 className="pdf-section-start text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2 mb-2">
                      <span className="w-1.5 h-3.5 bg-blue-600 rounded-sm"></span>
                      {sec.sectionName || "Additional Information"}
                    </h2>
                    <p className="text-[11.5px] text-slate-700 whitespace-pre-line leading-relaxed">
                      {sec.content}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatUrlDisplay(url) {
  if (!url) return "";
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}