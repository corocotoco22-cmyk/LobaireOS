import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Power, RotateCcw, Monitor, ShieldAlert } from "lucide-react";

interface LoTTYScreenProps {
  isOpen: boolean;
  onExitTTY: () => void;
  onRebootToGrub: () => void;
  onOpenCefiVault?: () => void;
  isRootDeleted: boolean;
  setIsRootDeleted: (deleted: boolean) => void;
}

const CATROOT_ASCII = `@@@@@@@@@@@@@@@@@@@@
@@@@@@ @@@@@@@@@@@@@
@@@@@@ -==@@*@@@@@@@
@@@@@ @.@@-@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@=@@@@@@@
@@@@@@@@@@@@@@=@@@@@
@@@@@@@@@@==@@*@@@@@
@@@@@@@@@@#@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@
@@@@@@@@@@@@@@@@@@@@

Escolha uma opção:
1 ----- Reniciar em LoCmdL
2 -----Deletar ROOT-------
3 ----------LoTTY---------
4 ---------------------SAIR
5 - Abrir /dev/BIOS/CEFI/`;

export const LoTTYScreen: React.FC<LoTTYScreenProps> = ({
  isOpen,
  onExitTTY,
  onRebootToGrub,
  onOpenCefiVault,
  isRootDeleted,
  setIsRootDeleted,
}) => {
  const [history, setHistory] = useState<Array<{ command?: string; output: string | React.ReactNode; isError?: boolean }>>([
    {
      output: (
        <div className="space-y-1 text-zinc-300">
          <p className="text-white font-bold">LobaiteOS 3.4 Hardened (tty1)</p>
          <p className="text-zinc-500">Kobaire WebOS Core • Zero-Trust Pure Console Subsystem</p>
          <p className="text-emerald-400 text-xs">LoLogin encerrado. Sessão root ativa no console TTY puro.</p>
          <p className="text-zinc-500 text-[11px]">Digite 'startx' ou 'exit' para retornar ao ambiente gráfico, ou 'catroot' para o menu.</p>
        </div>
      ),
    },
  ]);

  const [input, setInput] = useState("");
  const [isCatrootActive, setIsCatrootActive] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isCatrootActive]);

  if (!isOpen) return null;

  const handleCommand = (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    // Handle active catroot interactive state
    if (isCatrootActive) {
      if (trimmed === "1") {
        setHistory((prev) => [
          ...prev,
          { command: trimmed, output: "[catroot] Opção 1: Reiniciando em LoCmdL (GRUB Bootloader)..." },
        ]);
        setIsCatrootActive(false);
        setInput("");
        setTimeout(() => {
          onRebootToGrub();
        }, 600);
        return;
      }

      if (trimmed === "2") {
        setIsRootDeleted(true);
        setIsCatrootActive(false);
        setInput("");
        setHistory((prev) => [
          ...prev,
          {
            command: trimmed,
            output: (
              <div className="text-rose-300 space-y-1">
                <p>[!] ROOT desinstalado e privilégios revogados com sucesso.</p>
                <p className="text-amber-400 font-bold">
                  [!] O comando 'catroot' foi desativado. Para restaurar, digite: LoBK -I catroot
                </p>
              </div>
            ),
          },
        ]);
        return;
      }

      if (trimmed === "3") {
        setIsCatrootActive(false);
        setInput("");
        setHistory((prev) => [
          ...prev,
          {
            command: trimmed,
            output: (
              <div className="text-sky-300 space-y-1">
                <p>[catroot] Opção 3: Você já está no console virtual LoTTY (/dev/tty1).</p>
                <p className="text-zinc-400 text-xs">Para voltar ao ambiente gráfico LoLogin, digite: startx</p>
              </div>
            ),
          },
        ]);
        return;
      }

      if (trimmed === "4") {
        setIsCatrootActive(false);
        setInput("");
        setHistory((prev) => [
          ...prev,
          { command: trimmed, output: "[catroot] Sessão do menu catroot finalizada." },
        ]);
        return;
      }

      if (trimmed === "5") {
        setIsCatrootActive(false);
        setInput("");
        setHistory((prev) => [
          ...prev,
          {
            command: trimmed,
            output: (
              <div className="text-[#cba6f7] space-y-1">
                <p className="font-bold">[catroot] Opção 5: Inicializando explorador do Vault /dev/BIOS/CEFI/...</p>
                <p className="text-zinc-400 text-xs">Proteção de hardware catEFI ativa. Pressione Control + Alt + F4 para sair dos executáveis .efi.</p>
              </div>
            ),
          },
        ]);
        if (onOpenCefiVault) {
          setTimeout(() => {
            onOpenCefiVault();
          }, 300);
        }
        return;
      }

      // Invalid option
      setHistory((prev) => [
        ...prev,
        {
          command: trimmed,
          output: "Opção inválida. Digite 1 (LoCmdL), 2 (Deletar ROOT), 3 (LoTTY), 4 (SAIR) ou 5 (Abrir /dev/BIOS/CEFI/):",
          isError: true,
        },
      ]);
      setInput("");
      return;
    }

    // Normal command processing
    const lower = trimmed.toLowerCase();

    // Check LoBK restoration command (e.g. "lobk -i catroot" or "lobk -i catroot")
    if (lower === "lobk -i catroot") {
      setIsRootDeleted(false);
      setHistory((prev) => [
        ...prev,
        {
          command: trimmed,
          output: (
            <div className="text-emerald-400 space-y-1 font-mono">
              <p>[*] Executando LoBK (Lobaite Backup & Restore Tool v3.4)...</p>
              <p>[+] Verificando checksum dos pacotes...</p>
              <p>[+] Binário /usr/bin/catroot restaurado com sucesso.</p>
              <p className="text-white font-bold">[✓] Privilégios ROOT reestabelecidos no sistema!</p>
            </div>
          ),
        },
      ]);
      setInput("");
      return;
    }

    if (lower === "catroot") {
      if (isRootDeleted) {
        setHistory((prev) => [
          ...prev,
          {
            command: trimmed,
            output: (
              <div className="text-rose-400 font-mono">
                bash: catroot: comando não encontrado ou ROOT deletado. Digite 'LoBK -I catroot' para restaurar.
              </div>
            ),
            isError: true,
          },
        ]);
      } else {
        setIsCatrootActive(true);
        setHistory((prev) => [
          ...prev,
          {
            command: trimmed,
            output: (
              <div className="text-sky-300 font-mono text-xs">
                <pre className="leading-tight text-sky-400 font-bold bg-zinc-950 p-2 border border-zinc-800 rounded">
                  {CATROOT_ASCII}
                </pre>
              </div>
            ),
          },
        ]);
      }
      setInput("");
      return;
    }

    if (lower === "startx" || lower === "exit" || lower === "gui" || lower === "lobaite-gui") {
      setHistory((prev) => [
        ...prev,
        { command: trimmed, output: "Iniciando servidor gráfico e restaurando LoLogin Desktop..." },
      ]);
      setInput("");
      setTimeout(() => {
        onExitTTY();
      }, 500);
      return;
    }

    if (lower === "reboot") {
      setHistory((prev) => [
        ...prev,
        { command: trimmed, output: "Reiniciando sistema no GRUB..." },
      ]);
      setInput("");
      setTimeout(() => {
        onRebootToGrub();
      }, 500);
      return;
    }

    if (lower === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    if (lower === "help") {
      setHistory((prev) => [
        ...prev,
        {
          command: trimmed,
          output: (
            <div className="text-zinc-400 space-y-1">
              <p className="text-white font-bold">Comandos LoTTY disponíveis:</p>
              <p>• <span className="text-emerald-400">catroot</span> : Abre o menu interativo com a arte ASCII</p>
              <p>• <span className="text-emerald-400">LoBK -I catroot</span> : Restaura o binário catroot se foi deletado</p>
              <p>• <span className="text-emerald-400">startx / exit</span> : Retorna ao ambiente gráfico Desktop (LoLogin)</p>
              <p>• <span className="text-emerald-400">reboot</span> : Reinicia o computador no GRUB</p>
              <p>• <span className="text-emerald-400">clear</span> : Limpa a tela</p>
            </div>
          ),
        },
      ]);
      setInput("");
      return;
    }

    // Default unknown command
    setHistory((prev) => [
      ...prev,
      {
        command: trimmed,
        output: `bash: ${trimmed}: comando não encontrado no modo TTY. Digite 'help' ou 'catroot'.`,
        isError: true,
      },
    ]);
    setInput("");
  };

  return (
    <div className="fixed inset-0 z-[9998] bg-black text-zinc-100 font-mono flex flex-col justify-between p-4 sm:p-6 select-text animate-in fade-in duration-200">
      {/* TTY Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2 text-xs text-zinc-400 select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-emerald-400" />
          <span className="text-white font-bold">LoTTY Console (/dev/tty1)</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-400">LobaiteOS 🐺</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onExitTTY}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-sky-400 border border-zinc-700 transition text-[11px]"
          >
            <Monitor className="w-3 h-3" />
            <span>startx (Voltar para GUI)</span>
          </button>
          <button
            onClick={onRebootToGrub}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-rose-400 border border-zinc-700 transition text-[11px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reboot GRUB</span>
          </button>
        </div>
      </div>

      {/* TTY Output */}
      <div className="flex-1 overflow-y-auto my-3 space-y-2 text-xs font-mono">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            {item.command && (
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="font-bold">root@lobaite-tty1:~#</span>
                <span className="text-white">{item.command}</span>
              </div>
            )}
            <div className={item.isError ? "text-rose-400" : "text-zinc-300"}>{item.output}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Prompt Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCommand(input);
        }}
        className="flex items-center gap-2 pt-2 border-t border-zinc-900 text-xs font-mono"
      >
        <span className="text-emerald-400 font-bold whitespace-nowrap">
          {isCatrootActive ? "catroot [1-4] >" : "root@lobaite-tty1:~#"}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isCatrootActive ? "Digite 1, 2, 3 ou 4..." : "Digite um comando (ex: catroot, startx, help)..."}
          className="flex-1 bg-transparent text-white outline-none font-mono text-xs caret-emerald-400"
          autoFocus
        />
      </form>
    </div>
  );
};
