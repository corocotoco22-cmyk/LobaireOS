import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  ShieldCheck,
  Bot,
  Lock,
  Globe,
  Folder,
  Terminal,
  FileText,
  Activity,
  Sliders,
  Flame,
  ArrowRight,
} from "lucide-react";
import { AppId } from "../../types";
import { APP_REGISTRY } from "../../utils/systemData";

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appId: AppId) => void;
  onTriggerPanic: () => void;
}

const ICONS: Record<string, any> = {
  ShieldCheck,
  Bot,
  Lock,
  Globe,
  FolderLock: Folder,
  Terminal,
  FileText,
  Activity,
  Sliders,
};

export const SpotlightSearch: React.FC<SpotlightSearchProps> = ({
  isOpen,
  onClose,
  onOpenApp,
  onTriggerPanic,
}) => {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const appKeys = Object.keys(APP_REGISTRY) as AppId[];
  const filteredApps = appKeys.filter((id) => {
    const app = APP_REGISTRY[id];
    return (
      app.name.toLowerCase().includes(query.toLowerCase()) ||
      app.description.toLowerCase().includes(query.toLowerCase()) ||
      id.includes(query.toLowerCase())
    );
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-start justify-center pt-24 p-4 select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-2xl text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-800 bg-zinc-900/60">
          <Search className="w-4 h-4 text-sky-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Pesquisar aplicativos, utilitários ou comandos (Ex: Shield, Tor, Pânico)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 outline-none"
          />
          <kbd className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-400">ESC</kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredApps.map((appId) => {
            const app = APP_REGISTRY[appId];
            const Icon = ICONS[app.icon] || ShieldCheck;

            return (
              <div
                key={appId}
                onClick={() => {
                  onOpenApp(appId);
                  onClose();
                }}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-900/80 cursor-pointer transition text-zinc-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-zinc-900 group-hover:bg-sky-500/20 text-sky-400 transition">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-100 group-hover:text-sky-300 transition">{app.name}</h4>
                    <p className="text-[11px] text-zinc-400">{app.description}</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-sky-400 group-hover:translate-x-0.5 transition" />
              </div>
            );
          })}

          {/* Quick Panic command */}
          <div
            onClick={() => {
              onTriggerPanic();
              onClose();
            }}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-rose-500/10 cursor-pointer transition text-rose-300 group border border-transparent hover:border-rose-500/20"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-rose-200">Protocolo de Pânico & Wipe Imediato</h4>
                <p className="text-[11px] text-zinc-400">Purga a memória volátil e trava o sistema instantaneamente</p>
              </div>
            </div>
            <span className="font-mono text-[10px] text-rose-400 font-bold">DISPARAR</span>
          </div>
        </div>
      </div>
    </div>
  );
};
