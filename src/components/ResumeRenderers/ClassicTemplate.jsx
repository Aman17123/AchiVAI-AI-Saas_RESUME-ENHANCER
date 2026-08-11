"use client";

import React from "react";

export default function ClassicTemplate({ data }) {
  return (
    <div className="font-serif text-slate-900 px-10 py-10 max-w-4xl mx-auto text-[15px] leading-relaxed">

      {/* NAME */}
      <h1 className="text-xl font-bold text-center tracking-wide">
        {data?.name || "NAME"}
      </h1>
      <hr />

      {/* CONTACT */}
      <p className="text-center mt-1 text-[9px]">
        {[data?.location, data?.phone, data?.email].filter(Boolean).join(" • ")}
      </p>
      <hr className="border-black mb-5" />

      {/* ==================== EDUCATION ==================== */}
      <SectionHeader title="EDUCATION" />

      {(data?.education || []).map((edu, i) => (
        <div key={i} className="mb-3">

          {/* Institution + Dates */}
          <div className="flex justify-between items-center">
            <p className="font-bold text-[12px]">{edu.institution}</p>
            <p className="text-[10px]">{edu.startDate} – {edu.endDate}</p>
          </div>

          {/* Degree + Field */}
          <div className="flex justify-between items-center">
            <p className="text-[10px]">{edu.degree}, {edu.fieldOfStudy}</p>
            <p className="text-[10px]">{edu.cgpa} CGPA</p>
          </div>
          {/* School Name */}
          <p className="italic text-[9px]">{edu.school}</p>

          {edu.description && (
            <p className="text-[8px] whitespace-pre-line">
              {edu.description}
            </p>
          )}
        </div>
      ))}

      {/* ==================== SKILLS ==================== */}
      <SectionHeader title="SKILLS" />

      <ul className="list-disc ml-6 text-[10px] leading-tight space-y-[2px]">
        {(data?.skills || [])
          .map((skill) => {
            if (typeof skill === "string") return { name: skill.trim(), description: "" };
            if (typeof skill === "object" && skill?.value)
              return { name: skill.value.trim(), description: skill.description || "" };
            if (typeof skill === "object" && skill?.skillName)
              return { name: skill.skillName.trim(), description: skill.description || "" };
            return null;
          })
          .filter((s) => s && s.name !== "")
          .map((s, i) => (
            <li key={i}>
              <span className="font-medium">{s.name}</span>
              {s.description && (
                <div className="text-[9px] text-slate-600 ml-2 whitespace-pre-line leading-tight">
                  {s.description}
                </div>
              )}
            </li>
          ))}
      </ul>

      {/* ==================== PROJECTS ==================== */}
      <SectionHeader title="PROJECTS" />

      {(data?.projects || []).length > 0 ? (
        data.projects.map((proj, i) => (
          <div key={i} className="mb-3">

            {/* Project Name + Link Icon */}
            <p className="text-[12px] font-bold flex items-center gap-1">
              {proj.projectName}

{proj.projectUrl && (
  <a
    href={proj.projectUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="text-black hover:text-blue-800 ml-1"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="11"
      height="11"
      viewBox="0 0 24 24"
      stroke="currentColor"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block"
      style={{ verticalAlign: "middle" }}
    >
      {/* Box */}
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>

      {/* Arrow pointing to upper-right */}
      <path d="M9 9h6v6" />
      <path d="M15 9L9 15" />
    </svg>
  </a>
)}

            </p>

            {/* Technologies */}
            <p className="italic text-[9px]">{proj.technologies}</p>

            {/* Description */}
            {proj.description && (
              <p className="text-[8px] whitespace-pre-line leading-tight">
                {proj.description}
              </p>
            )}
          </div>
        ))
      ) : (
        <p className="text-sm text-slate-500">No projects added.</p>
      )}

      {/* ==================== EXPERIENCE ==================== */}
      <SectionHeader title="EXPERIENCE" />

      {(data?.experience || []).map((exp, i) => (
        <div key={i} className="mb-3">
          <p className="font-bold text-[12px]">
            {exp.company}</p>

          <p className="italic text-[9px]">
            {exp.title} • {exp.location}
          </p>

          <p className="text-[9px] italic">
            {exp.startDate || "—"} – {exp.endDate || "Present"}
          </p>

          {exp.description && (
            <p className="text-[8px] whitespace-pre-line leading-tight">
              {exp.description}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/* SECTION HEADER */
function SectionHeader({ title }) {
  return (
    <div className="pdf-section-start mt-4 mb-1">
      <p className="font-bold text-[12px] tracking-wide">{title}</p>
      <hr className="border-black" />
    </div>
  );
}
