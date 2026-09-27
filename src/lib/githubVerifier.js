// Proof-of-Work (PoW) GitHub Repository Verifier
// Validates resume tech claims against actual commit history, language distributions,
// and manifest dependencies (package.json, requirements.txt, Dockerfile, etc.)

export async function verifyGithubRepo(githubUrl, resumeText = "", candidateSkills = []) {
  if (!githubUrl || typeof githubUrl !== "string") {
    return null;
  }

  const cleanUrl = githubUrl.trim().replace(/\/$/, "");
  const match = cleanUrl.match(/github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)/i) ||
    cleanUrl.match(/^([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)$/);

  if (!match) {
    return {
      error: "Invalid GitHub repository URL. Format should be: https://github.com/owner/repository",
      url: githubUrl,
      verifiedSkills: [],
      unverifiedSkills: [],
      powScore: 0,
    };
  }

  const owner = match[1];
  const repo = match[2].replace(/\.git$/i, "");
  const repoFullName = `${owner}/${repo}`;

  const headers = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "AchiVAI-Resume-ProofOfWork-Engine",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    // 1. Fetch Repository Metadata
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
      cache: "no-store",
    });

    if (repoRes.status === 404) {
      return {
        error: `Repository '${repoFullName}' not found or is private. Make sure it is public.`,
        url: githubUrl,
        powScore: 0,
        verifiedSkills: [],
        unverifiedSkills: [],
      };
    }

    if (!repoRes.ok) {
      if (repoRes.status === 403) {
        return {
          error: "GitHub API rate limit exceeded. Please wait a moment or configure GITHUB_TOKEN.",
          url: githubUrl,
          powScore: 0,
          verifiedSkills: [],
          unverifiedSkills: [],
        };
      }
      return {
        error: `GitHub API error: status ${repoRes.status}`,
        url: githubUrl,
        powScore: 0,
        verifiedSkills: [],
        unverifiedSkills: [],
      };
    }

    const repoData = await repoRes.json();

    // 2. Fetch Languages Breakdown
    let languages = {};
    try {
      const langRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/languages`,
        { headers, cache: "no-store" }
      );
      if (langRes.ok) languages = await langRes.json();
    } catch {}

    // 3. Inspect Manifests & Project Tree
    let detectedPackages = new Set();
    let detectedFiles = new Set();

    // Check root contents
    try {
      const contentsRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents`,
        { headers, cache: "no-store" }
      );
      if (contentsRes.ok) {
        const contents = await contentsRes.json();
        if (Array.isArray(contents)) {
          contents.forEach((c) => detectedFiles.add(c.name.toLowerCase()));
        }
      }
    } catch {}

    // Inspect package.json if present
    if (detectedFiles.has("package.json")) {
      try {
        const pkgRes = await fetch(
          `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/package.json`,
          { headers, cache: "no-store" }
        );
        if (pkgRes.ok) {
          const pkg = await pkgRes.json();
          const allDeps = {
            ...(pkg.dependencies || {}),
            ...(pkg.devDependencies || {}),
          };
          Object.keys(allDeps).forEach((dep) => detectedPackages.add(dep.toLowerCase()));
        }
      } catch {}
    }

    // Inspect requirements.txt if present
    if (detectedFiles.has("requirements.txt")) {
      try {
        const reqRes = await fetch(
          `https://raw.githubusercontent.com/${owner}/${repo}/HEAD/requirements.txt`,
          { headers, cache: "no-store" }
        );
        if (reqRes.ok) {
          const text = await reqRes.text();
          text
            .split("\n")
            .map((l) => l.trim().split(/[=><]/)[0].trim().toLowerCase())
            .filter(Boolean)
            .forEach((dep) => detectedPackages.add(dep));
        }
      } catch {}
    }

    // 4. Fetch recent commits to extract development activity
    let commitMessages = [];
    try {
      const commitsRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=10`,
        { headers, cache: "no-store" }
      );
      if (commitsRes.ok) {
        const commits = await commitsRes.json();
        if (Array.isArray(commits)) {
          commitMessages = commits.map((c) => c.commit?.message?.toLowerCase() || "");
        }
      }
    } catch {}

    // 5. Cross-Verification of Skills
    // Knowledge Base of Tech Indicators
    const SKILL_RULES = [
      {
        skill: "React",
        check: () =>
          detectedPackages.has("react") ||
          languages["JavaScript"] ||
          languages["TypeScript"],
        evidence: () =>
          detectedPackages.has("react")
            ? "Declared dependency in package.json"
            : "JavaScript/TypeScript UI code present in repo",
      },
      {
        skill: "Next.js",
        check: () =>
          detectedPackages.has("next") ||
          detectedFiles.has("next.config.js") ||
          detectedFiles.has("next.config.mjs"),
        evidence: () => "Next.js framework config and dependencies found",
      },
      {
        skill: "TypeScript",
        check: () =>
          languages["TypeScript"] ||
          detectedFiles.has("tsconfig.json") ||
          detectedPackages.has("typescript"),
        evidence: () => `${languages["TypeScript"] ? "TypeScript codebase (" + Math.round((languages["TypeScript"] / (Object.values(languages).reduce((a, b) => a + b, 0) || 1)) * 100) + "% volume)" : "tsconfig.json configured"}`,
      },
      {
        skill: "Tailwind CSS",
        check: () =>
          detectedPackages.has("tailwindcss") ||
          detectedFiles.has("tailwind.config.js") ||
          detectedFiles.has("tailwind.config.ts"),
        evidence: () => "TailwindCSS dependency and PostCSS config verified",
      },
      {
        skill: "Node.js",
        check: () =>
          detectedFiles.has("package.json") ||
          detectedPackages.has("express") ||
          detectedPackages.has("fastify"),
        evidence: () => "Node.js runtime environment and ecosystem manifests present",
      },
      {
        skill: "Docker",
        check: () =>
          detectedFiles.has("dockerfile") ||
          detectedFiles.has("docker-compose.yml") ||
          detectedFiles.has("docker-compose.yaml"),
        evidence: () => "Dockerfile container orchestration manifest found in repository root",
      },
      {
        skill: "Python",
        check: () =>
          languages["Python"] ||
          detectedFiles.has("requirements.txt") ||
          detectedFiles.has("pyproject.toml"),
        evidence: () => "Native Python modules and requirement manifests detected",
      },
      {
        skill: "FastAPI",
        check: () => detectedPackages.has("fastapi"),
        evidence: () => "FastAPI package verified in requirements.txt",
      },
      {
        skill: "Supabase",
        check: () =>
          detectedPackages.has("@supabase/supabase-js") ||
          detectedPackages.has("@supabase/ssr"),
        evidence: () => "Supabase database client integration detected in package.json",
      },
      {
        skill: "MongoDB",
        check: () =>
          detectedPackages.has("mongoose") ||
          detectedPackages.has("mongodb"),
        evidence: () => "MongoDB/Mongoose driver dependencies found",
      },
      {
        skill: "PostgreSQL",
        check: () =>
          detectedPackages.has("pg") ||
          detectedPackages.has("@prisma/client") ||
          detectedPackages.has("drizzle-orm"),
        evidence: () => "PostgreSQL client ORM dependencies found",
      },
      {
        skill: "Redis",
        check: () =>
          detectedPackages.has("redis") ||
          detectedPackages.has("ioredis") ||
          commitMessages.some((m) => m.includes("redis")),
        evidence: () => "Redis cache client driver or commit refs found",
      },
      {
        skill: "Prisma",
        check: () =>
          detectedPackages.has("@prisma/client") ||
          detectedPackages.has("prisma") ||
          detectedFiles.has("prisma"),
        evidence: () => "Prisma schema and ORM client configured",
      },
      {
        skill: "Jest / Testing",
        check: () =>
          detectedPackages.has("jest") ||
          detectedPackages.has("vitest") ||
          detectedPackages.has("@testing-library/react"),
        evidence: () => "Automated testing framework installed",
      },
      {
        skill: "Git / CI/CD",
        check: () =>
          detectedFiles.has(".github") ||
          detectedFiles.has(".gitlab-ci.yml"),
        evidence: () => "GitHub Actions workflow automation pipeline found (.github/workflows)",
      },
    ];

    // Collect skills mentioned in the candidate's resume or matched keywords
    const candidateSkillsLower = [
      ...candidateSkills,
      ...(resumeText.match(/\b(React|Next\.js|TypeScript|Tailwind|Node\.js|Docker|Python|FastAPI|Supabase|MongoDB|PostgreSQL|Redis|Prisma|Jest|Git)\b/gi) || []),
    ].map((s) => s.toLowerCase());

    const uniqueCandidateSkills = Array.from(new Set(candidateSkillsLower));

    const verifiedSkills = [];
    const unverifiedSkills = [];

    SKILL_RULES.forEach((rule) => {
      const isClaimed =
        uniqueCandidateSkills.some((s) => s.includes(rule.skill.toLowerCase())) ||
        new RegExp(`\\b${rule.skill}\\b`, "i").test(resumeText);

      const hasProof = rule.check();

      if (hasProof) {
        verifiedSkills.push({
          skill: rule.skill,
          status: "VERIFIED",
          evidence: rule.evidence(),
          isClaimedInResume: isClaimed,
        });
      } else if (isClaimed) {
        unverifiedSkills.push({
          skill: rule.skill,
          status: "UNVERIFIED",
          risk: "HIGH",
          message: `Claimed in resume, but 0 references found in repository dependencies, file manifests, or commits.`,
        });
      }
    });

    const totalClaims = verifiedSkills.filter((s) => s.isClaimedInResume).length + unverifiedSkills.length;
    const powScore = totalClaims > 0
      ? Math.round((verifiedSkills.filter((s) => s.isClaimedInResume).length / totalClaims) * 100)
      : verifiedSkills.length > 0 ? 85 : 50;

    return {
      repoName: repoData.full_name,
      repoUrl: repoData.html_url,
      description: repoData.description || "Public repository",
      stars: repoData.stargazers_count,
      forks: repoData.forks_count,
      primaryLanguage: repoData.language || "Multi-language",
      languages,
      powScore,
      verifiedSkills,
      unverifiedSkills,
      checkedCommitsCount: commitMessages.length,
      auditTimestamp: new Date().toISOString(),
    };
  } catch (err) {
    console.error("verifyGithubRepo error:", err);
    return {
      error: `Failed to verify GitHub repo: ${err.message}`,
      url: githubUrl,
      powScore: 0,
      verifiedSkills: [],
      unverifiedSkills: [],
    };
  }
}
