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
} from "lucide-react";
import { GhostTab, TorCircuitNode } from "../../types";

export const GhostBrowseApp: React.FC = () => {
  const [tabs, setTabs] = useState<GhostTab[]>([
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
      title: "Privacy Guides • Ferramentas de Privacidade",
      isTor: true,
      trackersBlocked: 14,
      sslSecure: true,
      contentCategory: "portal",
    },
  ]);

  const [activeTabId, setActiveTabId] = useState<string>("tab-1");
  const [urlInput, setUrlInput] = useState(tabs[0].url);
  const [showCircuitPopover, setShowCircuitPopover] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[] | null>(null);

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
              title: target.includes("duckduckgo") ? `Busca: ${urlInput}` : target.replace(/^https?:\/\//, ""),
              trackersBlocked: t.trackersBlocked + 3,
            }
          : t
      )
    );
  };

  const handleNewTab = () => {
    const newId = "tab-" + Date.now();
    const newTab: GhostTab = {
      id: newId,
      url: "https://duckduckgogg42tsbb6w2xym3hdrxbdapspirunx36phsqxtsv4d.onion",
      title: "Nova Aba Descartável",
      isTor: true,
      trackersBlocked: 0,
      sslSecure: true,
      contentCategory: "search",
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
        title: "Guia Completo de Criptografia e Anonimato no LobaireOS",
        url: "https://lobaire.wiki/sovereign-privacy",
        desc: "Aprenda a orquestrar chaves PGP com hardware tokens, configurar DNS over HTTPS e anular fingerprinting de navegadores sem quebrar a renderização.",
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
      {
        title: "KeePassXC & PGP Secrets Management Best Practices",
        url: "https://keepassxc.org",
        desc: "Cofres de senha offline com chaves simétricas AES-256 e YubiKey HMAC-SHA1.",
      },
    ]);
  };

  return (
    <div id="ghostbrowse-app" className="h-full flex flex-col bg-slate-950/90 text-slate-100 select-none">
      {/* Top Tab Strip */}
      <div className="flex items-center gap-1 px-3 pt-2 bg-slate-900/80 border-b border-slate-800">
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
                  ? "bg-slate-950 border-slate-700 text-cyan-300 shadow-sm"
                  : "bg-slate-900/50 border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
              }`}
            >
              <Lock className="w-3 h-3 text-emerald-400" />
              <span className="max-w-[140px] truncate">{tab.title}</span>
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
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Nova Aba Anônima"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation & Address Bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-1 text-slate-400">
          <button className="p-1.5 rounded hover:bg-slate-800 hover:text-white disabled:opacity-30">
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded hover:bg-slate-800 hover:text-white disabled:opacity-30">
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 rounded hover:bg-slate-800 hover:text-white">
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address input */}
        <form onSubmit={handleNavigate} className="flex-1 flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 focus-within:border-cyan-500/50">
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
              className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none font-mono text-xs"
            />
          </div>
        </form>

        {/* Tracker Shield Badge */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-[11px]"
            title="Rastreadores bloqueados nesta página"
          >
            <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
            <span>{activeTab.trackersBlocked} Bloqueados</span>
          </div>
        </div>
      </div>

      {/* Tor Circuit Popover */}
      {showCircuitPopover && (
        <div className="absolute top-28 left-20 z-40 w-80 bg-slate-900/95 border border-slate-800 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-400" />
              Circuito Tor Criptografado
            </span>
            <button onClick={() => setShowCircuitPopover(false)} className="text-slate-400 hover:text-white">
              ✕
            </button>
          </div>
          <div className="space-y-2">
            {torCircuit.map((node, i) => (
              <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px]">
                <span className="text-base">{node.flag}</span>
                <div className="flex-1">
                  <p className="font-medium text-white">{node.name}</p>
                  <p className="font-mono text-[10px] text-slate-400">{node.ip} • {node.country}</p>
                </div>
                <span className="font-mono text-[10px] text-cyan-400">{node.latencyMs}ms</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            * Seus dados são criptografados em 3 camadas sucessivas com chaves efêmeras.
          </p>
        </div>
      )}

      {/* Browser Viewport */}
      <div className="flex-1 overflow-y-auto bg-slate-950 p-6 flex flex-col items-center">
        {activeTab.url.includes("duckduckgo") ? (
          <div className="w-full max-w-2xl space-y-6 my-auto text-center">
            {/* DuckDuckGo Onion View */}
            <div className="space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-2">
                <Globe className="w-10 h-10" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">DuckDuckGo Onion</h1>
              <p className="text-xs text-slate-400">O mecanismo de busca anônimo que não rastreia você.</p>
            </div>

            <form onSubmit={handleSearchSubmit} className="relative max-w-lg mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar na Web Sem Rastreadores..."
                className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/50 rounded-2xl px-5 py-3 text-sm text-white placeholder-slate-400 outline-none shadow-xl pr-12"
              />
              <button
                type="submit"
                className="absolute right-3 top-2.5 p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Simulated Search Results */}
            {searchResults && (
              <div className="text-left space-y-3 pt-4 max-w-xl mx-auto">
                <span className="text-[11px] font-mono text-cyan-400">Resultados Criptografados ({searchResults.length}):</span>
                {searchResults.map((res, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-semibold text-cyan-300 hover:underline">
                      {res.title}
                    </a>
                    <p className="text-[10px] font-mono text-emerald-400 mt-0.5">{res.url}</p>
                    <p className="text-xs text-slate-300 mt-1">{res.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Generic Protected Page Portal */
          <div className="w-full max-w-3xl space-y-6 text-xs">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">Portal de Privacidade: {activeTab.title}</h3>
                  <p className="text-xs text-cyan-400 font-mono mt-0.5">{activeTab.url}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[10px]">
                  SANDBOX ISOLADO
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Proteções de Fingerprint Ativas
                  </span>
                  <p className="text-slate-400 text-[11px]">
                    User-Agent genérico injetado, resolução de tela padronizada em 1920x1080 e fontes do sistema protegidas contra enumeração.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Destruição Automática de Cookies
                  </span>
                  <p className="text-slate-400 text-[11px]">
                    Nenhum cookie de sessão ou storage local persiste após o fechamento desta aba.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 text-slate-300 leading-relaxed">
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
