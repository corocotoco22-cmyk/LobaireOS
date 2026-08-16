import React, { useState, useEffect, useRef } from "react";
import {
  ExternalLink,
  RotateCw,
  Copy,
  Check,
  Star,
  Globe,
  Code2,
  Cpu,
  FileCode,
  ShieldCheck,
  Maximize2,
  Folder,
  FileText,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Terminal,
  AlertTriangle,
  GitBranch,
  GitCommit,
  Info,
  RefreshCw,
  Layers,
} from "lucide-react";
import { LOCOMUNITE_GITHUB_URL, LOCOMUNITE_GIT_CLONE, SYSTEM_KERNEL_NAME } from "../../utils/systemData";
import {
  fetchGitHubRepoData,
  fetchGitHubFileContent,
  GitHubRepoInfo,
  GitHubCommitItem,
  GitHubFileItem,
} from "../../services/githubService";

export const LoComuniteApp: React.FC = () => {
  const [activeMode, setActiveMode] = useState<"explorer" | "iframe" | "kernel" | "terminal">("explorer");
  const [currentUrl, setCurrentUrl] = useState(LOCOMUNITE_GITHUB_URL);
  const [inputUrl, setInputUrl] = useState(LOCOMUNITE_GITHUB_URL);
  const [iframeKey, setIframeKey] = useState(0);
  const [copiedClone, setCopiedClone] = useState(false);
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
  const [filesList, setFilesList] = useState<GitHubFileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("README.md");
  const [fileContent, setFileContent] = useState<string>("");
  const [isLoadingRepo, setIsLoadingRepo] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [repoTab, setRepoTab] = useState<"files" | "commits" | "readme">("files");

  const loadRepoData = async () => {
    setIsLoadingRepo(true);
    try {
      const data = await fetchGitHubRepoData();
      setRepoInfo(data.repo);
      setCommits(data.commits);
      setFilesList(data.files);
    } catch {
      // fallback
    } finally {
      setIsLoadingRepo(false);
    }
  };

  useEffect(() => {
    loadRepoData();
  }, []);

  useEffect(() => {
    let isCancelled = false;
    async function loadContent() {
      setIsLoadingFile(true);
      const content = await fetchGitHubFileContent(selectedFile);
      if (!isCancelled) {
        setFileContent(content);
        setIsLoadingFile(false);
      }
    }
    loadContent();
    return () => {
      isCancelled = true;
    };
  }, [selectedFile]);

  const handleCopyClone = () => {
    navigator.clipboard?.writeText(LOCOMUNITE_GIT_CLONE);
    setCopiedClone(true);
    setTimeout(() => setCopiedClone(false), 2500);
  };

  const handleRefreshIframe = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleNavigateIframe = (e: React.FormEvent) => {
    e.preventDefault();
    let url = inputUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = `https://${url}`;
    }
    setCurrentUrl(url);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div id="locomunite-app" className="h-full flex flex-col bg-zinc-950 text-zinc-100 select-none overflow-hidden font-sans">
      {/* Top Header / App Brand */}
      <div className="px-4 py-2.5 bg-zinc-900 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-zinc-950 border border-zinc-700 flex items-center justify-center text-lg">
            🐺
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">LoComunite Hub</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                corocotoco22-cmyk/LobaireOS
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 font-mono hidden md:inline">
                {SYSTEM_KERNEL_NAME}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls & Mode Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mode Switcher */}
          <div className="flex items-center bg-zinc-950 p-0.5 rounded-xl border border-zinc-800 text-xs">
            <button
              onClick={() => setActiveMode("explorer")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
                activeMode === "explorer"
                  ? "bg-sky-500 text-zinc-950 font-bold shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Explorador GitHub</span>
            </button>
            <button
              onClick={() => setActiveMode("iframe")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
                activeMode === "iframe"
                  ? "bg-sky-500 text-zinc-950 font-bold shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>i-Frame Web</span>
            </button>
            <button
              onClick={() => setActiveMode("kernel")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
                activeMode === "kernel"
                  ? "bg-sky-500 text-zinc-950 font-bold shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Kernel</span>
            </button>
            <button
              onClick={() => setActiveMode("terminal")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
                activeMode === "terminal"
                  ? "bg-sky-500 text-zinc-950 font-bold shadow"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Git & Terminal</span>
            </button>
          </div>

          <button
            onClick={handleCopyClone}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono text-sky-300 transition"
            title="Copiar comando git clone"
          >
            {copiedClone ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedClone ? "Copiado!" : "git clone"}</span>
          </button>

          <a
            href={LOCOMUNITE_GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-xs transition shadow-md"
            title="Abrir diretamente em nova janela do navegador"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Abrir no GitHub</span>
          </a>
        </div>
      </div>

      {/* Main Mode Viewports */}
      <div className="flex-1 relative overflow-hidden bg-zinc-950 flex flex-col">
        {/* MODE 1: EXPLORADOR GITHUB COMPLETO (Bypasses X-Frame-Options completely with real-time data) */}
        {activeMode === "explorer" && (
          <div className="h-full flex flex-col overflow-hidden">
            {/* Repo Subtitle & Stats Bar */}
            <div className="p-3.5 bg-zinc-900/90 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 font-mono">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300">
                  <GitBranch className="w-3.5 h-3.5 text-sky-400" />
                  <span>{repoInfo.defaultBranch}</span>
                </div>
                <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
                  <span><strong>{filesList.length}</strong> arquivos</span>
                  <span>•</span>
                  <span><strong>{commits.length}</strong> commits recentes</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">● Sincronizado via GitHub API</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadRepoData}
                  disabled={isLoadingRepo}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 transition"
                  title="Atualizar dados do repositório"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRepo ? "animate-spin text-sky-400" : ""}`} />
                  <span>{isLoadingRepo ? "Sincronizando..." : "Sincronizar"}</span>
                </button>

                <button
                  onClick={() => setIsStarred(!isStarred)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition ${
                    isStarred
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${isStarred ? "fill-amber-400 text-amber-400" : ""}`} />
                  <span>{isStarred ? "Starred" : "Star"}</span>
                  <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300">
                    {repoInfo.stars + (isStarred ? 1 : 0)}
                  </span>
                </button>

                <a
                  href={LOCOMUNITE_GITHUB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sky-300 border border-zinc-700 text-xs font-semibold transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Nova Janela</span>
                </a>
              </div>
            </div>

            {/* Inner Tabs for Repo Explorer */}
            <div className="flex items-center gap-2 px-4 bg-zinc-900/60 border-b border-zinc-800 text-xs font-medium">
              <button
                onClick={() => setRepoTab("files")}
                className={`py-2 px-3 border-b-2 transition flex items-center gap-1.5 ${
                  repoTab === "files"
                    ? "border-sky-400 text-sky-300 font-bold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Arquivos do Repositório ({filesList.length})</span>
              </button>
              <button
                onClick={() => setRepoTab("readme")}
                className={`py-2 px-3 border-b-2 transition flex items-center gap-1.5 ${
                  repoTab === "readme"
                    ? "border-sky-400 text-sky-300 font-bold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>README.md Renderizado</span>
              </button>
              <button
                onClick={() => setRepoTab("commits")}
                className={`py-2 px-3 border-b-2 transition flex items-center gap-1.5 ${
                  repoTab === "commits"
                    ? "border-sky-400 text-sky-300 font-bold"
                    : "border-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <GitCommit className="w-3.5 h-3.5" />
                <span>Commits ({commits.length})</span>
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {repoTab === "files" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full">
                  {/* File List */}
                  <div className="md:col-span-4 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 flex flex-col space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs font-mono text-zinc-300 font-bold">
                      <span className="flex items-center gap-1.5 truncate">
                        <Folder className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        {repoInfo.fullName}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-normal">main</span>
                    </div>

                    <div className="space-y-1 font-mono text-xs overflow-y-auto flex-1 max-h-[480px]">
                      {filesList.map((file) => (
                        <button
                          key={file.path}
                          onClick={() => {
                            if (file.type === "file") {
                              setSelectedFile(file.path);
                            }
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition ${
                            selectedFile === file.path
                              ? "bg-sky-500/15 border border-sky-500/30 text-sky-300 font-bold"
                              : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                          } ${file.type === "dir" ? "opacity-75 cursor-default" : "cursor-pointer"}`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {file.type === "dir" ? (
                              <Folder className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            ) : file.name.endsWith(".c") ? (
                              <FileCode className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : file.name.endsWith(".json") ? (
                              <Code2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            ) : (
                              <FileText className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            )}
                            <span className="truncate">{file.name}</span>
                          </div>
                          {file.size ? (
                            <span className="text-[10px] text-zinc-500 shrink-0">
                              {(file.size / 1024).toFixed(1)} KB
                            </span>
                          ) : null}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* File Content Preview */}
                  <div className="md:col-span-8 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col space-y-3">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-sky-400" />
                        <span className="font-mono font-bold text-white text-xs">{selectedFile}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-400 border border-zinc-800">
                          {isLoadingFile ? "Carregando..." : "Tempo Real"}
                        </span>
                      </div>
                      <button
                        onClick={() => navigator.clipboard?.writeText(fileContent)}
                        className="px-2.5 py-1 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-[11px] font-mono text-zinc-300 transition flex items-center gap-1.5"
                      >
                        <Copy className="w-3 h-3 text-sky-400" />
                        <span>Copiar Código</span>
                      </button>
                    </div>

                    <pre className="flex-1 p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed min-h-[350px]">
                      {isLoadingFile ? "Buscando dados em tempo real no repositório..." : fileContent}
                    </pre>
                  </div>
                </div>
              )}

              {repoTab === "readme" && (
                <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5 text-zinc-300 leading-relaxed text-xs">
                  <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 space-y-1">
                    <h2 className="text-base font-bold text-white">🐺 LobaireOS: The Sovereign & Zero-Trust Web Operating System</h2>
                    <p className="text-sky-300 font-mono">
                      Repositório Oficial: <a href={LOCOMUNITE_GITHUB_URL} target="_blank" rel="noopener noreferrer" className="underline font-bold text-white">{LOCOMUNITE_GITHUB_URL}</a>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-white">🚀 Início Rápido</h3>
                    <pre className="p-3 rounded-xl bg-zinc-950 font-mono text-sky-300 border border-zinc-800 overflow-x-auto">
{`# 1. Clonar o repositório oficial
git clone https://github.com/corocotoco22-cmyk/LobaireOS.git

# 2. Entrar na pasta do projeto
cd LobaireOS

# 3. Instalar dependências
npm install

# 4. Executar em ambiente local
npm run dev`}
                    </pre>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-white">🛡️ Kernel Unificado & Pilares de Segurança</h3>
                    <ul className="list-disc list-inside space-y-1 text-zinc-300">
                      <li><strong>Kernel:</strong> Kobaire -- LobaireOS</li>
                      <li><strong>WolfVault:</strong> Cofre militar com criptografia local AES-256 GCM</li>
                      <li><strong>GhostBrowse:</strong> Navegador Tor anti-rastreamento com isolamento de cookies</li>
                      <li><strong>Isolamento de Processos:</strong> Sandbox estrito com mitigação de fingerprinting</li>
                    </ul>
                  </div>
                </div>
              )}

              {repoTab === "commits" && (
                <div className="max-w-4xl mx-auto space-y-3">
                  {commits.map((commit) => (
                    <div
                      key={commit.sha}
                      className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-sky-300">{commit.sha}</span>
                          <span className="text-xs font-medium text-white">{commit.message}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                          <span>Autor: <strong className="text-zinc-300">{commit.author}</strong></span>
                          <span>•</span>
                          <span>{commit.date}</span>
                        </div>
                      </div>

                      <a
                        href={commit.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-sky-400 flex items-center gap-1 shrink-0"
                      >
                        <span>Ver Commit</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODE 2: IFRAME COM EXPLICATIVO E TRATAMENTO DA POLÍTICA X-FRAME-OPTIONS */}
        {activeMode === "iframe" && (
          <div className="w-full h-full flex flex-col relative">
            {/* Browser Bar */}
            <div className="px-4 py-2 bg-zinc-900/90 border-b border-zinc-800 flex items-center gap-2">
              <button
                onClick={handleRefreshIframe}
                className="p-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition"
                title="Recarregar i-frame"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              <form onSubmit={handleNavigateIframe} className="flex-1 flex items-center">
                <div className="w-full flex items-center bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5">
                  <span className="text-emerald-400 mr-2 text-xs">🔒</span>
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://github.com/corocotoco22-cmyk/LobaireOS"
                    className="w-full bg-transparent text-xs text-zinc-200 font-mono outline-none"
                  />
                </div>
              </form>

              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-xs transition"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Abrir em Nova Janela</span>
              </a>
            </div>

            {/* Smart Notice & Alternative Bar */}
            <div className="p-3 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Aviso de Segurança dos Navegadores (Firefox/Chrome):</strong> O site <code>github.com</code> envia o cabeçalho <code>X-Frame-Options: DENY</code> por segurança, impedindo a renderização direta dentro de iframes.
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveMode("explorer")}
                  className="px-3 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-xs transition shadow"
                >
                  Usar Explorador Dinâmico
                </button>
                <a
                  href={currentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-100 font-semibold text-xs transition"
                >
                  Abrir Nova Janela ↗
                </a>
              </div>
            </div>

            {/* The Actual Iframe */}
            <div className="flex-1 relative bg-white">
              <iframe
                key={iframeKey}
                src={currentUrl}
                title="LoComunite GitHub Repository Iframe"
                className="w-full h-full border-0"
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
              />
            </div>
          </div>
        )}

        {/* MODE 3: KERNEL SPECIFICATIONS */}
        {activeMode === "kernel" && (
          <div className="h-full overflow-y-auto p-4 md:p-6 space-y-4 max-w-4xl mx-auto">
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Kernel: {SYSTEM_KERNEL_NAME}</h3>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">
                    Hospedado no GitHub: https://github.com/corocotoco22-cmyk/LobaireOS
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs pt-2">
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-500 text-[10px] block">ESTADO</span>
                  <span className="font-bold text-emerald-400">100% Blindado</span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-500 text-[10px] block">SUBSYSTEM</span>
                  <span className="font-bold text-sky-400">LoComunite Hub</span>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                  <span className="text-zinc-500 text-[10px] block">TELEMETRIA</span>
                  <span className="font-bold text-rose-400">Bloqueada</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
              <span className="font-bold text-white text-xs font-mono">Código C de Inicialização:</span>
              <pre className="p-3.5 rounded-xl bg-zinc-950 font-mono text-xs text-sky-300 border border-zinc-800 overflow-x-auto">
{`/* Inicialização nativa do kernel no LobaireOS */
int init_kobaire_kernel(void) {
    printk("[Kobaire] Booting Kernel: ${SYSTEM_KERNEL_NAME}\\n");
    printk("[Kobaire] Repository: ${LOCOMUNITE_GITHUB_URL}\\n");
    enforce_process_isolation();
    return 0;
}`}
              </pre>
            </div>
          </div>
        )}

        {/* MODE 4: GIT & TERMINAL COMMANDS */}
        {activeMode === "terminal" && (
          <div className="h-full overflow-y-auto p-4 md:p-6 space-y-4 max-w-4xl mx-auto">
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-white text-sm">Comandos Git & LoComunite no WolfShell</h3>
              </div>
              <p className="text-xs text-zinc-300">
                Você pode interagir com o repositório oficial do LobaireOS diretamente pelo terminal <strong>WolfShell</strong> ou no seu terminal local:
              </p>

              <div className="space-y-2 font-mono text-xs">
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <span className="text-emerald-400">{LOCOMUNITE_GIT_CLONE}</span>
                  <button
                    onClick={handleCopyClone}
                    className="p-1 text-zinc-400 hover:text-white transition"
                    title="Copiar comando"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sky-300">
                  locomunite --code
                </div>
                <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400">
                  uname -a
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
