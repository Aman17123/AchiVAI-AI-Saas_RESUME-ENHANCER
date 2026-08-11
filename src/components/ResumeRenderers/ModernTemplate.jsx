"use client";

import React from "react";

export default function ModernTemplate({ data }) {
  const {
    name = "",
    title = "",
    email = "",
    phone = "",
    linkedin = "",
    websiteOrGithub = "",
    summary = "",
    experience = [],
    education = [],
    skills = [],
    languages = [],
    projects = [],
    certifications = [],
  } = data || {};

  const contact = [
    email,
    phone,
    linkedin,
    websiteOrGithub,
  ].filter(Boolean).join(" | ");

  const summaryArray = Array.isArray(summary)
    ? summary
    : typeof summary === "string"
      ? summary.split(/\n+/).filter((p) => p.trim())
      : [];

  const skillNames = skills
    .map((s) => (typeof s === "string" ? s : s?.skillName || s?.name || ""))
    .filter(Boolean);

  const languageList = languages
    .map((l) =>
      typeof l === "string"
        ? l
        : [l?.language, l?.proficiency].filter(Boolean).join(" — ")
    )
    .filter(Boolean);

  return (
    <div className="w-full min-h-screen flex font-sans text-slate-700">
      {/* LEFT SIDEBAR */}
      <div className="w-[33%] bg-slate-100 px-10 py-12 flex flex-col">

        {/* Profile Image Placeholder */}
        <div className="w-40 h-40 bg-slate-300 rounded-full mx-auto flex items-center justify-center text-sm text-slate-600">
          Upload Photo
        </div>

        {/* Name */}
        <h1 className="text-3xl font-bold text-center mt-5 text-slate-900">
          {name}
        </h1>

        <p className="text-center text-slate-600 text-base">
          {title}
        </p>

        {/* Summary */}
        <div className="mt-8">
          {summaryArray.length > 0 ? (
            summaryArray.map((paragraph, index) => (
              <p key={index} className="text-sm leading-relaxed mb-4">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-sm text-slate-400 italic">
              No summary added.
            </p>
          )}
        </div>

        {/* Contact */}
        {contact && (
          <div className="mt-10 text-sm space-y-1">
            <p>{contact}</p>
          </div>
        )}

        <p className="mt-6 text-xs text-slate-500">
          References available upon request
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-[67%] px-10 py-12">

        {/* WORK EXPERIENCE */}
        <h2 className="pdf-section-start text-xl font-bold text-slate-800 flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white text-sm">
            💼
          </span>
          WORK EXPERIENCE
        </h2>

        <div className="mt-4 space-y-8">
          {experience && experience.length > 0 ? (
            experience.map((job, index) => (
              <div key={index}>
                <p className="font-bold text-sm">{job.title}</p>
                <p className="text-xs text-slate-500">
                  {[job.company, job.location].filter(Boolean).join(" | ")}
                  {[job.startDate, job.endDate].some(Boolean)
                    ? ` | ${[job.startDate, job.endDate].filter(Boolean).join(" – ")}`
                    : ""}
                </p>

                {job.description && (
                  <p className="text-sm mt-2 whitespace-pre-line">
                    {job.description}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 italic">No experience added.</p>
          )}
        </div>

        {/* EDUCATION */}
        <h2 className="pdf-section-start text-xl font-bold text-slate-800 flex items-center gap-3 mt-10">
          <span className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white text-sm">
            🎓
          </span>
          EDUCATION
        </h2>

        <div className="mt-4 space-y-6">
          {education && education.length > 0 ? (
            education.map((edu, index) => (
              <div key={index}>
                <p className="font-bold text-sm">{edu.institution || edu.degree}</p>
                <p className="text-xs text-slate-500">
                  {[edu.degree, edu.fieldOfStudy].filter(Boolean).join(", ")}
                  {edu.cgpa ? ` | GPA: ${edu.cgpa}` : ""}
                </p>
                <p className="text-xs text-slate-500">
                  {[edu.startDate, edu.endDate].filter(Boolean).join(" – ")}
                </p>
                {edu.description && (
                  <p className="text-sm mt-2 whitespace-pre-line">
                    {edu.description}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 italic">No education added.</p>
          )}
        </div>

        {/* PROJECTS */}
        {projects && projects.length > 0 && (
          <>
            <h2 className="pdf-section-start text-xl font-bold text-slate-800 flex items-center gap-3 mt-10">
              <span className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white text-sm">
                🚀
              </span>
              PROJECTS
            </h2>

            <div className="mt-4 space-y-6">
              {projects.map((proj, index) => (
                <div key={index}>
                  <p className="font-bold text-sm">
                    {proj.projectName}
                    {proj.technologies && (
                      <span className="text-xs font-normal text-slate-500">
                        {" "}— {proj.technologies}
                      </span>
                    )}
                  </p>
                  {proj.description && (
                    <p className="text-sm mt-1 whitespace-pre-line">
                      {proj.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* SKILLS SECTION */}
        <h2 className="pdf-section-start text-xl font-bold text-slate-800 flex items-center gap-3 mt-10">
          <span className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white text-sm">
            🛠️
          </span>
          SKILLS
        </h2>

        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          {skillNames.length > 0 ? (
            skillNames.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-slate-400 italic">No skills added.</p>
          )}
        </div>

        {/* LANGUAGES */}
        {languageList.length > 0 && (
          <>
            <h2 className="pdf-section-start text-xl font-bold text-slate-800 flex items-center gap-3 mt-10">
              <span className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white text-sm">
                🗣️
              </span>
              LANGUAGES
            </h2>

            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {languageList.map((language, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200"
                >
                  {language}
                </span>
              ))}
            </div>
          </>
        )}

        {/* CERTIFICATIONS */}
        {certifications && certifications.length > 0 && (
          <>
            <h2 className="pdf-section-start text-xl font-bold text-slate-800 flex items-center gap-3 mt-10">
              <span className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-white text-sm">
                🏅
              </span>
              CERTIFICATIONS
            </h2>

            <div className="mt-4 space-y-2 text-sm">
              {certifications.map((cert, index) => (
                <p key={index}>
                  <span className="font-bold">{cert.certificationName}</span>
                  {cert.issuer && <span className="text-slate-500"> — {cert.issuer}</span>}
                  {cert.date && <span className="text-slate-500"> ({cert.date})</span>}
                </p>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}