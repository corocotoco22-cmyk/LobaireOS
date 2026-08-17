import React, { useState, useEffect } from "react";
import { Cpu, ShieldCheck, HardDrive, Terminal, Power, CornerDownLeft, RefreshCw, Layers } from "lucide-react";

interface BiosWebSettingsProps {
  isOpen: boolean;
  onExitBios: () => void;
  onBootOption: (bootType: "lobaite-2.0" | "lobaire-legacy" | "catroot" | "normal") => void;
}

export const BiosWebSettings: React.FC<BiosWebSettingsProps> = ({
  isOpen,
  onExitBios,
  onBootOption,
}) => {
  const [activeTab, setActiveTab] = useState<"main" | "advanced" | "security" | "boot" | "exit">("boot");
  const [selectedBootIndex, setSelectedBootIndex] = useState(0);

  const bootOptions = [
    {
      id: "lobaite-2.0",
      name: "Lobaite: New 2.0 Era",
      type: "lobaite-2.0" as const,
      description: "Nova Geração Oficial do LobaiteOS 🐺 (v3.4.0) com Engine Kobaire, Zero-Trust e UI Moderna",
      status: "ATIVO (PADRÃO)",
      statusColor: "text-emerald-400",
    },
    {
      id: "lobaire-legacy",
      name: "Lobaire: New 1.0.0 (DESCONTINUADO)",
      type: "lobaire-legacy" as const,
      description: "Versão legada anterior à transição de nome para LobaiteOS 🐺",
      status: "DESCONTINUADO",
      statusColor: "text-amber-400",
    },
    {
      id: "catroot-boot",
      name: 'catroot "CMDL("OpenRootMenu" > system Linux(ID:"WolfOS") root-name=catroot"',
      type: "catroot" as const,
      description: 'Executa a chamada direta CMDL para abrir o menu interativo catroot sob o ID de BIOS "WolfOS"',
      status: "SUPERUSER CMDL",
      statusColor: "text-sky-400",
    },
  ];

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const tabs: Array<"main" | "advanced" | "security" | "boot" | "exit"> = ["main", "advanced", "security", "boot", "exit"];
        const curIdx = tabs.indexOf(activeTab);
        setActiveTab(tabs[(curIdx + 1) % tabs.length]);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const tabs: Array<"main" | "advanced" | "security" | "boot" | "exit"> = ["main", "advanced", "security", "boot", "exit"];
        const curIdx = tabs.indexOf(activeTab);
        setActiveTab(tabs[(curIdx - 1 + tabs.length) % tabs.length]);
      } else if (e.key === "ArrowDown" && activeTab === "boot") {
        e.preventDefault();
        setSelectedBootIndex((prev) => (prev + 1) % bootOptions.length);
      } else if (e.key === "ArrowUp" && activeTab === "boot") {
        e.preventDefault();
        setSelectedBootIndex((prev) => (prev - 1 + bootOptions.length) % bootOptions.length);
      } else if (e.key === "Enter" && activeTab === "boot") {
        e.preventDefault();
        onBootOption(bootOptions[selectedBootIndex].type);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onExitBios();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeTab, selectedBootIndex, onExitBios, onBootOption, bootOptions]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0000aa] text-white font-mono text-xs select-none p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
      {/* BIOS Top Header */}
      <div>
        <div className="border-b-2 border-white pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-white text-[#0000aa] font-bold px-2 py-0.5 text-sm">
              BW (Bios Web Setup Utility)
            </span>
            <span className="text-yellow-300 font-bold">
              LobaiteOS 🐺 • BIOS System ID: "WolfOS" (Rev 3.4)
            </span>
          </div>
          <div className="text-xs text-zinc-300">
            Node: <span className="text-emerald-300 font-bold">WolfOS-Secure-Firmware</span>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="flex items-center gap-1 mt-2 border-b border-white/60 bg-[#000088] p-1">
          {(["main", "advanced", "security", "boot", "exit"] as const).map((tab) => {
            const isActive = activeTab === tab;
            const labels = {
              main: "Main",
              advanced: "Advanced",
              security: "Security",
              boot: "Boot Manager",
              exit: "Exit & Save",
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 font-bold uppercase transition ${
                  isActive
                    ? "bg-white text-[#0000aa] shadow"
                    : "text-zinc-300 hover:text-white hover:bg-[#000066]"
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 my-3 border border-white/80 bg-[#000077] p-4 overflow-y-auto flex flex-col justify-between">
        {/* TAB: BOOT MANAGER */}
        {activeTab === "boot" && (
          <div className="space-y-4">
            <div className="border-b border-white/40 pb-2">
              <h2 className="text-yellow-300 font-bold text-sm flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                <span>Boot Manager Configuration — BIOS ID: "WolfOS"</span>
              </h2>
              <p className="text-zinc-300 text-[11px]">
                Selecione a ordem de inicialização do sistema ou acione os módulos CMDL diretos.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-white font-bold text-xs">Boot Option Priorities:</p>
              {bootOptions.map((opt, idx) => {
                const isSelected = selectedBootIndex === idx;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      setSelectedBootIndex(idx);
                      onBootOption(opt.type);
                    }}
                    className={`p-3 border transition cursor-pointer ${
                      isSelected
                        ? "bg-white text-[#0000aa] border-yellow-300 font-bold shadow-lg"
                        : "bg-[#000055] border-white/40 text-zinc-200 hover:bg-[#000066]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{isSelected ? "▶ [Boot #" + (idx + 1) + "]" : "  [Boot #" + (idx + 1) + "]"}</span>
                        <span className="text-xs">{opt.name}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${opt.statusColor} bg-black/40`}>
                        {opt.status}
                      </span>
                    </div>
                    <p className={`text-[11px] mt-1 pl-6 ${isSelected ? "text-zinc-800" : "text-zinc-400"}`}>
                      {opt.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-[#000044] border border-white/30 text-[11px] text-zinc-300 space-y-1 font-mono">
              <p className="text-yellow-300 font-bold">Nota de Arquitetura WolfOS:</p>
              <p>• O identificador de hardware do LobaiteOS na BIOS é <strong className="text-white">ID:"WolfOS"</strong>.</p>
              <p>• Selecionar a opção 3 ativa a chamada direta de kernel CMDL para carregar o menu interativo <strong>catroot</strong>.</p>
            </div>
          </div>
        )}

        {/* TAB: MAIN */}
        {activeTab === "main" && (
          <div className="space-y-3 font-mono">
            <h2 className="text-yellow-300 font-bold text-sm">System Information</h2>
            <div className="space-y-1.5 text-xs text-zinc-200">
              <p>BIOS Vendor: <span className="text-white font-bold">Kobaire Firmware Group</span></p>
              <p>BIOS Version: <span className="text-yellow-300 font-bold">BW (Bios Web) v3.4.0</span></p>
              <p>BIOS System ID: <span className="text-emerald-300 font-bold">"WolfOS"</span></p>
              <p>OS Target: <span className="text-white font-bold">LobaiteOS 🐺</span></p>
              <p>System Date: <span className="text-white font-mono">{new Date().toLocaleDateString()}</span></p>
              <p>System Time: <span className="text-white font-mono">{new Date().toLocaleTimeString()}</span></p>
              <p>Total Memory: <span className="text-emerald-300 font-bold">16384 MB (Volatile Encrypted RAM)</span></p>
            </div>
          </div>
        )}

        {/* TAB: ADVANCED */}
        {activeTab === "advanced" && (
          <div className="space-y-3 font-mono">
            <h2 className="text-yellow-300 font-bold text-sm">Advanced Subsystem Settings</h2>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-white/20 pb-1">
                <span>Zero-Trust Process Isolation:</span>
                <span className="text-green-300 font-bold">[Enabled]</span>
              </div>
              <div className="flex justify-between border-b border-white/20 pb-1">
                <span>Hardware Entropy CSPRNG (4096-bit):</span>
                <span className="text-green-300 font-bold">[Enabled]</span>
              </div>
              <div className="flex justify-between border-b border-white/20 pb-1">
                <span>AES-256 Memory Guard:</span>
                <span className="text-green-300 font-bold">[Locked]</span>
              </div>
              <div className="flex justify-between border-b border-white/20 pb-1">
                <span>External Telemetry & Tracker Blocking:</span>
                <span className="text-green-300 font-bold">[Strict Block]</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB: SECURITY */}
        {activeTab === "security" && (
          <div className="space-y-3 font-mono">
            <h2 className="text-yellow-300 font-bold text-sm">Security & Cryptographic Keys</h2>
            <div className="space-y-2 text-xs">
              <p>Secure Boot Status: <span className="text-emerald-300 font-bold">Enabled (Kobaire Signature)</span></p>
              <p>TPM 2.0 Web Crypto Vault: <span className="text-emerald-300 font-bold">Active</span></p>
              <p>Root Permissions Control: <span className="text-yellow-300 font-bold">Managed by catroot / LoBK</span></p>
            </div>
          </div>
        )}

        {/* TAB: EXIT */}
        {activeTab === "exit" && (
          <div className="space-y-4 font-mono">
            <h2 className="text-yellow-300 font-bold text-sm">Exit & Boot Options</h2>
            <div className="space-y-2 text-xs">
              <button
                onClick={() => onBootOption("normal")}
                className="w-full text-left p-2.5 bg-[#000055] border border-white/50 hover:bg-white hover:text-[#0000aa] transition font-bold"
              >
                ▶ Save Changes and Boot LobaiteOS 🐺
              </button>
              <button
                onClick={onExitBios}
                className="w-full text-left p-2.5 bg-[#000055] border border-white/50 hover:bg-white hover:text-[#0000aa] transition font-bold"
              >
                ▶ Discard Changes and Exit to GRUB
              </button>
            </div>
          </div>
        )}
      </div>

      {/* BIOS Footer Key Helpers */}
      <div className="border-t-2 border-white pt-2 flex flex-wrap items-center justify-between text-[11px] text-yellow-300">
        <div className="flex items-center gap-3">
          <span>(←/→) Selecionar Aba</span>
          <span>(↑/↓) Selecionar Item</span>
          <span>(ENTER) Confirmar / Boot</span>
          <span>(ESC) Sair para GRUB</span>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "boot" && (
            <button
              onClick={() => onBootOption(bootOptions[selectedBootIndex].type)}
              className="bg-yellow-400 text-black font-bold px-3 py-1 hover:bg-yellow-300 transition"
            >
              Inicializar Selecionado (ENTER)
            </button>
          )}
          <button
            onClick={onExitBios}
            className="bg-white text-[#0000aa] font-bold px-3 py-1 hover:bg-zinc-200 transition"
          >
            Sair (ESC)
          </button>
        </div>
      </div>
    </div>
  );
};
