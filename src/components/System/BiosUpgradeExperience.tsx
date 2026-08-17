import React, { useState, useEffect } from "react";
import { Terminal, Cpu, Sparkles } from "lucide-react";

interface BiosUpgradeExperienceProps {
  isOpen: boolean;
  onComplete: () => void;
}

interface FloatingTerminal {
  id: number;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  currentPkg: number;
  speed: number;
  color: string;
}

export const BiosUpgradeExperience: React.FC<BiosUpgradeExperienceProps> = ({
  isOpen,
  onComplete,
}) => {
  const [phase, setPhase] = useState<"terminals" | "blackScreen" | "rebooting">("terminals");
  const [globalPkgCount, setGlobalPkgCount] = useState(1);
  const [blackScreenProgress, setBlackScreenProgress] = useState(0);

  // Spawning multiple staggered chaotic terminals
  const [terminals] = useState<FloatingTerminal[]>(() => [
    { id: 1, title: "wget-catefi-pkg [root@wolf-core]", x: 40, y: 50, width: 340, height: 210, currentPkg: 1, speed: 45, color: "border-cyan-500/60" },
    { id: 2, title: "pacman-cefi-subsystem [tty2]", x: 420, y: 80, width: 360, height: 230, currentPkg: 24, speed: 30, color: "border-fuchsia-500/60" },
    { id: 3, title: "flashrom --dev=BIOS/CEFI [hw-bus]", x: 120, y: 300, width: 380, height: 220, currentPkg: 88, speed: 50, color: "border-purple-500/60" },
    { id: 4, title: "catEFI-firmware-compiler [gcc-opt]", x: 540, y: 320, width: 350, height: 220, currentPkg: 12, speed: 35, color: "border-emerald-500/60" },
    { id: 5, title: "vcore-microcode-patcher [overclock]", x: 280, y: 160, width: 360, height: 200, currentPkg: 50, speed: 40, color: "border-amber-500/60" },
    { id: 6, title: "catroot-dev-vault-sync [id:WolfOS]", x: 60, y: 100, width: 320, height: 190, currentPkg: 110, speed: 25, color: "border-sky-500/60" },
    { id: 7, title: "efivars-catppuccin-loader [x86_64]", x: 600, y: 40, width: 330, height: 210, currentPkg: 75, speed: 35, color: "border-rose-500/60" },
  ]);

  useEffect(() => {
    if (!isOpen) {
      setPhase("terminals");
      setGlobalPkgCount(1);
      setBlackScreenProgress(0);
      return;
    }

    // Step 1: Terminals phase with "Download de pacote(X/333), baixando"
    const pkgInterval = setInterval(() => {
      setGlobalPkgCount((prev) => {
        if (prev >= 333) return 333;
        return prev + Math.floor(Math.random() * 8) + 3;
      });
    }, 90);

    // After 5 seconds, switch to the black screen phase
    const phase1Timer = setTimeout(() => {
      clearInterval(pkgInterval);
      setPhase("blackScreen");
    }, 5000);

    return () => {
      clearInterval(pkgInterval);
      clearTimeout(phase1Timer);
    };
  }, [isOpen]);

  // Step 2: Black screen with Lobaite logo and Progress bar
  // [----------------------------------------50%------------------------------]
  useEffect(() => {
    if (!isOpen || phase !== "blackScreen") return;

    // Animate progress up to 50% smoothly, and then complete in 1 second
    let currentVal = 0;
    const progressInterval = setInterval(() => {
      currentVal += 10;
      if (currentVal >= 50) {
        currentVal = 50;
        setBlackScreenProgress(50);
        clearInterval(progressInterval);
      } else {
        setBlackScreenProgress(currentVal);
      }
    }, 150);

    // After 1 second on the black screen, apply catEFI and complete!
    const completionTimer = setTimeout(() => {
      setPhase("rebooting");
      setTimeout(() => {
        onComplete();
      }, 400);
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(completionTimer);
    };
  }, [isOpen, phase, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] overflow-hidden select-none font-mono">
      {/* PHASE 1: A flurry of terminal windows showing "Download de pacote(X/333), baixando" */}
      {phase === "terminals" && (
        <div className="relative w-full h-full bg-black/90 backdrop-blur-md">
          {/* Matrix subtle background pulse */}
          <div className="absolute inset-0 bg-[radial-gradient(#cba6f7_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

          {/* Central status banner */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#1e1e2e]/95 border border-[#cba6f7] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-[#cdd6f4]">
            <div className="w-4 h-4 border-2 border-[#cba6f7] border-t-transparent rounded-full animate-spin" />
            <div>
              <p className="text-xs font-bold text-[#cba6f7]">
                INSTALANDO FIRMWARE catEFI (Catppuccin Mocha) • ID:&quot;WolfOS&quot;
              </p>
              <p className="text-[11px] text-[#a6adc8]">
                Download de pacote ({Math.min(globalPkgCount, 333)}/333), baixando...
              </p>
            </div>
          </div>

          {/* Spawned multiple floating terminals */}
          {terminals.map((term, index) => {
            const currentPkg = Math.min(333, globalPkgCount + (index * 29) % 180);
            return (
              <div
                key={term.id}
                style={{
                  top: `${term.y}px`,
                  left: `${term.x}px`,
                  width: `${term.width}px`,
                  height: `${term.height}px`,
                  zIndex: 10 + index,
                }}
                className={`absolute bg-[#11111b]/95 border-2 ${term.color} rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-75 duration-300`}
              >
                {/* Terminal Title Bar */}
                <div className="bg-[#181825] px-3 py-1.5 border-b border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="text-[10px] text-slate-300 font-bold ml-1.5 truncate max-w-[180px]">
                      {term.title}
                    </span>
                  </div>
                  <span className="text-[9px] text-[#cba6f7] font-mono animate-pulse">RUNNING</span>
                </div>

                {/* Terminal Content Buffer */}
                <div className="p-3 text-[10px] text-slate-200 flex-1 overflow-hidden space-y-1 bg-black/60">
                  <p className="text-emerald-400 font-bold">
                    &gt; Download de pacote({currentPkg}/333), baixando
                  </p>
                  <p className="text-cyan-300">
                    GET https://firmware.lobaite.os/catEFI/pkg_{currentPkg}.tar.gz [200 OK]
                  </p>
                  <p className="text-slate-400">
                    SHA256: 9f8a8b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0
                  </p>
                  <p className="text-[#f9e2af]">
                    Gravando em /dev/BIOS/CEFI/sector_{currentPkg * 4}... [OK]
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-cyan-400 via-purple-400 to-[#cba6f7] h-full transition-all duration-100"
                        style={{ width: `${(currentPkg / 333) * 100}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-[#cba6f7]">{Math.round((currentPkg / 333) * 100)}%</span>
                  </div>
                  <p className="text-[9px] text-slate-500 animate-pulse">
                    $ sync --force --hw-override ID:&quot;WolfOS&quot;
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PHASE 2 & 3: Black Screen with Lobaite Logo & Exact Requested Progress String */}
      {(phase === "blackScreen" || phase === "rebooting") && (
        <div className="w-full h-full bg-black text-white flex flex-col items-center justify-center p-6 space-y-8 animate-in fade-in duration-200">
          {/* Lobaite Wolf Logo */}
          <div className="flex flex-col items-center space-y-3">
            <div className="text-7xl select-none filter drop-shadow-[0_0_20px_rgba(203,166,247,0.5)] animate-pulse">
              🐺
            </div>
            <h1 className="text-2xl font-bold tracking-widest text-[#cdd6f4]">
              LOBAITE<span className="text-[#cba6f7]">OS</span>
            </h1>
            <p className="text-xs text-[#a6adc8] tracking-wider uppercase font-semibold">
              Firmware Flash Utility • WolfOS ID
            </p>
          </div>

          {/* Prompt: Baixando a BIOS */}
          <div className="text-center space-y-4 max-w-2xl w-full px-4">
            <p className="text-lg md:text-xl font-bold text-white tracking-wide">
              Baixando a BIOS
            </p>

            {/* Exact representation requested by user: [----------------------------------------50%------------------------------] */}
            <div className="bg-[#11111b] border border-[#313244] p-4 rounded-xl shadow-2xl text-cyan-300 text-xs md:text-sm font-mono tracking-wider break-all">
              [----------------------------------------50%------------------------------]
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-[#cba6f7] pt-2">
              <span className="w-2 h-2 rounded-full bg-[#cba6f7] animate-ping" />
              <span>Aplicando catEFI como BIOS padrão e reiniciando na BIOS...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
