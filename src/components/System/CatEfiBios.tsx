import React, { useState, useEffect } from "react";
import {
  Cpu,
  ShieldAlert,
  HardDrive,
  Terminal,
  Zap,
  Flame,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Play,
  Plus,
  Trash2,
  Code2,
} from "lucide-react";
import {
  EfiExecutable,
  getEfiExecutables,
  saveEfiExecutable,
  deleteEfiExecutable,
} from "../../lib/efiStorage";

interface CatEfiBiosProps {
  isOpen: boolean;
  onExitBios: () => void;
  onBootOption: (bootType: "lobaite-2.0" | "lobaire-legacy" | "catroot" | "normal") => void;
  onRunEfi: (executable: EfiExecutable) => void;
  onRestoreLegacyBw?: () => void;
}

export const CatEfiBios: React.FC<CatEfiBiosProps> = ({
  isOpen,
  onExitBios,
  onBootOption,
  onRunEfi,
  onRestoreLegacyBw,
}) => {
  const [activeTab, setActiveTab] = useState<"main" | "advanced" | "security" | "boot" | "root" | "exit">("main");
  const [selectedBootIndex, setSelectedBootIndex] = useState(0);

  // Root Features State (Overclock, EFI custom loader, voltages)
  const [cpuClockMultiplier, setCpuClockMultiplier] = useState(42); // 4.2 GHz
  const [vCoreVoltage, setVCoreVoltage] = useState(1.275);
  const [notification, setNotification] = useState<string | null>(null);

  // Dynamic EFI list from /dev/BIOS/CEFI/
  const [efiList, setEfiList] = useState<EfiExecutable[]>([]);
  const [selectedEfi, setSelectedEfi] = useState<EfiExecutable | null>(null);

  // New EFI Creator Modal
  const [isCreatingEfi, setIsCreatingEfi] = useState(false);
  const [newEfiName, setNewEfiName] = useState("");
  const [newEfiHtml, setNewEfiHtml] = useState(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #181825; color: #cba6f7; font-family: monospace; padding: 40px; }
    h1 { color: #f5c2e7; }
    .card { background: #1e1e2e; padding: 20px; border-radius: 12px; border: 1px solid #313244; }
  </style>
</head>
<body>
  <h1>🐺 Meu Programa Custom .EFI</h1>
  <div class="card">
    <p>Criado e carregado a partir de /dev/BIOS/CEFI/</p>
  </div>
</body>
</html>`);

  useEffect(() => {
    if (isOpen) {
      const items = getEfiExecutables();
      setEfiList(items);
      if (items.length > 0) {
        setSelectedEfi(items[0]);
      }
    }
  }, [isOpen]);

  const bootOptions = [
    {
      id: "lobaite-2.0",
      name: "Lobaite: New 2.0 Era",
      type: "lobaite-2.0" as const,
      description: "Nova Geração Oficial do LobaiteOS 🐺 (v3.4.0) com Engine Kobaire",
      status: "ATIVO (PADRÃO)",
      statusColor: "text-[#a6e3a1]",
    },
    {
      id: "lobaire-legacy",
      name: "Lobaire: New 1.0.0 (DESCONTINUADO)",
      type: "lobaire-legacy" as const,
      description: "Versão legada anterior à transição de nome para LobaiteOS 🐺",
      status: "DESCONTINUADO",
      statusColor: "text-[#f9e2af]",
    },
    {
      id: "catroot-boot",
      name: 'catroot "CMDL("OpenRootMenu" > system Linux(ID:"WolfOS") root-name=catroot"',
      type: "catroot" as const,
      description: 'Executa a chamada direta CMDL para abrir o menu interativo catroot',
      status: "ROOT CMDL",
      statusColor: "text-[#cba6f7]",
    },
  ];

  useEffect(() => {
    if (!isOpen || isCreatingEfi) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const tabs: Array<"main" | "advanced" | "security" | "boot" | "root" | "exit"> = [
          "main",
          "advanced",
          "security",
          "boot",
          "root",
          "exit",
        ];
        const curIdx = tabs.indexOf(activeTab);
        setActiveTab(tabs[(curIdx + 1) % tabs.length]);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const tabs: Array<"main" | "advanced" | "security" | "boot" | "root" | "exit"> = [
          "main",
          "advanced",
          "security",
          "boot",
          "root",
          "exit",
        ];
        const curIdx = tabs.indexOf(activeTab);
        setActiveTab(tabs[(curIdx - 1 + tabs.length) % tabs.length]);
      } else if (e.key === "Escape") {
        e.preventDefault();
        onExitBios();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeTab, isCreatingEfi, onExitBios]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSaveNewEfi = () => {
    if (!newEfiName.trim()) {
      showToast("Nome do arquivo .efi é obrigatório!");
      return;
    }
    const updated = saveEfiExecutable(newEfiName.trim(), newEfiHtml);
    setEfiList(updated);
    setIsCreatingEfi(false);
    setNewEfiName("");
    showToast(`Binário .efi salvo em /dev/BIOS/CEFI/${newEfiName.trim().endsWith('.efi') ? newEfiName.trim() : newEfiName.trim() + '.efi'}`);
  };

  const handleDeleteEfi = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteEfiExecutable(name);
    setEfiList(updated);
    if (selectedEfi?.name === name) {
      setSelectedEfi(updated[0] || null);
    }
    showToast(`Binário ${name} removido de /dev/BIOS/CEFI/`);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#1e1e2e] text-[#cdd6f4] font-mono text-xs select-none p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
      {/* Catppuccin Header */}
      <div>
        <div className="border-b border-[#313244] pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#cba6f7]/20 border border-[#cba6f7]/40 flex items-center justify-center text-[#cba6f7] font-bold">
              🐱
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#cba6f7] text-sm tracking-wide">
                  catEFI BIOS Setup Utility
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#f5c2e7]/10 text-[#f5c2e7] border border-[#f5c2e7]/30">
                  Catppuccin Mocha
                </span>
              </div>
              <p className="text-[11px] text-[#a6adc8]">
                LobaiteOS 🐺 • BIOS System ID: <span className="text-[#89b4fa]">"WolfOS"</span> (CEFI Kernel Loader)
              </p>
            </div>
          </div>
          <div className="text-right text-[11px] text-[#6c7086]">
            Vault: <span className="text-[#cba6f7] font-bold">/dev/BIOS/CEFI/</span> (Acesso Exclusivo catroot)
          </div>
        </div>

        {/* Catppuccin Minimalist Tab Bar */}
        <div className="flex items-center gap-1.5 mt-3 border-b border-[#313244] bg-[#181825] p-1.5 rounded-xl">
          {(["main", "advanced", "security", "boot", "root", "exit"] as const).map((tab) => {
            const isActive = activeTab === tab;
            const labels = {
              main: "Main",
              advanced: "Advanced",
              security: "Security",
              boot: "Boot Manager",
              root: "⚡ Root & CEFI (.efi Loader)",
              exit: "Exit",
            };
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#cba6f7] text-[#11111b] shadow-md shadow-[#cba6f7]/20"
                    : tab === "root"
                    ? "text-[#f38ba8] hover:text-[#f5c2e7] hover:bg-[#313244]"
                    : "text-[#a6adc8] hover:text-[#cdd6f4] hover:bg-[#313244]"
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Notification Toast inside catEFI */}
      {notification && (
        <div className="my-2 p-2.5 rounded-xl bg-[#cba6f7]/20 border border-[#cba6f7]/40 text-[#cba6f7] text-xs text-center animate-in fade-in">
          {notification}
        </div>
      )}

      {/* Content Container */}
      <div className="flex-1 my-3 bg-[#181825] border border-[#313244] rounded-2xl p-4 overflow-y-auto flex flex-col justify-between">
        {/* ROOT & CEFI LOADER TAB */}
        {activeTab === "root" && (
          <div className="space-y-4">
            <div className="border-b border-[#313244] pb-2 flex items-center justify-between">
              <div>
                <h2 className="text-[#cba6f7] font-bold text-sm flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#f38ba8]" />
                  <span>Diretório de Binários: /dev/BIOS/CEFI/ & Overclock</span>
                </h2>
                <p className="text-[#a6adc8] text-[11px] mt-0.5">
                  Diretório protegido por hardware: inacessível até mesmo pelo superusuário root comum, gerenciado exclusivamente pelo <strong className="text-[#cba6f7]">catroot</strong>.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-[#f38ba8]/10 text-[#f38ba8] border border-[#f38ba8]/30 text-[10px] font-bold">
                CEFI HARDWARE VAULT
              </span>
            </div>

            {/* Overclock Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#1e1e2e] border border-[#313244] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#f9e2af] font-bold text-xs flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#f9e2af]" />
                    CPU Overclock
                  </span>
                  <span className="text-[#89b4fa] font-bold">{(cpuClockMultiplier * 0.1).toFixed(1)} GHz</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCpuClockMultiplier((prev) => Math.max(30, prev - 1));
                      showToast(`CPU ajustada para ${(cpuClockMultiplier * 0.1 - 0.1).toFixed(1)} GHz`);
                    }}
                    className="px-2 py-1 rounded bg-[#313244] hover:bg-[#45475a] text-[#cdd6f4] font-bold"
                  >
                    -0.1G
                  </button>
                  <div className="flex-1 bg-[#11111b] h-2 rounded-full overflow-hidden border border-[#313244]">
                    <div
                      className="bg-gradient-to-r from-[#89b4fa] via-[#cba6f7] to-[#f38ba8] h-full"
                      style={{ width: `${((cpuClockMultiplier - 30) / 25) * 100}%` }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setCpuClockMultiplier((prev) => Math.min(55, prev + 1));
                      showToast(`CPU Overclock: ${(cpuClockMultiplier * 0.1 + 0.1).toFixed(1)} GHz`);
                    }}
                    className="px-2 py-1 rounded bg-[#313244] hover:bg-[#45475a] text-[#f38ba8] font-bold"
                  >
                    +0.1G
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#1e1e2e] border border-[#313244] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[#f9e2af] font-bold text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#f9e2af]" />
                    VCore Voltage
                  </span>
                  <span className="text-[#f38ba8] font-bold">{vCoreVoltage.toFixed(3)} V</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setVCoreVoltage((prev) => Math.max(1.0, +(prev - 0.025).toFixed(3)))}
                    className="px-2 py-1 rounded bg-[#313244] hover:bg-[#45475a] text-[#cdd6f4] font-bold"
                  >
                    -0.025V
                  </button>
                  <div className="flex-1 bg-[#11111b] h-2 rounded-full overflow-hidden border border-[#313244]">
                    <div
                      className="bg-[#f38ba8] h-full"
                      style={{ width: `${((vCoreVoltage - 1.0) / 0.5) * 100}%` }}
                    />
                  </div>
                  <button
                    onClick={() => setVCoreVoltage((prev) => Math.min(1.5, +(prev + 0.025).toFixed(3)))}
                    className="px-2 py-1 rounded bg-[#313244] hover:bg-[#45475a] text-[#f38ba8] font-bold"
                  >
                    +0.025V
                  </button>
                </div>
              </div>
            </div>

            {/* /dev/BIOS/CEFI/ Executables List & Runner */}
            <div className="p-3.5 rounded-xl bg-[#1e1e2e] border border-[#313244] space-y-3">
              <div className="flex items-center justify-between border-b border-[#313244] pb-2">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#cba6f7]" />
                  <div>
                    <span className="text-[#cba6f7] font-bold text-xs">
                      Binários .EFI Detectados em /dev/BIOS/CEFI/
                    </span>
                    <p className="text-[10px] text-[#a6adc8]">
                      Arquivos HTML salvos como .efi e carregados diretamente pela BIOS catEFI.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCreatingEfi(true)}
                  className="px-3 py-1 rounded-lg bg-[#cba6f7] text-[#11111b] font-bold hover:bg-[#b4befe] transition flex items-center gap-1.5 text-xs shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo .EFI</span>
                </button>
              </div>

              {/* List of EFI files */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {efiList.map((efi) => {
                  const isSelected = selectedEfi?.id === efi.id;
                  return (
                    <div
                      key={efi.id}
                      onClick={() => setSelectedEfi(efi)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#cba6f7]/15 border-[#cba6f7] text-[#cdd6f4]"
                          : "bg-[#181825] border-[#313244] text-[#a6adc8] hover:border-[#45475a]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-[#cba6f7] font-bold">●</span>
                          <span className="font-mono font-bold text-white text-xs">{efi.name}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#313244] text-[#a6adc8]">
                          {efi.size}
                        </span>
                      </div>

                      <p className="text-[10px] text-[#6c7086] mt-1.5 font-mono">
                        Path: /dev/BIOS/CEFI/{efi.name}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#313244]/60">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRunEfi(efi);
                          }}
                          className="px-3 py-1 rounded-lg bg-[#a6e3a1] text-[#11111b] font-bold hover:bg-[#94e2d5] transition flex items-center gap-1.5 text-[11px] shadow"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Executar .EFI</span>
                        </button>

                        <button
                          onClick={(e) => handleDeleteEfi(efi.name, e)}
                          className="p-1 rounded text-[#f38ba8] hover:bg-[#313244] transition"
                          title="Excluir binário .efi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Instruction Note for Exit Hotkey */}
              <div className="p-2.5 rounded-lg bg-[#f38ba8]/10 border border-[#f38ba8]/30 text-[#f38ba8] text-[11px] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>
                  <strong>Aviso de Execução:</strong> Ao rodar qualquer binário <code>.efi</code>, o catEFI exibirá o aviso prévio informando que para sair deve-se pressionar <strong>Control + Alt + F4</strong>.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* BOOT MANAGER TAB */}
        {activeTab === "boot" && (
          <div className="space-y-4">
            <div className="border-b border-[#313244] pb-2">
              <h2 className="text-[#cba6f7] font-bold text-sm flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#89b4fa]" />
                <span>catEFI Boot Manager (BIOS ID: "WolfOS")</span>
              </h2>
            </div>
            <div className="space-y-2">
              {bootOptions.map((opt, idx) => {
                const isSelected = selectedBootIndex === idx;
                return (
                  <div
                    key={opt.id}
                    onClick={() => {
                      setSelectedBootIndex(idx);
                      onBootOption(opt.type);
                    }}
                    className={`p-3 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? "bg-[#cba6f7]/20 border-[#cba6f7] text-[#cdd6f4] shadow-md shadow-[#cba6f7]/10"
                        : "bg-[#1e1e2e] border-[#313244] text-[#a6adc8] hover:bg-[#313244]/50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={isSelected ? "text-[#cba6f7] font-bold" : "text-[#6c7086]"}>
                          {isSelected ? "▶ [Boot #" + (idx + 1) + "]" : "  [Boot #" + (idx + 1) + "]"}
                        </span>
                        <span className="font-bold text-white text-xs">{opt.name}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono ${opt.statusColor} bg-[#11111b]`}>
                        {opt.status}
                      </span>
                    </div>
                    <p className="text-[11px] mt-1 pl-6 text-[#a6adc8]">{opt.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MAIN TAB */}
        {activeTab === "main" && (
          <div className="space-y-3 font-mono">
            <h2 className="text-[#cba6f7] font-bold text-sm">System & Firmware Specifications</h2>
            <div className="p-3 rounded-xl bg-[#1e1e2e] border border-[#313244] space-y-2 text-xs">
              <p>Firmware Type: <span className="text-[#a6e3a1] font-bold">catEFI Minimalist UEFI Subsystem</span></p>
              <p>Theme Palette: <span className="text-[#f5c2e7] font-bold">Catppuccin Mocha</span></p>
              <p>BIOS System ID: <span className="text-[#89b4fa] font-bold">"WolfOS" (Rev 3.4-catEFI)</span></p>
              <p>Protected EFI Vault: <span className="text-[#cba6f7] font-bold">/dev/BIOS/CEFI/</span></p>
              <p>Active CPU Multiplier: <span className="text-[#f9e2af] font-bold">{(cpuClockMultiplier * 0.1).toFixed(1)} GHz</span></p>
              <p>Total Memory: <span className="text-white font-bold">16384 MB (Volatile Encrypted RAM)</span></p>
            </div>
          </div>
        )}

        {/* ADVANCED TAB */}
        {activeTab === "advanced" && (
          <div className="space-y-3 font-mono">
            <h2 className="text-[#cba6f7] font-bold text-sm">Advanced Subsystem & Security Tweaks</h2>
            <div className="p-3 rounded-xl bg-[#1e1e2e] border border-[#313244] space-y-2 text-xs">
              <div className="flex justify-between border-b border-[#313244] pb-1.5">
                <span>Zero-Trust Process Sandboxing:</span>
                <span className="text-[#a6e3a1] font-bold">[Enforced]</span>
              </div>
              <div className="flex justify-between border-b border-[#313244] pb-1.5">
                <span>Memory Encryption Vector:</span>
                <span className="text-[#a6e3a1] font-bold">AES-256-XTS Active</span>
              </div>
              <div className="flex justify-between border-b border-[#313244] pb-1.5">
                <span>Hardware Level Vault (/dev/BIOS/CEFI/):</span>
                <span className="text-[#cba6f7] font-bold">[catroot Locked]</span>
              </div>
            </div>
          </div>
        )}

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <div className="space-y-3 font-mono">
            <h2 className="text-[#cba6f7] font-bold text-sm">Security & Root Permission Integrity</h2>
            <div className="p-3 rounded-xl bg-[#1e1e2e] border border-[#313244] space-y-2 text-xs">
              <p>TPM 2.0 Web Crypto Vault: <span className="text-[#a6e3a1] font-bold">Active</span></p>
              <p>Kernel Signature Mode: <span className="text-[#cba6f7] font-bold">Kobaire Custom Root</span></p>
              <p>Root Lock Status: <span className="text-[#f38ba8] font-bold">catroot Sovereign Authority</span></p>
            </div>
          </div>
        )}

        {/* EXIT TAB */}
        {activeTab === "exit" && (
          <div className="space-y-3 font-mono">
            <h2 className="text-[#cba6f7] font-bold text-sm">Save, Discard & Boot</h2>
            <div className="space-y-2">
              <button
                onClick={() => onBootOption("lobaite-2.0")}
                className="w-full text-left p-3 rounded-xl bg-[#cba6f7] text-[#11111b] font-bold hover:bg-[#b4befe] transition"
              >
                ▶ Save Changes, Apply Overclock & Boot LobaiteOS 🐺
              </button>
              <button
                onClick={onExitBios}
                className="w-full text-left p-3 rounded-xl bg-[#1e1e2e] border border-[#313244] hover:bg-[#313244] transition text-white font-bold"
              >
                ▶ Discard Changes & Exit to GRUB
              </button>
              {onRestoreLegacyBw && (
                <button
                  onClick={onRestoreLegacyBw}
                  className="w-full text-left p-3 rounded-xl bg-[#1e1e2e] border border-amber-500/40 hover:bg-amber-950/40 transition text-amber-300 font-bold"
                >
                  ⏮ Restaurar Firmware BIOS BW Clássica (WolfOS Padrão)
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Create new .EFI (HTML to .efi) */}
      {isCreatingEfi && (
        <div className="fixed inset-0 z-[10001] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1e1e2e] border border-[#cba6f7]/50 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl font-mono text-xs text-[#cdd6f4]">
            <div className="flex items-center justify-between border-b border-[#313244] pb-2">
              <div className="flex items-center gap-2 text-[#cba6f7] font-bold text-sm">
                <Code2 className="w-4 h-4" />
                <span>Criar Novo Executável .EFI em /dev/BIOS/CEFI/</span>
              </div>
              <button
                onClick={() => setIsCreatingEfi(false)}
                className="text-[#a6adc8] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[#a6adc8] text-[11px]">Nome do Arquivo (Ex: meu_app.efi):</label>
              <input
                type="text"
                value={newEfiName}
                onChange={(e) => setNewEfiName(e.target.value)}
                placeholder="meu_programa.efi"
                className="w-full p-2 rounded-lg bg-[#181825] border border-[#313244] text-white outline-none focus:border-[#cba6f7]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#a6adc8] text-[11px]">Código do Executável (HTML / CSS / JS):</label>
              <textarea
                value={newEfiHtml}
                onChange={(e) => setNewEfiHtml(e.target.value)}
                rows={10}
                className="w-full p-3 rounded-lg bg-[#181825] border border-[#313244] text-[#a6e3a1] font-mono text-xs outline-none focus:border-[#cba6f7]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#313244]">
              <button
                onClick={() => setIsCreatingEfi(false)}
                className="px-4 py-1.5 rounded-lg bg-[#313244] hover:bg-[#45475a] text-[#a6adc8] font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNewEfi}
                className="px-4 py-1.5 rounded-lg bg-[#cba6f7] text-[#11111b] font-bold hover:bg-[#b4befe] shadow"
              >
                Gravar .EFI em /dev/BIOS/CEFI/
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="border-t border-[#313244] pt-3 flex flex-wrap items-center justify-between text-[11px] text-[#a6adc8]">
        <div className="flex items-center gap-3">
          <span>(←/→) Selecionar Aba</span>
          <span>(ESC) Sair para GRUB</span>
          <span className="text-[#cba6f7]">catEFI • Catppuccin Mocha</span>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "boot" && (
            <button
              onClick={() => onBootOption(bootOptions[selectedBootIndex].type)}
              className="bg-[#cba6f7] text-[#11111b] font-bold px-3 py-1 rounded-lg hover:bg-[#b4befe] transition"
            >
              Inicializar Selecionado (ENTER)
            </button>
          )}
          <button
            onClick={onExitBios}
            className="bg-[#313244] hover:bg-[#45475a] text-white font-bold px-3 py-1 rounded-lg transition"
          >
            Sair (ESC)
          </button>
        </div>
      </div>
    </div>
  );
};
