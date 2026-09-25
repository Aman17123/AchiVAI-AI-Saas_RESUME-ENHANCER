# INVENTION DISCLOSURE FORM (IDF)

**Document Reference:** ACHIVAI-IDF-2026-001  
**Date of Disclosure:** September 16, 2026  
**Confidentiality Status:** Strictly Confidential / Patent Pending Candidate  

---

## 1. ADMINISTRATIVE DETAILS

* **Provisional Title of the Invention:**  
  *System and Method for Deterministic-Semantic Hybrid Evaluation, Calibration, and Machine-Readable Document Synthesis for Automated Applicant Tracking Systems*
* **Inventors:**  
  * Aman (Lead Developer & System Architect)  
  * [Co-inventors / Collaborators / Academic Advisor, if applicable]
* **Assignee / Institution:**  
  [University / College Name / Individual Inventor / Entity Name]

---

## 2. TECHNICAL FIELD & PROBLEM ADDRESSED

### 2.1 Technical Field
The present invention relates generally to computational linguistics, natural language processing (NLP), document layout analysis, and computerized recruitment technologies. More particularly, the invention pertains to a computer-implemented system and method that combines deterministic structural parsing, deterministic lexical-ontological evaluation, vector-space semantic matching, and constrained large language model (LLM) suggestion generation, integrated with a closed-loop ATS parser emulator for generating verified machine-readable documents.

### 2.2 Technical Problems in the Prior Art
Conventional Applicant Tracking Systems (ATS) and automated resume evaluation tools suffer from significant technical limitations:

1. **The LLM Hallucination and Non-Determinism Problem:**  
   Modern generative AI resume tools feed raw resume text and job descriptions directly into a Large Language Model (LLM) with a generic prompt to output an "ATS Score" (0–100). Because LLMs are probabilistic autoregressive token generators with stochastic temperature sampling, they:
   - Produce variable, non-reproducible scores for identical input pairs across separate inference passes.
   - Hallucinate matched or missing keywords that do not strictly exist in the source texts.
   - Lack an explainable mathematical audit trail required by enterprise compliance and recruitment standards.

2. **The "Image Trap" in Client-Side Document Generation:**  
   Web-based resume builders frequently use client-side DOM rasterization (such as `html2canvas` and `jsPDF` screenshotting) to preserve intricate layouts, multi-column CSS grids, and custom typography across diverse browsers. While visually appealing to human viewers, this converts textual documents into raster image bitmaps (e.g., PNGs wrapped inside PDF containers). Such files completely lack native vector text streams, leading to total extraction failure (zero text extracted) when processed by standard non-OCR ATS document ingestion pipelines (e.g., Apache Tika, Poppler, or legacy enterprise ATS parsers).

3. **Inability to Model Multi-Layer ATS Scoring Rubrics:**  
   Real-world enterprise ATS scanners (e.g., Taleo, Workday, Greenhouse) do not evaluate candidate profiles using a single semantic score. They apply layered filtering: hard Boolean keyword gates, chronological continuity checks, section-header syntax recognition, and token density thresholds. Pure vector embedding search fails on exact syntactic keywords (e.g., specific certifications or software versions), while pure keyword search fails on semantic equivalence.

---

## 3. PRIOR ART ANALYSIS (EXISTING TOOLS & PATENTS)

### 3.1 Prior Art Reference 1: Jobscan / Standard Lexical Keyword Matchers
* **Mechanism:** Jobscan and legacy keyword scanners rely predominantly on exact string matching, n-gram tokenization, and hard-coded frequency heuristics against job descriptions.
* **Shortcoming:** They lack semantic context. For example, a candidate with "developed microservices using Golang" may fail an ATS check looking for "backend distributed systems engineering" because lexical overlap is minimal despite identical semantic meaning.

### 3.2 Prior Art Reference 2: Generative LLM Wrapper Tools (Resume Worded, Rezi, Off-the-Shelf SaaS)
* **Mechanism:** These tools extract raw text and pass it directly to an external generative model (e.g., OpenAI GPT-4, Google Gemini) using prompt engineering to directly guess an ATS score.
* **Shortcoming:** Black-box, non-deterministic, prone to prompt drift, non-reproducible, and non-patentable as an abstract idea under global patent frameworks (including Section 3(k) of the Indian Patents Act, 1970 and 35 U.S.C. § 101).

### 3.3 Prior Art Reference 3: US Patent 10,242,084 B2 ("System and method for resume parsing and matching")
* **Mechanism:** Relies on structural ontology matching and rules-based entity extraction.
* **Difference in Present Invention:** The present invention introduces a dual-track parallel pipeline wherein deterministic lexical extraction and vector semantic projection run concurrently, feeding a closed-form deterministic calibration formula ($S_{ATS} = \alpha S_{\text{lex}} + \beta S_{\text{sem}} + \gamma S_{\text{struct}} - \delta P_{\text{format}}$), coupled with a downstream ATS emulator feedback loop that executes synthetic document validation prior to delivery.

---

## 4. DETAILED TECHNICAL SOLUTION & ARCHITECTURE

The invention addresses the foregoing problems through a five-stage hybrid pipeline:

```
[Raw Document (PDF/DOCX)] + [Job Description (JD)]
              │
              ▼
   ┌─────────────────────────────────────────────────────────┐
   │ Stage 1: Structural Tokenizer & Layout Graph Extractor  │
   │  - Font-size hierarchy, Section-Boundary Mapping        │
   │  - Chronological Anchor Tagging                         │
   └──────────────────────────┬──────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
   ┌──────────────────────┐       ┌────────────────────────┐
   │ Track A:             │       │ Track B:               │
   │ Deterministic        │       │ Vector Semantic        │
   │ Lexical & Ontology   │       │ Projection             │
   │ - Exact n-gram gate  │       │ - Dense embeddings     │
   │ - TF-IDF / BM25      │       │ - Sentence-level       │
   │ - Metric verb regex  │       │   cosine similarity    │
   └──────────┬───────────┘       └───────────┬────────────┘
              │                               │
              └───────────────┬───────────────┘
                              ▼
   ┌─────────────────────────────────────────────────────────┐
   │ Stage 3: Closed-Form Calibration Mathematical Engine    │
   │  S_ATS = α·S_lex + β·S_sem + γ·S_struct - δ·P_format    │
   │  (Deterministic, Auditable, Reproducible ATS Score)     │
   └──────────────────────────┬──────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
   ┌────────────────────────┐     ┌──────────────────────────┐
   │ Stage 4: Constrained   │     │ Stage 5: ATS-Safe Dual-  │
   │ Generative Gap Engine  │     │ Layer Document Synthesizer│
   │ - LLM generates text   │     │ - Vector PDF/UA with     │
   │   only for mathematically│   │   linear text streams    │
   │   flagged residuals    │     │ - Closed-loop emulation  │
   └────────────────────────┘     │   round-trip verification│
                                  └──────────────────────────┘
```

### Stage 1: Structural Tokenizer & Layout Graph Decomposition
The input document (PDF or DOCX) is ingested not as a flattened text string, but as a hierarchical layout graph:
- Optical and vector character bounding boxes are grouped into lines, blocks, and sections using spatial proximity clustering.
- Sections are classified using header anchors (e.g., `EXPERIENCE`, `EDUCATION`, `SKILLS`) mapped to canonical semantic buckets.
- Syntactic structures (dates, degree names, contact endpoints) are tagged via deterministic regular expression automata.

### Stage 2: Dual-Track Parallel Evaluation
- **Track A (Deterministic Lexical & Ontological Engine):**
  - Extracts mandatory technical entities from the Job Description (skills, tools, frameworks, minimum education, required certifications).
  - Performs multi-tier n-gram matching: exact string matching (e.g., "PostgreSQL"), acronym normalization (e.g., "GCP" $\leftrightarrow$ "Google Cloud Platform"), and lemmatized token matching.
  - Computes a deterministic lexical coverage coefficient ($S_{\text{lex}}$) and quantifies achievement bullet metrics ($N_{\text{metrics}} / N_{\text{bullets}}$).
- **Track B (Dense Vector Semantic Projection Engine):**
  - Generates dense vector representations of the candidate's responsibilities and the job requirements using an embedding model.
  - Computes pairwise cosine similarity matrices across experience statements and job requirement clauses, deriving a contextual semantic alignment coefficient ($S_{\text{sem}}$).

### Stage 3: Closed-Form Deterministic Calibration Engine
The overall ATS score is calculated using an explicit, parameterized scoring function rather than an LLM prompt:
$$S_{ATS} = \alpha \cdot S_{\text{lex}} + \beta \cdot S_{\text{sem}} + \gamma \cdot S_{\text{struct}} - \sum_{k} \delta_k \cdot P_k$$
Where:
- $S_{\text{lex}} \in [0, 100]$: Deterministic lexical coverage score.
- $S_{\text{sem}} \in [0, 100]$: Vector space semantic similarity score.
- $S_{\text{struct}} \in [0, 100]$: Structural hierarchy score (contact info presence, section ordering, chronological consistency).
- $P_k$: Explicit penalty functions (e.g., missing metrics, non-standard section headers, excessive character density).
- $\alpha, \beta, \gamma, \delta$: Fixed tuning weights normalized such that $\alpha + \beta + \gamma = 1.0$.

### Stage 4: Constrained Generative Synthesis (Residual Injection)
Instead of delegating scoring to the LLM, the LLM is deployed solely as a **constrained re-writing agent**:
- The inputs to the generative agent are strictly the identified residual vectors: specific missing keywords and bullets lacking measurable metrics.
- The generative agent is conditioned on a system prompt that strictly forbids adding unverified claims, producing proposed bullet point improvements that directly resolve the detected mathematical deficits.

### Stage 5: ATS Document Synthesis with Closed-Loop Emulation Verification
To overcome the rasterization/image-PDF failure mode:
1. The synthesis engine builds a **two-layer vector document**: a visual presentation layer rendered via vector paths, and an underlying **linearized structured text stream (PDF/UA standard)** with explicit Unicode character mapping.
2. The generated document is fed into an **internal ATS parser emulator** (emulating Poppler `pdftotext` and Apache Tika text extraction).
3. The extracted text from the emulator is compared against the source data model. If extraction fidelity falls below a predetermined threshold $\tau$ (e.g., $0.999$), the document layout engine dynamically reformulates page breaks and font embedding tables before user download.

---

## 5. DISTINCTION: CURRENT IMPLEMENTATION VS. PROPOSED INVENTION

To maintain scientific and legal integrity, the distinction between the operational code in the repository and the inventive architecture is outlined below:

| Component | Implemented in Current Repository (`AchiVAI-AI-Saas`) | Inventive Addition for Patent Application |
| :--- | :--- | :--- |
| **Document Ingestion** | Basic text extraction via `pdf-parse` & `mammoth` with whitespace cleanup (`src/lib/fileParsers.js`). | Hierarchical layout graph parser, bounding box clustering, section-boundary tagging. |
| **ATS Scoring** | Single Gemini 1.5 Flash prompt requesting an `atsScore` integer (`src/lib/prompt.js`). | Closed-form mathematical calibration engine combining deterministic lexical scores with vector embeddings. |
| **Keyword Analysis** | Extracted entirely by Gemini LLM inference. | Deterministic n-gram taxonomy matcher + acronym normalization table. |
| **Suggestion Generation** | Free-form suggestions generated by Gemini LLM. | Constrained generative rewrite engine conditioned strictly on calculated mathematical residuals. |
| **Document Export** | Offscreen HTML rendering converted to bitmap canvas slices and added to jsPDF (`src/utils/downloadPDF.js`). | Dual-layer vector PDF synthesis with linearized text stream, Tagged PDF compliance, and closed-loop ATS emulation verification. |

---

## 6. WHY THE INVENTION IS NON-OBVIOUS & HAS TECHNICAL EFFECT

1. **Overcoming Abstract Idea / Section 3(k) Challenges:**  
   Unlike generic AI wrappers, the invention does not patent an "abstract evaluation concept" or a "computer program per se." It defines a concrete mathematical transformation apparatus: converting raw unstructured byte streams into an aligned vector-lexical coordinate system, executing an auditable calibration formula, and verifying physical document data structures through an emulator feedback loop.
2. **Technical Improvement in Data Processing:**  
   The invention solves the specific technological drawback of modern LLM-based evaluation: non-reproducibility and semantic drift. It provides an automated, deterministic calibration mechanism that produces 100% reproducible scoring across distributed nodes.
3. **Solving the Document Ingestion Paradox:**  
   By embedding an automated ATS parser emulator into the document compilation pipeline, the system eliminates the critical failure mode of client-side canvas rasterization, providing guaranteed machine-readability across legacy enterprise recruitment databases.
