import React, { useState, useEffect } from "react";
import {
  Smartphone,
  RotateCw,
  X,
  Minus,
  Maximize2,
  ChevronLeft,
  Home,
  Menu,
  Wifi,
  Battery,
  ShieldCheck,
  Flame,
  Globe,
  Lock,
  Terminal,
  Bot,
  Folder,
  FileText,
  Activity,
  Sliders,
  Code2,
} from "lucide-react";
import { AppId, WindowState } from "../../types";
import { LfpSettings } from "../../lib/lfpStorage";

interface LfpPhoneShellProps {
  children: React.ReactNode;
  lfpSettings: LfpSettings;
  setLfpSettings: React.Dispatch<React.SetStateAction<LfpSettings>>;
  onCloseLfp: () => void;
  openWindows: WindowState[];
  activeWindowId: string | null;
  onOpenApp: (appId: AppId) => void;
  onCloseWindow: (id: string) => void;
  onTriggerPanic: () => void;
}

export const LfpPhoneShell: React.FC<LfpPhoneShellProps> = ({
  children,
  lfpSettings,
  setLfpSettings,
  onCloseLfp,
  openWindows,
  activeWindowId,
  onOpenApp,
  onCloseWindow,
  onTriggerPanic,
}) => {
  const [currentTime, setCurrentTime] = useState("");
  const [appSwitcherOpen, setAppSwitcherOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setCurrentTime(
        d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleOrientation = () => {
    setLfpSettings((prev) => {
      const nextOrient = prev.orientation === "portrait" ? "landscape" : "portrait";
      const next = { ...prev, orientation: nextOrient };
      try {
        localStorage.setItem("lobaite_lfp_settings", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const isLandscape = lfpSettings.orientation === "landscape";

  // Dimensions based on frame
  let frameWidth = "max-w-[410px]";
  let frameHeight = "h-[860px]";

  if (lfpSettings.activeDeviceFrame === "foldable") {
    frameWidth = isLandscape ? "max-w-[860px]" : "max-w-[620px]";
    frameHeight = isLandscape ? "h-[620px]" : "h-[840px]";
  } else if (lfpSettings.activeDeviceFrame === "compact") {
    frameWidth = isLandscape ? "max-w-[720px]" : "max-w-[360px]";
    frameHeight = isLandscape ? "h-[360px]" : "h-[740px]";
  } else if (isLandscape) {
    frameWidth = "max-w-[860px]";
    frameHeight = "h-[450px]";
  }

  return (
    <div className="fixed inset-0 z-[45] bg-black/85 backdrop-blur-xl flex flex-col items-center justify-center p-2 select-none font-sans animate-in fade-in duration-200">
      {/* Floating LFP Top Control Bar */}
      <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-2xl mb-2 text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-bold text-white">LFP Phone Mode</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            {lfpSettings.activeDeviceFrame.toUpperCase()}
          </span>
        </div>

        <div className="w-[1px] h-4 bg-zinc-700 mx-1" />

        {/* Rotate Button */}
        <button
          onClick={toggleOrientation}
          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition flex items-center gap-1 text-[11px]"
          title="Alternar Orientação (Retrato / Paisagem)"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>{isLandscape ? "Paisagem" : "Retrato"}</span>
        </button>

        {/* Exit LFP Mode Button */}
        <button
          onClick={onCloseLfp}
          className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 transition text-[11px] font-bold"
        >
          Sair do LFP
        </button>
      </div>

      {/* The Physical Mobile Device Frame */}
      <div
        className={`relative w-full ${frameWidth} ${frameHeight} max-h-[92vh] rounded-[44px] bg-zinc-950 border-[10px] border-zinc-800 shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_20px_rgba(56,189,248,0.2)] flex flex-col overflow-hidden transition-all duration-300`}
      >
        {/* Dynamic Island / Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 px-5 py-1.5 rounded-full bg-black border border-zinc-800/80 shadow-md flex items-center justify-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-800 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-indigo-500/80" />
          </div>
          <span className="text-[9px] font-mono text-zinc-400 font-bold">LOBAITE 🐺</span>
        </div>

        {/* Mobile Status Bar */}
        <div className="h-9 px-6 pt-1.5 flex items-center justify-between text-[11px] font-semibold text-zinc-200 bg-zinc-950 z-40">
          <span>{currentTime || "12:00"}</span>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[10px] font-mono text-purple-400">{lfpSettings.cellularNetwork}</span>
            <Wifi className="w-3.5 h-3.5 text-zinc-300" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono text-emerald-400">{lfpSettings.batteryLevel}%</span>
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Screen Viewport Container */}
        <div className="flex-1 relative overflow-hidden bg-zinc-950 flex flex-col">
          {children}

          {/* App Switcher Drawer if triggered */}
          {appSwitcherOpen && (
            <div
              className="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl p-4 flex flex-col justify-between animate-in fade-in"
              onClick={() => setAppSwitcherOpen(false)}
            >
              <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Menu className="w-3.5 h-3.5 text-cyan-400" />
                    LFP App Switcher
                  </h3>
                  <button
                    onClick={() => setAppSwitcherOpen(false)}
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-[60vh] p-1">
                  {openWindows.map((win) => (
                    <div
                      key={win.id}
                      onClick={() => {
                        setAppSwitcherOpen(false);
                      }}
                      className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col justify-between h-28 cursor-pointer hover:border-cyan-500/50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white truncate max-w-[100px]">
                          {win.title}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCloseWindow(win.id);
                          }}
                          className="text-zinc-500 hover:text-rose-400 p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400">Tocar para focar</span>
                    </div>
                  ))}
                  {openWindows.length === 0 && (
                    <p className="col-span-2 text-center text-xs text-zinc-500 py-6">
                      Nenhum app aberto em segundo plano
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Launch Icons */}
              <div className="pt-2 border-t border-zinc-800 flex items-center justify-around" onClick={(e) => e.stopPropagation()}>
                {[
                  { id: "shield", icon: ShieldCheck, color: "text-emerald-400" },
                  { id: "guardian", icon: Bot, color: "text-sky-400" },
                  { id: "ghostbrowse", icon: Globe, color: "text-purple-400" },
                  { id: "terminal", icon: Terminal, color: "text-rose-400" },
                  { id: "lfp", icon: Smartphone, color: "text-cyan-400" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onOpenApp(item.id as AppId);
                      setAppSwitcherOpen(false);
                    }}
                    className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
                  >
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Navigation Gesture Bar (Bottom Pill) */}
        <div className="h-8 bg-zinc-950 flex items-center justify-between px-8 z-40 border-t border-zinc-900/60">
          <button
            onClick={() => {
              if (activeWindowId) {
                onCloseWindow(activeWindowId);
              }
            }}
            className="p-1 text-zinc-400 hover:text-white transition"
            title="Voltar / Fechar App Atual"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Home Gesture Pill */}
          <button
            onClick={() => {
              // Minimize all or go to home screen
              setAppSwitcherOpen((prev) => !prev);
            }}
            className="w-28 h-1.5 rounded-full bg-zinc-600 hover:bg-zinc-400 transition active:scale-95"
            title="Home / Alternador de Apps LFP"
          />

          <button
            onClick={() => setAppSwitcherOpen((prev) => !prev)}
            className="p-1 text-zinc-400 hover:text-white transition"
            title="Multitarefa LFP"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
