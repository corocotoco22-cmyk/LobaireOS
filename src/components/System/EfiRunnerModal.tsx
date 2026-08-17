import React, { useState, useEffect } from "react";
import { AlertCircle, X, Maximize2, ShieldAlert, Cpu } from "lucide-react";
import { EfiExecutable } from "../../lib/efiStorage";

interface EfiRunnerModalProps {
  executable: EfiExecutable | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EfiRunnerModal: React.FC<EfiRunnerModalProps> = ({
  executable,
  isOpen,
  onClose,
}) => {
  const [showExitWarningBanner, setShowExitWarningBanner] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setShowExitWarningBanner(true);
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Hotkey: Ctrl + Alt + F4 or Escape
      if (e.ctrlKey && e.altKey && (e.key === "F4" || e.code === "F4")) {
        e.preventDefault();
        onClose();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !executable) return null;

  return (
    <div className="fixed inset-0 z-[10000] bg-black flex flex-col select-none overflow-hidden animate-in fade-in duration-200 font-mono">
      {/* Top Banner Alert: Ctrl + Alt + F4 to Exit */}
      {showExitWarningBanner && (
        <div className="bg-[#f38ba8] text-[#11111b] px-4 py-2 flex items-center justify-between font-bold text-xs shadow-lg animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>
              [catEFI .EFI RUNNER]: Executando <span className="underline">{executable.name}</span>. Para sair a qualquer momento, pressione{" "}
              <kbd className="bg-[#11111b] text-white px-2 py-0.5 rounded shadow">Ctrl + Alt + F4</kbd> ou <kbd className="bg-[#11111b] text-white px-2 py-0.5 rounded shadow">ESC</kbd>
            </span>
          </div>
          <button
            onClick={() => setShowExitWarningBanner(false)}
            className="text-[10px] bg-[#11111b]/20 hover:bg-[#11111b]/30 px-2 py-0.5 rounded transition"
          >
            Dispensar Aviso
          </button>
        </div>
      )}

      {/* Floating Exit Button in top-right */}
      <div className="absolute top-3 right-4 z-50 flex items-center gap-2 opacity-70 hover:opacity-100 transition">
        <div className="bg-[#181825]/90 border border-[#313244] text-[#cba6f7] text-[11px] px-3 py-1 rounded-lg backdrop-blur flex items-center gap-2">
          <span>/dev/BIOS/CEFI/{executable.name}</span>
          <button
            onClick={onClose}
            className="p-1 rounded bg-[#313244] hover:bg-[#f38ba8] hover:text-[#11111b] transition"
            title="Sair (Ctrl + Alt + F4)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Execution Sandbox (Rendered HTML as EFI) */}
      <iframe
        title={`EFI Executable: ${executable.name}`}
        srcDoc={executable.htmlContent}
        sandbox="allow-scripts allow-modals"
        className="flex-1 w-full h-full border-0 bg-black"
      />
    </div>
  );
};
