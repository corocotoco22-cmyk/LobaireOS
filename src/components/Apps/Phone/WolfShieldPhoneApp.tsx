import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Flame,
  Radio,
  Lock,
  Globe,
  Zap,
  Activity,
  ArrowRight,
  EyeOff,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { SecurityIncident } from "../../../types";

interface WolfShieldPhoneAppProps {
  firewallActive: boolean;
  setFirewallActive: React.Dispatch<React.SetStateAction<boolean>>;
  stealthMode: boolean;
  setStealthMode: React.Dispatch<React.SetStateAction<boolean>>;
  torRouting: boolean;
  setTorRouting: React.Dispatch<React.SetStateAction<boolean>>;
  camMicBlocked: boolean;
  setCamMicBlocked: React.Dispatch<React.SetStateAction<boolean>>;
  trackersBlocked: number;
  incidents: SecurityIncident[];
  onTriggerPanic: () => void;
}

export const WolfShieldPhoneApp: React.FC<WolfShieldPhoneAppProps> = ({
  firewallActive,
  setFirewallActive,
  stealthMode,
  setStealthMode,
  torRouting,
  setTorRouting,
  camMicBlocked,
  setCamMicBlocked,
  trackersBlocked,
  incidents,
  onTriggerPanic,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"status" | "toggles" | "threats">("status");
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  const handleDeepMobileScan = () => {
    setIsScanning(true);
    setScanMessage("Escaneando sandbox de permissões e conexões móveis...");
    setTimeout(() => {
      setIsScanning(false);
      setScanMessage("✅ Sistema 100% Blindado. 0 backdoors detectados.");
    }, 1800);
  };

  return (
    <div id="wolfshield-phone-app" className="h-full flex flex-col bg-zinc-950 text-zinc-100 p-4 space-y-4 select-none font-sans">
      {/* Mobile Top Shield Hero */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-500/30 flex flex-col items-center text-center space-y-2 shadow-2xl">
        <div className="relative">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-zinc-950 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-950" />
          </span>
        </div>
        <div>
          <h2 className="text-base font-extrabold text-white tracking-tight">WolfShield Mobile</h2>
          <p className="text-[11px] text-emerald-400 font-mono">Modo Soberano Celular Ativo</p>
        </div>
        <p className="text-xs text-zinc-400 max-w-xs">
          Proteção em tempo real com isolamento anti-torre celular (IMSI Catcher) e filtro de rede.
        </p>
        <button
          onClick={handleDeepMobileScan}
          disabled={isScanning}
          className="mt-2 w-full py-2.5 px-4 rounded-2xl bg-emerald-500 text-zinc-950 font-bold text-xs hover:bg-emerald-400 active:scale-95 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          {isScanning ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <ShieldCheck className="w-4 h-4" />
          )}
          <span>{isScanning ? "Escaneando..." : "Escanear Dispositivo"}</span>
        </button>
        {scanMessage && (
          <p className="text-[10px] text-emerald-300 font-mono pt-1">{scanMessage}</p>
        )}
      </div>

      {/* Segmented Tab Switcher */}
      <div className="flex bg-zinc-900 border border-zinc-800 rounded-2xl p-1 text-xs">
        <button
          onClick={() => setActiveSubTab("status")}
          className={`flex-1 py-1.5 rounded-xl font-bold transition text-center ${
            activeSubTab === "status" ? "bg-emerald-500 text-zinc-950 shadow-md" : "text-zinc-400 hover:text-white"
          }`}
        >
          Métricas
        </button>
        <button
          onClick={() => setActiveSubTab("toggles")}
          className={`flex-1 py-1.5 rounded-xl font-bold transition text-center ${
            activeSubTab === "toggles" ? "bg-emerald-500 text-zinc-950 shadow-md" : "text-zinc-400 hover:text-white"
          }`}
        >
          Chaves
        </button>
        <button
          onClick={() => setActiveSubTab("threats")}
          className={`flex-1 py-1.5 rounded-xl font-bold transition text-center ${
            activeSubTab === "threats" ? "bg-emerald-500 text-zinc-950 shadow-md" : "text-zinc-400 hover:text-white"
          }`}
        >
          Ameaças ({incidents.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {activeSubTab === "status" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between">
                <span className="text-[10px] font-mono text-zinc-400">Rastreadores Bloqueados</span>
                <span className="text-2xl font-mono font-extrabold text-emerald-400 mt-2">{trackersBlocked}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col justify-between">
                <span className="text-[10px] font-mono text-zinc-400">Túnel Criptográfico</span>
                <span className="text-sm font-mono font-bold text-purple-400 mt-2">Tor Onion 5G</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 text-xs">
              <h4 className="font-bold text-zinc-200">Defesa Móvel Ativa:</h4>
              <ul className="space-y-1.5 text-[11px] text-zinc-400 font-mono">
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span> Bloqueador de anúncio e telemetrias ativo
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span> Sandbox isolado por aplicativo
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="text-emerald-400 font-bold">✓</span> Zero vazamento de DNS (Quad9 Encrypted)
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeSubTab === "toggles" && (
          <div className="space-y-2">
            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs font-bold text-white">Firewall de Pacotes Móvel</p>
                  <p className="text-[10px] text-zinc-400">Filtra todo o tráfego 4G/5G</p>
                </div>
              </div>
              <button
                onClick={() => setFirewallActive(!firewallActive)}
                className={`w-12 h-6 rounded-full transition relative ${
                  firewallActive ? "bg-emerald-500" : "bg-zinc-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition transform ${
                    firewallActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-xs font-bold text-white">Roteamento Tor (Celular)</p>
                  <p className="text-[10px] text-zinc-400">Oculta IP e localização da operadora</p>
                </div>
              </div>
              <button
                onClick={() => setTorRouting(!torRouting)}
                className={`w-12 h-6 rounded-full transition relative ${
                  torRouting ? "bg-purple-500" : "bg-zinc-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition transform ${
                    torRouting ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <EyeOff className="w-5 h-5 text-sky-400" />
                <div>
                  <p className="text-xs font-bold text-white">Stealth Fingerprint</p>
                  <p className="text-[10px] text-zinc-400">Mascaramento de modelo de celular</p>
                </div>
              </div>
              <button
                onClick={() => setStealthMode(!stealthMode)}
                className={`w-12 h-6 rounded-full transition relative ${
                  stealthMode ? "bg-sky-500" : "bg-zinc-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition transform ${
                    stealthMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-rose-400" />
                <div>
                  <p className="text-xs font-bold text-white">Killswitch Câmera & Mic</p>
                  <p className="text-[10px] text-zinc-400">Corta acesso de sensores do celular</p>
                </div>
              </div>
              <button
                onClick={() => setCamMicBlocked(!camMicBlocked)}
                className={`w-12 h-6 rounded-full transition relative ${
                  camMicBlocked ? "bg-rose-500" : "bg-zinc-700"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition transform ${
                    camMicBlocked ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {activeSubTab === "threats" && (
          <div className="space-y-2">
            {incidents.map((inc) => (
              <div key={inc.id} className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    {inc.source}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    BLOQUEADO
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">{inc.description}</p>
                <span className="text-[9px] font-mono text-zinc-500">{inc.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Panic Button Mobile */}
      <button
        onClick={onTriggerPanic}
        className="w-full py-3 rounded-2xl bg-rose-950/80 hover:bg-rose-900 border border-rose-600/40 text-rose-200 font-bold text-xs transition flex items-center justify-center gap-2 active:scale-95 shadow-lg"
      >
        <Flame className="w-4 h-4 text-rose-400" />
        <span>Disparar Protocolo Pânico Mobile</span>
      </button>
    </div>
  );
};
