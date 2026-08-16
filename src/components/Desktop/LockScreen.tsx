import React, { useState, useEffect } from "react";
import { Lock, Unlock, ShieldCheck, Flame, Delete, AlertCircle, Fingerprint } from "lucide-react";

interface LockScreenProps {
  isLocked: boolean;
  onUnlock: () => void;
  correctPin: string;
  onTriggerPanic: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({
  isLocked,
  onUnlock,
  correctPin,
  onTriggerPanic,
}) => {
  const [pinInput, setPinInput] = useState("");
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
      setDateStr(
        now.toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isLocked) return null;

  const handleKeyPress = (num: string) => {
    if (pinInput.length < 8) {
      const nextPin = pinInput + num;
      setPinInput(nextPin);
      if (nextPin === correctPin) {
        unlockSuccess();
      }
    }
  };

  const handleBackspace = () => {
    setPinInput((prev) => prev.slice(0, -1));
    setErrorMsg(null);
  };

  const unlockSuccess = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      setPinInput("");
      setErrorMsg(null);
      onUnlock();
    }, 400);
  };

  const handleBioUnlock = () => {
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onUnlock();
    }, 700);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === correctPin) {
      unlockSuccess();
    } else {
      setErrorMsg("PIN incorreto. Proteção contra força bruta ativa.");
      setPinInput("");
    }
  };

  return (
    <div
      id="lobaire-lock-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-8 bg-gradient-to-b from-[#050505] via-[#090a0f] to-[#050505] text-zinc-100 select-none backdrop-blur-3xl animate-in fade-in duration-300"
    >
      {/* Top Bar Header */}
      <div className="w-full flex items-center justify-between max-w-4xl text-xs">
        <div className="flex items-center gap-2 text-sky-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>LobaireOS 🐺 • Zero-Knowledge Session</span>
        </div>
        <button
          onClick={onTriggerPanic}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition font-mono text-[11px]"
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Wipe de Emergência</span>
        </button>
      </div>

      {/* Center Clock & Authentication Pad */}
      <div className="flex flex-col items-center max-w-sm w-full space-y-6 text-center">
        {/* Time and Date */}
        <div className="space-y-1">
          <h1 className="text-6xl font-bold font-mono tracking-tight text-white">{timeStr}</h1>
          <p className="text-sm font-medium text-zinc-400 capitalize">{dateStr}</p>
        </div>

        {/* Wolf Security Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-4xl shadow-2xl shadow-sky-500/10">
            🐺
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-zinc-950 flex items-center justify-center">
            <Lock className="w-3 h-3 text-zinc-950" />
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold text-zinc-100">Operador Soberano</h2>
          <p className="text-xs text-sky-400 font-mono mt-0.5">Digite o PIN (Padrão: {correctPin})</p>
        </div>

        {/* PIN Dots Indicator */}
        <div className="flex items-center gap-3 my-2">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                pinInput.length > idx
                  ? "bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)] scale-110"
                  : "bg-zinc-800 border border-zinc-700"
              }`}
            />
          ))}
        </div>

        {errorMsg && (
          <p className="text-xs text-rose-400 font-mono flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errorMsg}
          </p>
        )}

        {/* Number Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              className="h-12 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-base font-mono font-semibold text-zinc-100 transition-all active:scale-95 shadow-md hover:border-zinc-700"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleBioUnlock}
            className="h-12 rounded-2xl bg-zinc-900/60 hover:bg-sky-500/10 border border-zinc-800 text-sky-400 transition-all flex items-center justify-center"
            title="Desbloqueio Biométrico Rápido"
          >
            <Fingerprint className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleKeyPress("0")}
            className="h-12 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-base font-mono font-semibold text-zinc-100 transition-all active:scale-95"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="h-12 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all flex items-center justify-center"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Instant Unlock Button */}
        <button
          onClick={unlockSuccess}
          className="text-xs text-zinc-500 hover:text-sky-400 transition font-mono"
        >
          [ Desbloqueio Rápido Instantâneo ]
        </button>
      </div>

      {/* Footer Info */}
      <div className="text-[11px] font-mono text-zinc-500 text-center">
        LobaireOS Hardened Security System • Memória Volátil Criptografada AES-256
      </div>
    </div>
  );
};
