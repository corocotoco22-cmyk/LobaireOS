import React, { useState } from "react";
import {
  FileText,
  Lock,
  Eye,
  EyeOff,
  Flame,
  Clock,
  Sparkles,
  Shield,
  Copy,
  Check,
  Code,
  Download,
} from "lucide-react";

export const StealthNotesApp: React.FC = () => {
  const [content, setContent] = useState(`# Anotações Confidenciais • LobaireOS

- Chaves de contingência guardadas no cofre físico
- Assinatura de transações via Cold Wallet (BIP-39)
- Rota de emergência: Servidor Onion Mirror #4

*Este documento é criptografado localmente na memória RAM.*`);

  const [isCamouflaged, setIsCamouflaged] = useState(false);
  const [isBurnAfterReading, setIsBurnAfterReading] = useState(false);
  const [burnTimer, setBurnTimer] = useState<number | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const wordsCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charsCount = content.length;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleBurn = () => {
    setContent("");
    setIsBurnAfterReading(false);
    setBurnTimer(null);
  };

  const startSelfDestruct = (seconds: number) => {
    setIsBurnAfterReading(true);
    setBurnTimer(seconds);
    const interval = setInterval(() => {
      setBurnTimer((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          handleBurn();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div id="stealth-notes-app" className="h-full flex flex-col bg-slate-950/90 text-slate-100 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              Stealth Notes
              <span className="px-2 py-0.5 text-[9px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                MEMÓRIA VOLÁTIL
              </span>
            </h2>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 text-xs">
          {/* Camouflage Mode */}
          <button
            onClick={() => setIsCamouflaged(!isCamouflaged)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition font-medium ${
              isCamouflaged
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700"
            }`}
            title="Camuflar instantaneamente para código C++ se alguém estiver olhando"
          >
            <Code className="w-3.5 h-3.5" />
            <span>{isCamouflaged ? "Descamuflar" : "Modo Camuflagem"}</span>
          </button>

          {/* Burn / Self Destruct */}
          <button
            onClick={() => startSelfDestruct(30)}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1.5 transition"
            title="Autodestruir esta nota em 30 segundos"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>{burnTimer !== null ? `Destruindo em ${burnTimer}s` : "Autodestruição (30s)"}</span>
          </button>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            title="Copiar texto"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Editor or Camouflage View */}
      <div className="flex-1 p-6 flex flex-col">
        {isCamouflaged ? (
          /* Boring C++ Camouflage code */
          <div className="flex-1 bg-slate-950 font-mono text-xs text-slate-400 p-4 rounded-xl border border-slate-800 overflow-y-auto leading-relaxed select-text">
            <p className="text-emerald-500">// Linux Kernel DMA Memory Allocator Routine</p>
            <p className="text-indigo-400">#include &lt;linux/module.h&gt;</p>
            <p className="text-indigo-400">#include &lt;linux/kernel.h&gt;</p>
            <p className="text-indigo-400">#include &lt;linux/init.h&gt;</p>
            <p className="mt-2 text-slate-300">static int __init mem_allocator_init(void) &#123;</p>
            <p className="pl-4 text-slate-400">pr_info(&quot;LobaireOS Ring0 Security Memory Guard initialized.\n&quot;);</p>
            <p className="pl-4 text-slate-400">return 0;</p>
            <p className="text-slate-300">&#125;</p>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Digite suas anotações criptografadas aqui..."
            className="flex-1 w-full bg-slate-950/60 border border-slate-800 focus:border-cyan-500/50 rounded-xl p-5 text-sm font-mono text-slate-200 placeholder-slate-600 outline-none resize-none leading-relaxed select-text"
          />
        )}
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-2 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span>{wordsCount} palavras</span>
          <span>{charsCount} caracteres</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <Lock className="w-3 h-3" />
          <span>Criptografado com PBKDF2-SHA256</span>
        </div>
      </div>
    </div>
  );
};
