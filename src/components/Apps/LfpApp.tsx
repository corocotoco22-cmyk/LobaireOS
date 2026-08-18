import React, { useState } from "react";
import {
  Smartphone,
  Tablet,
  RotateCw,
  Sliders,
  Wifi,
  Radio,
  BatteryCharging,
  Fingerprint,
  ShieldCheck,
  Zap,
  Globe,
  Lock,
  Layers,
  Sparkles,
  RefreshCw,
  PhoneCall,
  Check,
  Bot,
  Flame,
  Terminal,
  Folder,
  FileText,
  Activity,
  Code2,
} from "lucide-react";
import { LfpSettings } from "../../lib/lfpStorage";
import { AppId } from "../../types";

interface LfpAppProps {
  lfpSettings: LfpSettings;
  setLfpSettings: React.Dispatch<React.SetStateAction<LfpSettings>>;
  onOpenApp: (appId: string) => void;
  onTriggerPanic: () => void;
  onLockScreen: () => void;
  torRouting: boolean;
  firewallActive: boolean;
  stealthMode: boolean;
}

export const LfpApp: React.FC<LfpAppProps> = ({
  lfpSettings,
  setLfpSettings,
  onOpenApp,
  onTriggerPanic,
  onLockScreen,
  torRouting,
  firewallActive,
  stealthMode,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "devices" | "apps" | "diagnostics">("overview");
  const [sosActive, setSosActive] = useState(false);

  const toggleLfpMode = () => {
    setLfpSettings((prev) => {
      const next = { ...prev, enabled: !prev.enabled };
      try {
        localStorage.setItem("lobaite_lfp_settings", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const updateSetting = <K extends keyof LfpSettings>(key: K, value: LfpSettings[K]) => {
    setLfpSettings((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem("lobaite_lfp_settings", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleSimulateSos = () => {
    setSosActive(true);
    setTimeout(() => {
      setSosActive(false);
    }, 4000);
  };

  return (
    <div id="lfp-phone-app" className="h-full flex flex-col bg-zinc-950/95 text-zinc-100 select-none overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Smartphone className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              LFP (Lobaite For Phone)
              <span className={`px-2 py-0.5 text-[10px] font-mono rounded border ${
                lfpSettings.enabled
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                  : "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
              }`}>
                {lfpSettings.enabled ? "MODO LFP ATIVO EM TUDO" : "UNIVERSAL MOBILE ENGINE"}
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Arquitetura responsiva de alta performance adaptada para Smartphones, Tablets e Foldables
            </p>
          </div>
        </div>

        {/* Global LFP Master Switch */}
        <button
          onClick={toggleLfpMode}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg ${
            lfpSettings.enabled
              ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-500/20"
              : "bg-cyan-500 hover:bg-cyan-400 text-zinc-950 shadow-cyan-500/20"
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>{lfpSettings.enabled ? "Desativar Modo LFP" : "Ativar LFP em TUDO"}</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900/40 border-b border-zinc-800 text-xs">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-3 py-1.5 rounded-lg transition font-medium ${
            activeTab === "overview" ? "bg-zinc-800 text-cyan-400 border border-cyan-500/30" : "text-zinc-400 hover:text-white"
          }`}
        >
          Visão Geral do LFP
        </button>
        <button
          onClick={() => setActiveTab("devices")}
          className={`px-3 py-1.5 rounded-lg transition font-medium ${
            activeTab === "devices" ? "bg-zinc-800 text-cyan-400 border border-cyan-500/30" : "text-zinc-400 hover:text-white"
          }`}
        >
          Emulador de Dispositivos
        </button>
        <button
          onClick={() => setActiveTab("apps")}
          className={`px-3 py-1.5 rounded-lg transition font-medium ${
            activeTab === "apps" ? "bg-zinc-800 text-cyan-400 border border-cyan-500/30" : "text-zinc-400 hover:text-white"
          }`}
        >
          Lançador de Apps Touch
        </button>
        <button
          onClick={() => setActiveTab("diagnostics")}
          className={`px-3 py-1.5 rounded-lg transition font-medium ${
            activeTab === "diagnostics" ? "bg-zinc-800 text-cyan-400 border border-cyan-500/30" : "text-zinc-400 hover:text-white"
          }`}
        >
          Telemetria Mobile (Zero-Trace)
        </button>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Status Hero Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-cyan-950/40 border border-zinc-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-bold">
                    LFP Mobile Kernel v3.4 (Kobaire-Phone)
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Lobaite For Phone: O LobaiteOS na Palma da Sua Mão
                </h3>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  O LFP adapta todo o ecossistema do LobaiteOS (WolfShield, Guardian AI, GhostBrowse Tor, WolfShell, Cofre e catEFI) para operar com navegação por gestos, painéis touch-friendly e consumo ultrabaixo de bateria.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-[11px] font-mono text-emerald-400 border border-emerald-500/30">
                    ✓ Gestos Swipe de Borda
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-[11px] font-mono text-purple-400 border border-purple-500/30">
                    ✓ Modo Tor Mobile
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-[11px] font-mono text-sky-400 border border-sky-500/30">
                    ✓ Moldura & Orientação Dinâmica
                  </span>
                </div>
              </div>

              {/* Quick Simulator Toggle Visual */}
              <div className="flex flex-col items-center p-4 rounded-xl bg-zinc-950/80 border border-cyan-500/30 min-w-[200px] text-center">
                <Smartphone className={`w-12 h-12 mb-2 transition-transform duration-300 ${lfpSettings.enabled ? "text-emerald-400 scale-110" : "text-zinc-500"}`} />
                <p className="text-xs font-bold text-white">
                  {lfpSettings.enabled ? "LFP Ativo no Navegador" : "LFP em Standby"}
                </p>
                <p className="text-[10px] text-zinc-400 mb-3">
                  {lfpSettings.enabled ? "Todas as janelas e docks em modo phone" : "Clique abaixo para emular smartphone"}
                </p>
                <button
                  onClick={toggleLfpMode}
                  className={`w-full py-2 rounded-lg text-xs font-bold transition ${
                    lfpSettings.enabled
                      ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950"
                      : "bg-zinc-800 hover:bg-zinc-700 text-cyan-400 border border-cyan-500/40"
                  }`}
                >
                  {lfpSettings.enabled ? "Desativar" : "Ativar LFP Agora"}
                </button>
              </div>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-cyan-400">
                  <Fingerprint className="w-5 h-5" />
                  <span className="text-[10px] font-mono text-emerald-400">ATIVO</span>
                </div>
                <h4 className="font-bold text-white text-xs">Biometria & PIN Rápido</h4>
                <p className="text-[11px] text-zinc-400">
                  Desbloqueio com autenticação biométrica emulada ou teclado numérico touch otimizado para uma mão.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-purple-400">
                  <Radio className="w-5 h-5" />
                  <span className="text-[10px] font-mono text-purple-300">5G / TOR</span>
                </div>
                <h4 className="font-bold text-white text-xs">Modem Celular Criptografado</h4>
                <p className="text-[11px] text-zinc-400">
                  Túnel Tor embutido em conexões 4G/5G com isolamento de rádio de células telefônicas (Anti-IMSI Catcher).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-amber-400">
                  <BatteryCharging className="w-5 h-5" />
                  <span className="text-[10px] font-mono text-amber-300">94% OTIMIZADO</span>
                </div>
                <h4 className="font-bold text-white text-xs">Modo Baixo Consumo LFP</h4>
                <p className="text-[11px] text-zinc-400">
                  Economia agressiva de CPU e suspensão de abas de fundo com algoritmo Volatile Page Guard.
                </p>
              </div>
            </div>

            {/* Quick Mobile Action Bar */}
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <PhoneCall className="w-4 h-4 text-rose-400" />
                <span className="font-medium text-white">Botão de Emergência SOS Mobile:</span>
                <span className="text-zinc-400 text-[11px]">Wipe criptográfico instantâneo com atalho de tecla volume.</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateSos}
                  className="px-3.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold transition flex items-center gap-1.5"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Testar SOS Wipe</span>
                </button>
                <button
                  onClick={onLockScreen}
                  className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Bloquear Tela LFP</span>
                </button>
              </div>
            </div>

            {sosActive && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-mono animate-in fade-in flex items-center justify-between">
                <span>🚨 Protocolo SOS LFP Acionado: Limpando buffers voláteis de rede e memória...</span>
                <span className="font-bold text-rose-400">[SIMULAÇÃO SEGURA]</span>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Devices & Simulator Settings */}
        {activeTab === "devices" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Moldura e Configuração de Dispositivos LFP</h3>
              <p className="text-xs text-zinc-400">
                Selecione o formato de tela e proporção para navegar no LobaiteOS como em um smartphone real.
              </p>
            </div>

            {/* Device Frames Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { id: "iphone", name: "Lobaite Phone Pro (Modern)", screen: "390 x 844 px", icon: Smartphone },
                { id: "pixel", name: "Wolf Pixel 9 (Sovereign)", screen: "412 x 892 px", icon: Smartphone },
                { id: "compact", name: "Stealth Compact Mini", screen: "360 x 740 px", icon: Smartphone },
                { id: "foldable", name: "Lobaite Fold Edition", screen: "680 x 840 px", icon: Tablet },
              ].map((dev) => (
                <div
                  key={dev.id}
                  onClick={() => updateSetting("activeDeviceFrame", dev.id as any)}
                  className={`p-4 rounded-xl border cursor-pointer transition flex flex-col items-center text-center space-y-2 ${
                    lfpSettings.activeDeviceFrame === dev.id
                      ? "bg-cyan-500/15 border-cyan-500 text-white shadow-lg shadow-cyan-500/10"
                      : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-300"
                  }`}
                >
                  <dev.icon className="w-8 h-8 text-cyan-400" />
                  <div>
                    <h4 className="font-bold text-xs text-white">{dev.name}</h4>
                    <p className="text-[10px] font-mono text-zinc-400">{dev.screen}</p>
                  </div>
                  {lfpSettings.activeDeviceFrame === dev.id && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-cyan-500 text-zinc-950 font-bold">
                      SELECIONADO
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Adjustments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Orientation Switch */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-2">
                    <RotateCw className="w-4 h-4 text-cyan-400" />
                    Orientação de Tela
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 uppercase">
                    {lfpSettings.orientation}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateSetting("orientation", "portrait")}
                    className={`py-2 rounded-lg text-xs font-medium transition ${
                      lfpSettings.orientation === "portrait"
                        ? "bg-cyan-500 text-zinc-950 font-bold"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    📱 Retrato (Portrait)
                  </button>
                  <button
                    onClick={() => updateSetting("orientation", "landscape")}
                    className={`py-2 rounded-lg text-xs font-medium transition ${
                      lfpSettings.orientation === "landscape"
                        ? "bg-cyan-500 text-zinc-950 font-bold"
                        : "bg-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    🔄 Paisagem (Landscape)
                  </button>
                </div>
              </div>

              {/* Cellular Network Setting */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-2">
                    <Radio className="w-4 h-4 text-purple-400" />
                    Rádio Celular & Conexão
                  </span>
                  <span className="text-[10px] font-mono text-purple-300">
                    {lfpSettings.cellularNetwork}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[10px]">
                  {(["5G", "4G-LTE", "Tor-Mesh", "Offline"] as const).map((net) => (
                    <button
                      key={net}
                      onClick={() => updateSetting("cellularNetwork", net)}
                      className={`py-1.5 rounded-md font-mono transition ${
                        lfpSettings.cellularNetwork === net
                          ? "bg-purple-500 text-zinc-950 font-bold"
                          : "bg-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {net}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Touch Apps Launcher */}
        {activeTab === "apps" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Launcher Rápido de Aplicativos Mobile</h3>
              <p className="text-xs text-zinc-400">
                Toque em qualquer app para abrir instantaneamente em formato adaptado de smartphone.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: "shield", name: "WolfShield", desc: "Firewall & Proteção", icon: ShieldCheck, color: "text-emerald-400" },
                { id: "guardian", name: "Guardian AI", desc: "Assistente Gemini", icon: Bot, color: "text-sky-400" },
                { id: "ghostbrowse", name: "GhostBrowse", desc: "Navegador Tor", icon: Globe, color: "text-purple-400" },
                { id: "vault", name: "WolfVault", desc: "Senhas & TOTP", icon: Lock, color: "text-indigo-400" },
                { id: "files", name: "WolfFiles", desc: "Arquivos & Shredder", icon: Folder, color: "text-amber-400" },
                { id: "terminal", name: "WolfShell", desc: "Terminal Seguro", icon: Terminal, color: "text-rose-400" },
                { id: "notes", name: "Notas", desc: "Stealth Notes", icon: FileText, color: "text-teal-400" },
                { id: "monitor", name: "Monitor", desc: "Processos & RAM", icon: Activity, color: "text-cyan-400" },
                { id: "locomunite", name: "LoComunite", desc: "GitHub Hub", icon: Code2, color: "text-sky-300" },
                { id: "settings", name: "Ajustes", desc: "Configurações", icon: Sliders, color: "text-zinc-300" },
              ].map((app) => (
                <button
                  key={app.id}
                  onClick={() => onOpenApp(app.id)}
                  className="p-3.5 rounded-xl bg-zinc-900/70 hover:bg-zinc-800/90 border border-zinc-800 hover:border-cyan-500/40 text-left transition flex items-center gap-3 group active:scale-95"
                >
                  <app.icon className={`w-8 h-8 ${app.color} group-hover:scale-110 transition-transform`} />
                  <div>
                    <h4 className="text-xs font-bold text-white">{app.name}</h4>
                    <p className="text-[10px] text-zinc-400">{app.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Diagnostics */}
        {activeTab === "diagnostics" && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <p className="text-cyan-400 font-bold">[LFP-KERNEL] DIAGNÓSTICO DE SUBSISTEMA MOBILE:</p>
              <div className="text-zinc-300 space-y-1 text-[11px]">
                <p>• Interface Adaptativa: <span className="text-emerald-400">Flexbox Touch Compositor (CSS Hardware Accel)</span></p>
                <p>• Resolução Virtual: <span className="text-sky-300">1080x2400 @ 120Hz Zero-Lag</span></p>
                <p>• Gestos de Navegação: <span className="text-emerald-400">Edge-Swipe Back / Bottom-Bar App Switcher</span></p>
                <p>• Sandbox de Permissões: <span className="text-purple-400">Câmera e Microfone Isolados por App</span></p>
                <p>• Bateria Estimada: <span className="text-amber-400">22h Restantes (CPU Throttling Zero-Telemetry)</span></p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
