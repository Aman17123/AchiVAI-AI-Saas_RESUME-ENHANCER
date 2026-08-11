"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from 'next/navigation';
import ResumeForm from "../../../components/Editor/ResumeForm";
import { useResumeStore } from "../../../store/resumeStore";
import ClassicTemplate from "../../../components/ResumeRenderers/ClassicTemplate";
import ModernTemplate from "../../../components/ResumeRenderers/ModernTemplate";
import classicTemplateJson from "../../../templates/classic.json";
import modernTemplateJson from "../../../templates/modern.json";
import { downloadResumePDF } from "../../../utils/downloadPDF";
import { saveResumeToCloud } from "../../../lib/resumeService";
import { createClient } from "../../../lib/supabase";
import {
  FileText, Download, Share, Eye, Monitor, Smartphone,
  Save, Maximize, Minimize, Type, Settings,
  ZoomIn, ZoomOut, File, Layers, CheckCircle, Info,
  Code, User, Briefcase, GraduationCap, Award, MessageSquare,
  Star, Plus, Menu
} from "lucide-react";


export default function EditorPage() {
  const params = useParams();
  const { id: templateId } = params;
  const { data, setFullData, saveResume, addArrayItem } = useResumeStore();
  const [ready, setReady] = useState(false);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [theme, setTheme] = useState("professional-blue");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSection, setActiveSection] = useState("basic");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isSaving, setIsSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [templateName, setTemplateName] = useState("");
  const [templateLayout, setTemplateLayout] = useState("classic");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

  const templateOptions = ["classic", "modern"];

  const pickTemplate = (layout) => {
    setIsPickerOpen(false);
    handleTemplateChange(layout);
  };

    useEffect(() => {
      let mounted = true;

      async function load() {
        const makeEmpty = (tpl) => ({
          _template: tpl,
          name: "",
          title: "",
          email: "",
          phone: "",
          location: "",
          summary: "",
          website: "",
          linkedin: "",
          experience: [],
          education: [],
          skills: [],
          languages: [],
          projects: [],
          certifications: [],
          customSections: [],
        });

        try {
          if (templateId === "new") {
            if (!mounted) return;
            setFullData(makeEmpty("new"));
            setTemplateName("New Resume");
            setReady(true);
            return;
          }

          // Optional: load a saved resume from the cloud via ?resume=<id>
          const resumeId = new URLSearchParams(window.location.search).get(
            "resume"
          );

          if (resumeId) {
            try {
              const sessionId = sessionStorage.getItem("achivai_resume_id");
              if (sessionId !== resumeId) {
                sessionStorage.setItem("achivai_resume_id", resumeId);
              }
            } catch {}

            const supabase = createClient();
            const { data: saved } = await supabase
              .from("resumes")
              .select("id, name, template, data")
              .eq("id", resumeId)
              .maybeSingle();

            if (saved) {
              setFullData(saved.data);
              setTemplateName(saved.name || "Untitled Resume");
              setTemplateLayout(saved.template || "classic");
              setReady(true);
              return;
            }
          }

          const templateFiles = {
            classic: classicTemplateJson,
            modern: modernTemplateJson,
          };

          const templateJSON = templateFiles[templateId] || null;

          if (!templateJSON) {
            console.warn("Template not found, using fallback.");
            setFullData(makeEmpty(templateId));
            setTemplateName("Untitled Resume");
            setReady(true);
            return;
          }

          setFullData(templateJSON);
          setTemplateName(templateJSON.name || "Untitled Resume");

        // Correct mapping for all templates
        if (templateId.includes("modern")) {
          setTemplateLayout("modern");
        } 
        else {
          setTemplateLayout("classic");
        }

          
        } finally {
          mounted && setReady(true);
        }
      }

      load();
      return () => (mounted = false);
    }, [templateId, setFullData]);

    const TemplateComponent = useMemo(() => {
      switch (templateLayout) {
        case "modern":
          return ModernTemplate;
        default:
          return ClassicTemplate;
      }
    }, [templateLayout]);


  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 50));
  const handleResetZoom = () => setZoomLevel(100);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await saveResumeToCloud({
        name: templateName || data.name || "Untitled Resume",
        template: data?._template || templateLayout,
        data,
      });

      if (result.ok) {
        await saveResume(data); // localStorage backup
        setNotificationMessage(result.message || "Resume saved successfully!");
      } else if (result.auth) {
        setNotificationMessage(result.message);
      } else {
        setNotificationMessage("Saved offline. Sign in to save to the cloud.");
        await saveResume(data); // localStorage fallback
      }
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        setIsSaving(false);
      }, 2000);
    } catch {
      setNotificationMessage("Error saving resume. Please try again.");
      setShowNotification(true);
      setTimeout(() => {
        setShowNotification(false);
        setIsSaving(false);
      }, 2000);
    }
  };

  const handleTemplateChange = (layout) => {
    setTemplateLayout(layout);
    setNotificationMessage(`Template changed to ${layout}`);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleAddCustomSection = () => {
    addArrayItem("customSections", { title: "New Section", content: "" });
    setActiveSection("customSections");
    setNotificationMessage("Custom section added");
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setNotificationMessage("Link copied to clipboard!");
    } catch {
      setNotificationMessage("Share link copied to clipboard!");
    }
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleDuplicate = () => {
    const copy = deepClone(data);
    copy.name = data.name ? `${data.name} (copy)` : "Untitled Resume (copy)";
    setFullData(copy);
    setTemplateName(copy.name || "Untitled Resume (copy)");
    setNotificationMessage("Resume duplicated!");
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await downloadResumePDF(data, theme, templateLayout);
      setNotificationMessage("Resume exported successfully!");
      setShowNotification(true);
    } catch {
      setNotificationMessage("Error exporting PDF.");
      setShowNotification(true);
    } finally {
      setIsExporting(false);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const sections = [
    { id: "basic", name: "Personal Info", icon: <User className="h-5 w-5" /> },
    { id: "experience", name: "Experience", icon: <Briefcase className="h-5 w-5" /> },
    { id: "education", name: "Education", icon: <GraduationCap className="h-5 w-5" /> },
    { id: "skills", name: "Skills", icon: <Award className="h-5 w-5" /> },
    { id: "languages", name: "Languages", icon: <MessageSquare className="h-5 w-5" /> },
    { id: "projects", name: "Projects", icon: <Code className="h-5 w-5" /> },
    { id: "certifications", name: "Certifications", icon: <Star className="h-5 w-5" /> },
    { id: "customSections", name: "Custom Sections", icon: <Settings className="h-5 w-5" /> },
  ];

  /*  
  ======================================================
  NEW MINIMAL LOADER (Option B)
  ======================================================
  */
  if (!ready) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500">Loading Resume Editor...</p>
      </div>
    </div>
  );

  return (
    <>
      <div className="min-h-screen bg-slate-50 flex flex-col">

        {/* Top Navigation Bar */}
        <nav className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-sm">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">{templateName}</h1>
                <p className="text-xs text-slate-500">Professional Resume Builder</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">          
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-sm disabled:opacity-70"
            >
              {isSaving ? (
                <>
                  <div className="w-3 h-3 border-t border-white border-solid rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </>
              )}
            </button>

            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-sm disabled:opacity-70"
            >
              {isExporting ? (
                <>
                  <div className="w-3 h-3 border-t border-white border-solid rounded-full animate-spin"></div>
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                </>
              )}
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Section Navigation */}
          {sidebarOpen && (
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
              <div className="p-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-900">Resume Sections</h2>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                <div className="space-y-1">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <div
                        className={`p-1.5 rounded-md ${
                          activeSection === section.id
                            ? "bg-blue-100 text-blue-600"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {section.icon}
                      </div>
                      <span className="text-sm font-medium">{section.name}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200 px-3">
                  <button
                    onClick={handleAddCustomSection}
                    className="w-full flex items-center gap-2 px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Plus className="h-4 w-4" />
                    Add Custom Section
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content — Editor + Preview */}
          <div className="flex-1 flex flex-col">
            {/* Editor Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Editor Panel */}
              <div className="flex-1 bg-white border-r border-slate-200 overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <Type className="h-5 w-5 text-blue-500" />
                      {sections.find((s) => s.id === activeSection)?.name || "Section"}
                    </h2>
                    <div className="flex items-center gap-2 text-xs px-2.5 py-1 bg-green-50 text-green-700 rounded-full">
                      <CheckCircle className="h-3 w-3" />
                      Auto-saved
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="p-5">
                    <ResumeForm activeSection={activeSection} />
                  </div>
                </div>
              </div>

              {/* Preview Panel */}
              <div className="flex-1 bg-slate-50 overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-slate-200 bg-white">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                      <Eye className="h-5 w-5 text-blue-500" />
                      Resume Preview
                    </h2>

                    {/* Preview toolbar */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <button
                          onClick={() => setPreviewMode("desktop")}
                          className={`p-1.5 rounded-md transition-colors ${
                            previewMode === "desktop"
                              ? "bg-white shadow-sm text-blue-600"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <Monitor className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setPreviewMode("mobile")}
                          className={`p-1.5 rounded-md transition-colors ${
                            previewMode === "mobile"
                              ? "bg-white shadow-sm text-blue-600"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          <Smartphone className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Zoom */}
                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                        <button
                          onClick={handleZoomOut}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
                        >
                          <ZoomOut className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleResetZoom}
                          className="px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 rounded-md font-medium"
                        >
                          {zoomLevel}%
                        </button>
                        <button
                          onClick={handleZoomIn}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
                        >
                          <ZoomIn className="h-4 w-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
                      >
                        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preview Body */}
                <div
                  className={`flex-1 p-5 flex items-center justify-center ${
                    isFullscreen ? "fixed inset-0 z-50 bg-white" : ""
                  }`}
                >
                  <div
                    className={`relative ${
                      previewMode === "mobile" ? "w-80" : "w-full max-w-2xl"
                    }`}
                    style={{
                      transform: `scale(${zoomLevel / 100})`,
                      transformOrigin: "center",
                    }}
                  >
                    {/* Shadow frame */}
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl shadow-lg blur-sm opacity-30"></div>

                    {/* Document */}
                    <div
                      className="relative bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
                      style={{ aspectRatio: "210/297" }}
                    >
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2"></div>

                      <div className="p-8 bg-white h-full overflow-auto">
                        <TemplateComponent data={data} theme={theme} />
                      </div>

                      <div className="px-8 py-4 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500 flex items-center justify-between">
                        <div>Created with AchiVAI</div>
                        <div>Last saved: {new Date().toLocaleDateString()}</div>
                      </div>
                    </div>

                    {previewMode === "mobile" && (
                      <>
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-300 rounded-full"></div>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-2 border-slate-300"></div>
                      </>
                    )}
                  </div>
                </div>

                {/* Preview Footer */}
                <div className="px-5 py-3 border-t border-slate-200 bg-white">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsPickerOpen(true)}
                        className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-sm font-medium"
                      >
                        <File className="h-4 w-4" />
                        Change Template
                      </button>

                      <button
                        onClick={handleDuplicate}
                        className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-sm font-medium"
                      >
                        <Layers className="h-4 w-4" />
                        Duplicate
                      </button>
                    </div>

                    <button
                      onClick={handleShare}
                      className="flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm"
                    >
                      <Share className="h-4 w-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Tips Bar */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <Info className="h-4 w-4 text-white" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <span className="font-medium">Pro Tip:</span> Use action verbs and quantify achievements for stronger impact.
              </p>
            </div>
            <div className="ml-auto">
              <a className="text-sm font-medium text-blue-600 hover:text-blue-800" href="#">
                View All Tips →
              </a>
            </div>
          </div>
        </div>

        {/* Notification */}
        {showNotification && (
          <div className="fixed bottom-4 right-4 bg-slate-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 animate-fade-in">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <span>{notificationMessage}</span>
          </div>
        )}

      </div>

      {/* Template Picker Modal */}
      {isPickerOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Choose a Template</h3>
              <button
                onClick={() => setIsPickerOpen(false)}
                className="text-slate-500 hover:text-slate-900 text-xl leading-none cursor-pointer"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {templateOptions.map((t) => (
                <button
                  key={t}
                  onClick={() => pickTemplate(t)}
                  className={`p-4 rounded-lg border-2 text-sm font-medium capitalize transition-colors cursor-pointer ${
                    templateLayout === t
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 hover:border-blue-300 text-slate-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

