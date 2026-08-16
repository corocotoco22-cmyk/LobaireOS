import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Sparkles, Shield, Trash2, Code2 } from "lucide-react";
import { calculateSHA256, generateWolfPassword } from "../../utils/crypto";
import { SystemEdition } from "../../types";
import { KERNEL_INFO } from "../../utils/systemData";

interface WolfShellAppProps {
  onTriggerPanic?: () => void;
  onOpenApp?: (appId: string) => void;
  systemEdition?: SystemEdition;
  setSystemEdition?: React.Dispatch<React.SetStateAction<SystemEdition>>;
}

export const WolfShellApp: React.FC<WolfShellAppProps> = ({
  onTriggerPanic,
  onOpenApp,
  systemEdition = "standard",
  setSystemEdition,
}) => {
  const currentKernel = KERNEL_INFO[systemEdition];

  const [history, setHistory] = useState<Array<{ command?: string; output: string | React.ReactNode; isError?: boolean }>>([
    {
      output: (
        <div className="text-sky-300 font-mono text-xs space-y-1">
          <pre className="text-sky-400 font-bold leading-tight">
{`   /\\_\\_\\   LobaireOS WolfShell v3.4.0-hardened
  ( o.o )   Zero-Trust Sovereign WebOS Subsystem
   > ^ <    Type 'help' for available privacy commands.`}
          </pre>
          <div className="text-zinc-400 text-[11px] space-y-0.5 pt-1 border-t border-zinc-800/80">
            <p>• Kernel Ativo: <span className="text-sky-400 font-bold">{currentKernel.kernelName}</span></p>
            <p>• Edição: <span className="text-zinc-200">{currentKernel.editionName}</span></p>
            <p>• Memória volátil isolada • Chaves de criptografia Zero-Trust ativas</p>
          </div>
        </div>
      ),
    },
  ]);
  const [input, setInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isMatrixActive, setIsMatrixActive] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isMatrixActive]);

  const handleCommand = async (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output: string | React.ReactNode = "";
    let isError = false;

    switch (command) {
      case "help":
        output = (
          <div className="space-y-1 text-zinc-300 text-xs">
            <p className="text-sky-400 font-bold">Comandos do Sistema KobaireKe & Soberania:</p>
            <p>• <span className="text-emerald-400 font-mono">uname -a / kernel</span> : Exibe versão e release do Kernel KobaireKe</p>
            <p>• <span className="text-emerald-400 font-mono">locomunite</span> : Informações do código-fonte e subsistema LOPS</p>
            <p>• <span className="text-emerald-400 font-mono">locomunite --toggle</span> : Alterna entre Edição Padrão e LoComunite</p>
            <p>• <span className="text-emerald-400 font-mono">locomunite --code</span> : Exibe o código fonte de inicialização do kernel</p>
            <p>• <span className="text-emerald-400 font-mono">wolf --status</span> : Relatório do Kernel e Proteções</p>
            <p>• <span className="text-emerald-400 font-mono">genpass [tamanho]</span> : Gera senha militar criptográfica</p>
            <p>• <span className="text-emerald-400 font-mono">hash &lt;texto&gt;</span> : Calcula hash SHA-256 imediato</p>
            <p>• <span className="text-emerald-400 font-mono">firewall</span> : Inspeciona status do filtro de pacotes</p>
            <p>• <span className="text-emerald-400 font-mono">tor --circuit</span> : Lista nós ativos do circuito em cebola</p>
            <p>• <span className="text-emerald-400 font-mono">netstat</span> : Mostra conexões de rede locais e portas</p>
            <p>• <span className="text-emerald-400 font-mono">whoami</span> : Exibe identidade e isolamento do sandbox</p>
            <p>• <span className="text-emerald-400 font-mono">neofetch</span> : Exibe especificações minimalistas do OS</p>
            <p>• <span className="text-emerald-400 font-mono">matrix</span> : Ativa chuva binária de segurança</p>
            <p>• <span className="text-emerald-400 font-mono">open &lt;app&gt;</span> : Abre app (shield, vault, guardian, files, settings)</p>
            <p>• <span className="text-emerald-400 font-mono">panic</span> : Aciona protocolo de emergência imediato</p>
            <p>• <span className="text-emerald-400 font-mono">clear</span> : Limpa a tela do terminal</p>
          </div>
        );
        break;

      case "clear":
        setHistory([]);
        return;

      case "uname":
      case "kernel":
        if (args[0] === "-r") {
          output = currentKernel.kernelName;
        } else {
          output = `Linux lobaire-workstation 6.1.0-kobaire #1 SMP PREEMPT ${currentKernel.kernelName} x86_64 GNU/Linux`;
        }
        break;

      case "locomunite":
        if (args[0] === "--toggle") {
          if (setSystemEdition) {
            const next = systemEdition === "standard" ? "locomunite" : "standard";
            setSystemEdition(next);
            output = `[LoComunite] Sistema alternado para: ${KERNEL_INFO[next].editionName}\nKernel em execução: ${KERNEL_INFO[next].kernelName}`;
          } else {
            output = "Erro ao alternar edição do sistema.";
            isError = true;
          }
        } else if (args[0] === "--code") {
          output = (
            <pre className="text-sky-300 font-mono text-[11px] bg-zinc-950 p-2.5 rounded border border-zinc-800">
{`/* LoComunite: kobaire_kernel.c */
#ifdef CONFIG_LOBAIRE_LOPS
#define KERNEL_RELEASE "KobaireKe -- LobaireOS LOPS"
#define LOPS_OPTIMIZED_SUBSYSTEM 1
#else
#define KERNEL_RELEASE "KobaireKe -- LobaireOS No LOPS"
#define LOPS_OPTIMIZED_SUBSYSTEM 0
#endif`}
            </pre>
          );
        } else {
          output = (
            <div className="text-xs space-y-1 font-mono text-zinc-300">
              <p className="text-sky-400 font-bold">🐺 LOCOMUNITE — REPOSITÓRIO E CÓDIGO DO SISTEMA:</p>
              <p>• Edição Atual: <span className="text-white font-bold">{currentKernel.editionName}</span></p>
              <p>• Kernel Atual: <span className="text-sky-300 font-bold">{currentKernel.kernelName}</span></p>
              <p>• LobaireOS Padrão: <span className="text-zinc-400">KobaireKe -- LobaireOS No LOPS</span></p>
              <p>• LoComunite LOPS: <span className="text-zinc-400">KobaireKe -- LobaireOS LOPS</span></p>
              <p className="text-[11px] text-zinc-400 pt-1">
                Dica: Digite <span className="text-emerald-400 font-bold">locomunite --toggle</span> para alternar ou <span className="text-emerald-400 font-bold">locomunite --code</span> para inspecionar o fonte.
              </p>
            </div>
          );
        }
        break;

      case "wolf":
      case "wolf --status":
        output = (
          <div className="text-xs space-y-1 font-mono text-zinc-300">
            <p className="text-sky-400 font-bold">🐺 LOBAIRE-OS KERNEL ZERO-TRUST AUDIT:</p>
            <p>• Kernel: <span className="text-sky-300 font-bold">{currentKernel.kernelName}</span></p>
            <p>• Estado do Sistema: <span className="text-emerald-400 font-bold">100% BLINDADO</span></p>
            <p>• Telemetrias Externas: <span className="text-rose-400">DESABILITADAS</span></p>
            <p>• Subsistema LOPS: <span className="text-indigo-400">{systemEdition === "locomunite" ? "HABILITADO (LoComunite)" : "DESABILITADO (No LOPS)"}</span></p>
            <p>• Entropia da Memória: <span className="text-sky-400">4096-bit CSPRNG Active</span></p>
          </div>
        );
        break;

      case "whoami":
        output = "lobaire-operator@sovereign-node (UID 1000, GID 1000 - Strict Sandbox Jail)";
        break;

      case "neofetch":
        output = (
          <div className="font-mono text-xs text-zinc-300 flex items-start gap-4">
            <pre className="text-sky-400 font-bold">
{`   /\\_\\_\\
  ( 🐺 )
   \\ - /
   /   \\`}
            </pre>
            <div className="space-y-0.5">
              <p className="text-white font-bold">lobaire@wolf-workstation</p>
              <p className="text-zinc-600">----------------------</p>
              <p><strong className="text-sky-400">OS:</strong> {currentKernel.editionName}</p>
              <p><strong className="text-sky-400">Kernel:</strong> {currentKernel.kernelName}</p>
              <p><strong className="text-sky-400">Codebase:</strong> LoComunite Open Security Subsystem</p>
              <p><strong className="text-sky-400">Shell:</strong> WolfShell 3.4.0</p>
              <p><strong className="text-sky-400">WM:</strong> Lobaire Desktop Compositor</p>
              <p><strong className="text-sky-400">Memory:</strong> 184MB / 16384MB (Volatile Zero-Trace)</p>
            </div>
          </div>
        );
        break;

      case "genpass":
        const len = parseInt(args[0]) || 24;
        const pass = generateWolfPassword({ length: len, useUpper: true, useLower: true, useNumbers: true, useSymbols: true, avoidAmbiguous: true });
        output = `Senha gerada (${len} caracteres): ${pass}`;
        break;

      case "hash":
        if (args.length === 0) {
          output = "Erro: informe o texto para calcular o hash. Ex: hash meu_segredo";
          isError = true;
        } else {
          const textToHash = args.join(" ");
          const calculated = await calculateSHA256(textToHash);
          output = `SHA-256: ${calculated}`;
        }
        break;

      case "firewall":
        output = "Firewall WolfShield: 5 Regras Ativas • 0 Conexões Inbound Não Autorizadas • 48 Rastreadores Interceptados";
        break;

      case "tor":
      case "tor --circuit":
        output = "Circuito Tor Ativo: [Guarda: Islândia 🇮🇸] -> [Relay: Suíça 🇨🇭] -> [Saída: Romênia 🇷🇴] (RTT: 62ms)";
        break;

      case "netstat":
        output = (
          <div className="font-mono text-[11px] text-zinc-300 space-y-0.5">
            <p className="text-sky-400">Proto  Local Address          Foreign Address        State</p>
            <p>tcp    127.0.0.1:9050         0.0.0.0:*              LISTEN (Tor SOCKS5)</p>
            <p>tcp    127.0.0.1:853          9.9.9.9:853            ESTABLISHED (DoH Quad9)</p>
            <p>unix   /run/lobaire/vault.sock -                      CONNECTED (Sandbox IPC)</p>
          </div>
        );
        break;

      case "matrix":
        setIsMatrixActive(true);
        setTimeout(() => setIsMatrixActive(false), 5000);
        output = "Iniciando sequência de verificação criptográfica...";
        break;

      case "panic":
        if (onTriggerPanic) {
          onTriggerPanic();
          output = "🚨 PROTOCOLO DE PÂNICO DISPARADO: Limpeza de memória e bloqueio imediato.";
        }
        break;

      case "open":
        if (args[0] && onOpenApp) {
          onOpenApp(args[0]);
          output = `Abrindo aplicativo: ${args[0]}`;
        } else {
          output = "Uso: open <shield | vault | guardian | files | ghostbrowse | notes | monitor | settings>";
        }
        break;

      default:
        output = `Comando '${command}' não reconhecido pelo WolfShell. Digite 'help' para a lista de ferramentas.`;
        isError = true;
    }

    setHistory((prev) => [...prev, { command: trimmed, output, isError }]);
    setInput("");
  };

  return (
    <div id="wolfshell-app" className="h-full flex flex-col bg-zinc-950 text-zinc-200 font-mono text-xs select-text">
      {/* Terminal Titlebar Info */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800 text-zinc-400 select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-[11px] text-zinc-300">wolfshell@lobaire-node:~</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-sky-400 font-mono">[{currentKernel.kernelName}]</span>
          <span className="text-[10px] text-emerald-400 font-bold">SECURE_TTY_01</span>
        </div>
      </div>

      {/* Output Console */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono">
        {history.map((item, idx) => (
          <div key={idx} className="space-y-1">
            {item.command && (
              <div className="flex items-center gap-2 text-sky-400">
                <span className="text-emerald-400 font-bold">lobaire@wolf:~$</span>
                <span className="text-white">{item.command}</span>
              </div>
            )}
            <div className={item.isError ? "text-rose-400" : "text-zinc-300"}>{item.output}</div>
          </div>
        ))}

        {isMatrixActive && (
          <div className="text-emerald-400 font-mono text-xs animate-pulse leading-relaxed">
            01001100 01101111 01100010 01100001 01101001 01110010 01100101 01001111 01010011<br />
            [DEFENSE]: Memory encrypted with AES-256-XTS.<br />
            [DEFENSE]: Zero residual traces remaining in swap partition.<br />
            [KERNEL]: {currentKernel.kernelName} Active.
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Command Input Prompt */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCommand(input);
        }}
        className="flex items-center gap-2 px-4 py-3 bg-zinc-900/90 border-t border-zinc-800"
      >
        <span className="text-emerald-400 font-bold">lobaire@wolf:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite um comando (ex: uname, locomunite, neofetch)..."
          className="flex-1 bg-transparent text-white outline-none font-mono text-xs caret-sky-400"
          autoFocus
        />
      </form>
    </div>
  );
};

