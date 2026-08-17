import React, { useState, useEffect } from "react";
import { AppId, SecurityIncident, SystemEdition, SystemTheme, WindowState } from "./types";
import { APP_REGISTRY, INITIAL_SECURITY_INCIDENTS, THEMES } from "./utils/systemData";
import { TopBar } from "./components/Desktop/TopBar";
import { Dock } from "./components/Desktop/Dock";
import { WindowManager } from "./components/Desktop/WindowManager";
import { LockScreen } from "./components/Desktop/LockScreen";
import { SpotlightSearch } from "./components/Desktop/SpotlightSearch";
import { ControlCenter } from "./components/Desktop/ControlCenter";
import { GrubBootloader } from "./components/System/GrubBootloader";
import { LoTTYScreen } from "./components/System/LoTTYScreen";
import { LinuxMemoryTest } from "./components/System/LinuxMemoryTest";
import { BiosWebSettings } from "./components/System/BiosWebSettings";
import { CatEfiBios } from "./components/System/CatEfiBios";
import { CatrootCefiExplorer } from "./components/System/CatrootCefiExplorer";
import { EfiRunnerModal } from "./components/System/EfiRunnerModal";
import { BiosUpgradeExperience } from "./components/System/BiosUpgradeExperience";
import { EfiExecutable } from "./lib/efiStorage";
import { Sparkles, ArrowRight, ShieldCheck, Cpu } from "lucide-react";

export default function App() {
  // Global Desktop State
  const [theme, setTheme] = useState<SystemTheme>(THEMES[0]);
  const [systemEdition, setSystemEdition] = useState<SystemEdition>("standard");
  const [isLocked, setIsLocked] = useState(false);
  const [lockPin, setLockPin] = useState("1337");
  const [autoLockMinutes, setAutoLockMinutes] = useState(15);
  const [clipboardAutoClear, setClipboardAutoClear] = useState(true);

  // BIOS Types & Updates State (BW vs catEFI)
  const [activeBiosType, setActiveBiosType] = useState<"BW" | "catefi">(() => {
    try {
      return (localStorage.getItem("lobaite_bios_type") as "BW" | "catefi") || "BW";
    } catch {
      return "BW";
    }
  });
  const [showBiosUpdateModal, setShowBiosUpdateModal] = useState(false);
  const [isUpdatingBios, setIsUpdatingBios] = useState(false);

  // System Modes (GRUB Bootloader, LoTTY Console, Memory Test, BIOS Web, ROOT status)
  const [isGrubMode, setIsGrubMode] = useState(false);
  const [isTtyMode, setIsTtyMode] = useState(false);
  const [isMemtestMode, setIsMemtestMode] = useState(false);
  const [isBiosMode, setIsBiosMode] = useState(false);
  const [isCefiExplorerOpen, setIsCefiExplorerOpen] = useState(false);
  const [runningEfiExecutable, setRunningEfiExecutable] = useState<EfiExecutable | null>(null);
  const [isRootDeleted, setIsRootDeleted] = useState<boolean>(() => {
    try {
      return localStorage.getItem("lobaite_root_deleted") === "true";
    } catch {
      return false;
    }
  });

  const handleSetRootDeleted = (deleted: boolean) => {
    setIsRootDeleted(deleted);
    try {
      localStorage.setItem("lobaite_root_deleted", deleted ? "true" : "false");
    } catch {
      // ignore
    }
  };

  const handleApplyBiosUpgrade = () => {
    setShowBiosUpdateModal(false);
    setIsUpdatingBios(true);
  };

  const handleCompleteBiosUpgrade = () => {
    setActiveBiosType("catefi");
    try {
      localStorage.setItem("lobaite_bios_type", "catefi");
    } catch {
      // ignore
    }
    setIsUpdatingBios(false);
    // Open catEFI BIOS directly upon reboot!
    setIsBiosMode(true);
    setIsGrubMode(false);
    setIsTtyMode(false);
    setPanicToast("✨ Firmware catEFI (Catppuccin Mocha) gravada e inicializada com sucesso!");
    setTimeout(() => setPanicToast(null), 5000);
  };

  // Security Subsystem State
  const [firewallActive, setFirewallActive] = useState(true);
  const [stealthMode, setStealthMode] = useState(true);
  const [torRouting, setTorRouting] = useState(true);
  const [camMicBlocked, setCamMicBlocked] = useState(true);
  const [trackersBlocked, setTrackersBlocked] = useState(148);
  const [dnsProvider, setDnsProvider] = useState("Quad9");
  const [incidents, setIncidents] = useState<SecurityIncident[]>(INITIAL_SECURITY_INCIDENTS);

  // UI Drawers & Overlays
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [isControlCenterOpen, setIsControlCenterOpen] = useState(false);
  const [panicToast, setPanicToast] = useState<string | null>(null);

  // Windows State - pre-open WolfShield and Lobaire Guardian AI as welcoming first experience!
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: "win-shield",
      appId: "shield",
      title: APP_REGISTRY.shield.name,
      isMinimized: false,
      isMaximized: false,
      position: { x: 40, y: 55 },
      size: { width: 840, height: 560 },
      zIndex: 10,
    },
    {
      id: "win-guardian",
      appId: "guardian",
      title: APP_REGISTRY.guardian.name,
      isMinimized: false,
      isMaximized: false,
      position: { x: 260, y: 80 },
      size: { width: 760, height: 550 },
      zIndex: 11,
    },
  ]);

  const [activeWindowId, setActiveWindowId] = useState<string | null>("win-guardian");

  // Keyboard Shortcuts (Ctrl+K, Cmd+K, Ctrl+L, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSpotlightOpen((prev) => !prev);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "l") {
        e.preventDefault();
        setIsLocked(true);
      }
      if (e.key === "Escape") {
        setIsSpotlightOpen(false);
        setIsControlCenterOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Window Management Actions
  const handleOpenApp = (appId: AppId) => {
    // If already open, restore and focus
    const existing = windows.find((w) => w.appId === appId);
    if (existing) {
      const highestZ = Math.max(...windows.map((w) => w.zIndex), 10) + 1;
      setWindows((prev) =>
        prev.map((w) =>
          w.id === existing.id ? { ...w, isMinimized: false, zIndex: highestZ } : w
        )
      );
      setActiveWindowId(existing.id);
      return;
    }

    // Otherwise create new window
    const meta = APP_REGISTRY[appId];
    const highestZ = Math.max(...windows.map((w) => w.zIndex), 10) + 1;
    const cascadeOffset = (windows.length % 6) * 25;

    const newWindow: WindowState = {
      id: "win-" + appId + "-" + Date.now(),
      appId,
      title: meta.name,
      isMinimized: false,
      isMaximized: false,
      position: {
        x: Math.max(20, Math.min(window.innerWidth - meta.defaultWidth - 20, 80 + cascadeOffset)),
        y: Math.max(50, 60 + cascadeOffset),
      },
      size: {
        width: Math.min(window.innerWidth - 40, meta.defaultWidth),
        height: Math.min(window.innerHeight - 100, meta.defaultHeight),
      },
      zIndex: highestZ,
    };

    setWindows((prev) => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
  };

  const handleFocusWindow = (id: string) => {
    const highestZ = Math.max(...windows.map((w) => w.zIndex), 10) + 1;
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: highestZ } : w))
    );
    setActiveWindowId(id);
  };

  const handleCloseWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      const remaining = windows.filter((w) => w.id !== id && !w.isMinimized);
      if (remaining.length > 0) {
        setActiveWindowId(remaining[remaining.length - 1].id);
      } else {
        setActiveWindowId(null);
      }
    }
  };

  const handleMinimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    if (activeWindowId === id) {
      const remaining = windows.filter((w) => w.id !== id && !w.isMinimized);
      setActiveWindowId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  };

  const handleToggleMaximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w))
    );
  };

  const handleUpdateWindowPosition = (id: string, pos: { x: number; y: number }) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, position: pos } : w))
    );
  };

  const handleTriggerPanic = () => {
    // 1. Close all sensitive documents and clear clipboard
    navigator.clipboard.writeText("");
    // 2. Lock screen
    setIsLocked(true);
    // 3. Show panic toast
    setPanicToast("🚨 Protocolo de Pânico: Memória RAM volátil expurgada e terminal travado.");
    setTimeout(() => setPanicToast(null), 5000);
  };

  const activeWindow = windows.find((w) => w.id === activeWindowId) || null;

  return (
    <div
      id="lobaire-desktop-root"
      className="relative w-screen h-screen overflow-hidden font-sans select-none flex flex-col"
      style={{
        background: theme.bgGradient,
        color: theme.textColor,
      }}
    >
      {/* Subtle Geometric Cyber-Wolf Background Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Subtle Central Wolf Silhouette Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <span className="text-[28rem] font-bold select-none">🐺</span>
      </div>

      {/* Top Menu Bar */}
      <TopBar
        theme={theme}
        activeWindow={activeWindow}
        firewallActive={firewallActive}
        stealthMode={stealthMode}
        torRouting={torRouting}
        camMicBlocked={camMicBlocked}
        trackersBlocked={trackersBlocked}
        systemEdition={systemEdition}
        onToggleSystemEdition={() =>
          setSystemEdition((prev) => (prev === "standard" ? "locomunite" : "standard"))
        }
        onLockScreen={() => setIsLocked(true)}
        onTriggerPanic={handleTriggerPanic}
        onOpenSpotlight={() => setIsSpotlightOpen(true)}
        onToggleControlCenter={() => setIsControlCenterOpen(!isControlCenterOpen)}
        isControlCenterOpen={isControlCenterOpen}
        onOpenApp={handleOpenApp}
      />

      {/* Desktop Canvas / Window Manager */}
      <main className="relative flex-1 overflow-hidden">
        <WindowManager
          windows={windows}
          activeWindowId={activeWindowId}
          onFocusWindow={handleFocusWindow}
          onCloseWindow={handleCloseWindow}
          onMinimizeWindow={handleMinimizeWindow}
          onToggleMaximizeWindow={handleToggleMaximizeWindow}
          onUpdateWindowPosition={handleUpdateWindowPosition}
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
          systemEdition={systemEdition}
          setSystemEdition={setSystemEdition}
          currentTheme={theme}
          setCurrentTheme={setTheme}
          lockPin={lockPin}
          setLockPin={setLockPin}
          autoLockMinutes={autoLockMinutes}
          setAutoLockMinutes={setAutoLockMinutes}
          clipboardAutoClear={clipboardAutoClear}
          setClipboardAutoClear={setClipboardAutoClear}
          onTriggerPanic={handleTriggerPanic}
          onOpenApp={handleOpenApp}
          onRestartGrub={() => setIsGrubMode(true)}
          onOpenTTY={() => {
            setIsLocked(false);
            setIsTtyMode(true);
          }}
          onOpenCefiVault={() => setIsCefiExplorerOpen(true)}
          isRootDeleted={isRootDeleted}
          setIsRootDeleted={handleSetRootDeleted}
        />
      </main>

      {/* Minimalist Floating Dock */}
      <Dock
        openWindows={windows}
        activeWindowId={activeWindowId}
        onOpenApp={handleOpenApp}
        onToggleSpotlight={() => setIsSpotlightOpen(true)}
        onTriggerPanic={handleTriggerPanic}
      />

      {/* Spotlight Command Palette (Ctrl+K) */}
      <SpotlightSearch
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        onOpenApp={handleOpenApp}
        onTriggerPanic={handleTriggerPanic}
      />

      {/* Control Center Drawer */}
      <ControlCenter
        isOpen={isControlCenterOpen}
        onClose={() => setIsControlCenterOpen(false)}
        firewallActive={firewallActive}
        setFirewallActive={setFirewallActive}
        stealthMode={stealthMode}
        setStealthMode={setStealthMode}
        torRouting={torRouting}
        setTorRouting={setTorRouting}
        camMicBlocked={camMicBlocked}
        setCamMicBlocked={setCamMicBlocked}
        dnsProvider={dnsProvider}
        onLockScreen={() => setIsLocked(true)}
        onTriggerPanic={handleTriggerPanic}
      />

      {/* Security Lock Screen */}
      <LockScreen
        isLocked={isLocked}
        onUnlock={() => setIsLocked(false)}
        correctPin={lockPin}
        onTriggerPanic={handleTriggerPanic}
      />

      {/* GRUB Bootloader Overlay */}
      <GrubBootloader
        isOpen={isGrubMode}
        onBootDesktop={() => {
          setIsGrubMode(false);
          setIsTtyMode(false);
          setIsMemtestMode(false);
          setIsBiosMode(false);
        }}
        onBootTTY={() => {
          setIsGrubMode(false);
          setIsTtyMode(true);
        }}
        onBootMemtest={() => {
          setIsGrubMode(false);
          setIsMemtestMode(true);
        }}
        onBootBios={() => {
          setIsGrubMode(false);
          setIsBiosMode(true);
        }}
      />

      {/* LoTTY Pure Console Overlay (dev/tty1) */}
      <LoTTYScreen
        isOpen={isTtyMode}
        onExitTTY={() => setIsTtyMode(false)}
        onRebootToGrub={() => {
          setIsTtyMode(false);
          setIsGrubMode(true);
        }}
        onOpenCefiVault={() => setIsCefiExplorerOpen(true)}
        isRootDeleted={isRootDeleted}
        setIsRootDeleted={handleSetRootDeleted}
      />

      {/* Linux Memory Test (Memtest86+) Overlay */}
      <LinuxMemoryTest
        isOpen={isMemtestMode}
        onExit={() => {
          setIsMemtestMode(false);
        }}
        onRebootGrub={() => {
          setIsMemtestMode(false);
          setIsGrubMode(true);
        }}
      />

      {/* BW (Bios Web) Setup Utility Overlay - BIOS ID: "WolfOS" */}
      <BiosWebSettings
        isOpen={isBiosMode && activeBiosType === "BW"}
        onExitBios={() => {
          setIsBiosMode(false);
          setIsGrubMode(true);
        }}
        onBootOption={(bootType) => {
          setIsBiosMode(false);
          if (bootType === "lobaite-2.0" || bootType === "normal") {
            setSystemEdition("standard");
            setIsTtyMode(false);
          } else if (bootType === "lobaire-legacy") {
            setSystemEdition("standard");
            setIsTtyMode(false);
            setPanicToast("⚠️ Inicializado em compatibilidade Lobaire 1.0.0 (DESCONTINUADO)");
            setTimeout(() => setPanicToast(null), 4000);
          } else if (bootType === "catroot") {
            // catroot shortcut triggers reboot into LobaiteOS with BIOS update prompt to catEFI!
            setIsTtyMode(false);
            setPanicToast("🔄 Reiniciando LobaiteOS 🐺 para verificar atualização da BIOS...");
            setTimeout(() => {
              setPanicToast(null);
              setShowBiosUpdateModal(true);
            }, 1800);
          }
        }}
      />

      {/* catEFI Modern Catppuccin Setup Utility Overlay - Root & Overclock */}
      <CatEfiBios
        isOpen={isBiosMode && activeBiosType === "catefi"}
        onExitBios={() => {
          setIsBiosMode(false);
          setIsGrubMode(true);
        }}
        onRestoreLegacyBw={() => {
          setActiveBiosType("BW");
          try {
            localStorage.setItem("lobaite_bios_type", "BW");
          } catch {
            // ignore
          }
          setPanicToast("⏪ Firmware revertida para a BIOS BW padrão (WolfOS)!");
          setTimeout(() => setPanicToast(null), 4000);
        }}
        onRunEfi={(exec) => {
          setRunningEfiExecutable(exec);
        }}
        onBootOption={(bootType) => {
          setIsBiosMode(false);
          if (bootType === "lobaite-2.0" || bootType === "normal") {
            setSystemEdition("standard");
            setIsTtyMode(false);
          } else if (bootType === "lobaire-legacy") {
            setSystemEdition("standard");
            setIsTtyMode(false);
            setPanicToast("⚠️ Inicializado em compatibilidade Lobaire 1.0.0 (DESCONTINUADO)");
            setTimeout(() => setPanicToast(null), 4000);
          } else if (bootType === "catroot") {
            setIsTtyMode(true);
          }
        }}
      />

      {/* Exclusive catroot /dev/BIOS/CEFI/ Hardware Vault Explorer */}
      <CatrootCefiExplorer
        isOpen={isCefiExplorerOpen}
        onClose={() => setIsCefiExplorerOpen(false)}
        onRunEfi={(exec) => {
          setRunningEfiExecutable(exec);
        }}
      />

      {/* .EFI Custom Executable Runner (Loaded from /dev/BIOS/CEFI/) */}
      <EfiRunnerModal
        isOpen={!!runningEfiExecutable}
        executable={runningEfiExecutable}
        onClose={() => setRunningEfiExecutable(null)}
      />

      {/* BIOS Update Available Notification Modal */}
      {showBiosUpdateModal && (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1e1e2e] border border-[#cba6f7]/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl font-mono text-xs text-[#cdd6f4] space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 border-b border-[#313244] pb-3">
              <div className="w-9 h-9 rounded-xl bg-[#cba6f7]/20 border border-[#cba6f7]/40 flex items-center justify-center text-lg">
                🐱
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#cba6f7]">
                  Atualização de BIOS Disponível • catEFI (Catppuccin)
                </h3>
                <p className="text-[11px] text-[#a6adc8]">
                  Substituir BIOS BW Legada pela nova Firmware catEFI Pro
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#181825] border border-[#313244] space-y-2">
              <p className="text-[#f9e2af] font-bold">Novidades do catEFI:</p>
              <ul className="list-disc pl-4 space-y-1 text-[#a6adc8] text-[11px]">
                <li>Interface minimalista baseada na paleta <strong>Catppuccin Mocha</strong>.</li>
                <li><strong>Nova Aba Root ⚡:</strong> Controle de Overclock de CPU (GHz), tensão VCore e suporte para carregar binários customizados <code>.efi</code>.</li>
                <li>Identificador de BIOS oficial preservado: <code>ID:"WolfOS"</code>.</li>
              </ul>
            </div>

            {isUpdatingBios ? (
              <div className="space-y-2 pt-2 text-center">
                <div className="flex items-center justify-center gap-2 text-[#cba6f7] font-bold">
                  <div className="w-4 h-4 border-2 border-[#cba6f7] border-t-transparent rounded-full animate-spin" />
                  <span>Gravando firmware catEFI na ROM WolfOS...</span>
                </div>
                <p className="text-[10px] text-[#6c7086]">Por favor não desligue o sistema.</p>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowBiosUpdateModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#313244] hover:bg-[#45475a] text-[#a6adc8] transition font-bold"
                >
                  Lembrar Mais Tarde
                </button>
                <button
                  onClick={handleApplyBiosUpgrade}
                  className="px-4 py-2 rounded-xl bg-[#cba6f7] text-[#11111b] hover:bg-[#b4befe] transition font-bold flex items-center gap-2 shadow-lg shadow-[#cba6f7]/25"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Atualizar para catEFI</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Cinematic BIOS Upgrade Experience (Terminals swarm -> Black screen with Lobaite Logo & 50% bar -> Reboot catEFI) */}
      <BiosUpgradeExperience
        isOpen={isUpdatingBios}
        onComplete={handleCompleteBiosUpgrade}
      />

      {/* Panic Notification Banner */}
      {panicToast && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-rose-950/90 border border-rose-500/50 text-rose-200 text-xs font-mono shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-3">
          {panicToast}
        </div>
      )}
    </div>
  );
}
