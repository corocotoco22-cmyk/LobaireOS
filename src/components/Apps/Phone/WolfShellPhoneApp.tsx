import React, { useState, useRef, useEffect } from "react";
import {
  Terminal,
  Send,
  Trash2,
  Flame,
  Shield,
  Smartphone,
  Check,
} from "lucide-react";
import { AppId } from "../../../types";

interface WolfShellPhoneAppProps {
  onTriggerPanic: () => void;
  onOpenApp: (appId: string) => void;
  onRestartGrub: () => void;
  onOpenTTY: () => void;
  onOpenCefiVault: () => void;
  isRootDeleted: boolean;
  setIsRootDeleted: (deleted: boolean) => void;
}

export const WolfShellPhoneApp: React.FC<WolfShellPhoneAppProps> = ({
  onTriggerPanic,
  onOpenApp,
  onRestartGrub,
  onOpenTTY,
  onOpenCefiVault,
  isRootDeleted,
  setIsRootDeleted,
}) => {
  const [history, setHistory] = useState<Array<{ command: string; output: React.ReactNode; isError?: boolean }>>([
    {
      command: "lfp --mobile-init",
      output: (
        <div className="text-zinc-300 font-mono text-[11px] space-y-1">
          <p className="text-cyan-400 font-bold">🐺 WolfShell Mobile v3.4.0 (LFP Subsystem)</p>
          <p>Engine: <span className="text-sky-300 font-bold">Kobaire -- LobaiteOS</span></p>
          <p>Conexão Móvel: <span className="text-emerald-400">Tor 5G Sandboxed</span></p>
          <p className="text-zinc-400">Digite <span className="text-emerald-400 font-bold">help</span> para comandos rápidos ou toque nos botões abaixo.</p>
        </div>
      ),
    },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const parts = trimmed.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output: React.ReactNode = "";
    let isError = false;

    switch (command) {
      case "help":
        output = (
          <div className="space-y-1 text-zinc-300 text-[11px] font-mono">
            <p className="text-cyan-400 font-bold">Comandos Rápidos no Celular:</p>
            <p>• <span className="text-emerald-400">catroot</span> : Menu Superusuário ROOT</p>
            <p>• <span className="text-emerald-400">lfp</span> : Status do subsistema mobile</p>
            <p>• <span className="text-emerald-400">whoami</span> : Identidade de Sandbox</p>
            <p>• <span className="text-emerald-400">panic</span> : Protocolo de emergência</p>
            <p>• <span className="text-emerald-400">clear</span> : Limpar tela</p>
          </div>
        );
        break;

      case "clear":
        setHistory([]);
        setInput("");
        return;

      case "whoami":
        output = isRootDeleted
          ? "lobaite-user@phone (UID 1000, Sandboxed Non-Root)"
          : "root@phone (UID 0, Superusuário Kobaire)";
        break;

      case "lfp":
        output = (
          <div className="space-y-1 text-[11px] font-mono text-zinc-300">
            <p className="text-cyan-400 font-bold">📱 LFP PHONE STATUS:</p>
            <p>• Subsistema: <span className="text-emerald-400">100% Nativo Mobile</span></p>
            <p>• Roteamento: <span className="text-purple-300">Modem Tor Celular 5G</span></p>
            <p>• Gestos & Hápticos: <span className="text-white">Ativos</span></p>
          </div>
        );
        break;

      case "catroot":
        output = (
          <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1 font-mono text-[11px]">
            <p className="text-sky-400 font-bold">🐱 catroot (Menu ROOT Mobile):</p>
            <p>1. <button onClick={onRestartGrub} className="text-emerald-400 underline">Reiniciar GRUB</button></p>
            <p>2. <button onClick={() => setIsRootDeleted(true)} className="text-rose-400 underline">Deletar ROOT</button></p>
            <p>3. <button onClick={onOpenCefiVault} className="text-purple-400 underline">Abrir Vault catEFI</button></p>
          </div>
        );
        break;

      case "panic":
        onTriggerPanic();
        output = "🚨 PROTOCOLO DE PÂNICO DISPARADO NO CELULAR!";
        break;

      default:
        output = `Comando '${command}' não encontrado. Digite 'help'.`;
        isError = true;
    }

    setHistory((prev) => [...prev, { command: trimmed, output, isError }]);
    setInput("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
  };

  return (
    <div id="wolfshell-phone-app" className="h-full flex flex-col bg-zinc-950 text-zinc-100 font-mono select-none">
      {/* Phone Terminal Output */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5 text-xs">
        {history.map((h, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center gap-1 text-cyan-400 font-bold text-[11px]">
              <span>phone:~$</span>
              <span className="text-white">{h.command}</span>
            </div>
            <div className={`p-2 rounded-xl bg-zinc-900/70 border border-zinc-800/80 ${h.isError ? "text-rose-400" : "text-zinc-200"}`}>
              {h.output}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Quick Touch Command Pills */}
      <div className="px-3 py-1.5 bg-zinc-900 border-t border-zinc-800/80 flex items-center gap-1.5 overflow-x-auto text-[10px]">
        {["help", "lfp", "catroot", "whoami", "clear", "panic"].map((cmd) => (
          <button
            key={cmd}
            onClick={() => executeCommand(cmd)}
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-cyan-300 active:scale-95 transition font-bold shrink-0"
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Touch Input Bar */}
      <form onSubmit={handleFormSubmit} className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite um comando..."
          className="flex-1 px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500 font-mono"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold active:scale-95 transition"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
