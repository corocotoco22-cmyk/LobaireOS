import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Bot,
  Globe,
  Lock,
  Terminal,
  Folder,
  FileText,
  Activity,
  Sliders,
  Code2,
  Smartphone,
  Flame,
  Wifi,
  Battery,
  ChevronLeft,
  Search,
  Grid,
  Phone,
  MessageSquare,
  Camera,
  Layers,
  Settings,
  ArrowUpRight,
  ShieldAlert,
  Radio,
  Share2,
  X,
  Volume2,
  Moon,
  Sun,
} from "lucide-react";
import { AppId, SecurityIncident, SystemEdition, SystemTheme, WindowState } from "../../types";
import { APP_REGISTRY, INITIAL_SECURITY_INCIDENTS } from "../../utils/systemData";
import { LfpSettings } from "../../lib/lfpStorage";
import { WolfShieldPhoneApp } from "../Apps/Phone/WolfShieldPhoneApp";
import { LobaireGuardianPhoneApp } from "../Apps/Phone/LobaireGuardianPhoneApp";
import { WolfVaultPhoneApp } from "../Apps/Phone/WolfVaultPhoneApp";
import { GhostBrowsePhoneApp } from "../Apps/Phone/GhostBrowsePhoneApp";
import { WolfFilesPhoneApp } from "../Apps/Phone/WolfFilesPhoneApp";
import { WolfShellPhoneApp } from "../Apps/Phone/WolfShellPhoneApp";
import { StealthNotesPhoneApp } from "../Apps/Phone/StealthNotesPhoneApp";
import { ThreatMonitorPhoneApp } from "../Apps/Phone/ThreatMonitorPhoneApp";
import { SystemSettingsPhoneApp } from "../Apps/Phone/SystemSettingsPhoneApp";
import { LoComunitePhoneApp } from "../Apps/Phone/LoComunitePhoneApp";
import { LfpApp } from "../Apps/LfpApp";

interface LfpMobileOSProps {
  lfpSettings: LfpSettings;
  setLfpSettings: React.Dispatch<React.SetStateAction<LfpSettings>>;
  onExitLfp: () => void;
  onTriggerPanic: () => void;
  theme: SystemTheme;
  setTheme: (theme: SystemTheme) => void;
  systemEdition: SystemEdition;
  setSystemEdition: React.Dispatch<React.SetStateAction<SystemEdition>>;
  lockPin: string;
  setLockPin: (pin: string) => void;
  autoLockMinutes: number;
  setAutoLockMinutes: (min: number) => void;
  clipboardAutoClear: boolean;
  setClipboardAutoClear: (clear: boolean) => void;
  firewallActive: boolean;
  setFirewallActive: React.Dispatch<React.SetStateAction<boolean>>;
  stealthMode: boolean;
  setStealthMode: React.Dispatch<React.SetStateAction<boolean>>;
  torRouting: boolean;
  setTorRouting: React.Dispatch<React.SetStateAction<boolean>>;
  camMicBlocked: boolean;
  setCamMicBlocked: React.Dispatch<React.SetStateAction<boolean>>;
  trackersBlocked: number;
  setTrackersBlocked: React.Dispatch<React.SetStateAction<number>>;
  dnsProvider: string;
  setDnsProvider: React.Dispatch<React.SetStateAction<string>>;
  incidents: SecurityIncident[];
  onRestartGrub: () => void;
  onOpenTTY: () => void;
  onOpenCefiVault: () => void;
  isRootDeleted: boolean;
  setIsRootDeleted: (deleted: boolean) => void;
}

export const LfpMobileOS: React.FC<LfpMobileOSProps> = ({
  lfpSettings,
  setLfpSettings,
  onExitLfp,
  onTriggerPanic,
  theme,
  setTheme,
  systemEdition,
  setSystemEdition,
  lockPin,
  setLockPin,
  autoLockMinutes,
  setAutoLockMinutes,
  clipboardAutoClear,
  setClipboardAutoClear,
  firewallActive,
  setFirewallActive,
  stealthMode,
  setStealthMode,
  torRouting,
  setTorRouting,
  camMicBlocked,
  setCamMicBlocked,
  trackersBlocked,
  setTrackersBlocked,
  dnsProvider,
  setDnsProvider,
  incidents,
  onRestartGrub,
  onOpenTTY,
  onOpenCefiVault,
  isRootDeleted,
  setIsRootDeleted,
}) => {
  // Active Full-screen Mobile App (null means Home Screen)
  const [activeMobileApp, setActiveMobileApp] = useState<AppId | null>(null);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [isControlShadeOpen, setIsControlShadeOpen] = useState(false);
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);
  const [recentApps, setRecentApps] = useState<AppId[]>(["shield", "guardian", "ghostbrowse", "vault"]);
  const [isMultitaskOpen, setIsMultitaskOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(
        d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      );
      setCurrentDate(
        d.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "short" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLaunchApp = (appId: AppId) => {
    setActiveMobileApp(appId);
    setIsAppDrawerOpen(false);
    setIsMultitaskOpen(false);
    setRecentApps((prev) => [appId, ...prev.filter((id) => id !== appId)].slice(0, 8));
  };

  const handleCloseActiveApp = () => {
    setActiveMobileApp(null);
  };

  // App Metadata definition with dedicated Mobile App Colors and Icons
  const MOBILE_APP_LIST: { id: AppId; name: string; icon: any; bg: string; color: string; desc: string }[] = [
    { id: "shield", name: "WolfShield", icon: ShieldCheck, bg: "bg-emerald-500/15 border-emerald-500/30", color: "text-emerald-400", desc: "Firewall & Proteção" },
    { id: "guardian", name: "Lobaite AI", icon: Bot, bg: "bg-sky-500/15 border-sky-500/30", color: "text-sky-400", desc: "Assistente Criptográfico" },
    { id: "ghostbrowse", name: "GhostBrowse", icon: Globe, bg: "bg-purple-500/15 border-purple-500/30", color: "text-purple-400", desc: "Navegador Tor Mobile" },
    { id: "vault", name: "WolfVault", icon: Lock, bg: "bg-amber-500/15 border-amber-500/30", color: "text-amber-400", desc: "Cofre AES-256" },
    { id: "terminal", name: "WolfShell", icon: Terminal, bg: "bg-zinc-800 border-zinc-700", color: "text-rose-400", desc: "Terminal Mobile" },
    { id: "files", name: "Arquivos", icon: Folder, bg: "bg-blue-500/15 border-blue-500/30", color: "text-blue-400", desc: "Gerenciador Local" },
    { id: "notes", name: "Notas", icon: FileText, bg: "bg-yellow-500/15 border-yellow-500/30", color: "text-yellow-400", desc: "Notas Criptografadas" },
    { id: "monitor", name: "Monitor", icon: Activity, bg: "bg-red-500/15 border-red-500/30", color: "text-red-400", desc: "Ameaças & Conexões" },
    { id: "locomunite", name: "LoComunite", icon: Code2, bg: "bg-pink-500/15 border-pink-500/30", color: "text-pink-400", desc: "Hub do Sistema" },
    { id: "lfp", name: "LFP Config", icon: Smartphone, bg: "bg-cyan-500/15 border-cyan-500/30", color: "text-cyan-400", desc: "Ajustes do Telefone" },
    { id: "settings", name: "Ajustes", icon: Sliders, bg: "bg-zinc-800 border-zinc-700", color: "text-zinc-300", desc: "Configurações OS" },
  ];

  // Mobile Bottom Dock pinned apps
  const DOCK_APPS: { id: AppId; name: string; icon: any; bg: string; color: string }[] = [
    { id: "shield", name: "Shield", icon: ShieldCheck, bg: "bg-emerald-500", color: "text-zinc-950" },
    { id: "guardian", name: "Guardian", icon: Bot, bg: "bg-sky-500", color: "text-zinc-950" },
    { id: "ghostbrowse", name: "Web Tor", icon: Globe, bg: "bg-purple-600", color: "text-white" },
    { id: "terminal", name: "Shell", icon: Terminal, bg: "bg-zinc-900 border border-zinc-700", color: "text-rose-400" },
  ];

  const renderMobileAppContent = (appId: AppId) => {
    switch (appId) {
      case "shield":
        return (
          <WolfShieldPhoneApp
            firewallActive={firewallActive}
            setFirewallActive={setFirewallActive}
            stealthMode={stealthMode}
            setStealthMode={setStealthMode}
            torRouting={torRouting}
            setTorRouting={setTorRouting}
            camMicBlocked={camMicBlocked}
            setCamMicBlocked={setCamMicBlocked}
            trackersBlocked={trackersBlocked}
            incidents={incidents}
            onTriggerPanic={onTriggerPanic}
          />
        );
      case "guardian":
        return <LobaireGuardianPhoneApp />;
      case "vault":
        return <WolfVaultPhoneApp />;
      case "ghostbrowse":
        return <GhostBrowsePhoneApp />;
      case "files":
        return <WolfFilesPhoneApp />;
      case "terminal":
        return (
          <WolfShellPhoneApp
            onTriggerPanic={onTriggerPanic}
            onOpenApp={(id) => handleLaunchApp(id as AppId)}
            onRestartGrub={onRestartGrub}
            onOpenTTY={onOpenTTY}
            onOpenCefiVault={onOpenCefiVault}
            isRootDeleted={isRootDeleted}
            setIsRootDeleted={setIsRootDeleted}
          />
        );
      case "notes":
        return <StealthNotesPhoneApp />;
      case "monitor":
        return <ThreatMonitorPhoneApp />;
      case "settings":
        return (
          <SystemSettingsPhoneApp
            currentTheme={theme}
            setCurrentTheme={setTheme}
            lockPin={lockPin}
            setLockPin={setLockPin}
            dnsProvider={dnsProvider}
            setDnsProvider={setDnsProvider}
            autoLockMinutes={autoLockMinutes}
            setAutoLockMinutes={setAutoLockMinutes}
            clipboardAutoClear={clipboardAutoClear}
            setClipboardAutoClear={setClipboardAutoClear}
            systemEdition={systemEdition}
            setSystemEdition={setSystemEdition}
          />
        );
      case "locomunite":
        return <LoComunitePhoneApp />;
      case "lfp":
        return (
          <LfpApp
            lfpSettings={lfpSettings}
            setLfpSettings={setLfpSettings}
            onOpenApp={(id) => handleLaunchApp(id as AppId)}
            onTriggerPanic={onTriggerPanic}
            onLockScreen={() => setActiveMobileApp(null)}
            torRouting={torRouting}
            firewallActive={firewallActive}
            stealthMode={stealthMode}
          />
        );
      default:
        return <div className="p-6 text-zinc-400">Aplicativo em execução</div>;
    }
  };

  const filteredDrawerApps = MOBILE_APP_LIST.filter(
    (a) =>
      a.name.toLowerCase().includes(mobileSearchQuery.toLowerCase()) ||
      a.desc.toLowerCase().includes(mobileSearchQuery.toLowerCase())
  );

  return (
    <div
      id="lobaite-lfp-native-os"
      className="fixed inset-0 z-50 bg-[#06070a] text-zinc-100 flex items-center justify-center font-sans select-none overflow-hidden"
    >
      {/* Phone Hardware Shell with Titanium Bezel on Desktop & Fullscreen on Mobile */}
      <div className="relative w-full h-full sm:max-w-[420px] sm:h-[92vh] sm:max-h-[890px] sm:rounded-[52px] sm:border-[10px] sm:border-zinc-800 sm:shadow-[0_25px_70px_rgba(0,0,0,0.9),0_0_0_2px_rgba(255,255,255,0.08)] bg-[#090a0f] flex flex-col overflow-hidden sm:ring-1 sm:ring-zinc-700/50">
        
        {/* Mobile Top Status Bar */}
        <header
          onClick={() => setIsControlShadeOpen((prev) => !prev)}
          className="h-11 px-5 bg-black/50 backdrop-blur-md flex items-center justify-between z-40 cursor-pointer border-b border-white/5 active:bg-white/5 transition shrink-0"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono tracking-tight text-white">{currentTime}</span>
          </div>

          {/* Dynamic Island / Privacy Camera Notch */}
          <div className="px-3.5 py-1 rounded-full bg-black border border-zinc-800/80 flex items-center gap-2 shadow-inner">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
              <span className="w-1 h-1 rounded-full bg-cyan-400" />
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-300">LFP Phone</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-300 font-mono">
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">
              {lfpSettings.cellularNetwork || "5G"}
            </span>
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <div className="flex items-center gap-1">
              <span className="text-[10px]">{lfpSettings.batteryLevel ?? 96}%</span>
              <Battery className="w-3.5 h-3.5 text-zinc-300 fill-zinc-300" />
            </div>
          </div>
        </header>

      {/* Control Shade / Notification Panel (Swipe down equivalent) */}
      {isControlShadeOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-2xl flex flex-col p-4 animate-in fade-in slide-in-from-top-4"
          onClick={() => setIsControlShadeOpen(false)}
        >
          <div
            className="max-w-md w-full mx-auto bg-zinc-900/95 border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  Central LFP Mobile
                </h3>
                <p className="text-[11px] text-zinc-400">Controles rápidos do smartphone</p>
              </div>
              <button
                onClick={() => setIsControlShadeOpen(false)}
                className="p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Toggle Tiles */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setFirewallActive(!firewallActive)}
                className={`p-3 rounded-2xl border flex items-center gap-3 text-left transition ${
                  firewallActive
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : "bg-zinc-800/80 border-zinc-700 text-zinc-400"
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
                <div>
                  <p className="text-xs font-bold">Firewall</p>
                  <p className="text-[10px] opacity-80">{firewallActive ? "Protegido" : "Desativado"}</p>
                </div>
              </button>

              <button
                onClick={() => setTorRouting(!torRouting)}
                className={`p-3 rounded-2xl border flex items-center gap-3 text-left transition ${
                  torRouting
                    ? "bg-purple-500/20 border-purple-500/40 text-purple-300"
                    : "bg-zinc-800/80 border-zinc-700 text-zinc-400"
                }`}
              >
                <Globe className="w-5 h-5" />
                <div>
                  <p className="text-xs font-bold">Tor Celular</p>
                  <p className="text-[10px] opacity-80">{torRouting ? "Ativo (5G Tor)" : "Direto"}</p>
                </div>
              </button>

              <button
                onClick={() => setStealthMode(!stealthMode)}
                className={`p-3 rounded-2xl border flex items-center gap-3 text-left transition ${
                  stealthMode
                    ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
                    : "bg-zinc-800/80 border-zinc-700 text-zinc-400"
                }`}
              >
                <Radio className="w-5 h-5" />
                <div>
                  <p className="text-xs font-bold">Modo Stealth</p>
                  <p className="text-[10px] opacity-80">{stealthMode ? "Oculto" : "Visível"}</p>
                </div>
              </button>

              <button
                onClick={() => setCamMicBlocked(!camMicBlocked)}
                className={`p-3 rounded-2xl border flex items-center gap-3 text-left transition ${
                  camMicBlocked
                    ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
                    : "bg-zinc-800/80 border-zinc-700 text-zinc-400"
                }`}
              >
                <Lock className="w-5 h-5" />
                <div>
                  <p className="text-xs font-bold">Cam / Mic</p>
                  <p className="text-[10px] opacity-80">{camMicBlocked ? "Travados" : "Liberados"}</p>
                </div>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 border-t border-zinc-800 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setIsControlShadeOpen(false);
                  onExitLfp();
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition text-center"
              >
                💻 Modo Computador
              </button>
              <button
                onClick={() => {
                  setIsControlShadeOpen(false);
                  onTriggerPanic();
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition flex items-center gap-1.5 shadow-lg shadow-rose-600/30"
              >
                <Flame className="w-4 h-4" />
                Pânico SOS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main View Area: Either an Open Full-Screen App or the Native Phone Home Screen */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {activeMobileApp ? (
          /* Fullscreen Mobile App View */
          <div className="w-full h-full flex flex-col bg-zinc-950 animate-in fade-in duration-150">
            {/* Native Mobile App Header with Back Bar */}
            <div className="h-11 px-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between shrink-0">
              <button
                onClick={handleCloseActiveApp}
                className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 p-1 -ml-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Início</span>
              </button>
              <span className="text-xs font-bold text-white truncate max-w-[180px]">
                {APP_REGISTRY[activeMobileApp]?.name || activeMobileApp}
              </span>
              <button
                onClick={() => setIsMultitaskOpen(true)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
                title="Multitarefa"
              >
                <Layers className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Rendered App Content */}
            <div className="flex-1 overflow-y-auto">
              {renderMobileAppContent(activeMobileApp)}
            </div>
          </div>
        ) : (
          /* Native Phone Home Screen */
          <div className="w-full h-full flex flex-col justify-between p-5 overflow-y-auto">
            {/* Top Widget: Clock & Security Status */}
            <div className="space-y-4 pt-2">
              <div className="text-center space-y-1">
                <h1 className="text-5xl font-extrabold font-mono tracking-tight text-white drop-shadow-md">
                  {currentTime}
                </h1>
                <p className="text-xs font-medium text-zinc-400 capitalize">{currentDate}</p>
              </div>

              {/* Lobaite Security Glance Card */}
              <div
                onClick={() => handleLaunchApp("shield")}
                className="p-4 rounded-3xl bg-zinc-900/80 border border-zinc-800/80 backdrop-blur-xl flex items-center justify-between shadow-xl cursor-pointer hover:border-emerald-500/40 transition active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      Lobaite Shield Mobile
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      {trackersBlocked} ameaças bloqueadas • Tor 5G
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500" />
              </div>

              {/* Search Bar Widget */}
              <div
                onClick={() => setIsAppDrawerOpen(true)}
                className="px-4 py-2.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 flex items-center gap-2.5 text-xs text-zinc-400 cursor-pointer hover:bg-zinc-900 transition"
              >
                <Search className="w-4 h-4 text-cyan-400" />
                <span>Pesquisar apps ou comandos...</span>
              </div>
            </div>

            {/* Home Screen App Grid (4x3 style) */}
            <div className="grid grid-cols-4 gap-y-5 gap-x-2 my-auto py-4">
              {MOBILE_APP_LIST.slice(0, 8).map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleLaunchApp(app.id)}
                  className="flex flex-col items-center gap-1.5 group active:scale-90 transition transform"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg ${app.bg} group-hover:scale-105 transition`}
                  >
                    <app.icon className={`w-7 h-7 ${app.color}`} />
                  </div>
                  <span className="text-[11px] font-medium text-zinc-200 tracking-tight truncate max-w-[72px] text-center">
                    {app.name}
                  </span>
                </button>
              ))}
            </div>

            {/* Bottom Pinned App Dock for Phones */}
            <div className="w-full max-w-sm mx-auto p-3 rounded-3xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-2xl flex items-center justify-around shadow-2xl mb-1">
              {DOCK_APPS.map((app) => (
                <button
                  key={app.id}
                  onClick={() => handleLaunchApp(app.id)}
                  className="flex flex-col items-center gap-1 active:scale-90 transition transform"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${app.bg}`}
                  >
                    <app.icon className={`w-6 h-6 ${app.color}`} />
                  </div>
                </button>
              ))}
              <button
                onClick={() => setIsAppDrawerOpen(true)}
                className="w-12 h-12 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 active:scale-90 transition"
                title="Todos os Aplicativos"
              >
                <Grid className="w-6 h-6 text-cyan-400" />
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Mobile App Drawer (All Apps Drawer) */}
      {isAppDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col p-4 animate-in fade-in slide-in-from-bottom-6"
          onClick={() => setIsAppDrawerOpen(false)}
        >
          <div
            className="w-full max-w-md mx-auto flex-1 flex flex-col space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  placeholder="Pesquisar aplicativo..."
                  autoFocus
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <button
                onClick={() => setIsAppDrawerOpen(false)}
                className="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List / Grid of Apps */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredDrawerApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => handleLaunchApp(app.id)}
                  className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800/80 flex items-center justify-between cursor-pointer hover:border-cyan-500/40 active:scale-[0.99] transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border ${app.bg}`}
                    >
                      <app.icon className={`w-5 h-5 ${app.color}`} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{app.name}</h4>
                      <p className="text-[11px] text-zinc-400">{app.desc}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Multitask Switcher (App Cards View) */}
      {isMultitaskOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col p-5 animate-in fade-in"
          onClick={() => setIsMultitaskOpen(false)}
        >
          <div className="w-full max-w-md mx-auto flex-1 flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Multitarefa & Apps Recentes
              </h3>
              <button
                onClick={() => setIsMultitaskOpen(false)}
                className="p-1 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 overflow-y-auto py-4">
              {recentApps.map((id) => {
                const appMeta = MOBILE_APP_LIST.find((a) => a.id === id);
                if (!appMeta) return null;
                return (
                  <div
                    key={id}
                    onClick={() => handleLaunchApp(id)}
                    className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between h-36 cursor-pointer hover:border-cyan-500/50 transition active:scale-95"
                  >
                    <div className="flex items-center gap-2">
                      <appMeta.icon className={`w-4 h-4 ${appMeta.color}`} />
                      <span className="text-xs font-bold text-white truncate">{appMeta.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400">Tocar para abrir</span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                setActiveMobileApp(null);
                setIsMultitaskOpen(false);
              }}
              className="w-full py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white text-center transition"
            >
              Fechar Todos & Ir para a Tela de Início
            </button>
          </div>
        </div>
      )}

        {/* Bottom Phone Gesture Navigation Bar (Back, Home, Multitask) */}
        <footer className="h-12 bg-black/60 backdrop-blur-md flex items-center justify-around px-6 z-40 border-t border-white/5 shrink-0">
          {/* Back Button */}
          <button
            onClick={() => {
              if (activeMobileApp) {
                handleCloseActiveApp();
              } else if (isAppDrawerOpen) {
                setIsAppDrawerOpen(false);
              } else if (isMultitaskOpen) {
                setIsMultitaskOpen(false);
              }
            }}
            className="p-2 text-zinc-400 hover:text-white active:scale-90 transition"
            title="Voltar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Central Home Gesture Pill */}
          <button
            onClick={() => {
              setActiveMobileApp(null);
              setIsAppDrawerOpen(false);
              setIsMultitaskOpen(false);
            }}
            className="w-28 h-1.5 rounded-full bg-zinc-600 hover:bg-white active:scale-95 transition"
            title="Início"
          />

          {/* Multitask Button */}
          <button
            onClick={() => setIsMultitaskOpen((prev) => !prev)}
            className="p-2 text-zinc-400 hover:text-white active:scale-90 transition"
            title="Multitarefa"
          >
            <Layers className="w-5 h-5" />
          </button>
        </footer>
      </div>
    </div>
  );
};
