import React, { useState, useRef } from "react";
import {
  X,
  Minus,
  Maximize2,
  Minimize2,
  Lock,
  Shield,
} from "lucide-react";
import { AppId, SecurityIncident, SystemEdition, SystemTheme, WindowState } from "../../types";
import { WolfShieldApp } from "../Apps/WolfShieldApp";
import { LobaireGuardianApp } from "../Apps/LobaireGuardianApp";
import { WolfVaultApp } from "../Apps/WolfVaultApp";
import { GhostBrowseApp } from "../Apps/GhostBrowseApp";
import { WolfFilesApp } from "../Apps/WolfFilesApp";
import { WolfShellApp } from "../Apps/WolfShellApp";
import { StealthNotesApp } from "../Apps/StealthNotesApp";
import { ThreatMonitorApp } from "../Apps/ThreatMonitorApp";
import { SystemSettingsApp } from "../Apps/SystemSettingsApp";
import { LoComuniteApp } from "../Apps/LoComuniteApp";

interface WindowManagerProps {
  windows: WindowState[];
  activeWindowId: string | null;
  onFocusWindow: (id: string) => void;
  onCloseWindow: (id: string) => void;
  onMinimizeWindow: (id: string) => void;
  onToggleMaximizeWindow: (id: string) => void;
  onUpdateWindowPosition: (id: string, pos: { x: number; y: number }) => void;

  // System State Props for Apps
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
  incidents: SecurityIncident[];
  dnsProvider: string;
  setDnsProvider: React.Dispatch<React.SetStateAction<string>>;
  systemEdition?: SystemEdition;
  setSystemEdition?: React.Dispatch<React.SetStateAction<SystemEdition>>;
  currentTheme: SystemTheme;
  setCurrentTheme: (theme: SystemTheme) => void;
  lockPin: string;
  setLockPin: (pin: string) => void;
  autoLockMinutes: number;
  setAutoLockMinutes: (min: number) => void;
  clipboardAutoClear: boolean;
  setClipboardAutoClear: (clear: boolean) => void;
  onTriggerPanic: () => void;
  onOpenApp: (appId: string) => void;
  onRestartGrub?: () => void;
  onOpenTTY?: () => void;
  onOpenCefiVault?: () => void;
  isRootDeleted?: boolean;
  setIsRootDeleted?: (deleted: boolean) => void;
}

export const WindowManager: React.FC<WindowManagerProps> = ({
  windows,
  activeWindowId,
  onFocusWindow,
  onCloseWindow,
  onMinimizeWindow,
  onToggleMaximizeWindow,
  onUpdateWindowPosition,
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
  incidents,
  dnsProvider,
  setDnsProvider,
  systemEdition = "standard",
  setSystemEdition,
  currentTheme,
  setCurrentTheme,
  lockPin,
  setLockPin,
  autoLockMinutes,
  setAutoLockMinutes,
  clipboardAutoClear,
  setClipboardAutoClear,
  onTriggerPanic,
  onOpenApp,
  onRestartGrub,
  onOpenTTY,
  onOpenCefiVault,
  isRootDeleted,
  setIsRootDeleted,
}) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseDownHeader = (w: WindowState, e: React.MouseEvent) => {
    if (w.isMaximized) return;
    onFocusWindow(w.id);
    setDraggingId(w.id);
    dragOffsetRef.current = {
      x: e.clientX - w.position.x,
      y: e.clientY - w.position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId) return;
    const newX = Math.max(10, Math.min(window.innerWidth - 100, e.clientX - dragOffsetRef.current.x));
    const newY = Math.max(40, Math.min(window.innerHeight - 80, e.clientY - dragOffsetRef.current.y));
    onUpdateWindowPosition(draggingId, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const renderAppContent = (appId: AppId) => {
    switch (appId) {
      case "shield":
        return (
          <WolfShieldApp
            firewallActive={firewallActive}
            setFirewallActive={setFirewallActive}
            stealthMode={stealthMode}
            setStealthMode={setStealthMode}
            torRouting={torRouting}
            setTorRouting={setTorRouting}
            camMicBlocked={camMicBlocked}
            setCamMicBlocked={setCamMicBlocked}
            trackersBlocked={trackersBlocked}
            setTrackersBlocked={setTrackersBlocked}
            incidents={incidents}
            dnsProvider={dnsProvider}
            setDnsProvider={setDnsProvider}
          />
        );
      case "guardian":
        return <LobaireGuardianApp />;
      case "vault":
        return <WolfVaultApp />;
      case "ghostbrowse":
        return <GhostBrowseApp />;
      case "files":
        return <WolfFilesApp />;
      case "terminal":
        return (
          <WolfShellApp
            onTriggerPanic={onTriggerPanic}
            onOpenApp={onOpenApp}
            onRestartGrub={onRestartGrub}
            onOpenTTY={onOpenTTY}
            onOpenCefiVault={onOpenCefiVault}
            isRootDeleted={isRootDeleted}
            setIsRootDeleted={setIsRootDeleted}
            systemEdition={systemEdition}
            setSystemEdition={setSystemEdition}
          />
        );
      case "notes":
        return <StealthNotesApp />;
      case "monitor":
        return <ThreatMonitorApp />;
      case "settings":
        return (
          <SystemSettingsApp
            currentTheme={currentTheme}
            setCurrentTheme={setCurrentTheme}
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
        return <LoComuniteApp />;
      default:
        return <div className="p-6 text-slate-400">Aplicativo em execução.</div>;
    }
  };

  return (
    <div
      id="lobaire-window-manager"
      className="absolute inset-0 pointer-events-none overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {windows.map((w) => {
        if (w.isMinimized) return null;

        const isFocused = activeWindowId === w.id;

        return (
          <div
            key={w.id}
            onClick={() => onFocusWindow(w.id)}
            style={{
              position: "absolute",
              left: w.isMaximized ? 0 : w.position.x,
              top: w.isMaximized ? 36 : w.position.y,
              width: w.isMaximized ? "100vw" : w.size.width,
              height: w.isMaximized ? "calc(100vh - 36px - 64px)" : w.size.height,
              zIndex: w.zIndex,
            }}
            className={`pointer-events-auto flex flex-col rounded-2xl overflow-hidden border shadow-2xl backdrop-blur-2xl transition-shadow duration-200 ${
              isFocused
                ? "border-zinc-700/80 shadow-[0_25px_60px_rgba(0,0,0,0.85)]"
                : "border-zinc-800/80 opacity-95 shadow-lg"
            }`}
          >
            {/* Window Header Bar */}
            <div
              onMouseDown={(e) => handleMouseDownHeader(w, e)}
              className="h-10 px-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between cursor-move select-none"
            >
              {/* Traffic light control dots */}
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseWindow(w.id);
                  }}
                  className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition flex items-center justify-center group"
                  title="Fechar"
                >
                  <X className="w-2 h-2 text-rose-950 opacity-0 group-hover:opacity-100" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMinimizeWindow(w.id);
                  }}
                  className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-600 transition flex items-center justify-center group"
                  title="Minimizar"
                >
                  <Minus className="w-2 h-2 text-amber-950 opacity-0 group-hover:opacity-100" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMaximizeWindow(w.id);
                  }}
                  className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition flex items-center justify-center group"
                  title={w.isMaximized ? "Restaurar" : "Maximizar"}
                >
                  {w.isMaximized ? (
                    <Minimize2 className="w-2 h-2 text-emerald-950 opacity-0 group-hover:opacity-100" />
                  ) : (
                    <Maximize2 className="w-2 h-2 text-emerald-950 opacity-0 group-hover:opacity-100" />
                  )}
                </button>
              </div>

              {/* Title & Sandbox Badge */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-zinc-200">{w.title}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  SANDBOX
                </span>
              </div>

              {/* Right spacer / icon */}
              <div className="flex items-center gap-1 text-zinc-500">
                <Lock className="w-3 h-3 text-emerald-400" />
              </div>
            </div>

            {/* App Body Component Container */}
            <div className="flex-1 overflow-hidden bg-zinc-950/90 text-zinc-300">
              {renderAppContent(w.appId)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
