# FORM 2
### THE PATENTS ACT, 1970
**(39 of 1970)**  
**&**  
### THE PATENTS RULES, 2003
## PROVISIONAL SPECIFICATION
**(See Section 10 and Rule 13)**

---

### 1. TITLE OF THE INVENTION
**A SYSTEM AND METHOD FOR DETERMINISTIC-SEMANTIC HYBRID EVALUATION, CALIBRATION, AND MACHINE-READABLE DOCUMENT SYNTHESIS FOR AUTOMATED APPLICANT TRACKING SYSTEMS**

---

### 2. APPLICANT(S)
* **Name:** [APPLICANT / INVENTOR NAME, e.g., Aman]  
* **Nationality:** Indian  
* **Address:** [Applicant / University / Institute Address, City, State, PIN, India]  

---

### 3. PREAMBLE TO THE DESCRIPTION

**PROVISIONAL SPECIFICATION**  
The following specification describes the invention.

---

### 4. FIELD OF THE INVENTION

The present invention relates generally to the technical fields of natural language processing (NLP), computational linguistics, document layout analysis, and computerized recruitment technologies. More specifically, the present invention relates to a computer-implemented method, computing architecture, and software system for evaluating electronic candidate documents against job descriptions utilizing a deterministic-semantic hybrid calibration pipeline, and synthesizing verified machine-readable document representations via an integrated closed-loop applicant tracking system (ATS) parser emulator.

---

### 5. BACKGROUND OF THE INVENTION & PRIOR ART LIMITATIONS

With the massive expansion of digital job applications, corporate recruitment relies heavily on automated software known as Applicant Tracking Systems (ATS) to parse, index, search, and rank candidate resumes before any human recruiter reviews them. An ATS ingests electronic resumes (typically submitted in Portable Document Format (PDF) or Microsoft Word (DOCX) formats), extracts raw text using programmatic parsing tools, tokenizes the content into candidate profile sections, and matches the candidate's stated competencies against specific criteria outlined in a Job Description (JD).

In recent years, two primary architectural paradigms have emerged in computerized resume evaluation and optimization tools:

1. **Syntactic and Lexical Keyword Matchers (Legacy Systems):**  
   Conventional tools (such as Jobscan or rule-based ATS filters) utilize exact string matching, keyword counting, and n-gram frequency distributions. While completely deterministic and computationally efficient, these systems fail to capture semantic equivalents. For instance, if a job description mandates "experience deploying microservices to cloud environments," a candidate whose resume states "architected distributed containerized backend workloads on AWS" would receive a zero match from pure keyword matching, despite possessing identical substantive experience.

2. **Large Language Model (LLM) Wrappers (Generative AI Systems):**  
   With the advent of generative Large Language Models (e.g., Google Gemini, OpenAI GPT), contemporary tools have adopted a naive architectural approach: passing the entire extracted resume text and job description into an LLM via a prompt, requesting the model to return an ATS compatibility score (e.g., on a 0–100 scale) alongside feedback. While such systems demonstrate high linguistic flexibility, they introduce critical technical problems:
   * **Stochastic Non-Determinism & Score Drift:** LLMs operate on probabilistic autoregressive token generation. Consequently, processing the exact same resume and job description pair through identical prompts across multiple instances frequently produces wildly fluctuating numerical scores and divergent missing keyword lists.
   * **Hallucinatory Gap Detection:** Generative models are prone to hallucinating required competencies that do not exist within the job description or asserting that a skill is missing from a resume when it is present under a non-standard section heading.
   * **Absence of a Mathematical Audit Trail:** Enterprise compliance, talent acquisition audits, and bias-monitoring frameworks require an explainable, deterministic mathematical basis for candidate rejection or qualification. Pure LLM prompt scoring represents an opaque black-box mechanism.

Furthermore, an acute technical paradox exists in modern web-based document generation tools. To ensure that generated resumes visually preserve intricate formatting, margins, and typography across diverse operating systems and browsers, web applications frequently employ client-side Document Object Model (DOM) screenshot rasterization (e.g., combining `html2canvas` with `jsPDF`). In such pipelines, DOM tree fragments are rendered into an offscreen canvas and serialized as bitmap graphics (e.g., PNG images) embedded into a PDF container. Although visually identical to formatted text to a human observer, these files contain **no underlying vector text streams or character encodings**. When submitted to real-world corporate ATS engines that utilize non-OCR text extractors (such as Apache Tika, PDFBox, or Poppler utilities), the parsers encounter empty streams, resulting in complete parsing failure and automated candidate disqualification.

Accordingly, there is an urgent and unmet technological need for a system and method that:
1. Reconciles exact lexical matching with vector semantic understanding through a mathematically constrained, reproducible calibration engine;
2. Restricts generative neural networks strictly to residual compensation rather than unconstrained scoring; and
3. Guarantees true machine-readability through a closed-loop document synthesis architecture equipped with an internal ATS parser emulator.

---

### 6. OBJECTS OF THE INVENTION

The primary objects of the present invention are to overcome the technical limitations of conventional systems:

1. It is a primary object of the present invention to provide a **hybrid multi-stage evaluation engine** that combines deterministic lexical-ontological extraction and dense vector-space semantic matching to compute a fully reproducible, mathematically grounded ATS compatibility score.
2. It is another object of the present invention to eliminate non-deterministic scoring variance and LLM hallucination by segregating the scoring mechanism from the generative suggestion mechanism, utilizing a closed-form calibration formula.
3. It is another object of the present invention to provide a **closed-loop ATS document synthesis engine** that dynamically compiles resumes into vector-based documents with linearized text streams (PDF/UA compliant) and verifies their structural integrity prior to distribution using an integrated ATS parser emulator.
4. It is another object of the present invention to provide an automated color-space normalizer and layout-segmentation algorithm that prevents document generation pipeline crashes when parsing advanced Cascading Style Sheets (CSS) specifications.

---

### 7. SUMMARY OF THE INVENTION

The present invention provides a computer-implemented method and computing system for evaluating and synthesizing machine-readable candidate profile documents. 

In a first aspect, the system receives an unstructured candidate document (such as a PDF or DOCX file) and an associated job description. A **Structural Tokenizer and Layout Graph Extractor** deconstructs the document into a hierarchical layout graph, identifying section boundaries, chronological anchors, and syntactic elements (e.g., contact data, educational credentials) through coordinate analysis and regular expression automata.

In a second aspect, the system executes a **dual-track evaluation pipeline**:
* **Track A (Deterministic Lexical and Ontological Engine):** Performs multi-tier n-gram matching, acronym expansion, and canonical skill taxonomy mapping against the job description to calculate a deterministic lexical coverage score ($S_{\text{lex}}$), a quantified metric density score, and an exact missing keyword set.
* **Track B (Dense Vector Semantic Projection Engine):** Transforms candidate responsibility statements and job requirements into high-dimensional embedding vectors, computing a contextual semantic alignment score ($S_{\text{sem}}$) through pairwise cosine similarity matrix operations.

In a third aspect, the system feeds the outputs of the dual-track pipeline into a **Closed-Form Calibration Engine**, which calculates an overall ATS compatibility score ($S_{\text{ATS}}$) according to a deterministic parameterized formula:
$$S_{\text{ATS}} = \alpha \cdot S_{\text{lex}} + \beta \cdot S_{\text{sem}} + \gamma \cdot S_{\text{struct}} - \sum_{k} \delta_k \cdot P_k$$
wherein $S_{\text{struct}}$ represents a structural compliance coefficient, $P_k$ represents deterministic penalty factors, and $\alpha, \beta, \gamma, \delta$ are predefined normalized weights.

In a fourth aspect, a **Constrained Generative Synthesis Engine** receives strictly the computed mathematical residual vectors (specifically the identified missing lexical entities and low-metric bullet points) and prompts a generative language model to produce targeted linguistic enhancements without delegating the scoring or evaluation process to the model.

In a fifth aspect, the system provides an **ATS-Safe Document Synthesis Engine** that transforms the structured candidate data model into a dual-layer vector document containing a linearized Unicode text stream. An **Integrated ATS Parser Emulator** immediately executes an automated extraction pass on the generated document, compares the extracted text stream with the source data model to derive an extraction fidelity score, and conditionally recompiles the document if the fidelity score fails to satisfy an acceptance threshold.

---

### 8. BRIEF DESCRIPTION OF THE DRAWINGS

The features and technical architecture of the present invention will become more apparent from the following detailed description taken in conjunction with the accompanying conceptual drawings (which will be formally submitted with the Complete Specification):

* **FIG. 1** illustrates an overall system block diagram of the hybrid ATS evaluation, calibration, and document synthesis architecture across client-server infrastructure.
* **FIG. 2** is a logical flowchart illustrating the multi-stage document ingestion, structural layout graph decomposition, and dual-track evaluation pipeline.
* **FIG. 3** illustrates the closed-form mathematical calibration engine reconciling deterministic lexical tokens with dense vector semantic projections.
* **FIG. 4** is a flowchart illustrating the closed-loop document synthesis engine and the ATS parser emulator verification cycle.
* **FIG. 5** illustrates a schematic of the client-side color-space normalization probe and section-boundary-snapping slicing mechanism.

---

### 9. DETAILED DESCRIPTION OF THE INVENTION

The present invention discloses a technical apparatus, system architecture, and computational method for deterministic-semantic ATS evaluation and verified document synthesis. The invention is described with reference to preferred embodiments and functional modules.

#### 9.1 Module 1: Structural Tokenizer & Layout Graph Decomposition
When a raw candidate file (PDF/DOCX) is submitted, rather than flattening the file into an unstructured character stream, the module performs layout-aware parsing:
1. In the case of vector PDF documents, character objects, font size metadata, and Cartesian coordinates $(x, y, w, h)$ are ingested into a bounding-box cluster tree.
2. Section header candidates are detected through font weight differential analysis and canonical string normalization (e.g., detecting tokens matching the set `{"WORK EXPERIENCE", "EMPLOYMENT HISTORY", "CAREER PROFILE"}` and mapping them to a normalized `EXPERIENCE` section node).
3. Text lines falling beneath respective section header bounds are clustered into child nodes, preserving parent-child hierarchical relationships.
4. Regular expression automata scan the header nodes to isolate contact endpoints (email syntax, E.164 phone numbering formats, standardized URL patterns) and date ranges to determine chronological continuity.

#### 9.2 Module 2: Dual-Track Parallel Evaluation Pipeline
Once the layout graph is instantiated, the system bifurcates processing into two parallel asynchronous execution tracks:

##### Track A: Deterministic Lexical & Ontological Engine
1. The target Job Description is processed through a deterministic entity extractor that maps tokens against a pre-indexed technical ontology (comprising programming languages, frameworks, cloud infrastructures, domain acronyms, and industry certifications).
2. The extracted requirements are classified into Mandatory Tier-1 Requirements ($R_1$) and Preferred Tier-2 Requirements ($R_2$).
3. The candidate document's layout graph is scanned using an exact and lemmatized n-gram sliding window ($n \in \{1, 2, 3, 4\}$).
4. Acronym normalization is enforced via a bi-directional lookup table (e.g., mapping "Kubernetes" $\leftrightarrow$ "K8s", "Amazon Web Services" $\leftrightarrow$ "AWS").
5. The lexical score $S_{\text{lex}}$ is computed as:
   $$S_{\text{lex}} = 100 \times \left( \lambda_1 \frac{|T_{\text{res}} \cap R_1|}{|R_1|} + \lambda_2 \frac{|T_{\text{res}} \cap R_2|}{|R_2|} \right)$$
   where $T_{\text{res}}$ represents the set of candidate document tokens, and $\lambda_1, \lambda_2$ represent normalized priority coefficients.
6. A metric quantification index $M_{\text{quant}}$ is calculated by scanning experience bullet strings using numeric-percentage-currency regex automata ($\text{Regex}_{\text{quant}}$), computing the ratio of quantified achievement statements to total statements.

##### Track B: Dense Vector Semantic Projection Engine
1. Concurrently, individual bullet points from the candidate's experience sections and requirement clauses from the job description are partitioned into semantic clauses.
2. Each clause is projected into a high-dimensional vector space using a deep contextual language representation model, yielding resume clause vectors $\vec{v}_i$ and requirement vectors $\vec{u}_j$.
3. A cosine similarity matrix $\mathbf{C}$ is constructed where:
   $$\mathbf{C}_{i,j} = \frac{\vec{v}_i \cdot \vec{u}_j}{\|\vec{v}_i\| \|\vec{u}_j\|}$$
4. For each requirement vector $\vec{u}_j$, the maximum similarity achieved across all candidate clauses is determined: $m_j = \max_i (\mathbf{C}_{i,j})$.
5. The overall semantic alignment score $S_{\text{sem}}$ is computed as the mean of the top-$k$ aligned requirements, capturing contextual equivalences that evade lexical keyword filters.

#### 9.3 Module 3: Closed-Form Deterministic Calibration Engine
To prevent the non-reproducibility and hallucination inherent in direct LLM evaluation, the final scoring logic is strictly sequestered within a deterministic calibration module.
The calibrated ATS compatibility score $S_{\text{ATS}}$ is evaluated as:
$$S_{\text{ATS}} = \text{clamp}\left( \alpha \cdot S_{\text{lex}} + \beta \cdot S_{\text{sem}} + \gamma \cdot S_{\text{struct}} - \sum_{k=1}^m \delta_k \cdot P_k, \, 0, \, 100 \right)$$
Where:
- $S_{\text{struct}}$ is a score derived from structural checks (e.g., $+20$ for valid contact information, $+20$ for standard section headings, $+20$ for chronological ordering, $+20$ for education credentials, $+20$ for length suitability);
- $P_k$ represents specific binary or proportional penalties:
  - $P_1$: Penalty for zero quantified metrics in the primary work experience section;
  - $P_2$: Penalty for high passive-verb-to-active-verb ratio;
  - $P_3$: Penalty for catastrophic lexical omissions (missing Tier-1 mandatory requirements);
- $\alpha, \beta, \gamma, \delta_k$ are fixed, auditable hyper-parameters configured to mirror target enterprise ATS algorithms.

Because every component of this equation is calculated through closed-form deterministic functions, the generated score is **100% reproducible, verifiable, and mathematically auditable**.

#### 9.4 Module 4: Constrained Generative Residual Synthesizer
Unlike conventional AI tools that prompt an LLM to evaluate candidates, the present system restricts the generative model to an assistive rewriting role:
1. The calibration engine outputs a discrete **Residual Vector** $\mathbf{R} = \{ K_{\text{missing}}, B_{\text{low-metric}} \}$, wherein $K_{\text{missing}} = R_1 \setminus T_{\text{res}}$ represents verified missing mandatory keywords, and $B_{\text{low-metric}}$ represents identified bullet points having zero quantified impacts.
2. The residual vector, along with the source bullet point, is injected into a constrained prompt envelope instructing the language model to propose re-written variations incorporating the missing lexical entities and prompting the candidate for quantifiable numerical parameters.
3. The LLM is strictly prohibited from modifying the underlying mathematical score or inventing ungrounded factual assertions.

#### 9.5 Module 5: Closed-Loop ATS-Safe Document Synthesis Engine
To overcome the documented failure mode of client-side DOM rasterization, the synthesis pipeline operates under an automated verification loop:
1. **Dual-Layer Document Compilation:** The resume layout is compiled into a Portable Document Format specification wherein all textual elements are serialized into an explicit, uncompressed content stream tagged according to the PDF/Universal Accessibility (PDF/UA) ISO standard. Each glyph is mapped to a definitive Unicode character code via embedded `ToUnicode` CMap tables.
2. **Integrated ATS Parser Emulator:** Prior to final file delivery or user download, the server-side synthesis engine routes the compiled binary PDF into an internal emulation container hosting standard headless ATS extraction libraries (e.g., an Apache Tika / Poppler `pdftotext` extraction harness).
3. **Fidelity Verification Metric:** The emulator extracts raw text stream $T_{\text{emulated}}$ from the generated PDF. An alignment engine computes a character-level Levenshtein similarity metric and word-level intersection-over-union metric against the source structured data model $T_{\text{source}}$:
   $$\text{Fidelity}(T_{\text{source}}, T_{\text{emulated}}) = \frac{|T_{\text{source}} \cap T_{\text{emulated}}|}{|T_{\text{source}} \cup T_{\text{emulated}}|}$$
4. **Automated Compensation:** If $\text{Fidelity} < 0.999$, the compilation engine detects a structural collision (e.g., overlapping text frames, non-standard font encoding failure, or incorrect reading order), dynamically adjusts bounding box margins and font embedding tables, and recompiles the document until 100% parsing fidelity is verified.

#### 9.6 Module 6: Color-Space Normalization & Dynamic Coordinate Snapping (Client-Side Rendering)
In implementations where preliminary client-side visual previews are generated:
1. The system implements a dynamic 2D canvas color probe. When elements utilize modern CSS Color Module 4 color notations (e.g., `lab()`, `oklch()`, `color()`), the engine injects these color strings into a transient HTML5 canvas rendering context probe, extracts computed sRGB equivalents, and rewrites the DOM style properties prior to rendering.
2. The engine tracks vertical offsets of explicit boundary marker classes (`.pdf-section-start`). Page slicing algorithms calculate vertical boundaries using a greedy bin-packing constraint snapping strictly to the detected marker offsets, preventing the truncation of text lines across physical page divides.

---

### 10. DRAFT CLAIMS

*(Note: The following claims are provided to define the scope and technical boundaries of the inventive concepts for priority establishment and subsequent complete specification filing.)*

**We Claim:**

1. **A computer-implemented method for deterministically evaluating and calibrating applicant profile compatibility against a target job description, comprising:**
   - ingesting an electronic candidate document and a target job description into a data processing system;
   - decomposing said electronic candidate document into a hierarchical layout graph comprising section nodes and child text elements;
   - executing a dual-track evaluation pipeline comprising:
     - (a) a deterministic lexical engine extracting technical entities from said target job description and executing n-gram matching and acronym expansion across said hierarchical layout graph to compute a deterministic lexical coverage score ($S_{\text{lex}}$); and
     - (b) a vector semantic engine generating high-dimensional embeddings of candidate experience statements and job description requirement clauses to compute a contextual semantic alignment score ($S_{\text{sem}}$);
   - calculating a calibrated applicant tracking system (ATS) compatibility score ($S_{\text{ATS}}$) within a closed-form calibration engine according to a predetermined mathematical formula combining said deterministic lexical coverage score ($S_{\text{lex}}$), said contextual semantic alignment score ($S_{\text{sem}}$), a structural compliance score ($S_{\text{struct}}$), and parameterized penalty factors; and
   - generating an explainable evaluation output comprising said calibrated compatibility score and a discrete residual vector indicating specific verified lexical omissions.

2. **The method as claimed in claim 1, further comprising:**
   - synthesizing a candidate resume document into a vector-based Portable Document Format (PDF) comprising a linearized Unicode text stream and embedded character mapping tables;
   - processing said synthesized document through an integrated ATS parser emulator to extract an emulated text stream;
   - computing an extraction fidelity metric by comparing said emulated text stream against source profile data; and
   - conditionally reconfiguring document layout parameters and recompiling said document when said extraction fidelity metric fails to satisfy a predetermined threshold.

3. **The method as claimed in claim 1, wherein said closed-form calibration engine computes said calibrated compatibility score ($S_{\text{ATS}}$) according to the formula:**
   $$S_{\text{ATS}} = \text{clamp}\left( \alpha \cdot S_{\text{lex}} + \beta \cdot S_{\text{sem}} + \gamma \cdot S_{\text{struct}} - \sum_{k} \delta_k \cdot P_k, \, 0, \, 100 \right)$$
   wherein $\alpha, \beta, \gamma$ are predetermined weighting coefficients satisfying $\alpha + \beta + \gamma = 1.0$, and $P_k$ represents deterministic penalties comprising quantified metric deficiency penalties and structural header deficiency penalties.

4. **The method as claimed in claim 1, wherein said discrete residual vector is provided to a constrained generative language model to produce targeted linguistic revisions of candidate achievement statements, wherein said generative language model is restricted from altering said calibrated compatibility score.**

5. **The method as claimed in claim 1, wherein decomposing said electronic candidate document into a hierarchical layout graph comprises clustering character bounding boxes by spatial proximity, detecting section boundaries using font-size differential analysis, and tagging contact endpoints and date sequences via regular expression automata.**

6. **The method as claimed in claim 2, wherein generating a visual preview of said candidate resume document comprises probing CSS Color Module 4 color values via an offscreen 2D canvas context to translate said values into standard sRGB strings, and segmenting multi-page graphical representations by snapping slice heights to detected section boundary coordinates.**

7. **A computerized applicant tracking evaluation system, comprising:**
   - one or more processors; and
   - a non-transitory computer-readable storage medium having instructions stored thereon that, when executed by said one or more processors, cause the system to carry out the method of any one of claims 1 to 6.

---

### 11. ABSTRACT OF THE INVENTION

A computer-implemented system and method for deterministic-semantic hybrid evaluation, calibration, and machine-readable document synthesis for automated Applicant Tracking Systems (ATS) is disclosed. The system ingests an unstructured candidate document and target job description, deconstructing the document into a hierarchical layout graph. A dual-track evaluation pipeline executes in parallel: a deterministic lexical-ontological engine computing exact n-gram coverage ($S_{\text{lex}}$), acronym normalization, and metric density, alongside a dense vector semantic engine computing contextual clause embeddings and cosine similarity alignment ($S_{\text{sem}}$). A closed-form deterministic calibration engine synthesizes these scores into a 100% reproducible, auditable ATS compatibility score ($S_{\text{ATS}}$) according to a parameterized mathematical formula, mitigating the non-determinism and hallucination of generative language models. Computed residual deficits are routed to a constrained generative model for targeted statement enhancement. An ATS-safe document synthesis engine compiles dual-layer vector documents with linearized text streams and verifies parsing fidelity via an integrated closed-loop ATS parser emulator prior to release.

---
**Dated this 16th day of September, 2026**

**Signature:**  
*(To be signed by Applicant / Authorized Registered Patent Agent)*
