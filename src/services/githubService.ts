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
    content: `# LobaiteOS 🐺: The Sovereign & Zero-Trust Web Operating System

Repositório Oficial no GitHub:
🔗 **https://github.com/corocotoco22-cmyk/LobaireOS**

Site no Netlify:
🔗 **https://lobaireos.netlify.app/**

LobaiteOS 🐺 é um sistema operacional web sovereign, zero-trust e focado em privacidade absoluta, construído inteiramente em **TypeScript + React + Vite**.

## 🚀 Como Iniciar

\`\`\`bash
# 1. Clonar o repositório oficial
git clone https://github.com/corocotoco22-cmyk/LobaireOS.git

# 2. Entrar na pasta do projeto
cd LobaireOS

# 3. Instalar as dependências
npm install

# 4. Executar em modo desenvolvimento
npm run dev
\`\`\`

## 🛡️ Arquitetura WebOS (TypeScript & React)
- **Engine**: React 18 + TypeScript + Tailwind CSS
- **Isolamento de Processos**: Sandbox de memória volátil e controle de permissões por app
- **WolfVault**: Criptografia de segredos local com Web Crypto API (AES-GCM 256-bit)
- **GhostBrowse**: Navegador com proteção anti-fingerprinting e isolamento de tráfego
- **LoComunite**: Hub de conexão com o repositório oficial no GitHub`,
  },
  {
    name: "src",
    path: "src",
    type: "dir",
    size: 0,
  },
  {
    name: "src/App.tsx",
    path: "src/App.tsx",
    type: "file",
    size: 4500,
    content: `// LobaireOS - Main Desktop & Window Manager Engine (React + TypeScript)
import React, { useState } from "react";
import { Desktop } from "./components/Desktop/Desktop";
import { WindowManager } from "./components/WindowManager/WindowManager";

export function App() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-zinc-950 text-zinc-100 select-none">
      <Desktop />
      <WindowManager />
    </div>
  );
}`,
  },
  {
    name: "src/types.ts",
    path: "src/types.ts",
    type: "file",
    size: 3100,
    content: `// LobaireOS - System Types & Process Definitions
export type AppId = "shield" | "guardian" | "vault" | "ghostbrowse" | "files" | "terminal" | "notes" | "monitor" | "settings" | "locomunite";

export interface SystemProcess {
  pid: number;
  name: string;
  appId: AppId;
  cpu: number;
  memoryMb: number;
  networkKb: number;
  status: "running" | "sandboxed" | "isolated";
  threatScore: "SAFE" | "SUSPICIOUS" | "THREAT";
}`,
  },
  {
    name: "package.json",
    path: "package.json",
    type: "file",
    size: 980,
    content: `{
  "name": "lobaire-os",
  "private": true,
  "version": "3.4.0",
  "type": "module",
  "description": "Sovereign Zero-Trust Web Operating System (React + TypeScript)",
  "repository": "https://github.com/corocotoco22-cmyk/LobaireOS",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.344.0",
    "motion": "^12.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "typescript": "^5.5.3",
    "vite": "^5.4.1"
  }
}`,
  },
  {
    name: "vite.config.ts",
    path: "vite.config.ts",
    type: "file",
    size: 320,
    content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});`,
  },
  {
    name: "LICENSE",
    path: "LICENSE",
    type: "file",
    size: 1420,
    content: `MIT License / Sovereign Open Source

Copyright (c) 2026 corocotoco22-cmyk / LobaireOS

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction.`,
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
