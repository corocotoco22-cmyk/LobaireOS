import React, { useState, useEffect } from "react";
import { Terminal, RefreshCw, Power, ArrowUp, ArrowDown, CornerDownLeft } from "lucide-react";

interface GrubBootloaderProps {
  isOpen: boolean;
  onBootDesktop: () => void;
  onBootTTY: () => void;
  onBootMemtest: () => void;
  onBootBios: () => void;
}

export const GrubBootloader: React.FC<GrubBootloaderProps> = ({
  isOpen,
  onBootDesktop,
  onBootTTY,
  onBootMemtest,
  onBootBios,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [countdown, setCountdown] = useState(6);
  const [isBooting, setIsBooting] = useState(false);
  const [bootLogs, setBootLogs] = useState<string[]>([]);

  const grubEntries = [
    {
      id: "lobaite-standard",
      title: "LobaiteOS 🐺 (v3.4.0-hardened) - Kobaire Web Engine",
      subtitle: "Inicialização gráfica padrão (LoLogin Desktop) com sandbox Zero-Trust",
      action: "desktop",
    },
    {
      id: "lobaite-locmdl",
      title: "LobaiteOS (Modo de Recuperação LoCmdL / Kobaire Core)",
      subtitle: "Inicializa direto no console virtual puro LoTTY (/dev/tty1)",
      action: "tty",
    },
    {
      id: "lobaite-safe",
      title: "LobaiteOS Fallback / Memory Test (Safe Mode)",
      subtitle: "Abre o teste clássico de memória RAM (Memtest86+ das distros Linux)",
      action: "memtest",
    },
    {
      id: "uefi-firmware",
      title: "UEFI Firmware Settings / LoComunite Live Node",
      subtitle: 'Abre a BIOS Web (BW) do LobaiteOS com Boot Manager (BIOS ID: "WolfOS")',
      action: "bios",
    },
  ];

  useEffect(() => {
    if (!isOpen) {
      setCountdown(6);
      setIsBooting(false);
      setBootLogs([]);
      setSelectedIndex(0);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerBoot(selectedIndex);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, selectedIndex]);

  useEffect(() => {
    if (!isOpen || isBooting) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % grubEntries.length);
        setCountdown(10); // reset countdown on interaction
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + grubEntries.length) % grubEntries.length);
        setCountdown(10);
      } else if (e.key === "Enter") {
        e.preventDefault();
        triggerBoot(selectedIndex);
      } else if (e.key === "c" || e.key === "C") {
        triggerBoot(1); // direct to recovery TTY
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, isBooting]);

  const triggerBoot = (index: number) => {
    setIsBooting(true);
    const entry = grubEntries[index];

    let logs: string[] = [];

    if (entry.action === "desktop") {
      logs = [
        `[    0.000000] GNU GRUB version 2.06-lobaite`,
        `[    0.002140] Booting: ${entry.title}`,
        `[    0.041200] Loading Kobaire WebOS Engine (TypeScript + React 18)...`,
        `[    0.124500] Initializing Web Crypto API (AES-256-GCM / SHA-256)...`,
        `[    0.281000] Loading Zero-Knowledge Sandbox & Process Isolator...`,
        `[    0.410200] Mounting /dev/shm (Volatile Zero-Trace RAM Vault)...`,
        `[    0.589100] Starting Lobaite Desktop Compositor & LoLogin Manager...`,
        `[    0.720000] System Ready. Starting graphical target...`,
      ];
    } else if (entry.action === "tty") {
      logs = [
        `[    0.000000] GNU GRUB version 2.06-lobaite`,
        `[    0.003120] Booting Recovery: Kobaire Core Subsystem`,
        `[    0.052100] Bypassing LoLogin Graphical Desktop Server...`,
        `[    0.142000] Initializing pure terminal console /dev/tty1 (LoTTY)...`,
        `[    0.320000] Mounting root filesystem in maintenance mode...`,
        `[    0.510000] LoTTY Terminal Ready. Spawning root shell...`,
      ];
    } else if (entry.action === "memtest") {
      logs = [
        `[    0.000000] Loading Memtest86+ v5.31b Standalone Diagnostic Binary...`,
        `[    0.010200] Probing memory map via e820 BIOS call (BIOS ID: "WolfOS")...`,
        `[    0.045000] 16384 MB detected. Initializing test vectors...`,
        `[    0.100000] Launching Linux Memory Test Suite...`,
      ];
    } else if (entry.action === "bios") {
      logs = [
        `[    0.000000] Invoking UEFI / BW (Bios Web) Setup Utility...`,
        `[    0.021000] System Hardware ID: "WolfOS" authenticated.`,
        `[    0.050000] Loading Boot Manager & Cryptographic Firmware Configurations...`,
      ];
    }

    logs.forEach((log, i) => {
      setTimeout(() => {
        setBootLogs((prev) => [...prev, log]);
        if (i === logs.length - 1) {
          setTimeout(() => {
            if (entry.action === "desktop") onBootDesktop();
            else if (entry.action === "tty") onBootTTY();
            else if (entry.action === "memtest") onBootMemtest();
            else if (entry.action === "bios") onBootBios();
          }, 500);
        }
      }, i * 160);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black text-zinc-100 font-mono flex flex-col justify-between p-6 select-none animate-in fade-in duration-300">
      {/* GRUB Header */}
      <div>
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-xl">🐺</span>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">
                GNU GRUB version 2.06 (LobaiteOS 🐺 / LoCmdL Bootloader)
              </h1>
              <p className="text-xs text-zinc-500 font-mono">
                Kobaire Engine • Zero-Trust Sovereign WebOS
              </p>
            </div>
          </div>
          <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded border border-emerald-800/60">
            {isBooting ? "INICIALIZANDO..." : `Boot automático em ${countdown}s`}
          </div>
        </div>
      </div>

      {/* Booting Logs View */}
      {isBooting ? (
        <div className="flex-1 my-6 overflow-y-auto bg-black p-4 rounded-lg font-mono text-xs text-emerald-400 space-y-1">
          {bootLogs.map((log, index) => (
            <div key={index} className="leading-relaxed">
              {log}
            </div>
          ))}
          <div className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-1" />
        </div>
      ) : (
        /* GRUB Menu Selector Box */
        <div className="my-auto max-w-4xl mx-auto w-full">
          <div className="border border-zinc-700 bg-zinc-950 p-1.5 shadow-2xl rounded-sm">
            <div className="border border-zinc-800 p-3 space-y-1">
              {grubEntries.map((entry, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={entry.id}
                    onClick={() => {
                      setSelectedIndex(idx);
                      triggerBoot(idx);
                    }}
                    className={`w-full text-left px-3 py-2.5 transition flex flex-col font-mono text-xs ${
                      isSelected
                        ? "bg-sky-950/80 text-white border-l-4 border-sky-400 font-bold"
                        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={isSelected ? "text-sky-400" : "text-transparent"}>
                        {isSelected ? "▶" : "•"}
                      </span>
                      <span className={isSelected ? "text-white" : "text-zinc-300"}>
                        {entry.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 pl-4 mt-0.5">
                      {entry.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 p-3 bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 space-y-1 font-mono">
            <p className="flex items-center gap-2">
              <span className="text-sky-400 font-bold">Instruções:</span>
              <span>Use as teclas <span className="text-white">↑</span> e <span className="text-white">↓</span> para navegar. Pressione <span className="text-white">ENTER</span> para inicializar a opção selecionada.</span>
            </p>
            <p className="text-zinc-500">
              Pressione <span className="text-white">'c'</span> para modo LoCmdL/LoTTY de recuperação.
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-zinc-900 pt-3 flex items-center justify-between text-[11px] text-zinc-500">
        <span>LobaiteOS 🐺 Boot Manager • https://github.com/corocotoco22-cmyk/LobaireOS</span>
        <button
          onClick={() => triggerBoot(selectedIndex)}
          className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs transition flex items-center gap-1"
        >
          <CornerDownLeft className="w-3 h-3" />
          <span>Inicializar Agora</span>
        </button>
      </div>
    </div>
  );
};
