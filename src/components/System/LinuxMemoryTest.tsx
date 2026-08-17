import React, { useState, useEffect } from "react";
import { Cpu, RefreshCw, CheckCircle, AlertTriangle, Play, Pause, CornerDownLeft, X } from "lucide-react";

interface LinuxMemoryTestProps {
  isOpen: boolean;
  onExit: () => void;
  onRebootGrub: () => void;
}

export const LinuxMemoryTest: React.FC<LinuxMemoryTestProps> = ({
  isOpen,
  onExit,
  onRebootGrub,
}) => {
  const [passCount, setPassCount] = useState(0);
  const [testPercent, setTestPercent] = useState(14);
  const [passPercent, setPassPercent] = useState(8);
  const [activeTestNum, setActiveTestNum] = useState(1);
  const [activeTestName, setActiveTestName] = useState("Test #1 [Address test, own address]");
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(12);

  const testList = [
    "Test #0 [Address test, walking ones]",
    "Test #1 [Address test, own address]",
    "Test #2 [Moving inversions, ones & zeros]",
    "Test #3 [Moving inversions, 8 bit pattern]",
    "Test #4 [Moving inversions, random pattern]",
    "Test #5 [Block move, 64 moves]",
    "Test #6 [Moving inversions, 32 bit pattern]",
    "Test #7 [Random number sequence]",
    "Test #8 [Modulo 20, ones & zeros]",
    "Test #9 [Bit fade test, 90 min, 2 patterns]",
  ];

  useEffect(() => {
    if (!isOpen || isPaused) return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);

      setTestPercent((prev) => {
        if (prev >= 100) {
          setActiveTestNum((curr) => {
            const next = (curr + 1) % testList.length;
            setActiveTestName(testList[next]);
            return next;
          });
          return 0;
        }
        return prev + 3;
      });

      setPassPercent((prev) => {
        if (prev >= 100) {
          setPassCount((p) => p + 1);
          return 0;
        }
        return prev + 1;
      });
    }, 400);

    return () => clearInterval(timer);
  }, [isOpen, isPaused, testList]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onRebootGrub();
      } else if (e.key === "c" || e.key === "C") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      } else if (e.key === "Enter") {
        e.preventDefault();
        onExit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onExit, onRebootGrub]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#000084] text-white font-mono text-xs select-none p-3 sm:p-5 flex flex-col justify-between overflow-hidden">
      {/* Memtest86 Classic Header */}
      <div className="border-b-2 border-white pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="bg-white text-[#000084] font-bold px-2 py-0.5 text-sm">
            Memtest86+ v5.31b
          </span>
          <span className="text-yellow-300 font-bold">
            Kobaire Core • Linux Memory Architecture Test (LobaiteOS 🐺 Safe Mode)
          </span>
        </div>
        <div className="text-right text-[11px] text-zinc-200">
          Pass: <span className="text-yellow-300 font-bold">{passCount}</span> | Errors:{" "}
          <span className="text-green-300 font-bold">0 (ECC OK)</span>
        </div>
      </div>

      {/* Main Memtest Diagnostic Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-2 flex-1">
        {/* Left Column: CPU & System Spec */}
        <div className="border border-white/60 p-3 space-y-2 bg-[#000066]">
          <p className="text-yellow-300 font-bold border-b border-white/40 pb-1">
            System & CPU Specifications
          </p>
          <div className="space-y-1 text-[11px]">
            <p>
              <span className="text-zinc-300">CPU Type:</span> AMD/Intel x86_64 Sovereign Virtual Core @ 3.40 GHz
            </p>
            <p>
              <span className="text-zinc-300">L1 Cache:</span> 64K (142850 MB/s)
            </p>
            <p>
              <span className="text-zinc-300">L2 Cache:</span> 512K (76200 MB/s)
            </p>
            <p>
              <span className="text-zinc-300">L3 Cache:</span> 16384K (38400 MB/s)
            </p>
            <p>
              <span className="text-zinc-300">Memory Range:</span> 0k - 16384M (16.0 GB Volatile RAM)
            </p>
            <p>
              <span className="text-zinc-300">Chipset / Node:</span> WolfOS BIOS ID #0x7F2A / Zero-Trust Node
            </p>
            <p>
              <span className="text-zinc-300">Settings:</span> RAM: 3200 MHz (DDR4-3200) / CAS: 16-18-18-36
            </p>
          </div>
        </div>

        {/* Right Column: Execution & Progress Bars */}
        <div className="border border-white/60 p-3 space-y-3 bg-[#000066]">
          <p className="text-yellow-300 font-bold border-b border-white/40 pb-1">
            Current Test Progress & Status
          </p>

          <div className="space-y-1 text-[11px]">
            <p className="text-white font-bold">{activeTestName}</p>
            <div className="flex items-center gap-2">
              <span className="w-20 text-zinc-300">Test {testPercent}%:</span>
              <div className="flex-1 bg-black h-4 border border-white relative overflow-hidden">
                <div
                  className="bg-yellow-400 h-full transition-all duration-200"
                  style={{ width: `${testPercent}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-20 text-zinc-300">Pass {passPercent}%:</span>
              <div className="flex-1 bg-black h-4 border border-white relative overflow-hidden">
                <div
                  className="bg-green-400 h-full transition-all duration-200"
                  style={{ width: `${passPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/30 text-[11px] grid grid-cols-2 gap-2 text-zinc-200">
            <div>Elapsed Time: <span className="text-yellow-300 font-bold">{formatTime(elapsedSeconds)}</span></div>
            <div>ECC Enabled: <span className="text-green-300 font-bold">YES</span></div>
            <div>State: <span className={isPaused ? "text-red-400 font-bold" : "text-green-400 font-bold"}>{isPaused ? "PAUSADO" : "TESTANDO..."}</span></div>
            <div>Memory Encription: <span className="text-yellow-300 font-bold">AES-256-XTS</span></div>
          </div>
        </div>
      </div>

      {/* Results Log Box */}
      <div className="border border-white/60 bg-black p-3 h-28 overflow-y-auto text-[11px] space-y-1 font-mono">
        <p className="text-green-400">***** PASS COMPLETE, NO ERRORS DETECTED *****</p>
        <p className="text-zinc-400">[0x00000000 - 0x3FFFFFFF] Standard Memory Page 0 verified: OK</p>
        <p className="text-zinc-400">[0x40000000 - 0x7FFFFFFF] Crypto Volatile Key Ring 1 verified: OK</p>
        <p className="text-zinc-400">[0x80000000 - 0xBFFFFFFF] Zero-Trust Process Jail buffer: OK</p>
        <p className="text-yellow-300">[Memtest86+] System hardware memory meets strict LobaiteOS 🐺 sovereign standards.</p>
      </div>

      {/* Classic Action Controls Footer */}
      <div className="border-t-2 border-white pt-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
        <div className="flex items-center gap-4 text-yellow-300">
          <span>(ESC) Reiniciar / Voltar ao GRUB</span>
          <span>(C) Configurar / {isPaused ? "Continuar" : "Pausar"}</span>
          <span>(ENTER) Iniciar Desktop</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="bg-white text-[#000084] font-bold px-2.5 py-0.5 hover:bg-yellow-300 transition"
          >
            {isPaused ? "Continuar" : "Pausar"}
          </button>
          <button
            onClick={onExit}
            className="bg-green-500 text-black font-bold px-2.5 py-0.5 hover:bg-green-400 transition"
          >
            Iniciar LobaiteOS
          </button>
          <button
            onClick={onRebootGrub}
            className="bg-red-600 text-white font-bold px-2.5 py-0.5 hover:bg-red-500 transition"
          >
            Sair para o GRUB (ESC)
          </button>
        </div>
      </div>
    </div>
  );
};
