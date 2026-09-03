"use client";

import React from "react";

export default function ClassicTemplate({ data }) {
  const {
    name = "",
    title = "",
    email = "",
    phone = "",
    location = "",
    websiteOrGithub = "",
    linkedin = "",
    summary = "",
    experience = [],
    education = [],
    skills = [],
    projects = [],
    languages = [],
    certifications = [],
    customSections = [],
  } = data || {};

  // Clean contact items
  const contactItems = [
    location,
    phone,
    email,
    websiteOrGithub && formatUrlDisplay(websiteOrGithub),
    linkedin && formatUrlDisplay(linkedin),
  ].filter(Boolean);

  // Normalize skills
  const normalizedSkills = (skills || [])
    .map((skill) => {
      if (!skill) return null;
      if (typeof skill === "string") return { name: skill.trim(), description: "" };
      const name = skill.skillName || skill.name || skill.value || "";
      return { name: name.trim(), description: skill.description || "" };
    })
    .filter((s) => s && s.name);

  // Normalize languages
  const normalizedLanguages = (languages || [])
    .map((lang) => {
      if (!lang) return null;
      if (typeof lang === "string") return lang.trim();
      return [lang.language || lang.name, lang.proficiency].filter(Boolean).join(" — ");
    })
    .filter(Boolean);

  return (
    <div className="font-serif text-slate-900 px-8 py-8 max-w-4xl mx-auto text-[13px] leading-relaxed bg-white">
      {/* ==================== HEADER ==================== */}
      <div className="text-center pb-2 border-b-2 border-slate-900">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight uppercase text-slate-950">
          {name || "Your Name"}
        </h1>

        {title && (
          <p className="text-sm font-semibold tracking-wide text-slate-700 mt-1 uppercase">
            {title}
          </p>
        )}

        {contactItems.length > 0 && (
          <p className="text-[11px] text-slate-600 mt-2 flex flex-wrap justify-center gap-x-2.5 gap-y-0.5">
            {contactItems.map((item, i) => (
              <span key={i} className="inline-flex items-center">
                {i > 0 && <span className="text-slate-400 mr-2.5">•</span>}
                {item}
              </span>
            ))}
          </p>
        )}
      </div>

      {/* ==================== PROFESSIONAL SUMMARY ==================== */}
      {summary && (
        <div className="mt-4">
          <SectionHeader title="PROFESSIONAL SUMMARY" />
          <p className="text-[12px] text-slate-800 leading-normal text-justify whitespace-pre-line mt-1">
            {summary}
          </p>
        </div>
      )}

      {/* ==================== EXPERIENCE ==================== */}
      {experience && experience.length > 0 && (
        <div className="mt-4">
          <SectionHeader title="EXPERIENCE" />
          <div className="space-y-3.5 mt-1.5">
            {experience.map((exp, i) => {
              if (!exp.title && !exp.company && !exp.description) return null;
              return (
                <div key={exp.id || i} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-[13px] text-slate-950">
                      {exp.title || "Position Title"}
                    </span>
                    <span className="text-[11px] font-medium text-slate-600 whitespace-nowrap">
                      {[exp.startDate, exp.endDate || "Present"].filter(Boolean).join(" – ")}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline text-[11.5px] italic text-slate-700">
                    <span>{exp.company || "Company"}</span>
                    {exp.location && <span>{exp.location}</span>}
                  </div>

                  {exp.description && (
                    <p className="text-[11.5px] text-slate-800 mt-1 whitespace-pre-line leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== EDUCATION ==================== */}
      {education && education.length > 0 && (
        <div className="mt-4">
          <SectionHeader title="EDUCATION" />
          <div className="space-y-3 mt-1.5">
            {education.map((edu, i) => {
              if (!edu.institution && !edu.degree) return null;
              return (
                <div key={edu.id || i} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-[13px] text-slate-950">
                      {edu.institution || edu.school || "University / College"}
                    </span>
                    <span className="text-[11px] font-medium text-slate-600 whitespace-nowrap">
                      {[edu.startDate, edu.endDate || edu.year].filter(Boolean).join(" – ")}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline text-[11.5px] text-slate-700">
                    <span className="italic">
                      {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(" in ")}
                    </span>
                    {edu.cgpa && (
                      <span className="font-medium text-slate-600">
                        GPA: {edu.cgpa}
                      </span>
                    )}
                  </div>

                  {edu.description && (
                    <p className="text-[11px] text-slate-800 mt-0.5 whitespace-pre-line">
                      {edu.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== SKILLS ==================== */}
      {normalizedSkills.length > 0 && (
        <div className="mt-4">
          <SectionHeader title="SKILLS" />
          <div className="space-y-1.5 mt-1.5">
            {normalizedSkills.map((s, i) => (
              <div key={i} className="text-[11.5px] leading-snug">
                <span className="font-bold text-slate-900">{s.name}: </span>
                <span className="text-slate-700">{s.description || s.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== PROJECTS ==================== */}
      {projects && projects.length > 0 && (
        <div className="mt-4">
          <SectionHeader title="PROJECTS" />
          <div className="space-y-3 mt-1.5">
            {projects.map((proj, i) => {
              if (!proj.projectName && !proj.description) return null;
              return (
                <div key={proj.id || i} className="break-inside-avoid">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-[12.5px] text-slate-950">
                      {proj.projectName}
                      {proj.projectUrl && (
                        <span className="font-normal text-[11px] text-slate-600 ml-2">
                          ({formatUrlDisplay(proj.projectUrl)})
                        </span>
                      )}
                    </span>
                    {[proj.startDate, proj.endDate].some(Boolean) && (
                      <span className="text-[11px] text-slate-600">
                        {[proj.startDate, proj.endDate].filter(Boolean).join(" – ")}
                      </span>
                    )}
                  </div>

                  {proj.technologies && (
                    <p className="italic text-[11px] text-slate-600">
                      Technologies: {proj.technologies}
                    </p>
                  )}

                  {proj.description && (
                    <p className="text-[11.5px] text-slate-800 mt-0.5 whitespace-pre-line leading-relaxed">
                      {proj.description}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================== CERTIFICATIONS ==================== */}
      {certifications && certifications.length > 0 && (
        <div className="mt-4">
          <SectionHeader title="CERTIFICATIONS" />
          <div className="space-y-1.5 mt-1.5">
            {certifications.map((cert, i) => (
              <div key={cert.id || i} className="text-[11.5px] flex justify-between items-baseline">
                <span>
                  <span className="font-semibold text-slate-900">
                    {cert.certificationName}
                  </span>
                  {cert.issuer && <span className="text-slate-600"> — {cert.issuer}</span>}
                  {cert.credentialId && (
                    <span className="text-slate-500 text-[10.5px]"> (ID: {cert.credentialId})</span>
                  )}
                </span>
                {cert.date && <span className="text-[11px] text-slate-600">{cert.date}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== LANGUAGES ==================== */}
      {normalizedLanguages.length > 0 && (
        <div className="mt-4">
          <SectionHeader title="LANGUAGES" />
          <p className="text-[11.5px] text-slate-800 mt-1">
            {normalizedLanguages.join(" • ")}
          </p>
        </div>
      )}

      {/* ==================== CUSTOM SECTIONS ==================== */}
      {customSections && customSections.length > 0 && (
        <>
          {customSections.map((sec, i) => {
            if (!sec.sectionName && !sec.content) return null;
            return (
              <div key={sec.id || i} className="mt-4">
                <SectionHeader title={(sec.sectionName || "Additional Information").toUpperCase()} />
                <p className="text-[11.5px] text-slate-800 mt-1 whitespace-pre-line leading-relaxed">
                  {sec.content}
                </p>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div className="pdf-section-start mt-3 mb-1">
      <h2 className="font-bold text-[12px] tracking-wider uppercase text-slate-950">
        {title}
      </h2>
      <hr className="border-t border-slate-900 mt-0.5" />
    </div>
  );
}

function formatUrlDisplay(url) {
  if (!url) return "";
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
