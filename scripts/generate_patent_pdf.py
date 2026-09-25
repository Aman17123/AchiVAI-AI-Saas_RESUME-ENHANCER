import os
import subprocess

html_content = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>AchiVAI — Patent Evaluation & Provisional Specification Dossier</title>
<style>
  @page {
    size: A4;
    margin: 20mm 16mm 20mm 16mm;
    @bottom-right {
      content: counter(page);
    }
  }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    line-height: 1.6;
    font-size: 10.5pt;
    background-color: #ffffff;
    margin: 0;
    padding: 0;
  }

  /* Cover Page */
  .cover-page {
    page-break-after: always;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 92vh;
    padding: 30px 10px;
    border-bottom: 4px solid #1e3a8a;
  }

  .cover-badge {
    display: inline-block;
    background: #e0e7ff;
    color: #1e3a8a;
    font-weight: 700;
    font-size: 9pt;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    padding: 6px 14px;
    border-radius: 4px;
    width: fit-content;
  }

  .cover-title {
    font-size: 26pt;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.25;
    margin-top: 25px;
    margin-bottom: 12px;
  }

  .cover-subtitle {
    font-size: 13pt;
    color: #475569;
    line-height: 1.5;
    font-weight: 400;
    max-width: 90%;
  }

  .cover-divider {
    width: 80px;
    height: 4px;
    background: #2563eb;
    margin: 25px 0;
  }

  .cover-meta-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 20px;
    margin-top: 30px;
  }

  .cover-meta-item h4 {
    margin: 0 0 4px 0;
    font-size: 8.5pt;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #64748b;
  }

  .cover-meta-item p {
    margin: 0;
    font-size: 11pt;
    font-weight: 600;
    color: #0f172a;
  }

  .cover-footer {
    font-size: 8.5pt;
    color: #94a3b8;
    border-top: 1px solid #e2e8f0;
    padding-top: 15px;
    margin-top: auto;
  }

  /* Typography */
  h1, h2, h3, h4, h5 {
    color: #0f172a;
    font-weight: 700;
    page-break-after: avoid;
  }

  h1 {
    font-size: 18pt;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 6px;
    margin-top: 28px;
    margin-bottom: 14px;
    letter-spacing: -0.3px;
  }

  h2 {
    font-size: 13.5pt;
    margin-top: 20px;
    margin-bottom: 10px;
    color: #1e3a8a;
  }

  h3 {
    font-size: 11.5pt;
    margin-top: 14px;
    margin-bottom: 6px;
    color: #334155;
  }

  p {
    margin-top: 0;
    margin-bottom: 10px;
    text-align: justify;
  }

  /* Page Breaks */
  .page-break {
    page-break-before: always;
  }

  .no-break {
    page-break-inside: avoid;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 9.5pt;
    page-break-inside: avoid;
  }

  th, td {
    padding: 8px 10px;
    border: 1px solid #cbd5e1;
    text-align: left;
    vertical-align: top;
  }

  th {
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  tr:nth-child(even) td {
    background-color: #f8fafc;
  }

  /* Callout Cards */
  .callout {
    border-left: 4px solid #2563eb;
    background: #f0f7ff;
    padding: 12px 16px;
    border-radius: 0 6px 6px 0;
    margin: 14px 0;
    page-break-inside: avoid;
  }

  .callout-title {
    font-weight: 700;
    color: #1e3a8a;
    font-size: 10pt;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .callout-warning {
    border-left-color: #dc2626;
    background: #fef2f2;
  }

  .callout-warning .callout-title {
    color: #991b1b;
  }

  .callout-success {
    border-left-color: #16a34a;
    background: #f0fdf4;
  }

  .callout-success .callout-title {
    color: #166534;
  }

  /* Code & Pre */
  code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 9pt;
    background: #f1f5f9;
    padding: 2px 5px;
    border-radius: 3px;
    color: #0f172a;
  }

  pre {
    background: #0f172a;
    color: #f8fafc;
    padding: 14px;
    border-radius: 6px;
    font-size: 8.5pt;
    line-height: 1.45;
    overflow-x: hidden;
    page-break-inside: avoid;
    white-space: pre-wrap;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
  }

  /* Math Blocks */
  .math-box {
    background: #f8fafc;
    border: 1px solid #cbd5e1;
    border-left: 4px solid #6366f1;
    padding: 10px 16px;
    border-radius: 4px;
    margin: 12px 0;
    font-family: "Cambria Math", "Times New Roman", serif;
    font-size: 11pt;
    text-align: center;
    page-break-inside: avoid;
  }

  /* Lists */
  ul, ol {
    margin-top: 0;
    margin-bottom: 10px;
    padding-left: 20px;
  }

  li {
    margin-bottom: 4px;
  }

  /* Header running band */
  .section-tag {
    font-size: 8pt;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #64748b;
    font-weight: 700;
    margin-bottom: 2px;
  }

  .claim-item {
    margin-bottom: 12px;
    padding-left: 8px;
    border-left: 2px solid #e2e8f0;
  }
</style>
</head>
<body>

<!-- ================= COVER PAGE ================= -->
<div class="cover-page">
  <div>
    <span class="cover-badge">Academic &amp; Patent Advisory Dossier</span>
    <h1 class="cover-title">AchiVAI: Patent Evaluation &amp; Provisional Specification Dossier</h1>
    <p class="cover-subtitle">
      A Comprehensive Technical Audit, Indian Patent Office (IPO) Form 2 Provisional Specification, and Strategic Intellectual Property Advisory on Deterministic-Semantic ATS Calibration &amp; Closed-Loop Document Synthesis.
    </p>
    <div class="cover-divider"></div>
  </div>

  <div class="cover-meta-grid">
    <div class="cover-meta-item">
      <h4>Principal Inventor &amp; Author</h4>
      <p>Aman</p>
      <span style="font-size:8.5pt; color:#64748b;">Lead Developer &amp; System Architect</span>
    </div>
    <div class="cover-meta-item">
      <h4>Target Institution</h4>
      <p>College / University IPR Cell</p>
      <span style="font-size:8.5pt; color:#64748b;">Department of Computer Science / Engineering</span>
    </div>
    <div class="cover-meta-item">
      <h4>Project Codebase</h4>
      <p>AchiVAI (Next.js SaaS Platform)</p>
      <span style="font-size:8.5pt; color:#64748b;">AI-Resume-Enhancer Engine</span>
    </div>
    <div class="cover-meta-item">
      <h4>Document Version &amp; Date</h4>
      <p>v1.0 (Confidential)</p>
      <span style="font-size:8.5pt; color:#64748b;">September 16, 2026</span>
    </div>
  </div>

  <div class="cover-footer">
    <strong>Notice:</strong> This document contains proprietary technical formulations, provisional patent specifications under the Indian Patents Act, 1970, and strategic risk analyses. Prepared specifically for consultation with faculty advisors and registered patent attorneys.
  </div>
</div>


<!-- ================= EXECUTIVE SUMMARY FOR PROFESSOR ================= -->
<div class="page-break"></div>
<div class="section-tag">Executive Summary</div>
<h1>1. Executive Briefing for Faculty Advisor</h1>

<p>
This dossier has been compiled to evaluate whether the <strong>AchiVAI</strong> software project contains patentable intellectual property under Indian Patent Law (The Patents Act, 1970) and international standards, and to present a fully drafted <strong>Provisional Patent Specification (Form 2)</strong> for institutional review.
</p>

<div class="callout callout-warning">
  <div class="callout-title">&#9888; The Honest Technical Reality of the Current Code</div>
  <p>
    In its present operational state, AchiVAI is an application wrapper: it extracts text using open-source libraries (<code>pdf-parse</code>, <code>mammoth</code>), sends it to Google's <code>gemini-1.5-flash</code> API with a prompt, and displays the returned JSON score. Under <strong>Section 3(k) of the Indian Patents Act, 1970</strong> and <strong>35 U.S.C. § 101</strong>, <em>"asking an off-the-shelf AI API to score a resume"</em> is non-statutory subject matter (an abstract business idea / computer programme per se) and is categorically non-patentable.
  </p>
</div>

<div class="callout callout-success">
  <div class="callout-title">&#10004; The Inventive Elevation Developed in This Dossier</div>
  <p>
    To transform this project into an enforceable, patentable invention, we have architected the <strong>Hybrid Deterministic-Semantic ATS Calibration and Closed-Loop Document Synthesis System</strong>. Instead of trusting an LLM's non-deterministic black-box score, this architecture introduces a <strong>parallel dual-track evaluation pipeline</strong>, a <strong>closed-form mathematical calibration formula</strong>, and a <strong>closed-loop ATS emulator</strong> that tests compiled PDF/UA data streams for 99.9% machine-readability.
  </p>
</div>

<h2>Key Decision Points to Discuss with Your Professor</h2>
<ol>
  <li>
    <strong>Filing a Provisional Patent (Indian Patent Office):</strong><br>
    Does our university/college have an active IPR Cell with student patent sponsorship? Filing a provisional application (Form 1 + Form 2) secures an immediate <strong>12-month priority date</strong> at very low statutory cost (₹1,600 for individuals/students), during which we can build out the mathematical calibration benchmarks before filing the Complete Specification.
  </li>
  <li>
    <strong>Alternative: High-Impact Academic Conference Publication:</strong><br>
    If patent prosecution costs or Section 3(k) hurdles are prohibitive, the exact hybrid architecture formulated in this dossier provides the ideal methodology for an <strong>IEEE / ACM / Springer research paper</strong> titled <em>"Bridging the Reliability Gap in Automated Resume Screening: A Deterministic-Semantic Calibration Architecture with Closed-Loop Parser Emulation."</em>
  </li>
  <li>
    <strong>Software Copyright Protection:</strong><br>
    Immediate source code copyright registration (Form XIV, Copyright Act, 1957) can be secured for the current Next.js application codebase, protecting the UI, schema, and business logic from plagiarism.
  </li>
</ol>


<!-- ================= PART 1: CODEBASE INVENTORY & AUDIT ================= -->
<div class="page-break"></div>
<div class="section-tag">Part 1 &bull; Technical Audit</div>
<h1>2. Technical Inventory &amp; Patentability Matrix</h1>

<p>
Every component of the existing <code>AchiVAI-AI-Saas_RESUME-ENHANCER</code> repository was mechanically audited to determine whether novel technical steps exist in the source code.
</p>

<table>
  <thead>
    <tr>
      <th style="width: 22%;">Component &amp; Source File</th>
      <th style="width: 38%;">Mechanical Operation</th>
      <th style="width: 25%;">Section 3(k) &amp; Prior Art Rating</th>
      <th style="width: 15%;">Verdict</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Prompt Construction</strong><br><code>src/lib/prompt.js</code></td>
      <td>String template concatenation injecting resume text and job description into a prompt instructing Gemini to return JSON with an integer <code>atsScore</code>. No mathematical weighting or chunking.</td>
      <td><strong>Novelty: 0/10</strong><br>Standard prompt engineering. Thousands of open-source wrappers use identical formats. Fails Section 3(k) (mental act / algorithm).</td>
      <td><span style="color:#dc2626; font-weight:700;">Non-Patentable</span></td>
    </tr>
    <tr>
      <td><strong>Document Text Parser</strong><br><code>src/lib/fileParsers.js</code></td>
      <td>Invokes npm packages <code>pdf-parse</code> (PDF) and <code>mammoth</code> (DOCX). Applies standard regex to collapse whitespace and remove page tags. Truncates at 30k chars.</td>
      <td><strong>Novelty: 0/10</strong><br>Textbook file I/O using public third-party npm packages. No custom OCR, coordinate trees, or table decoders.</td>
      <td><span style="color:#dc2626; font-weight:700;">Non-Patentable</span></td>
    </tr>
    <tr>
      <td><strong>End-to-End ATS Scoring</strong><br><code>src/app/api/analyze-resume/</code></td>
      <td>Authenticates user via Supabase, checks monthly quota in <code>usage_events</code>, calls Gemini 1.5 Flash, parses JSON, and clamps score (0–100).</td>
      <td><strong>Novelty: 0/10</strong><br>Scoring is 100% computed inside third-party LLM weights. No deterministic post-processing or formula.</td>
      <td><span style="color:#dc2626; font-weight:700;">Non-Patentable</span></td>
    </tr>
    <tr>
      <td><strong>Billing &amp; Quota Guards</strong><br><code>src/lib/razorpayServer.js</code></td>
      <td>HMAC-SHA256 hash verification (crypto) and standard SQL monthly count queries (<code>created_at &gt;= startOfMonth</code>).</td>
      <td><strong>Novelty: 0/10</strong><br>Standard RFC 2104 cryptographic boilerplate and standard database counter logic.</td>
      <td><span style="color:#dc2626; font-weight:700;">Non-Patentable</span></td>
    </tr>
    <tr>
      <td><strong>PDF Export Pipeline</strong><br><code>src/utils/downloadPDF.js</code></td>
      <td>Renders React HTML offscreen, screenshots DOM using <code>html2canvas</code>, normalizes CSS color spaces via 2D canvas probe, slices image at section boundaries, and saves as PNGs in <code>jsPDF</code>.</td>
      <td><strong>Novelty: 2.5/10</strong><br>Slicing DOM screenshots is standard since 2017. <strong>Critical Flaw:</strong> Produces a raster image PDF with zero text streams, failing non-OCR ATS parsers.</td>
      <td><span style="color:#dc2626; font-weight:700;">Unviable</span><br>(Contradicts ATS claim)</td>
    </tr>
  </tbody>
</table>

<div class="callout">
  <div class="callout-title">The Engineering Paradox in Current Resume Builders</div>
  <p>
    AchiVAI's web interface promises <em>"ATS-friendly vector PDF export."</em> However, mechanical inspection of <code>src/utils/downloadPDF.js</code> reveals it uses <code>html2canvas</code> to rasterize DOM elements into bitmap canvases, inserting PNG images into <code>jsPDF</code>. When an actual corporate ATS (e.g., Taleo, Workday, Greenhouse) ingests this file without optical character recognition (OCR), it extracts <strong>zero characters</strong>. 
    The patent specification drafted herein explicitly rectifies this by claiming a <strong>dual-layer vector synthesis engine with an integrated closed-loop ATS parser emulator</strong>.
  </p>
</div>


<!-- ================= PART 2: INVENTION DISCLOSURE FORM ================= -->
<div class="page-break"></div>
<div class="section-tag">Part 2 &bull; Invention Disclosure Form</div>
<h1>3. Invention Disclosure Form (IDF)</h1>

<p><strong>Document Ref:</strong> ACHIVAI-IDF-2026-001 &bull; <strong>Status:</strong> Confidential</p>

<h2>3.1 Title of the Invention</h2>
<p>
<strong>System and Method for Deterministic-Semantic Hybrid Evaluation, Calibration, and Machine-Readable Document Synthesis for Automated Applicant Tracking Systems</strong>
</p>

<h2>3.2 Technical Field</h2>
<p>
Computational linguistics, natural language processing (NLP), document layout graph parsing, and automated recruitment technologies.
</p>

<h2>3.3 Technical Problems Addressed</h2>
<ul>
  <li><strong>Probabilistic LLM Non-Determinism &amp; Score Drift:</strong> Generative models yield divergent scores and hallucinated keyword lists across identical resume-JD pairs due to stochastic token sampling.</li>
  <li><strong>The Client-Side "Image Trap":</strong> Web resume builders screenshot HTML trees into bitmap PDFs, causing total parsing failure in standard enterprise ATS non-OCR pipelines.</li>
  <li><strong>Absence of an Auditable Calibration Metric:</strong> Enterprise recruitment compliance requires mathematical explainability, which black-box neural networks cannot provide.</li>
</ul>

<h2>3.4 Prior Art Differentiation</h2>
<ul>
  <li><strong>Jobscan &amp; Lexical Matchers:</strong> Rely solely on exact string matches and n-gram frequencies. They fail to identify contextual semantic equivalence (e.g., "GCP architect" vs "distributed cloud engineering").</li>
  <li><strong>Generative LLM Wrappers (Resume Worded, Rezi):</strong> Offload scoring entirely to external models via prompts. Unpatentable under Section 3(k) and 35 U.S.C. § 101, non-reproducible, and prone to hallucinations.</li>
  <li><strong>US Patent 10,242,084 B2:</strong> Discloses rules-based resume entity extraction. It lacks parallel vector projection, closed-form multi-stage calibration, and emulator verification loops.</li>
</ul>

<h2>3.5 System Architecture Overview</h2>
<pre>
[Raw Document (PDF/DOCX)] + [Job Description (JD)]
              │
              ▼
   ┌─────────────────────────────────────────────────────────┐
   │ Stage 1: Structural Tokenizer &amp; Layout Graph Extractor  │
   │  - Font hierarchy, Section-Boundary Mapping, Regex Anchors│
   └──────────────────────────┬──────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
   ┌──────────────────────┐       ┌────────────────────────┐
   │ Track A:             │       │ Track B:               │
   │ Deterministic        │       │ Dense Vector Semantic  │
   │ Lexical &amp; Ontology   │       │ Projection             │
   │ - Exact n-gram gate  │       │ - Clause embeddings    │
   │ - Acronym normalize  │       │ - Cosine similarity    │
   │ - Metric regex density│      │   matrix matching      │
   └──────────┬───────────┘       └───────────┬────────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
   ┌─────────────────────────────────────────────────────────┐
   │ Stage 3: Closed-Form Calibration Mathematical Engine    │
   │  S_ATS = α·S_lex + β·S_sem + γ·S_struct - Σ(δ_k · P_k)   │
   │  (100% Deterministic, Auditable, Reproducible ATS Score)│
   └──────────────────────────┬──────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
   ┌────────────────────────┐     ┌──────────────────────────┐
   │ Stage 4: Constrained   │     │ Stage 5: ATS-Safe Dual-  │
   │ Generative Gap Engine  │     │ Layer Document Synthesizer│
   │ - LLM generates text   │     │ - Linearized PDF/UA text │
   │   strictly for discrete│     │ - Closed-loop emulation  │
   │   mathematical residuals│    │   round-trip verification│
   └────────────────────────┘     └──────────────────────────┘
</pre>


<!-- ================= PART 3: FORM 2 PROVISIONAL SPECIFICATION ================= -->
<div class="page-break"></div>
<div class="section-tag">Part 3 &bull; Indian Patent Office Official Format</div>
<h1>4. Form 2: Provisional Patent Specification</h1>

<div style="text-align: center; margin: 15px 0 25px 0;">
  <strong style="font-size: 13pt;">FORM 2</strong><br>
  <span style="font-size: 10pt;">THE PATENTS ACT, 1970 (39 of 1970) &amp; THE PATENTS RULES, 2003</span><br>
  <strong style="font-size: 12pt; color:#1e3a8a;">PROVISIONAL SPECIFICATION</strong><br>
  <span style="font-size: 9pt; color:#64748b;">(See Section 10 and Rule 13)</span>
</div>

<h2>4.1 Title of the Invention</h2>
<p>
<strong>A SYSTEM AND METHOD FOR DETERMINISTIC-SEMANTIC HYBRID EVALUATION, CALIBRATION, AND MACHINE-READABLE DOCUMENT SYNTHESIS FOR AUTOMATED APPLICANT TRACKING SYSTEMS</strong>
</p>

<h2>4.2 Preamble to the Description</h2>
<p>
<strong>PROVISIONAL SPECIFICATION:</strong> The following specification describes the invention.
</p>

<h2>4.3 Detailed Description of the Preferred Embodiments</h2>

<h3>Module 1: Structural Tokenizer &amp; Layout Graph Decomposition</h3>
<p>
When an electronic candidate file is ingested, the system reads vector character objects, font metrics, and bounding-box coordinates $(x, y, w, h)$ into a spatial proximity cluster tree. Section headers are detected via font weight differentials and mapped to canonical nodes (e.g., <code>{"EMPLOYMENT HISTORY", "WORK EXPERIENCE"} &rarr; EXPERIENCE</code>). Regex automata tag contact endpoints and chronological dates, establishing an auditable document graph.
</p>

<h3>Module 2: Parallel Dual-Track Evaluation Pipeline</h3>
<p>
Processing executes across two concurrent, asynchronous channels:
</p>
<ul>
  <li>
    <strong>Track A (Deterministic Lexical Engine):</strong> Extracts mandatory technical entities ($R_1$) and preferred entities ($R_2$) from the job description. Scans the candidate document graph using an exact and lemmatized n-gram sliding window ($n \in \{1, 2, 3, 4\}$) with bi-directional acronym expansion tables (e.g., <code>"Kubernetes" &harr; "K8s"</code>). Lexical coverage is computed as:
    <div class="math-box">
      S_{\text{lex}} = 100 \times \left( \lambda_1 \frac{|T_{\text{res}} \cap R_1|}{|R_1|} + \lambda_2 \frac{|T_{\text{res}} \cap R_2|}{|R_2|} \right)
    </div>
  </li>
  <li>
    <strong>Track B (Dense Vector Semantic Projection):</strong> Projects experience statements $\vec{v}_i$ and requirement clauses $\vec{u}_j$ into dense vector embeddings. Computes a pairwise cosine similarity matrix $\mathbf{C}_{i,j} = \frac{\vec{v}_i \cdot \vec{u}_j}{\|\vec{v}_i\| \|\vec{u}_j\|}$. The mean of the top-$k$ aligned requirements determines the semantic alignment score $S_{\text{sem}}$.
  </li>
</ul>

<h3>Module 3: Closed-Form Deterministic Calibration Engine</h3>
<p>
To prevent LLM hallucination and score drift, the ATS score is sequestered within an explicit closed-form calibration function:
</p>
<div class="math-box">
  S_{\text{ATS}} = \text{clamp}\left( \alpha \cdot S_{\text{lex}} + \beta \cdot S_{\text{sem}} + \gamma \cdot S_{\text{struct}} - \sum_{k=1}^m \delta_k \cdot P_k, \, 0, \, 100 \right)
</div>
<p>
Where $S_{\text{struct}}$ represents structural hierarchy compliance, $P_k$ denotes specific penalties (e.g., missing metrics, high passive-verb ratios, omitted Tier-1 skills), and $\alpha, \beta, \gamma$ are normalized weights ($\alpha + \beta + \gamma = 1.0$). The resulting score is <strong>100% reproducible across distributed computing instances</strong>.
</p>

<h3>Module 4: Constrained Generative Residual Synthesizer</h3>
<p>
The calibration engine outputs a discrete <strong>Residual Vector</strong> $\mathbf{R} = \{ K_{\text{missing}}, B_{\text{low-metric}} \}$. The generative language model is restricted strictly to proposing linguistic revisions for the specific identified deficits. The LLM is prohibited from modifying the calculated score or generating unverified factual claims.
</p>

<h3>Module 5: Closed-Loop ATS-Safe Document Synthesis Engine</h3>
<p>
The synthesis engine serializes structured profile data into a Portable Document Format (PDF) containing a linearized Unicode text stream with embedded <code>ToUnicode</code> CMap tables (PDF/UA ISO standard). Prior to user release, the generated file is processed by an internal <strong>ATS Parser Emulator</strong> (hosting Apache Tika / Poppler extraction harnesses). A fidelity index is computed:
</p>
<div class="math-box">
  \text{Fidelity}(T_{\text{source}}, T_{\text{emulated}}) = \frac{|T_{\text{source}} \cap T_{\text{emulated}}|}{|T_{\text{source}} \cup T_{\text{emulated}}|}
</div>
<p>
If $\text{Fidelity} < 0.999$, the engine automatically reconfigures layout bounding boxes and font tables until complete machine-readability is verified.
</p>

<h2>4.4 Draft Claims (For Scope &amp; Priority Establishment)</h2>
<div class="claim-item">
  <strong>1. (Independent Method Claim)</strong><br>
  A computer-implemented method for deterministically evaluating and calibrating applicant profile compatibility against a target job description, comprising:
  ingesting an electronic candidate document and target job description; decomposing said document into a hierarchical layout graph; executing a dual-track evaluation pipeline comprising (a) a deterministic lexical engine computing an exact n-gram coverage score ($S_{\text{lex}}$) with acronym expansion, and (b) a vector semantic engine computing a contextual cosine alignment score ($S_{\text{sem}}$); calculating a calibrated ATS compatibility score ($S_{\text{ATS}}$) within a closed-form calibration engine combining said lexical score, said semantic score, a structural score ($S_{\text{struct}}$), and parameterized penalties; and generating an explainable output comprising said score and a discrete residual vector of verified lexical omissions.
</div>

<div class="claim-item">
  <strong>2. (Dependent Claim &bull; Emulator Loop)</strong><br>
  The method as claimed in claim 1, further comprising: synthesizing a candidate resume document into a vector PDF comprising a linearized Unicode text stream; processing said synthesized document through an integrated ATS parser emulator to extract an emulated text stream; computing an extraction fidelity metric against source profile data; and conditionally reconfiguring document layout parameters when said fidelity fails to satisfy a predetermined acceptance threshold.
</div>

<div class="claim-item">
  <strong>3. (Dependent Claim &bull; Calibration Formula)</strong><br>
  The method as claimed in claim 1, wherein said closed-form calibration engine computes $S_{\text{ATS}} = \text{clamp}(\alpha S_{\text{lex}} + \beta S_{\text{sem}} + \gamma S_{\text{struct}} - \sum \delta_k P_k, 0, 100)$, wherein $\alpha + \beta + \gamma = 1.0$, and $P_k$ comprises quantified metric deficiency penalties and structural header deficiency penalties.
</div>

<div class="claim-item">
  <strong>4. (Dependent Claim &bull; Constrained Residual LLM)</strong><br>
  The method as claimed in claim 1, wherein said discrete residual vector is provided to a constrained generative language model to produce targeted linguistic revisions of candidate achievement statements, wherein said generative language model is restricted from altering said calibrated compatibility score.
</div>

<div class="claim-item">
  <strong>5. (Independent System Claim)</strong><br>
  A computerized applicant tracking evaluation system, comprising one or more processors and non-transitory computer-readable memory having instructions configured to execute the method of claims 1 to 4.
</div>


<!-- ================= PART 4: RISK ANALYSIS & STRATEGY ================= -->
<div class="page-break"></div>
<div class="section-tag">Part 4 &bull; Risk &amp; Strategic Advisory</div>
<h1>5. Legal Risks &amp; Strategic Roadmaps</h1>

<h2>5.1 The Four Primary Risks to Discuss with Patent Counsel</h2>
<ul>
  <li>
    <strong>1. Section 3(k) Objection (Indian Patents Act):</strong><br>
    The Indian Patent Office routinely objects to software claims under Section 3(k) as <em>"computer programmes per se"</em> or <em>"business methods."</em> Defense requires demonstrating a <strong>"technical effect"</strong>: specifically, the mathematical elimination of neural network stochastic variance and the physical closed-loop testing of PDF/UA byte streams by an internal emulator.
  </li>
  <li>
    <strong>2. Prior Art from HR-Tech Corporations:</strong><br>
    Companies like Workday, Oracle/Taleo, and Jobscan hold patents on taxonomy parsing and keyword frequency scoring. Our patent relies on the <strong>novel hybrid reconciliation</strong> of deterministic lexical tokens, dense embeddings, and the closed-loop compilation emulator.
  </li>
  <li>
    <strong>3. The 12-Month "Provisional-to-Complete" Clock:</strong><br>
    Under Indian patent law, filing a provisional gives you exactly <strong>12 months</strong> to file the Complete Specification. During this year, the mathematical calibration engine and emulator must be built and empirically benchmarked.
  </li>
  <li>
    <strong>4. Resolving the "Image-PDF" Flaw in Current Code:</strong><br>
    The existing <code>downloadPDF.js</code> relies on <code>html2canvas</code> screenshotting. To match the patent claims, this must be upgraded to a true vector engine (e.g., <code>@react-pdf/renderer</code>) that embeds native Unicode text streams.
  </li>
</ul>

<h2>5.2 Strategic Comparison: Three Alternate Paths</h2>
<table>
  <thead>
    <tr>
      <th>Dimension</th>
      <th>Option A: Provisional Patent</th>
      <th>Option B: Research Paper</th>
      <th>Option C: Software Copyright</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Core Goal</strong></td>
      <td>Commercial monopoly &amp; IP priority date</td>
      <td>Academic prestige &amp; citations</td>
      <td>Protection against code theft</td>
    </tr>
    <tr>
      <td><strong>Legal Barrier</strong></td>
      <td>High (Section 3(k) CRI examination)</td>
      <td>Peer review (methodology &amp; data)</td>
      <td>Minimal (formal registration)</td>
    </tr>
    <tr>
      <td><strong>Official Fees</strong></td>
      <td>₹1,600 (Student) / ₹8,000 (Entity)</td>
      <td>Zero to standard conference fee</td>
      <td>₹500 (Individual)</td>
    </tr>
    <tr>
      <td><strong>Ideal For</strong></td>
      <td>College IPR sponsorship / Startup IP</td>
      <td>M.Tech / B.Tech / PhD thesis credit</td>
      <td>Immediate SaaS code protection</td>
    </tr>
  </tbody>
</table>

<h2>5.3 Recommended Next Steps for Aman</h2>
<ol>
  <li><strong>Print or share this complete PDF dossier</strong> with your project guide or faculty head.</li>
  <li><strong>Visit your University IPR Cell:</strong> Request an evaluation for filing Form 1 and Form 2 under student sponsorship.</li>
  <li><strong>Implement the Baseline Calibration Code:</strong> Introduce the basic mathematical formula in <code>src/app/api/analyze-resume/route.js</code> to possess working prototype data.</li>
  <li><strong>Switch PDF Export:</strong> Replace <code>html2canvas</code> with structured vector rendering to ensure true machine-readability.</li>
</ol>

<div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #cbd5e1; font-size: 8.5pt; color: #64748b; text-align: center;">
  End of Patent Dossier &bull; Prepared by Aman &bull; AchiVAI Platform Architecture &bull; 2026
</div>

</body>
</html>
"""

html_path = "z:\\AI\\ai_resume\\patent\\AchiVAI_Patent_Dossier.html"
pdf_path = "z:\\AI\\ai_resume\\patent\\AchiVAI_Patent_Dossier.pdf"

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"HTML generated at {html_path}")

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
cmd = [
    edge_path,
    "--headless",
    "--disable-gpu",
    f"--print-to-pdf={pdf_path}",
    "--no-margins",
    html_path
]

print("Compiling PDF with Microsoft Edge...")
res = subprocess.run(cmd, capture_output=True, text=True)
print("Return code:", res.returncode)

if os.path.exists(pdf_path):
    size = os.path.getsize(pdf_path)
    print(f"SUCCESS: PDF generated at {pdf_path} (Size: {size:,} bytes)")
else:
    print("FAILED to create PDF")
