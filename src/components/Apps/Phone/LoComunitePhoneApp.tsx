import React, { useState } from "react";
import {
  Code2,
  ExternalLink,
  GitBranch,
  Terminal,
  Shield,
  Star,
  CheckCircle,
} from "lucide-react";

export const LoComunitePhoneApp: React.FC = () => {
  return (
    <div id="locomunite-phone-app" className="h-full flex flex-col bg-zinc-950 text-zinc-100 p-4 space-y-4 font-sans select-none overflow-y-auto">
      {/* Header Hero */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-pink-950/40 via-zinc-900 to-zinc-950 border border-pink-500/30 text-center space-y-2 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mx-auto">
          <Code2 className="w-7 h-7" />
        </div>
        <div>
          <h3 className="text-base font-extrabold text-white">LoComunite Mobile</h3>
          <p className="text-[11px] text-pink-400 font-mono">Hub Oficial do Repositório</p>
        </div>
        <p className="text-xs text-zinc-400">
          Comunidade aberta e código-fonte soberano de LobaiteOS e Kobaire.
        </p>
        <a
          href="https://github.com/corocotoco22-cmyk/LobaireOS"
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-2xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs active:scale-95 transition shadow-lg shadow-pink-600/20"
        >
          <span>Abrir no GitHub</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Quick Specs */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
        <h4 className="font-bold text-zinc-200">Informações da Build:</h4>
        <div className="space-y-1.5 font-mono text-[11px] text-zinc-400">
          <p>• Repositório: <span className="text-pink-300">corocotoco22-cmyk/LobaireOS</span></p>
          <p>• Engine: <span className="text-sky-300">Kobaire -- LobaiteOS</span></p>
          <p>• Versão: <span className="text-emerald-400 font-bold">3.4.0 (LFP Universal)</span></p>
          <p>• BIOS Padrão: <span className="text-purple-300 font-bold">BW & catEFI</span></p>
        </div>
      </div>
    </div>
  );
};
