"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useResumeStore } from "../../store/resumeStore";
import { Country, State, City } from "country-state-city";
import {
  PlusCircle,
  Trash,
  ArrowUp,
  ArrowDown,
  User,
  Briefcase,
  GraduationCap,
  Award,
  MessageSquare,
  Settings,
  Code,
  Star,
  Edit3,
  BookOpen,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Link,
  Info,
  AlertCircle,
} from "lucide-react";
import { UNIVERSITIES } from "../../data/universities";

/* ============================================================
   TEMPLATE → ALLOWED SECTIONS
   ============================================================ */
const TEMPLATE_SECTIONS = {
  classic: ["basic", "education", "experience", "skills", "projects", "languages", "certifications"],
  modern: ["basic", "education", "experience", "skills", "projects"],
};

/* ============================================================
   LOCAL DATA
   ============================================================ */
const DEGREE_LIST = [
  "Bachelor of Science (BSc)",
  "Bachelor of Arts (BA)",
  "Bachelor of Engineering (BEng)",
  "Bachelor of Computer Science (BCS)",
  "Bachelor of Business Administration (BBA)",
  "Master of Science (MSc)",
  "Master of Arts (MA)",
  "Master of Engineering (MEng)",
  "Master of Business Administration (MBA)",
  "Doctor of Philosophy (PhD)",
  "Doctor of Medicine (MD)",
  "Juris Doctor (JD)",
  "Associate Degree",
  "Diploma",
  "Certificate Program",
];

const FIELD_OF_STUDY_LIST = [
  "Computer Science",
  "Software Engineering",
  "Data Science",
  "Artificial Intelligence",
  "Cybersecurity",
  "Information Technology",
  "Business Administration",
  "Marketing",
  "Finance",
  "Economics",
  "Psychology",
  "Sociology",
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "Medicine",
  "Nursing",
  "Accounting",
  "Graphic Design",
  "Architecture",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Environmental Studies",
  "Education",
  "Law",
  "Political Science",
];

/* ============================================================
   ICON MAP
   ============================================================ */
const ICONS = {
  name: <User className="h-4 w-4" />,
  title: <Briefcase className="h-4 w-4" />,
  email: <Mail className="h-4 w-4" />,
  phone: <Phone className="h-4 w-4" />,
  location: <MapPin className="h-4 w-4" />,
  websiteOrGithub: <Link className="h-4 w-4" />,
  linkedin: <Link className="h-4 w-4" />,
  summary: <Edit3 className="h-4 w-4" />,
  institution: <GraduationCap className="h-4 w-4" />,
  degree: <Award className="h-4 w-4" />,
  fieldOfStudy: <BookOpen className="h-4 w-4" />,
  startDate: <Calendar className="h-4 w-4" />,
  endDate: <Calendar className="h-4 w-4" />,
  skillName: <Award className="h-4 w-4" />,
  description: <Edit3 className="h-4 w-4" />,
  level: <Star className="h-4 w-4" />,
  language: <MessageSquare className="h-4 w-4" />,
  proficiency: <Star className="h-4 w-4" />,
  projectName: <Code className="h-4 w-4" />,
  technologies: <Code className="h-4 w-4" />,
  projectUrl: <Link className="h-4 w-4" />,
  certificationName: <Award className="h-4 w-4" />,
  issuer: <Award className="h-4 w-4" />,
  date: <Calendar className="h-4 w-4" />,
  credentialId: <Award className="h-4 w-4" />,
  credentialUrl: <Link className="h-4 w-4" />,
  sectionName: <Settings className="h-4 w-4" />,
};

const fallbackIcon = <Edit3 className="h-4 w-4" />;

/* ============================================================
   FIELD CONFIG
   ============================================================ */
const FIELD_PROPS = {
  email: {
    type: "email",
    autoComplete: "email",
    validate: (v) => (/^\S+@\S+\.\S+$/.test(v) || v === "" ? null : "Invalid email"),
  },

  phone: {
    type: "tel",
    autoComplete: "tel",
    pattern: "[0-9+() -]*",
    validate: (v) => (/^[0-9+() -]*$/.test(v) ? null : "Invalid phone"),
  },

  websiteOrGithub: { type: "url" },
  linkedin: { type: "url" },
  projectUrl: { type: "url" },
  credentialUrl: { type: "url" },

  cgpa: {
    type: "number",
    validate: (v) =>
      v === "" || (!isNaN(v) && v >= 0 && v <= 10)
        ? null
        : "CGPA must be between 0 and 10",
  },

  startDate: { type: "date" },
  endDate: { type: "date" },
  date: { type: "date" },
};

/* ============================================================
   SECTION CONFIG
   ============================================================ */
const SECTION_CONFIG = {
  basic: {
    title: "Personal Information",
    icon: <User className="h-5 w-5" />,
    description: "Your personal details",
    tip: "Keep contact details current.",
    isArray: false,
    fields: [
      { name: "name", type: "text" },
      { name: "title" },
      { name: "email", type: "email" },
      { name: "phone", type: "tel" },
      { name: "country", type: "autocomplete", source: "countries" },
      { name: "state", type: "autocomplete", source: "states" },
      { name: "city", type: "autocomplete", source: "cities" },
      // developer-friendly single field for GitHub or Website
      { name: "websiteOrGithub", type: "url" },
      { name: "linkedin", type: "url" },
      { name: "summary", multiline: true, span: 2 },
    ],
  },

  education: {
    title: "Education",
    icon: <GraduationCap className="h-5 w-5" />,
    description: "Academic background",
    tip: "Include majors and institutions.",
    isArray: true,
    titleField: "institution",
    defaultItem: {
      id: "",
      institution: "",
      degree: "",
      fieldOfStudy: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      cgpa: "",
    },
    fields: [
      { name: "institution", type: "autocomplete", source: "universities" },
      { name: "degree", type: "autocomplete", source: "degrees" },
      { name: "fieldOfStudy", type: "autocomplete", source: "fieldsOfStudy" },
      { name: "location", type: "autocomplete", source: "cities" },
      "startDate",
      "endDate",
      "cgpa",
      { name: "description", multiline: true, span: 2 },
    ],
  },

  experience: {
    title: "Experience",
    icon: <Briefcase className="h-5 w-5" />,
    description: "Your employment history",
    tip: "Lead with achievements.",
    isArray: true,
    titleField: "title",
    defaultItem: {
      id: "",
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    },
    fields: [
      "title",
      "company",
      { name: "location", type: "autocomplete", source: "cities" },
      "startDate",
      "endDate",
      { name: "description", multiline: true, span: 2 },
    ],
  },

  // 🔥 UPDATED SKILLS SECTION
  skills: {
    title: "Skills",
    icon: <Award className="h-5 w-5" />,
    description: "Technical & soft skills",
    tip: "Add a short description for each skill.",
    isArray: true,
    titleField: "skillName",
    defaultItem: { id: "", skillName: "", description: "" },
    fields: ["skillName", { name: "description", multiline: true, span: 2 }],
  },

  languages: {
    title: "Languages",
    icon: <MessageSquare className="h-5 w-5" />,
    description: "Languages you speak",
    tip: "Be honest about proficiency.",
    isArray: true,
    titleField: "language",
    defaultItem: { id: "", language: "", proficiency: "" },
    fields: ["language", "proficiency"],
  },

  projects: {
    title: "Projects",
    icon: <Code className="h-5 w-5" />,
    description: "Your portfolio / personal projects",
    tip: "Show results or link to your work.",
    isArray: true,
    titleField: "projectName",
    defaultItem: {
      id: "",
      projectName: "",
      technologies: "",
      startDate: "",
      endDate: "",
      projectUrl: "",
      description: "",
    },
    fields: [
      "projectName",
      "technologies",
      "startDate",
      "endDate",
      "projectUrl",
      { name: "description", multiline: true, span: 2 },
    ],
  },

  certifications: {
    title: "Certifications",
    icon: <Star className="h-5 w-5" />,
    description: "Your professional certifications",
    tip: "Add credential IDs or URLs when possible.",
    isArray: true,
    titleField: "certificationName",
    defaultItem: {
      id: "",
      certificationName: "",
      issuer: "",
      date: "",
      credentialId: "",
      credentialUrl: "",
    },
    fields: ["certificationName", "issuer", "date", "credentialId", "credentialUrl"],
  },

  customSections: {
    title: "Custom Sections",
    icon: <Settings className="h-5 w-5" />,
    description: "Add unique resume sections (Awards, Publications, etc.)",
    tip: "Name your section clearly.",
    isArray: true,
    titleField: "sectionName",
    defaultItem: { id: "", sectionName: "", content: "" },
    fields: ["sectionName", { name: "content", multiline: true, span: 2 }],
  },
};

/* ============================================================
   COUNTRY HELPERS
   ============================================================ */
const ALL_COUNTRIES = Country.getAllCountries() || [];

const COUNTRY_NAME_TO_ISO = Object.fromEntries(
  ALL_COUNTRIES.map((c) => [c.name.toLowerCase(), c.isoCode])
);

function getCountryList() {
  return ALL_COUNTRIES.map((c) => c.name);
}

function getStateListForCountry(countryIso) {
  if (!countryIso) return [];
  return State.getStatesOfCountry(countryIso).map((s) => ({ name: s.name, isoCode: s.isoCode }));
}

function getCityListForState(countryIso, stateIso) {
  if (!countryIso || !stateIso) return [];
  return City.getCitiesOfState(countryIso, stateIso).map((c) => c.name);
}

async function fetchUniversities(query) {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return UNIVERSITIES.filter((u) => u.toLowerCase().includes(q)).slice(0, 50);
}

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
export default function ResumeForm({ activeSection, selectedTemplate = "classic" }) {
  // Which sections this template allows
  const allowedSections = TEMPLATE_SECTIONS[selectedTemplate] || [];
  const isSectionAllowed = allowedSections.includes(activeSection);

  // mount guard
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  // Zustand store
  const formData = useResumeStore((s) => s.data);
  const updateField = useResumeStore((s) => s.updateField);
  const updateArrayField = useResumeStore((s) => s.updateArrayField);
  const addArrayItem = useResumeStore((s) => s.addArrayItem);
  const removeArrayItem = useResumeStore((s) => s.removeArrayItem);
  const setFullData = useResumeStore((s) => s.setFullData);

  // Only load section config if allowed
  const config = useMemo(() => {
    if (!isSectionAllowed) return null;
    return SECTION_CONFIG[activeSection];
  }, [activeSection, isSectionAllowed]);

  /* Autosave */
  const AUTOSAVE_KEY = "resume_autosave_v_final";
  const autosaveTimer = useRef(null);
  const scheduleAutosave = useCallback((data) => {
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(data));
      } catch {}
    }, 900);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    scheduleAutosave(formData);
  }, [formData, mounted, scheduleAutosave]);

  /* Load saved data */
  useEffect(() => {
    if (!mounted) return;
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY);
      if (raw && Object.keys(formData || {}).length === 0) {
        setFullData(JSON.parse(raw));
      }
    } catch {}
  }, [mounted, formData, setFullData]);

  /* ID fix */
  useEffect(() => {
    if (!mounted) return;

    const updated = { ...(formData || {}) };
    let changed = false;

    for (const key of Object.keys(SECTION_CONFIG)) {
      const cfg = SECTION_CONFIG[key];
      if (!cfg.isArray) continue;

      const arr = Array.isArray(updated[key]) ? updated[key].slice() : [];
      for (let i = 0; i < arr.length; i++) {
        const it = arr[i] || {};
        if (!it.id) {
          arr[i] = { ...it, id: crypto.randomUUID() };
          changed = true;
        }
      }
      updated[key] = arr;
    }

    if (changed) {
      setFullData(updated);
    }
  }, [mounted, formData, setFullData]);

  /* Handlers */
  const handleFieldChange = useCallback(
    (field, value) => {
      updateField(field, value);
    },
    [updateField]
  );

  const handleArrayFieldChange = useCallback(
    (arrayName, index, field, value) => {
      updateArrayField(arrayName, index, field, value);
    },
    [updateArrayField]
  );

  const handleAdd = useCallback(() => {
    if (!config?.defaultItem) return;
    const item = { ...config.defaultItem, id: crypto.randomUUID() };
    addArrayItem(activeSection, item);
  }, [config, addArrayItem, activeSection]);

  const handleMove = useCallback(
    (field, index, dir) => {
      const arr = [...(formData[field] || [])];
      const to = index + dir;
      if (to < 0 || to >= arr.length) return;
      const item = arr[index];
      arr.splice(index, 1);
      arr.splice(to, 0, item);
      const next = { ...formData, [field]: arr };
      setFullData(next);
      scheduleAutosave(next);
    },
    [formData, setFullData, scheduleAutosave]
  );

  /* Render Logic */
  if (!mounted) return <PolishedSkeleton />;
  if (!config) return <EmptyState />;

  return (
    <div className="space-y-6">
      <Panel title={config.title} icon={config.icon} description={config.description} tip={config.tip}>
        {!config.isArray ? (
          <FieldRenderer fields={config.fields} data={formData} onChange={handleFieldChange} />
        ) : (
          <ArraySection
            name={activeSection}
            items={formData[activeSection] || []}
            fields={config.fields}
            titleField={config.titleField}
            onChange={handleArrayFieldChange}
            onMove={handleMove}
            onRemove={(i) => removeArrayItem(activeSection, i)}
            onAdd={handleAdd}
          />
        )}
      </Panel>
    </div>
  );
}

/* ============================================================
   ArraySection
   ============================================================ */
const ArraySection = React.memo(function ArraySection({
  name,
  items = [],
  fields,
  titleField,
  onChange,
  onMove,
  onRemove,
  onAdd,
}) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const safeItem = typeof item === "object" && item !== null ? item : {};
        const key = safeItem.id || `${name}-${index}`;

        return (
          <div key={key} className="border border-slate-200 rounded-xl p-5 bg-white shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
              <div>
                <h4 className="text-lg font-semibold text-slate-900">
                  {safeItem[titleField] || `${capitalize(name)} #${index + 1}`}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {safeItem.company || safeItem.institution || ""}
                </p>
              </div>

              <div className="flex gap-2 items-center">
                <IconBtn subtle onClick={() => onMove(name, index, -1)} title="Move up">
                  <ArrowUp className="w-4 h-4" />
                </IconBtn>
                <IconBtn subtle onClick={() => onMove(name, index, 1)} title="Move down">
                  <ArrowDown className="w-4 h-4" />
                </IconBtn>
                <IconBtn danger onClick={() => onRemove(index)} title="Remove">
                  <Trash className="w-4 h-4" />
                </IconBtn>
              </div>
            </div>

            <FieldRenderer
              fields={fields}
              data={safeItem}
              onChange={(field, value) => onChange(name, index, field, value)}
            />
          </div>
        );
      })}

      <button
        onClick={onAdd}
        className="w-full flex items-center justify-center gap-2 border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-3 rounded-lg transition"
      >
        <PlusCircle className="h-5 w-5" />
        Add {capitalize(name)}
      </button>
    </div>
  );
});

/* ============================================================
   FieldRenderer
   ============================================================ */
const FieldRenderer = React.memo(function FieldRenderer({ fields, data, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fields.map((f) => {
        const field = typeof f === "string" ? f : f.name;
        const multiline = typeof f === "object" && f.multiline;
        const span = typeof f === "object" && f.span;
        const type = typeof f === "object" && f.type;
        const source = typeof f === "object" && f.source;

        return (
          <div key={field} className={span === 2 ? "sm:col-span-2" : ""}>
            <InputField
              field={field}
              type={type}
              source={source}
              label={capitalizeWords(field)}
              value={data && data[field] !== undefined ? data[field] : ""}
              onChange={(v) => onChange(field, v)}
              multiline={multiline}
              icon={ICONS[field] ?? fallbackIcon}
            />
          </div>
        );
      })}
    </div>
  );
});

/* ============================================================
   InputField
   ============================================================ */
function debounce(fn, delay = 250) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const InputField = React.memo(function InputField({
  label,
  value,
  onChange,
  multiline,
  icon,
  field,
  type,
  source,
}) {
  const logic = FIELD_PROPS[field] || {};
  const [error, setError] = useState("");
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const form = useResumeStore((s) => s.data);
  const formCountry = form?.country;
  const formState = form?.state;

  useEffect(() => {
    if (!value) {
      const id = setTimeout(() => setError(""), 0);
      return () => clearTimeout(id);
    }
  }, [value]);

  const validate = useCallback(
    (v) => {
      if (logic.validate) {
        const msg = logic.validate(v);
        setError(msg || "");
        return !msg;
      }
      setError("");
      return true;
    },
    [logic]
  );

  const fetchOptions = useCallback(
    async (query) => {
      if (!query || query.length < 1) {
        setOptions([]);
        return;
      }

      setLoading(true);
      let results = [];

      try {
        if (source === "countries") {
          const list = getCountryList();
          results = list.filter((c) => c.toLowerCase().includes(query.toLowerCase()));
        } else if (source === "states") {
          const selectedCountry = formCountry || "";
          const iso = COUNTRY_NAME_TO_ISO[(selectedCountry || "").toLowerCase()];
          if (iso) {
            results = getStateListForCountry(iso)
              .map((s) => s.name)
              .filter((s) => s.toLowerCase().includes(query.toLowerCase()));
          } else {
            const allStates = ALL_COUNTRIES.flatMap((c) =>
              State.getStatesOfCountry(c.isoCode).map((s) => s.name)
            );
            results = allStates.filter((s) => s.toLowerCase().includes(query.toLowerCase()));
          }
        } else if (source === "cities") {
          const selectedCountry = formCountry || "";
          const selectedState = formState || "";
          const countryIso = COUNTRY_NAME_TO_ISO[(selectedCountry || "").toLowerCase()];
          let matched = [];
          if (countryIso && selectedState) {
            const states = getStateListForCountry(countryIso);
            const stateObj = states.find(
              (s) => s.name.toLowerCase() === selectedState.toLowerCase()
            );
            if (stateObj) matched = getCityListForState(countryIso, stateObj.isoCode);
          }
          if (!matched.length && countryIso) {
            const states = getStateListForCountry(countryIso);
            for (let s of states.slice(0, 5)) matched.push(...getCityListForState(countryIso, s.isoCode));
          }
          results = matched.filter((c) => c.toLowerCase().includes(query.toLowerCase()));
        } else if (source === "universities") {
          results = await fetchUniversities(query);
        } else if (source === "degrees") {
          results = DEGREE_LIST.filter((d) => d.toLowerCase().includes(query.toLowerCase()));
        } else if (source === "fieldsOfStudy") {
          results = FIELD_OF_STUDY_LIST.filter((d) => d.toLowerCase().includes(query.toLowerCase()));
        }
      } catch (err) {
        console.error("fetchOptions error", err);
      }

      setOptions(results.slice(0, 50));
      setLoading(false);
    },
    [source, formCountry, formState]
  );

  const debouncedFetch = useMemo(() => debounce(fetchOptions, 300), [fetchOptions]);

  const handleInput = useCallback(
    (v) => {
      onChange(v);
      validate(v);
      if (type === "autocomplete") debouncedFetch(v);
    },
    [onChange, validate, type, debouncedFetch]
  );

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="relative">
        {type === "autocomplete" ? (
          <>
            <input
              value={value}
              placeholder=" "
              className={`peer w-full px-4 py-3 border rounded-lg text-sm bg-white ${
                error ? "border-red-400" : "border-slate-200"
              } focus:outline-none focus:ring-2 focus:ring-blue-200`}
              onChange={(e) => handleInput(e.target.value)}
            />

            {options.length > 0 && (
              <div className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-56 overflow-auto">
                {loading && <div className="p-2 text-sm text-slate-400">Loading…</div>}

                {options.map((opt) => (
                  <div
                    key={opt}
                    onClick={() => {
                      onChange(opt);
                      setOptions([]);
                    }}
                    className="px-4 py-2 cursor-pointer hover:bg-slate-50 text-sm"
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : !multiline ? (
          <input
            {...(logic.type ? { type: logic.type } : {})}
            value={value}
            placeholder=" "
            autoComplete={logic.autoComplete}
            inputMode={logic.inputMode}
            pattern={logic.pattern}
            className={`peer w-full px-4 py-3 border rounded-lg text-sm bg-white ${
              error ? "border-red-400" : "border-slate-200"
            } focus:outline-none focus:ring-2 focus:ring-blue-200`}
            onChange={(e) => handleInput(e.target.value)}
            onBlur={() => validate(value)}
          />
        ) : (
          <textarea
            value={value}
            placeholder=" "
            rows={4}
            className={`peer w-full px-4 py-3 border rounded-lg text-sm bg-white ${
              error ? "border-red-400" : "border-slate-200"
            } focus:outline-none focus:ring-2 focus:ring-blue-200`}
            onChange={(e) => handleInput(e.target.value)}
            onBlur={() => validate(value)}
          />
        )}

        <label className="absolute left-4 -top-2 text-xs bg-white px-1 text-slate-500 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">{icon}</span>
            <span className="font-medium text-slate-700">{label}</span>
          </div>
        </label>
      </div>

      {error && (
        <div className="flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}
    </div>
  );
});

/* ============================================================
   UI Helpers
   ============================================================ */
function Panel({ title, icon, description, tip, children }) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 flex gap-4">
        <div className="p-2 rounded-lg bg-slate-50 text-slate-700">{icon}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-500 mt-1">{description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 px-6 py-6 bg-white">
        {tip && (
          <div className="flex gap-3 items-start p-4 bg-slate-50 rounded-lg border border-slate-100 mb-4">
            <div className="p-1 rounded bg-slate-100 text-slate-600">
              <Info className="h-4 w-4" />
            </div>
            <div className="text-sm text-slate-600">{tip}</div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

function IconBtn({ children, danger, subtle, ...props }) {
  const base = subtle
    ? "p-2 rounded-md hover:bg-slate-50 text-slate-500"
    : "p-2 rounded-md hover:bg-slate-50 text-slate-600";
  const dangerClass = danger ? "text-red-500 hover:bg-red-50" : "";
  return (
    <button {...props} className={`${base} ${dangerClass} transition`}>
      {children}
    </button>
  );
}

function PolishedSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-12 rounded-lg bg-slate-100 w-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-10 rounded bg-slate-100" />
        <div className="h-10 rounded bg-slate-100" />
        <div className="h-10 rounded bg-slate-100 sm:col-span-2" />
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-12 text-center text-slate-500">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
        <Settings className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="text-lg font-medium text-slate-900 mb-2">No Section</h3>
      <p className="text-sm">This section is not available for this template.</p>
    </div>
  );
}

/* ============================================================
   Helpers
   ============================================================ */
const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : "");
const capitalizeWords = (str) =>
  str ? str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()) : "";

export { getCountryList, getStateListForCountry, getCityListForState };
