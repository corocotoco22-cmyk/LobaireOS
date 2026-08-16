import React from "react";
import {
  ShieldCheck,
  Flame,
  Zap,
  EyeOff,
  Radio,
  Lock,
  Sun,
  Volume2,
  Wifi,
  Globe,
  Sliders,
  CheckCircle2,
} from "lucide-react";

interface ControlCenterProps {
  isOpen: boolean;
  onClose: () => void;
  firewallActive: boolean;
  setFirewallActive: React.Dispatch<React.SetStateAction<boolean>>;
  stealthMode: boolean;
  setStealthMode: React.Dispatch<React.SetStateAction<boolean>>;
  torRouting: boolean;
  setTorRouting: React.Dispatch<React.SetStateAction<boolean>>;
  camMicBlocked: boolean;
  setCamMicBlocked: React.Dispatch<React.SetStateAction<boolean>>;
  dnsProvider: string;
  onLockScreen: () => void;
  onTriggerPanic: () => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({
  isOpen,
  onClose,
  firewallActive,
  setFirewallActive,
  stealthMode,
  setStealthMode,
  torRouting,
  setTorRouting,
  camMicBlocked,
  setCamMicBlocked,
  dnsProvider,
  onLockScreen,
  onTriggerPanic,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-transparent"
      onClick={onClose}
    >
      <div
        className="absolute top-11 right-4 w-80 bg-zinc-950/95 border border-zinc-800 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl text-xs space-y-4 select-none animate-in slide-in-from-top-2 duration-150 text-zinc-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
          <span className="font-bold text-zinc-100 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            Centro de Controle Rápido
          </span>
          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> ZERO-TRUST
          </span>
        </div>

        {/* 2x2 Quick Security Tiles */}
        <div className="grid grid-cols-2 gap-2">
          {/* Tile 1: Firewall */}
          <button
            onClick={() => setFirewallActive(!firewallActive)}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              firewallActive
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                : "bg-zinc-900/60 border-zinc-800 text-zinc-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <Flame className="w-4 h-4" />
              <span className="text-[10px] font-bold">{firewallActive ? "LIGADO" : "OFF"}</span>
            </div>
            <p className="font-medium text-zinc-100 text-[11px] mt-2">Firewall</p>
          </button>

          {/* Tile 2: Tor */}
          <button
            onClick={() => setTorRouting(!torRouting)}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              torRouting
                ? "bg-purple-500/15 border-purple-500/40 text-purple-300"
                : "bg-zinc-900/60 border-zinc-800 text-zinc-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <Zap className="w-4 h-4" />
              <span className="text-[10px] font-bold">{torRouting ? "ONION" : "DIRETO"}</span>
            </div>
            <p className="font-medium text-zinc-100 text-[11px] mt-2">Rede Tor</p>
          </button>

          {/* Tile 3: Stealth Mode */}
          <button
            onClick={() => setStealthMode(!stealthMode)}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              stealthMode
                ? "bg-sky-500/15 border-sky-500/40 text-sky-300"
                : "bg-zinc-900/60 border-zinc-800 text-zinc-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <EyeOff className="w-4 h-4" />
              <span className="text-[10px] font-bold">{stealthMode ? "ATIVO" : "OFF"}</span>
            </div>
            <p className="font-medium text-zinc-100 text-[11px] mt-2">Anti-Fingerprint</p>
          </button>

          {/* Tile 4: Hardware Lock */}
          <button
            onClick={() => setCamMicBlocked(!camMicBlocked)}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
              camMicBlocked
                ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                : "bg-zinc-900/60 border-zinc-800 text-zinc-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <Lock className="w-4 h-4" />
              <span className="text-[10px] font-bold">{camMicBlocked ? "MUTED" : "ON"}</span>
            </div>
            <p className="font-medium text-zinc-100 text-[11px] mt-2">Cam/Mic Lock</p>
          </button>
        </div>

        {/* DNS info row */}
        <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between text-[11px]">
          <span className="text-zinc-400 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-400" /> DNS Criptografado
          </span>
          <span className="font-mono text-indigo-300 font-semibold">{dnsProvider}</span>
        </div>

        {/* Quick Lock & Panic Action */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => {
              onLockScreen();
              onClose();
            }}
            className="flex-1 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-100 font-medium flex items-center justify-center gap-1.5 transition"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Bloquear</span>
          </button>
          <button
            onClick={() => {
              onTriggerPanic();
              onClose();
            }}
            className="flex-1 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Wipe Pânico</span>
          </button>
        </div>
      </div>
    </div>
  );
};
