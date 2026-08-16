import React from "react";
import {
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
  LayoutGrid,
  Code2,
} from "lucide-react";
import { AppId, WindowState } from "../../types";
import { APP_REGISTRY } from "../../utils/systemData";

interface DockProps {
  openWindows: WindowState[];
  activeWindowId: string | null;
  onOpenApp: (appId: AppId) => void;
  onToggleSpotlight: () => void;
  onTriggerPanic: () => void;
}

const ICON_MAP: Record<string, any> = {
  ShieldCheck,
  Bot,
  Lock,
  Globe,
  FolderLock: Folder,
  Terminal,
  FileText,
  Activity,
  Sliders,
  Code2,
};

export const Dock: React.FC<DockProps> = ({
  openWindows,
  activeWindowId,
  onOpenApp,
  onToggleSpotlight,
  onTriggerPanic,
}) => {
  const appKeys = Object.keys(APP_REGISTRY) as AppId[];

  return (
    <div
      id="lobaire-dock-container"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 select-none"
    >
      <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl transition-all">
        {/* App Launcher / Spotlight */}
        <button
          onClick={onToggleSpotlight}
          className="group relative p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-850/80 transition-transform active:scale-95"
          title="WolfSearch & Launcher (Ctrl+K)"
        >
          <LayoutGrid className="w-5 h-5 text-sky-400 group-hover:rotate-12 transition-transform" />
          {/* Tooltip */}
          <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-100 opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none shadow-lg">
            WolfLauncher (Ctrl+K)
          </span>
        </button>

        <div className="w-[1px] h-6 bg-zinc-800 my-auto mx-1" />

        {/* Core Apps */}
        {appKeys.map((appId) => {
          const appMeta = APP_REGISTRY[appId];
          const IconComponent = ICON_MAP[appMeta.icon] || ShieldCheck;
          const isRunning = openWindows.some((w) => w.appId === appId && !w.isMinimized);
          const isFocused = openWindows.some((w) => w.appId === appId && w.id === activeWindowId && !w.isMinimized);

          return (
            <button
              key={appId}
              onClick={() => onOpenApp(appId)}
              className={`group relative p-2.5 rounded-xl transition-all duration-200 hover:-translate-y-1.5 active:scale-90 flex flex-col items-center ${
                isFocused
                  ? "bg-zinc-800/90 text-white shadow-lg shadow-sky-500/10 border border-sky-500/30"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <IconComponent className="w-5 h-5" />

              {/* Running indicator dot */}
              <div
                className={`w-1 h-1 rounded-full mt-1 transition-all ${
                  isRunning
                    ? "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)] scale-100"
                    : "bg-transparent scale-0"
                }`}
              />

              {/* Tooltip */}
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] font-medium text-zinc-100 opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none shadow-xl">
                {appMeta.name}
              </span>
            </button>
          );
        })}

        <div className="w-[1px] h-6 bg-zinc-800 my-auto mx-1" />

        {/* Panic Button */}
        <button
          onClick={onTriggerPanic}
          className="group relative p-2.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-transform active:scale-95"
          title="Protocolo Pânico (Wipe Imediato)"
        >
          <Flame className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-rose-950 border border-rose-800 text-[10px] font-mono text-rose-200 opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none shadow-lg">
            🚨 Protocolo Pânico
          </span>
        </button>
      </div>
    </div>
  );
};
