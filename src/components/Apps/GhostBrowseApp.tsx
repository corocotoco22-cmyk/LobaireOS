import React, { useState } from "react";
import {
  Globe,
  ShieldCheck,
  Zap,
  Lock,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Plus,
  X,
  EyeOff,
  Flame,
  Search,
  ExternalLink,
  Radio,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Code2,
  GitBranch,
  Star,
  GitFork,
  FileCode,
  Folder,
  FileText,
  Copy,
  Terminal,
  Info,
} from "lucide-react";
import { GhostTab, TorCircuitNode } from "../../types";
import { LOCOMUNITE_GITHUB_URL, LOCOMUNITE_GIT_CLONE } from "../../utils/systemData";
import {
  fetchGitHubRepoData,
  fetchGitHubFileContent,
  GitHubRepoInfo,
  GitHubCommitItem,
  GitHubFileItem,
} from "../../services/githubService";

export const GhostBrowseApp: React.FC = () => {
  const [tabs, setTabs] = useState<GhostTab[]>([
    {
      id: "tab-locomunite",
      url: LOCOMUNITE_GITHUB_URL,
      title: "GitHub • corocotoco22-cmyk/LobaireOS",
      isTor: true,
      trackersBlocked: 6,
      sslSecure: true,
      contentCategory: "portal",
    },
    {
      id: "tab-1",
      url: "https://duckduckgogg42tsbb6w2xym3hdrxbdapspirunx36phsqxtsv4d.onion",
      title: "DuckDuckGo Onion Search",
      isTor: true,
      trackersBlocked: 8,
      sslSecure: true,
      contentCategory: "search",
    },
    {
      id: "tab-2",
      url: "https://privacyguides.org/pt-br/",
      title: "Privacy Guides • Privacidade",
      isTor: true,
      trackersBlocked: 14,
      sslSecure: true,
      contentCategory: "portal",
    },
  ]);

  const [activeTabId, setActiveTabId] = useState<string>("tab-locomunite");
  const [urlInput, setUrlInput] = useState(LOCOMUNITE_GITHUB_URL);
  const [showCircuitPopover, setShowCircuitPopover] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [copiedClone, setCopiedClone] = useState(false);
  const [selectedRepoFile, setSelectedRepoFile] = useState<string | null>(null);
  const [activeRepoTab, setActiveRepoTab] = useState<"code" | "issues" | "pulls" | "releases">("code");
  const [isStarred, setIsStarred] = useState(false);

  // Dynamic GitHub Data
  const [repoInfo, setRepoInfo] = useState<GitHubRepoInfo>({
    name: "LobaireOS",
    fullName: "corocotoco22-cmyk/LobaireOS",
    description: "Zero-Trust Sovereign Web Operating System com Kernel Kobaire -- LobaireOS",
    stars: 1240,
    forks: 48,
    openIssues: 0,
    defaultBranch: "main",
    updatedAt: new Date().toISOString(),
    htmlUrl: LOCOMUNITE_GITHUB_URL,
    isLive: true,
  });
  const [commits, setCommits] = useState<GitHubCommitItem[]>([]);
  const [dynamicFiles, setDynamicFiles] = useState<GitHubFileItem[]>([]);
  const [filePreviewContent, setFilePreviewContent] = useState<string>("");
  const [isLoadingFileContent, setIsLoadingFileContent] = useState(false);

  React.useEffect(() => {
    fetchGitHubRepoData().then((data) => {
      setRepoInfo(data.repo);
      setCommits(data.commits);
      setDynamicFiles(data.files);
    });
  }, []);

  const handleSelectFile = async (fileName: string) => {
    if (selectedRepoFile === fileName) {
      setSelectedRepoFile(null);
      return;
    }
    setSelectedRepoFile(fileName);
    setIsLoadingFileContent(true);
    const content = await fetchGitHubFileContent(fileName);
    setFilePreviewContent(content);
    setIsLoadingFileContent(false);
  };

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  const torCircuit: TorCircuitNode[] = [
    { name: "Este LobaireOS", ip: "127.0.0.1 (Sandbox)", country: "Local Host", flag: "🔒", latencyMs: 2, type: "guard" },
    { name: "Guarda Criptografado (Entry)", ip: "185.220.101.44", country: "Islândia (Reykjavík)", flag: "🇮🇸", latencyMs: 28, type: "guard" },
    { name: "Nó Intermediário (Relay)", ip: "193.200.17.89", country: "Suíça (Zürich)", flag: "🇨🇭", latencyMs: 44, type: "middle" },
    { name: "Nó de Saída Anônimo (Exit)", ip: "45.154.255.12", country: "Romênia (Bucareste)", flag: "🇷🇴", latencyMs: 62, type: "exit" },
  ];

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = urlInput.trim();
    if (!target) return;

    if (!target.startsWith("http://") && !target.startsWith("https://") && !target.endsWith(".onion")) {
      // Treat as search
      setSearchQuery(target);
      target = `https://duckduckgogg42tsbb6w2xym3hdrxbdapspirunx36phsqxtsv4d.onion/?q=${encodeURIComponent(target)}`;
    }

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              url: target,
              title: target.includes("github.com/corocotoco22-cmyk/LobaireOS")
                ? "GitHub • corocotoco22-cmyk/LobaireOS"
                : target.includes("duckduckgo")
                ? `Busca: ${urlInput}`
                : target.replace(/^https?:\/\//, ""),
              trackersBlocked: t.trackersBlocked + 3,
            }
          : t
      )
    );
  };

  const handleOpenBookmark = (url: string, title: string) => {
    setUrlInput(url);
    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              url,
              title,
              trackersBlocked: t.trackersBlocked + 2,
            }
          : t
      )
    );
  };

  const handleNewTab = () => {
    const newId = "tab-" + Date.now();
    const newTab: GhostTab = {
      id: newId,
      url: LOCOMUNITE_GITHUB_URL,
      title: "GitHub • corocotoco22-cmyk/LobaireOS",
      isTor: true,
      trackersBlocked: 0,
      sslSecure: true,
      contentCategory: "portal",
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
    setUrlInput(newTab.url);
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const remaining = tabs.filter((t) => t.id !== id);
    setTabs(remaining);
    if (activeTabId === id) {
      setActiveTabId(remaining[0].id);
      setUrlInput(remaining[0].url);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchResults([
      {
        title: "corocotoco22-cmyk/LobaireOS: Sovereign WebOS & KobaireKe Kernel",
        url: LOCOMUNITE_GITHUB_URL,
        desc: "Repositório Oficial do LobaireOS no GitHub. Zero-Trust Web Operating System com suíte de defesa cibernética, kernels KobaireKe e isolamento de processos.",
      },
      {
        title: "Guia Completo de Criptografia e Anonimato no LobaireOS",
        url: "https://lobaire.wiki/sovereign-privacy",
        desc: "Aprenda a orquestrar chaves PGP com hardware tokens, configurar DNS over HTTPS e anular fingerprinting de navegadores.",
      },
      {
        title: "Electronic Frontier Foundation (EFF) - Surveillance Self-Defense",
        url: "https://ssd.eff.org",
        desc: "Guias práticos e defensivos contra vigilância em massa, proteção de senhas e telecomunicações seguras.",
      },
      {
        title: "Tor Project: Anonymity Online & Onion Services Protocol",
        url: "https://torproject.org",
        desc: "Defenda-se contra o rastreamento e a vigilância. Navegue livremente por meio da rede distribuída em cebola.",
      },
    ]);
  };

  const handleCopyClone = () => {
    navigator.clipboard?.writeText(LOCOMUNITE_GIT_CLONE);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2500);
  };

  const isGitHubRepo =
    activeTab.url.includes("github.com/corocotoco22-cmyk/LobaireOS") ||
    activeTab.url.includes("corocotoco22-cmyk") ||
    activeTab.url.includes("LobaireOS");

  const repoFiles = [
    {
      name: "lobaire_kernel",
      type: "dir",
      message: "Add KobaireKe LOPS & No LOPS kernel routines",
      time: "Hoje",
    },
    {
      name: "src",
      type: "dir",
      message: "Implement full sovereign desktop, apps and vault",
      time: "Hoje",
    },
    {
      name: "docs",
      type: "dir",
      message: "Add Zero-Trust architecture specification & memory vault docs",
      time: "Hoje",
    },
    {
      name: ".gitignore",
      type: "file",
      message: "Configure build artifacts and secrets exclusion",
      time: "Hoje",
      content: "node_modules/\ndist/\n.env\n*.log",
    },
    {
      name: "LICENSE",
      type: "file",
      message: "GPL-3.0 Sovereign Open Source License",
      time: "Hoje",
      content: "GNU GENERAL PUBLIC LICENSE\nVersion 3, 29 June 2007\n\nCopyright (C) 2026 LobaireOS Project & corocotoco22-cmyk",
    },
    {
      name: "locomunite_config.json",
      type: "file",
      message: "LoComunite repository & subsystem configuration",
      time: "Hoje",
      content: JSON.stringify(
        {
          repository: "https://github.com/corocotoco22-cmyk/LobaireOS",
          kernels: ["KobaireKe -- LobaireOS No LOPS", "KobaireKe -- LobaireOS LOPS"],
          lopsOptimized: true,
          sandboxing: "Zero-Trust AES-256",
        },
        null,
        2
      ),
    },
    {
      name: "kobaire_kernel.c",
      type: "file",
      message: "Core KobaireKe kernel initialization source code",
      time: "Hoje",
      content: `/*
 * KobaireKe - LobaireOS Core Kernel
 * Repository: https://github.com/corocotoco22-cmyk/LobaireOS
 */
#include <lobaire/security.h>
#include <lobaire/sandbox.h>

#ifdef CONFIG_LOBAIRE_LOPS
#define KERNEL_RELEASE "KobaireKe -- LobaireOS LOPS"
#define LOPS_OPTIMIZED_SUBSYSTEM 1
#else
#define KERNEL_RELEASE "KobaireKe -- LobaireOS No LOPS"
#define LOPS_OPTIMIZED_SUBSYSTEM 0
#endif

int init_kobaire_kernel(void) {
    printk("[KobaireKe] Booting Kernel: %s\\n", KERNEL_RELEASE);
    printk("[KobaireKe] Repository: https://github.com/corocotoco22-cmyk/LobaireOS\\n");
    enforce_process_isolation();
    return 0;
}`,
    },
    {
      name: "package.json",
      type: "file",
      message: "LobaireOS release v3.4.0 Hardened",
      time: "Hoje",
      content: `{\n  "name": "lobaire-os",\n  "version": "3.4.0",\n  "repository": "https://github.com/corocotoco22-cmyk/LobaireOS"\n}`,
    },
    {
      name: "README.md",
      type: "file",
      message: "Document KobaireKe kernels, LoComunite and sovereign features",
      time: "Hoje",
      content: `# LobaireOS: The Sovereign & Zero-Trust WebOS

Official GitHub Repository: https://github.com/corocotoco22-cmyk/LobaireOS

LobaireOS is a privacy-first, zero-trust web operating system engineered with hardened cryptographic defenses, isolated volatile memory, and the KobaireKe kernel suite.`,
    },
  ];

  return (
    <div id="ghostbrowse-app" className="h-full flex flex-col bg-zinc-950 text-zinc-100 select-none">
      {/* Top Tab Strip */}
      <div className="flex items-center gap-1 px-3 pt-2 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-1 flex-1 overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              onClick={() => {
                setActiveTabId(tab.id);
                setUrlInput(tab.url);
              }}
              className={`group flex items-center gap-2 px-3 py-1.5 rounded-t-xl text-xs font-medium cursor-pointer transition border-t border-x ${
                activeTabId === tab.id
                  ? "bg-zinc-950 border-zinc-700 text-sky-300 shadow-sm"
                  : "bg-zinc-900/50 border-transparent text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
              }`}
            >
              <Lock className="w-3 h-3 text-emerald-400" />
              <span className="max-w-[170px] truncate">{tab.title}</span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => handleCloseTab(tab.id, e)}
                  className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-0.5 rounded transition"
                  title="Fechar aba (Destruição imediata de memória)"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={handleNewTab}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          title="Nova Aba Anônima"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation & Address Bar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-zinc-950 border-b border-zinc-800 text-xs">
        <div className="flex items-center gap-1 text-zinc-400">
          <button
            onClick={() => handleOpenBookmark(LOCOMUNITE_GITHUB_URL, "GitHub • corocotoco22-cmyk/LobaireOS")}
            className="p-1.5 rounded hover:bg-zinc-800 hover:text-white"
            title="Voltar ao LoComunite GitHub"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded hover:bg-zinc-800 hover:text-white disabled:opacity-30">
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              const u = urlInput;
              setUrlInput("");
              setTimeout(() => setUrlInput(u), 50);
            }}
            className="p-1.5 rounded hover:bg-zinc-800 hover:text-white"
            title="Recarregar"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address input */}
        <form onSubmit={handleNavigate} className="flex-1 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5 focus-within:border-sky-500/50">
            <button
              type="button"
              onClick={() => setShowCircuitPopover(!showCircuitPopover)}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono hover:bg-emerald-500/20 transition"
              title="Inspecionar Circuito Tor"
            >
              <Zap className="w-3 h-3" />
              <span>TOR ONION</span>
            </button>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-zinc-500 outline-none font-mono text-xs"
            />
          </div>
        </form>

        {/* Open in external real browser button */}
        {isGitHubRepo && (
          <a
            href={LOCOMUNITE_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-xs transition shadow-sm"
            title="Abrir página oficial do GitHub no navegador"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">GitHub Oficial</span>
          </a>
        )}

        {/* Tracker Shield Badge */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-300 font-mono text-[11px]"
            title="Rastreadores bloqueados nesta página"
          >
            <EyeOff className="w-3.5 h-3.5 text-sky-400" />
            <span>{activeTab.trackersBlocked} Bloqueados</span>
          </div>
        </div>
      </div>

      {/* Bookmarks Quick Bar */}
      <div className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900/60 border-b border-zinc-800/80 text-[11px] font-mono overflow-x-auto">
        <span className="text-zinc-500 text-[10px] uppercase font-bold">Atalhos:</span>
        <button
          onClick={() => handleOpenBookmark(LOCOMUNITE_GITHUB_URL, "GitHub • corocotoco22-cmyk/LobaireOS")}
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md transition ${
            isGitHubRepo
              ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold"
              : "text-zinc-300 hover:bg-zinc-800 hover:text-white"
          }`}
        >
          <span>🐺</span>
          <span>LoComunite (GitHub)</span>
        </button>
        <button
          onClick={() =>
            handleOpenBookmark(
              "https://duckduckgogg42tsbb6w2xym3hdrxbdapspirunx36phsqxtsv4d.onion",
              "DuckDuckGo Onion Search"
            )
          }
          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
        >
          <span>🧅</span>
          <span>DuckDuckGo</span>
        </button>
        <button
          onClick={() =>
            handleOpenBookmark("https://privacyguides.org/pt-br/", "Privacy Guides • Ferramentas de Privacidade")
          }
          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
        >
          <span>🛡️</span>
          <span>Privacy Guides</span>
        </button>
        <button
          onClick={() =>
            handleOpenBookmark("https://torproject.org", "Tor Project: Anonymity Online")
          }
          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
        >
          <span>🌐</span>
          <span>Tor Project</span>
        </button>
      </div>

      {/* Tor Circuit Popover */}
      {showCircuitPopover && (
        <div className="absolute top-32 left-20 z-40 w-80 bg-zinc-900/95 border border-zinc-800 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-400" />
              Circuito Tor Criptografado
            </span>
            <button onClick={() => setShowCircuitPopover(false)} className="text-zinc-400 hover:text-white">
              ✕
            </button>
          </div>
          <div className="space-y-2">
            {torCircuit.map((node, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800 text-[11px]">
                <span className="text-base">{node.flag}</span>
                <div className="flex-1">
                  <p className="font-medium text-white">{node.name}</p>
                  <p className="font-mono text-[10px] text-zinc-400">{node.ip} • {node.country}</p>
                </div>
                <span className="font-mono text-[10px] text-sky-400">{node.latencyMs}ms</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-zinc-400 leading-tight">
            * Seus dados são criptografados em 3 camadas sucessivas com chaves efêmeras.
          </p>
        </div>
      )}

      {/* Browser Viewport */}
      <div className="flex-1 overflow-y-auto bg-zinc-950 p-4 sm:p-6 flex flex-col items-center">
        {/* CASE 1: GitHub Page for corocotoco22-cmyk/LobaireOS */}
        {isGitHubRepo ? (
          <div className="w-full max-w-5xl space-y-5 text-xs text-zinc-200">
            {/* GitHub Header Banner */}
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-zinc-950 border border-zinc-700 flex items-center justify-center text-2xl">
                    🐙
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sky-400 font-semibold font-mono text-sm">corocotoco22-cmyk</span>
                      <span className="text-zinc-500">/</span>
                      <span className="text-white font-bold font-mono text-base">LobaireOS</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                        Public
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30 text-[10px] font-mono">
                        LoComunite
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 font-mono">
                      {LOCOMUNITE_GITHUB_URL}
                    </p>
                  </div>
                </div>

                {/* GitHub Action Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setIsStarred(!isStarred)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                      isStarred
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : "bg-zinc-950 border-zinc-700 text-zinc-300 hover:border-zinc-500"
                    }`}
                  >
                    <Star className={`w-3.5 h-3.5 ${isStarred ? "fill-amber-400 text-amber-400" : ""}`} />
                    <span>{isStarred ? "Starred" : "Star"}</span>
                    <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300">
                      {repoInfo.stars + (isStarred ? 1 : 0)}
                    </span>
                  </button>

                  <a
                    href={repoInfo.htmlUrl || LOCOMUNITE_GITHUB_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-xs transition shadow-md"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir no GitHub</span>
                  </a>
                </div>
              </div>

              {/* Repo Subtitle & Tags */}
              <div className="space-y-2">
                <p className="text-zinc-300 text-xs leading-relaxed">
                  <strong>LobaireOS:</strong> {repoInfo.description}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">lobaireos</span>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">kobaire-kernel</span>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">locomunite</span>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">zero-trust</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">● Conexão Dinâmica</span>
                </div>
              </div>

              {/* Navigation Tabs (Code, Issues, etc.) */}
              <div className="flex items-center gap-4 border-t border-zinc-800 pt-3 text-xs font-semibold">
                <button
                  onClick={() => setActiveRepoTab("code")}
                  className={`flex items-center gap-1.5 pb-1 border-b-2 transition ${
                    activeRepoTab === "code"
                      ? "border-sky-400 text-sky-400"
                      : "border-transparent text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Code2 className="w-4 h-4" />
                  <span>Code ({dynamicFiles.length})</span>
                </button>
                <button
                  onClick={() => setActiveRepoTab("issues")}
                  className={`flex items-center gap-1.5 pb-1 border-b-2 transition ${
                    activeRepoTab === "issues"
                      ? "border-sky-400 text-sky-400"
                      : "border-transparent text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <Info className="w-4 h-4" />
                  <span>Issues</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-[10px] text-zinc-300">{repoInfo.openIssues}</span>
                </button>
                <button
                  onClick={() => setActiveRepoTab("pulls")}
                  className={`flex items-center gap-1.5 pb-1 border-b-2 transition ${
                    activeRepoTab === "pulls"
                      ? "border-sky-400 text-sky-400"
                      : "border-transparent text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <GitBranch className="w-4 h-4" />
                  <span>Commits ({commits.length})</span>
                </button>
                <button
                  onClick={() => setActiveRepoTab("releases")}
                  className={`flex items-center gap-1.5 pb-1 border-b-2 transition ${
                    activeRepoTab === "releases"
                      ? "border-sky-400 text-sky-400"
                      : "border-transparent text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Kernel (Kobaire)</span>
                </button>
              </div>
            </div>

            {/* Code / Clone Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-mono text-xs">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                  <GitBranch className="w-3.5 h-3.5 text-sky-400" />
                  <span>{repoInfo.defaultBranch}</span>
                </div>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400"><strong>{repoInfo.forks}</strong> forks</span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-400"><strong>{repoInfo.stars}</strong> stars</span>
              </div>

              {/* Clone command button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyClone}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-sky-300 transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedClone ? "Comando Copiado!" : "Copiar Git Clone"}</span>
                </button>
              </div>
            </div>

            {/* Latest Commit Bar */}
            <div className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center font-bold text-[10px]">
                  C
                </div>
                <span className="font-bold text-white">{commits[0]?.author || "corocotoco22-cmyk"}</span>
                <span className="text-zinc-400 truncate max-w-xs sm:max-w-md">
                  {commits[0]?.message || "Update LobaireOS repository"}
                </span>
              </div>
              <span className="text-zinc-500 text-[10px] hidden sm:inline">commit {commits[0]?.sha || "4f9b201"}</span>
            </div>

            {/* Repository File Tree */}
            <div className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden divide-y divide-zinc-800/80 font-mono text-xs">
              {dynamicFiles.map((file, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (file.type === "file") {
                      handleSelectFile(file.path || file.name);
                    }
                  }}
                  className={`p-3 flex items-center justify-between cursor-pointer transition ${
                    selectedRepoFile === (file.path || file.name)
                      ? "bg-zinc-800/80 text-sky-300 font-bold"
                      : "hover:bg-zinc-800/40 text-zinc-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {file.type === "dir" ? (
                      <Folder className="w-4 h-4 text-sky-400" />
                    ) : file.name.endsWith(".c") ? (
                      <Code2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <FileText className="w-4 h-4 text-zinc-400" />
                    )}
                    <span className="font-semibold">{file.name}</span>
                  </div>
                  <span className="text-zinc-500 text-[11px] truncate max-w-[200px] hidden md:inline">
                    {file.type === "dir" ? "Diretório" : "Arquivo dinâmico"}
                  </span>
                  <span className="text-zinc-500 text-[10px]">
                    {file.size ? `${(file.size / 1024).toFixed(1)} KB` : "live"}
                  </span>
                </div>
              ))}
            </div>

            {/* File Viewer Modal / Preview if clicked */}
            {selectedRepoFile && (
              <div className="p-4 rounded-2xl bg-zinc-900 border border-sky-500/30 space-y-2">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <span className="font-mono font-bold text-sky-300 flex items-center gap-1.5">
                    <FileCode className="w-4 h-4" />
                    {selectedRepoFile}
                    {isLoadingFileContent && <span className="text-xs text-zinc-400 font-normal">(carregando...)</span>}
                  </span>
                  <button
                    onClick={() => setSelectedRepoFile(null)}
                    className="text-zinc-400 hover:text-white text-xs px-2 py-0.5 rounded bg-zinc-800"
                  >
                    Fechar
                  </button>
                </div>
                <pre className="p-3.5 rounded-xl bg-zinc-950 font-mono text-[11px] text-zinc-300 overflow-x-auto border border-zinc-800 max-h-96">
                  {isLoadingFileContent ? "Buscando dados em tempo real no repositório..." : filePreviewContent}
                </pre>
              </div>
            )}

            {/* Rendered README.md Section */}
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="font-bold text-white font-mono flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-400" />
                  README.md
                </span>
                <span className="text-[10px] font-mono text-zinc-500">LobaireOS Sovereign Core</span>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-zinc-300 font-sans">
                <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 space-y-1">
                  <h3 className="font-bold text-white text-sm">🐺 LoComunite: Repositório Oficial do LobaireOS</h3>
                  <p className="text-sky-300 text-xs">
                    Link do repositório no GitHub: <a href={LOCOMUNITE_GITHUB_URL} target="_blank" rel="noopener noreferrer" className="underline font-bold text-white">{LOCOMUNITE_GITHUB_URL}</a>
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Kernel Oficial: Kobaire -- LobaireOS</h4>
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] space-y-1">
                    <p className="text-sky-400 font-bold">Kobaire -- LobaireOS</p>
                    <p className="text-zinc-400 text-[10px]">Kernel unificado de produção com isolamento de memória AES-256 e sandboxing estrito.</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Como Clonar e Executar</h4>
                  <pre className="p-3 rounded-xl bg-zinc-950 font-mono text-[11px] text-sky-300 border border-zinc-800 overflow-x-auto">
                    {`# Clonar o repositório oficial
git clone https://github.com/corocotoco22-cmyk/LobaireOS.git

# Acessar a pasta do sistema
cd LobaireOS

# Instalar dependências e inicializar o compositor
npm install
npm run dev`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab.url.includes("duckduckgo") ? (
          /* CASE 2: DuckDuckGo Onion View */
          <div className="w-full max-w-2xl space-y-6 my-auto text-center">
            <div className="space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-2">
                <Globe className="w-10 h-10" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">DuckDuckGo Onion</h1>
              <p className="text-xs text-zinc-400">O mecanismo de busca anônimo que não rastreia você.</p>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative max-w-lg mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar na Web Sem Rastreadores..."
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-sky-500/50 rounded-2xl px-5 py-3 text-sm text-white placeholder-zinc-500 outline-none shadow-xl pr-12"
              />
              <button
                type="submit"
                className="absolute right-3 top-2.5 p-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 transition"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Search Results */}
            {searchResults && (
              <div className="text-left space-y-3 pt-4 max-w-xl mx-auto">
                <span className="text-[11px] font-mono text-sky-400">Resultados Criptografados ({searchResults.length}):</span>
                {searchResults.map((res, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (res.url.includes("github.com/corocotoco22-cmyk/LobaireOS")) {
                        handleOpenBookmark(LOCOMUNITE_GITHUB_URL, "GitHub • corocotoco22-cmyk/LobaireOS");
                      }
                    }}
                    className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition cursor-pointer"
                  >
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-semibold text-sky-300 hover:underline">
                      {res.title}
                    </a>
                    <p className="text-[10px] font-mono text-emerald-400 mt-0.5">{res.url}</p>
                    <p className="text-xs text-zinc-300 mt-1">{res.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* CASE 3: Generic Protected Page Portal */
          <div className="w-full max-w-3xl space-y-6 text-xs">
            <div className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">Portal de Privacidade: {activeTab.title}</h3>
                  <p className="text-xs text-sky-400 font-mono mt-0.5">{activeTab.url}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[10px]">
                  SANDBOX ISOLADO
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
                  <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Proteções de Fingerprint Ativas
                  </span>
                  <p className="text-zinc-400 text-[11px]">
                    User-Agent genérico injetado, resolução de tela padronizada em 1920x1080 e fontes do sistema protegidas contra enumeração.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
                  <span className="font-semibold text-zinc-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Destruição Automática de Cookies
                  </span>
                  <p className="text-zinc-400 text-[11px]">
                    Nenhum cookie de sessão ou storage local persiste após o fechamento desta aba.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/40 border border-zinc-800 text-zinc-300 leading-relaxed">
                <p className="font-medium text-white mb-1">Dica de Navegação Segura:</p>
                Evite fazer login em contas pessoais com seu nome real enquanto estiver navegando em modo Tor anônimo para prevenir correlação de identidade de metadados.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
