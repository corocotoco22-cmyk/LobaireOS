import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Zap,
  Lock,
  EyeOff,
  Radio,
  Wifi,
  Sliders,
  Bell,
  Power,
  RefreshCw,
  Search,
  Flame,
  Activity,
  Code2,
} from "lucide-react";
import { SystemEdition, SystemTheme, WindowState } from "../../types";

interface TopBarProps {
  theme: SystemTheme;
  activeWindow: WindowState | null;
  firewallActive: boolean;
  stealthMode: boolean;
  torRouting: boolean;
  camMicBlocked: boolean;
  trackersBlocked: number;
  systemEdition?: SystemEdition;
  onToggleSystemEdition?: () => void;
  onLockScreen: () => void;
  onTriggerPanic: () => void;
  onOpenSpotlight: () => void;
  onToggleControlCenter: () => void;
  isControlCenterOpen: boolean;
  onOpenApp: (appId: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  theme,
  activeWindow,
  firewallActive,
  stealthMode,
  torRouting,
  camMicBlocked,
  trackersBlocked,
  systemEdition = "standard",
  onToggleSystemEdition,
  onLockScreen,
  onTriggerPanic,
  onOpenSpotlight,
  onToggleControlCenter,
  isControlCenterOpen,
  onOpenApp,
}) => {
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [isWolfMenuOpen, setIsWolfMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setDateStr(
        now.toLocaleDateString("pt-BR", {
          weekday: "short",
          day: "2-digit",
          month: "short",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      id="lobaire-topbar"
      className="h-9 px-4 flex items-center justify-between border-b text-xs select-none backdrop-blur-md z-40 transition-colors"
      style={{
        backgroundColor: "rgba(9, 9, 11, 0.85)",
        borderColor: "rgba(39, 39, 42, 0.8)",
        color: "#d4d4d8",
      }}
    >
      {/* Left section: Wolf Menu & Active Context */}
      <div className="flex items-center gap-3 relative">
        <button
          onClick={() => setIsWolfMenuOpen(!isWolfMenuOpen)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-zinc-800/60 transition font-bold text-sky-400"
          title="Menu LobaireOS"
        >
          <span className="text-sm">🐺</span>
          <span className="font-mono text-xs tracking-wider text-zinc-100">LobaireOS</span>
        </button>

        {/* Wolf System Dropdown Menu */}
        {isWolfMenuOpen && (
          <div
            className="absolute top-8 left-0 w-64 bg-zinc-950/95 border border-zinc-800 rounded-xl p-1.5 shadow-2xl backdrop-blur-md z-50 text-xs space-y-0.5"
            onMouseLeave={() => setIsWolfMenuOpen(false)}
          >
            <div className="px-3 py-2 border-b border-zinc-800/80 mb-1">
              <p className="font-bold text-zinc-100">
                LobaireOS 3.4 Hardened
              </p>
              <p className="text-[10px] text-sky-400 font-mono">
                Kernel: Kobaire -- LobaireOS
              </p>
            </div>
            <button
              onClick={() => {
                onOpenApp("locomunite");
                setIsWolfMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
              title="Abrir aplicativo LoComunite Hub"
            >
              <div className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-sky-400" />
                <span>LoComunite Hub</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-sky-400">
                GitHub
              </span>
            </button>
            <button
              onClick={() => {
                onOpenApp("shield");
                setIsWolfMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Central de Segurança</span>
            </button>
            <button
              onClick={() => {
                onOpenApp("settings");
                setIsWolfMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
            >
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>Ajustes do Sistema</span>
            </button>
            <button
              onClick={() => {
                onLockScreen();
                setIsWolfMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-zinc-300 hover:bg-zinc-800 hover:text-white transition"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Bloquear Sessão (PIN)</span>
            </button>
            <div className="border-t border-zinc-800/80 my-1" />
            <button
              onClick={() => {
                onTriggerPanic();
                setIsWolfMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/15 transition font-semibold"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Protocolo Pânico & Wipe</span>
            </button>
          </div>
        )}

        {/* Active Window Context */}
        {activeWindow && (
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-zinc-800 text-zinc-400 text-xs">
            <span className="font-semibold text-zinc-200">{activeWindow.title}</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
              SANDBOX
            </span>
          </div>
        )}
      </div>

      {/* Center: Spotlight Search Quick Launcher Bar */}
      <div className="hidden sm:flex items-center">
        <button
          onClick={onOpenSpotlight}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/70 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 transition text-[11px]"
        >
          <Search className="w-3 h-3 text-sky-400" />
          <span>WolfSearch & Comandos</span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-[9px] font-mono text-zinc-400">Ctrl K</kbd>
        </button>
      </div>

      {/* Right section: Shield Indicators, Quick Toggles & Clock */}
      <div className="flex items-center gap-3">
        {/* Live Privacy Toggles */}
        <div className="flex items-center gap-1.5">
          {/* Tor Indicator */}
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono transition cursor-pointer ${
              torRouting ? "bg-purple-500/15 text-purple-300 border border-purple-500/30" : "text-zinc-500 hover:text-zinc-300"
            }`}
            onClick={() => onOpenApp("shield")}
            title={torRouting ? "Roteamento Tor Ativo" : "Tor Desativado"}
          >
            <Zap className="w-3 h-3" />
            <span className="hidden lg:inline">TOR</span>
          </div>

          {/* Stealth Mode Indicator */}
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono transition cursor-pointer ${
              stealthMode ? "bg-sky-500/15 text-sky-300 border border-sky-500/30" : "text-zinc-500 hover:text-zinc-300"
            }`}
            onClick={() => onOpenApp("shield")}
            title={stealthMode ? "Anti-Fingerprint Ativo" : "Stealth Desativado"}
          >
            <EyeOff className="w-3 h-3" />
            <span className="hidden lg:inline">STEALTH</span>
          </div>

          {/* Hardware Killswitch Indicator */}
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono transition cursor-pointer ${
              camMicBlocked ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30" : "text-amber-400"
            }`}
            onClick={() => onOpenApp("shield")}
            title="Isolamento de Câmera & Mic"
          >
            <Lock className="w-3 h-3" />
          </div>

          {/* Trackers blocked count badge */}
          <div
            onClick={() => onOpenApp("shield")}
            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-sky-400 font-mono text-[10px] cursor-pointer hover:bg-zinc-800 transition"
            title="Total de rastreadores neutralizados"
          >
            <ShieldCheck className="w-3 h-3 text-sky-400" />
            <span>{trackersBlocked}</span>
          </div>
        </div>

        {/* Control Center Toggle */}
        <button
          onClick={onToggleControlCenter}
          className={`p-1.5 rounded-md transition ${
            isControlCenterOpen ? "bg-sky-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
          }`}
          title="Centro de Controles Rápidos"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>

        {/* Live Clock & Date */}
        <div
          onClick={onLockScreen}
          className="flex items-center gap-2 font-mono text-xs text-zinc-300 px-2 py-1 rounded-md hover:bg-zinc-800/60 transition cursor-pointer"
          title="Clique para bloquear a sessão"
        >
          <span className="hidden sm:inline text-zinc-500">{dateStr}</span>
          <span className="font-semibold text-zinc-100">{timeStr}</span>
        </div>
      </div>
    </header>
  );
};
