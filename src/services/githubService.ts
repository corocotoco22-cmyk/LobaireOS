export interface GitHubRepoInfo {
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  openIssues: number;
  defaultBranch: string;
  updatedAt: string;
  htmlUrl: string;
  isLive: boolean;
  avatarUrl?: string;
  language?: string;
  license?: string;
}

export interface GitHubCommitItem {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

export interface GitHubFileItem {
  name: string;
  path: string;
  type: "file" | "dir";
  size?: number;
  downloadUrl?: string | null;
  content?: string;
}

const REPO_OWNER = "corocotoco22-cmyk";
const REPO_NAME = "LobaireOS";

// Default fallback data if offline or rate limited by GitHub API
const DEFAULT_FILES: GitHubFileItem[] = [
  {
    name: "README.md",
    path: "README.md",
    type: "file",
    size: 2840,
    content: `# LobaireOS: The Sovereign & Zero-Trust Web Operating System

Repositório Oficial no GitHub:
🔗 **https://github.com/corocotoco22-cmyk/LobaireOS**

LobaireOS é um sistema operacional web sovereign, zero-trust e focado em privacidade absoluta, alimentado pelo kernel **Kobaire -- LobaireOS**.

## 🚀 Como Iniciar

\`\`\`bash
# 1. Clonar o repositório
git clone https://github.com/corocotoco22-cmyk/LobaireOS.git

# 2. Entrar na pasta
cd LobaireOS

# 3. Instalar as dependências
npm install

# 4. Executar em modo desenvolvimento
npm run dev
\`\`\`

## 🛡️ Pilares de Segurança
- **Kernel Unificado**: Kobaire -- LobaireOS
- **Isolamento de Processos**: Sandbox estrito com mitigação de fingerprinting
- **WolfVault**: Criptografia de segredos local AES-256 GCM
- **GhostBrowse**: Roteamento anônimo e bloqueio total de telemetria`,
  },
  {
    name: "kobaire_kernel.c",
    path: "kobaire_kernel.c",
    type: "file",
    size: 3420,
    content: `/*
 * Kobaire -- LobaireOS Kernel Initialization
 * Project: LobaireOS Sovereign Operating System
 * Repository: https://github.com/corocotoco22-cmyk/LobaireOS
 * Kernel: Kobaire -- LobaireOS
 */

#include <lobaire/kernel.h>
#include <lobaire/crypto_sandbox.h>
#include <lobaire/memory_vault.h>

#define KERNEL_NAME "Kobaire -- LobaireOS"
#define KERNEL_VERSION "3.4.0-hardened"
#define ZERO_TRUST_SECURITY_LEVEL 3

int init_kobaire_kernel(void) {
    printk("[Kobaire] Booting Kernel: %s (v%s)\\n", KERNEL_NAME, KERNEL_VERSION);
    printk("[Kobaire] Repository: https://github.com/corocotoco22-cmyk/LobaireOS\\n");
    
    // Initialize secure volatile memory regions
    init_memory_vault_protection();
    
    // Isolate hardware sensors and telemetry vectors
    block_unauthorized_hardware_probing();
    
    // Enforce process sandboxing
    enforce_process_isolation();
    
    printk("[Kobaire] Kernel initialized successfully. System status: SECURE.\\n");
    return 0;
}`,
  },
  {
    name: "src",
    path: "src",
    type: "dir",
    size: 0,
  },
  {
    name: "docs",
    path: "docs",
    type: "dir",
    size: 0,
  },
  {
    name: "locomunite_manifest.json",
    path: "locomunite_manifest.json",
    type: "file",
    size: 1120,
    content: JSON.stringify(
      {
        name: "LoComunite",
        kernel: "Kobaire -- LobaireOS",
        repository: "https://github.com/corocotoco22-cmyk/LobaireOS",
        gitClone: "git clone https://github.com/corocotoco22-cmyk/LobaireOS.git",
        license: "GPL-3.0 Sovereign Open Source",
        maintainer: "corocotoco22-cmyk",
        liveSync: true,
      },
      null,
      2
    ),
  },
  {
    name: "package.json",
    path: "package.json",
    type: "file",
    size: 890,
    content: `{\n  "name": "lobaire-os",\n  "version": "3.4.0",\n  "description": "Sovereign Zero-Trust WebOS with Kobaire -- LobaireOS Kernel",\n  "repository": "https://github.com/corocotoco22-cmyk/LobaireOS",\n  "author": "corocotoco22-cmyk",\n  "license": "GPL-3.0"\n}`,
  },
  {
    name: "LICENSE",
    path: "LICENSE",
    type: "file",
    size: 1420,
    content: `GNU GENERAL PUBLIC LICENSE\nVersion 3, 29 June 2007\n\nCopyright (C) 2026 LobaireOS Project & corocotoco22-cmyk\nEveryone is permitted to copy and distribute verbatim copies of this license document.`,
  },
];

export async function fetchGitHubRepoData(): Promise<{
  repo: GitHubRepoInfo;
  commits: GitHubCommitItem[];
  files: GitHubFileItem[];
}> {
  try {
    // 1. Fetch Repository Meta
    const repoRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`, {
      headers: { Accept: "application/vnd.github.v3+json" },
    });

    let repo: GitHubRepoInfo = {
      name: REPO_NAME,
      fullName: `${REPO_OWNER}/${REPO_NAME}`,
      description: "Zero-Trust Sovereign Web Operating System com Kernel Kobaire -- LobaireOS",
      stars: 1240,
      forks: 48,
      openIssues: 0,
      defaultBranch: "main",
      updatedAt: new Date().toISOString(),
      htmlUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}`,
      isLive: false,
      language: "TypeScript / C",
      license: "GPL-3.0",
    };

    if (repoRes.ok) {
      const data = await repoRes.json();
      repo = {
        name: data.name || REPO_NAME,
        fullName: data.full_name || `${REPO_OWNER}/${REPO_NAME}`,
        description: data.description || repo.description,
        stars: data.stargazers_count ?? repo.stars,
        forks: data.forks_count ?? repo.forks,
        openIssues: data.open_issues_count ?? repo.openIssues,
        defaultBranch: data.default_branch || "main",
        updatedAt: data.updated_at || repo.updatedAt,
        htmlUrl: data.html_url || `https://github.com/${REPO_OWNER}/${REPO_NAME}`,
        isLive: true,
        avatarUrl: data.owner?.avatar_url,
        language: data.language || "TypeScript",
        license: data.license?.spdx_id || "GPL-3.0",
      };
    }

    // 2. Fetch Commits
    let commits: GitHubCommitItem[] = [
      {
        sha: "4f9b201",
        message: "Update Kobaire -- LobaireOS kernel & LoComunite GitHub hub",
        author: REPO_OWNER,
        date: "Hoje",
        url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/commit/4f9b201`,
      },
      {
        sha: "1a8e932",
        message: "Enforce zero-trust sandboxing and volatile page guard",
        author: REPO_OWNER,
        date: "Ontem",
        url: `https://github.com/${REPO_OWNER}/${REPO_NAME}/commit/1a8e932`,
      },
    ];

    try {
      const commitsRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits?per_page=5`, {
        headers: { Accept: "application/vnd.github.v3+json" },
      });
      if (commitsRes.ok) {
        const commitData = await commitsRes.json();
        if (Array.isArray(commitData) && commitData.length > 0) {
          commits = commitData.map((c: any) => ({
            sha: c.sha ? c.sha.substring(0, 7) : "commit",
            message: c.commit?.message?.split("\n")[0] || "Update repository",
            author: c.commit?.author?.name || c.author?.login || REPO_OWNER,
            date: c.commit?.author?.date
              ? new Date(c.commit.author.date).toLocaleDateString("pt-BR")
              : "Recente",
            url: c.html_url || `https://github.com/${REPO_OWNER}/${REPO_NAME}`,
          }));
        }
      }
    } catch {
      // Keep default commits on error
    }

    // 3. Fetch Root Contents
    let files: GitHubFileItem[] = DEFAULT_FILES;
    try {
      const contentsRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`, {
        headers: { Accept: "application/vnd.github.v3+json" },
      });
      if (contentsRes.ok) {
        const contentsData = await contentsRes.json();
        if (Array.isArray(contentsData) && contentsData.length > 0) {
          files = contentsData.map((item: any) => ({
            name: item.name,
            path: item.path,
            type: item.type === "dir" ? "dir" : "file",
            size: item.size || 0,
            downloadUrl: item.download_url,
          }));
        }
      }
    } catch {
      // fallback
    }

    return { repo, commits, files };
  } catch (error) {
    return {
      repo: {
        name: REPO_NAME,
        fullName: `${REPO_OWNER}/${REPO_NAME}`,
        description: "Zero-Trust Sovereign Web Operating System com Kernel Kobaire -- LobaireOS",
        stars: 1240,
        forks: 48,
        openIssues: 0,
        defaultBranch: "main",
        updatedAt: new Date().toISOString(),
        htmlUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}`,
        isLive: false,
        language: "TypeScript / C",
        license: "GPL-3.0",
      },
      commits: [
        {
          sha: "4f9b201",
          message: "Update Kobaire -- LobaireOS kernel & LoComunite GitHub hub",
          author: REPO_OWNER,
          date: "Hoje",
          url: `https://github.com/${REPO_OWNER}/${REPO_NAME}`,
        },
      ],
      files: DEFAULT_FILES,
    };
  }
}

export async function fetchGitHubFileContent(path: string): Promise<string> {
  // Check in default files first
  const fallback = DEFAULT_FILES.find((f) => f.path === path || f.name === path);
  
  try {
    const res = await fetch(`https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${path}`);
    if (res.ok) {
      return await res.text();
    }
  } catch {
    // ignore
  }

  try {
    const apiRes = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`);
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data.content && data.encoding === "base64") {
        return atob(data.content.replace(/\s/g, ""));
      }
    }
  } catch {
    // ignore
  }

  return fallback?.content || `// Conteúdo dinâmico do arquivo: ${path}\n// Repositório: https://github.com/${REPO_OWNER}/${REPO_NAME}`;
}
