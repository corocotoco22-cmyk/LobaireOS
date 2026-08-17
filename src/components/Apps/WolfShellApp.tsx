import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Sparkles, Shield, Trash2, Code2 } from "lucide-react";
import { calculateSHA256, generateWolfPassword } from "../../utils/crypto";
import { SystemEdition } from "../../types";
import { KERNEL_INFO } from "../../utils/systemData";

interface WolfShellAppProps {
  onTriggerPanic?: () => void;
  onOpenApp?: (appId: string) => void;
  onRestartGrub?: () => void;
  onOpenTTY?: () => void;
  onOpenCefiVault?: () => void;
  systemEdition?: SystemEdition;
  setSystemEdition?: React.Dispatch<React.SetStateAction<SystemEdition>>;
  isRootDeleted?: boolean;
  setIsRootDeleted?: (deleted: boolean) => void;
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

export const WolfShellApp: React.FC<WolfShellAppProps> = ({
  onTriggerPanic,
  onOpenApp,
  onRestartGrub,
  onOpenTTY,
  onOpenCefiVault,
  systemEdition = "standard",
  setSystemEdition,
  isRootDeleted = false,
  setIsRootDeleted,
}) => {
  const currentKernel = KERNEL_INFO[systemEdition];

  const [history, setHistory] = useState<Array<{ command?: string; output: string | React.ReactNode; isError?: boolean }>>([
    {
      output: (
        <div className="text-sky-300 font-mono text-xs space-y-1">
          <pre className="text-sky-400 font-bold leading-tight">
{`   /\\_\\_\\   LobaiteOS 🐺 WolfShell v3.4.0-hardened
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
  const [isCatrootInteractive, setIsCatrootInteractive] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, isMatrixActive, isCatrootInteractive]);

  const handleCommand = async (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    // If currently inside interactive catroot menu
    if (isCatrootInteractive) {
      if (trimmed === "1") {
        setHistory((prev) => [
          ...prev,
          {
            command: trimmed,
            output: (
              <div className="text-sky-300 font-mono">
                [catroot] Opção 1 selecionada: Reiniciando sistema em LoCmdL (GRUB Bootloader)...
              </div>
            ),
          },
        ]);
        setIsCatrootInteractive(false);
        setInput("");
        if (onRestartGrub) {
          setTimeout(() => {
            onRestartGrub();
          }, 600);
        }
        return;
      }

      if (trimmed === "2") {
        if (setIsRootDeleted) {
          setIsRootDeleted(true);
        }
        setIsCatrootInteractive(false);
        setInput("");
        setHistory((prev) => [
          ...prev,
          {
            command: trimmed,
            output: (
              <div className="text-rose-300 space-y-1 font-mono">
                <p className="text-rose-400 font-bold">[!] Deletando ROOT do sistema...</p>
                <p>[!] Permissões de superusuário revogadas e binários /usr/bin/catroot desativados.</p>
                <p className="text-amber-400 font-bold">
                  [!] O comando 'catroot' parou de funcionar. Para restaurar, digite: LoBK -I catroot
                </p>
              </div>
            ),
          },
        ]);
        return;
      }

      if (trimmed === "3") {
        setIsCatrootInteractive(false);
        setInput("");
        setHistory((prev) => [
          ...prev,
          {
            command: trimmed,
            output: (
              <div className="text-emerald-400 font-mono">
                [catroot] Opção 3: Encerrando LoLogin e abrindo o console TTY puro (/dev/tty1)...
              </div>
            ),
          },
        ]);
        if (onOpenTTY) {
          setTimeout(() => {
            onOpenTTY();
          }, 500);
        }
        return;
      }

      if (trimmed === "4") {
        setIsCatrootInteractive(false);
        setInput("");
        setHistory((prev) => [
          ...prev,
          {
            command: trimmed,
            output: "[catroot] Saindo do menu catroot. Sessão normal restaurada.",
          },
        ]);
        return;
      }

      if (trimmed === "5") {
        setIsCatrootInteractive(false);
        setInput("");
        setHistory((prev) => [
          ...prev,
          {
            command: trimmed,
            output: (
              <div className="text-purple-300 font-mono space-y-1">
                <p className="text-[#cba6f7] font-bold">[catroot] Opção 5: Abrindo cofre de hardware /dev/BIOS/CEFI/...</p>
                <p className="text-zinc-400 text-xs">• Acesso concedido exclusivamente via credencial catroot.</p>
                <p className="text-zinc-400 text-xs">• Carregador de binários .EFI (HTML) da BIOS catEFI inicializado.</p>
              </div>
            ),
          },
        ]);
        if (onOpenCefiVault) {
          setTimeout(() => {
            onOpenCefiVault();
          }, 400);
        }
        return;
      }

      // Invalid option
      setHistory((prev) => [
        ...prev,
        {
          command: trimmed,
          output: "Opção inválida. Escolha uma opção: 1 (LoCmdL), 2 (Deletar ROOT), 3 (LoTTY), 4 (SAIR) ou 5 (Abrir /dev/BIOS/CEFI/)",
          isError: true,
        },
      ]);
      setInput("");
      return;
    }

    const parts = trimmed.split(" ");
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Direct check for LoBK restoration command (e.g. "LoBK -I catroot" or "lobk -i catroot")
    if (trimmed.toLowerCase() === "lobk -i catroot") {
      if (setIsRootDeleted) {
        setIsRootDeleted(false);
      }
      setHistory((prev) => [
        ...prev,
        {
          command: trimmed,
          output: (
            <div className="text-emerald-400 font-mono space-y-1">
              <p>[*] Executando LoBK (Lobaite Backup & Restore Tool v3.4)...</p>
              <p>[+] Verificando repositório de segurança e hash de integridade...</p>
              <p>[+] Binário /usr/bin/catroot e privilégios ROOT reinstalados com sucesso!</p>
              <p className="text-white font-bold">[✓] O comando 'catroot' foi reativado no sistema.</p>
            </div>
          ),
        },
      ]);
      setInput("");
      return;
    }

    let output: string | React.ReactNode = "";
    let isError = false;

    switch (command) {
      case "catroot":
        if (isRootDeleted) {
          output = (
            <div className="text-rose-400 font-mono space-y-1">
              <p>bash: catroot: comando não encontrado ou ROOT deletado.</p>
              <p className="text-amber-400 font-bold">Digite 'LoBK -I catroot' para restaurar.</p>
            </div>
          );
          isError = true;
        } else {
          setIsCatrootInteractive(true);
          output = (
            <div className="text-sky-300 font-mono text-xs">
              <pre className="leading-tight text-sky-400 font-bold bg-zinc-950 p-2 border border-zinc-800 rounded">
                {CATROOT_ASCII}
              </pre>
            </div>
          );
        }
        break;

      case "help":
        output = (
          <div className="space-y-1 text-zinc-300 text-xs">
            <p className="text-sky-400 font-bold">Comandos do Sistema Kobaire & Soberania:</p>
            <p>• <span className="text-emerald-400 font-mono">catroot</span> : Abre o menu interativo ROOT com arte ASCII</p>
            <p>• <span className="text-emerald-400 font-mono">LoBK -I catroot</span> : Restaura o comando catroot e privilégios ROOT</p>
            <p>• <span className="text-emerald-400 font-mono">uname -a / kernel</span> : Exibe a Engine Kobaire -- LobaiteOS</p>
            <p>• <span className="text-emerald-400 font-mono">locomunite</span> : Informações do repositório GitHub e código do sistema</p>
            <p>• <span className="text-emerald-400 font-mono">locomunite --code</span> : Exibe o código fonte de inicialização</p>
            <p>• <span className="text-emerald-400 font-mono">wolf --status</span> : Relatório da Engine e Proteções</p>
            <p>• <span className="text-emerald-400 font-mono">genpass [tamanho]</span> : Gera senha militar criptográfica</p>
            <p>• <span className="text-emerald-400 font-mono">hash &lt;texto&gt;</span> : Calcula hash SHA-256 imediato</p>
            <p>• <span className="text-emerald-400 font-mono">firewall</span> : Inspeciona status do filtro de pacotes</p>
            <p>• <span className="text-emerald-400 font-mono">tor --circuit</span> : Lista nós ativos do circuito em cebola</p>
            <p>• <span className="text-emerald-400 font-mono">netstat</span> : Mostra conexões de rede locais e portas</p>
            <p>• <span className="text-emerald-400 font-mono">whoami</span> : Exibe identidade e isolamento do sandbox</p>
            <p>• <span className="text-emerald-400 font-mono">neofetch</span> : Exibe especificações minimalistas do OS</p>
            <p>• <span className="text-emerald-400 font-mono">matrix</span> : Ativa chuva binária de segurança</p>
            <p>• <span className="text-emerald-400 font-mono">open &lt;app&gt;</span> : Abre app (shield, vault, guardian, files, locomunite, settings)</p>
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
          output = "Kobaire -- LobaiteOS (TypeScript Web Engine)";
        } else {
          output = "LobaiteOS Web Engine 3.4.0 (React 18 / TypeScript 5.5 / Vite / Web Crypto Sandboxed)";
        }
        break;

      case "github":
      case "repo":
      case "locomunite":
        if (args[0] === "--code") {
          output = (
            <pre className="text-sky-300 font-mono text-[11px] bg-zinc-950 p-2.5 rounded border border-zinc-800">
{`/* LobaiteOS Web Engine: src/App.tsx */
/* Repositório: https://github.com/corocotoco22-cmyk/LobaireOS */

export function App() {
  // Inicialização do Desktop, Janelas e Sandbox Web Crypto
  return <LobaiteDesktopSystem sovereign={true} zeroTrust={true} />;
}`}
            </pre>
          );
        } else {
          output = (
            <div className="text-xs space-y-1 font-mono text-zinc-300">
              <p className="text-sky-400 font-bold">🐺 LOCOMUNITE — REPOSITÓRIO OFICIAL DO LOBAITEOS:</p>
              <p>• GitHub URL: <span className="text-white font-bold underline">https://github.com/corocotoco22-cmyk/LobaireOS</span></p>
              <p>• Git Clone: <span className="text-emerald-400">git clone https://github.com/corocotoco22-cmyk/LobaireOS.git</span></p>
              <p>• Arquitetura: <span className="text-sky-300 font-bold">React 18 + TypeScript WebOS</span></p>
              <p>• Aplicativo do Sistema: <span className="text-zinc-300">LoComunite Hub</span></p>
              <p className="text-[11px] text-zinc-400 pt-1">
                Comandos úteis: <span className="text-emerald-400 font-bold">catroot</span> | <span className="text-emerald-400 font-bold">open locomunite</span> | <span className="text-emerald-400 font-bold">wolf --status</span>
              </p>
            </div>
          );
        }
        break;

      case "wolf":
      case "wolf --status":
        output = (
          <div className="text-xs space-y-1 font-mono text-zinc-300">
            <p className="text-sky-400 font-bold">🐺 LOBAITE-OS ENGINE ZERO-TRUST AUDIT:</p>
            <p>• Engine: <span className="text-sky-300 font-bold">Kobaire -- LobaiteOS</span></p>
            <p>• Estado do Sistema: <span className="text-emerald-400 font-bold">100% BLINDADO</span></p>
            <p>• Telemetrias Externas: <span className="text-rose-400">DESABILITADAS</span></p>
            <p>• ROOT Status: <span className={isRootDeleted ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>{isRootDeleted ? "DESATIVADO / DELETADO" : "ATIVO (catroot pronto)"}</span></p>
            <p>• Entropia da Memória: <span className="text-sky-400">4096-bit CSPRNG Active</span></p>
          </div>
        );
        break;

      case "whoami":
        output = isRootDeleted
          ? "lobaite-user@sovereign-node (UID 1000, GID 1000 - Non-Root Sandbox)"
          : "root@sovereign-node (UID 0, GID 0 - Kobaire Sovereign Superuser)";
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
              <p className="text-white font-bold">lobaite@wolf-workstation</p>
              <p className="text-zinc-600">----------------------</p>
              <p><strong className="text-sky-400">OS:</strong> {currentKernel.editionName}</p>
              <p><strong className="text-sky-400">Engine:</strong> {currentKernel.kernelName}</p>
              <p><strong className="text-sky-400">Codebase:</strong> LoComunite Open Security Subsystem</p>
              <p><strong className="text-sky-400">Shell:</strong> WolfShell 3.4.0</p>
              <p><strong className="text-sky-400">WM:</strong> Lobaite Desktop Compositor</p>
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

      case "ls":
        if (args[0] && (args[0].includes("CEFI") || args[0].includes("BIOS"))) {
          output = (
            <div className="text-rose-400 font-mono space-y-1">
              <p>ls: impossível abrir diretório '{args[0]}': Permissão negada.</p>
              <p className="text-zinc-400 text-xs">
                🔒 /dev/BIOS/CEFI/ é um Vault de hardware da BIOS catEFI. Nem mesmo o superusuário 'root' possui acesso direto pelo shell.
              </p>
              <p className="text-[#cba6f7] font-bold text-xs">
                Acesse através do menu interativo: digite 'catroot' e escolha a Opção 5.
              </p>
            </div>
          );
          isError = true;
        } else {
          output = "bin  boot  dev  etc  home  lib  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var";
        }
        break;

      case "cd":
        if (args[0] && (args[0].includes("CEFI") || args[0].includes("BIOS"))) {
          output = (
            <div className="text-rose-400 font-mono space-y-1">
              <p>bash: cd: {args[0]}: Permissão negada (Hardware Vault catEFI).</p>
              <p className="text-zinc-400 text-xs">
                Apenas o atalho e menu <span className="text-[#cba6f7] font-bold">catroot</span> possui as chaves de decriptação para abrir /dev/BIOS/CEFI/.
              </p>
            </div>
          );
          isError = true;
        } else {
          output = "";
        }
        break;

      case "open":
        if (args[0] && onOpenApp) {
          onOpenApp(args[0]);
          output = `Abrindo aplicativo: ${args[0]}`;
        } else {
          output = "Uso: open <shield | vault | guardian | files | ghostbrowse | notes | monitor | settings | locomunite>";
        }
        break;

      default:
        output = `Comando '${command}' não reconhecido pelo WolfShell. Digite 'help' para a lista de ferramentas ou 'catroot' para o menu.`;
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
          <span className="text-[11px] text-zinc-300">wolfshell@lobaite-node:~</span>
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
                <span className="text-emerald-400 font-bold">
                  {isCatrootInteractive ? "catroot [1-4] >" : isRootDeleted ? "lobaite@wolf:~$" : "root@wolf:~#"}
                </span>
                <span className="text-white">{item.command}</span>
              </div>
            )}
            <div className={item.isError ? "text-rose-400" : "text-zinc-300"}>{item.output}</div>
          </div>
        ))}

        {isMatrixActive && (
          <div className="text-emerald-400 font-mono text-xs animate-pulse leading-relaxed">
            01001100 01101111 01100010 01100001 01101001 01110100 01100101 01001111 01010011<br />
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
        <span className="text-emerald-400 font-bold whitespace-nowrap">
          {isCatrootInteractive ? "catroot [1-4] >" : isRootDeleted ? "lobaite@wolf:~$" : "root@wolf:~#"}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isCatrootInteractive ? "Escolha uma opção: 1, 2, 3 ou 4..." : "Digite um comando (ex: catroot, uname, help)..."}
          className="flex-1 bg-transparent text-white outline-none font-mono text-xs caret-sky-400"
          autoFocus
        />
      </form>
    </div>
  );
};

