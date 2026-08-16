import React, { useState } from "react";
import {
  Sliders,
  Palette,
  Shield,
  Lock,
  Globe,
  Radio,
  RefreshCw,
  Eye,
  Key,
  CheckCircle2,
  Zap,
  Code2,
  Terminal,
  Cpu,
  GitBranch,
} from "lucide-react";
import { KERNEL_INFO, THEMES } from "../../utils/systemData";
import { SystemEdition, SystemTheme } from "../../types";

interface SystemSettingsAppProps {
  currentTheme: SystemTheme;
  setCurrentTheme: (theme: SystemTheme) => void;
  lockPin: string;
  setLockPin: (pin: string) => void;
  dnsProvider: string;
  setDnsProvider: (dns: string) => void;
  autoLockMinutes: number;
  setAutoLockMinutes: (min: number) => void;
  clipboardAutoClear: boolean;
  setClipboardAutoClear: (clear: boolean) => void;
  systemEdition?: SystemEdition;
  setSystemEdition?: React.Dispatch<React.SetStateAction<SystemEdition>>;
}

export const SystemSettingsApp: React.FC<SystemSettingsAppProps> = ({
  currentTheme,
  setCurrentTheme,
  lockPin,
  setLockPin,
  dnsProvider,
  setDnsProvider,
  autoLockMinutes,
  setAutoLockMinutes,
  clipboardAutoClear,
  setClipboardAutoClear,
  systemEdition = "standard",
  setSystemEdition,
}) => {
  const [activeTab, setActiveTab] = useState<"appearance" | "security" | "network" | "locomunite" | "about">("appearance");
  const [newPinInput, setNewPinInput] = useState(lockPin);
  const [pinMessage, setPinMessage] = useState<string | null>(null);

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.length < 4) {
      alert("O PIN de bloqueio deve conter no mínimo 4 dígitos.");
      return;
    }
    setLockPin(newPinInput);
    setPinMessage("PIN mestre atualizado com sucesso.");
    setTimeout(() => setPinMessage(null), 3000);
  };

  const activeKernelInfo = KERNEL_INFO[systemEdition];

  return (
    <div id="system-settings-app" className="h-full flex flex-col bg-zinc-950/90 text-zinc-100 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Configurações do LobaireOS</h2>
            <p className="text-xs text-zinc-400">
              Kernel: <span className="text-sky-400 font-mono font-medium">{activeKernelInfo.kernelName}</span>
            </p>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => setActiveTab("appearance")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "appearance" ? "bg-sky-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Aparência
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "security" ? "bg-sky-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Segurança & PIN
          </button>
          <button
            onClick={() => setActiveTab("network")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "network" ? "bg-sky-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Rede & DNS
          </button>
          <button
            onClick={() => setActiveTab("locomunite")}
            className={`px-3 py-1.5 rounded-md font-medium transition flex items-center gap-1.5 ${
              activeTab === "locomunite" ? "bg-sky-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            LoComunite
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`px-3 py-1.5 rounded-md font-medium transition ${
              activeTab === "about" ? "bg-sky-500 text-zinc-950 font-bold" : "text-zinc-400 hover:text-white"
            }`}
          >
            Sobre
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-zinc-300">
        {/* Tab 1: Appearance */}
        {activeTab === "appearance" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Temas Minimalistas</h3>
              <p className="text-zinc-400">Escolha o ambiente visual com paleta calibrada para foco e discrição.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {THEMES.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setCurrentTheme(t)}
                  className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                    currentTheme.id === t.id
                      ? "bg-zinc-800/90 border-sky-500 shadow-lg shadow-sky-500/10"
                      : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl border border-white/20 shadow-inner flex items-center justify-center text-sm font-bold"
                      style={{ background: t.bgGradient }}
                    >
                      🐺
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{t.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.primary }} />
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.accent }} />
                      </div>
                    </div>
                  </div>

                  {currentTheme.id === t.id && (
                    <span className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-400 font-bold text-[10px]">
                      SELECIONADO
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Security & PIN */}
        {activeTab === "security" && (
          <div className="max-w-xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Autenticação Mestra & Bloqueio</h3>
              <p className="text-zinc-400">Configure o código numérico PIN ou Biometria virtual do LobaireOS.</p>
            </div>

            <form onSubmit={handleSavePin} className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-4">
              <div>
                <label className="text-zinc-300 font-medium block mb-1.5">Código PIN de Desbloqueio (Padrão: 1337)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    maxLength={8}
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    className="bg-zinc-950 border border-zinc-800 focus:border-sky-500/50 rounded-xl px-4 py-2 text-white font-mono text-sm tracking-widest outline-none w-48"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold"
                  >
                    Salvar PIN
                  </button>
                </div>
              </div>

              {pinMessage && (
                <p className="text-emerald-400 text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {pinMessage}
                </p>
              )}
            </form>

            {/* Auto Lock & Clipboard settings */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <div>
                  <p className="font-medium text-white">Auto-Bloqueio por Inatividade</p>
                  <p className="text-zinc-400 text-[11px]">Trava a tela automaticamente após tempo de ócio</p>
                </div>
                <select
                  value={autoLockMinutes}
                  onChange={(e) => setAutoLockMinutes(Number(e.target.value))}
                  className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-white outline-none"
                >
                  <option value={1}>1 Minuto</option>
                  <option value={5}>5 Minutos</option>
                  <option value={15}>15 Minutos</option>
                  <option value={30}>30 Minutos</option>
                  <option value={0}>Desativado</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <div>
                  <p className="font-medium text-white">Auto-Limpeza da Área de Transferência (Clipboard)</p>
                  <p className="text-zinc-400 text-[11px]">Apaga senhas copiadas após 30 segundos</p>
                </div>
                <button
                  onClick={() => setClipboardAutoClear(!clipboardAutoClear)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    clipboardAutoClear ? "bg-sky-500" : "bg-zinc-700"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      clipboardAutoClear ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Network & DNS */}
        {activeTab === "network" && (
          <div className="max-w-xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white mb-1">Provedor DNS Criptografado (DoH / DoT)</h3>
              <p className="text-zinc-400">Escolha o servidor resolver que não mantém logs e bloqueia malwares.</p>
            </div>

            <div className="space-y-3">
              {[
                { name: "Quad9 (Recomendado)", id: "Quad9", desc: "9.9.9.9 • Bloqueio de malware, sem logs de IP, sede na Suíça" },
                { name: "Mullvad DNS", id: "Mullvad-DoH", desc: "doh.mullvad.net • Focado em privacidade rigorosa e anti-tracker" },
                { name: "Cloudflare 1.1.1.1 (Privacy First)", id: "Cloudflare-DoH", desc: "1.1.1.1 • Alta velocidade com criptografia DoH ponta a ponta" },
                { name: "AdGuard DNS", id: "AdGuard-DNS", desc: "dns.adguard.com • Bloqueio severo de anúncios e rastreadores" },
              ].map((prov) => (
                <div
                  key={prov.id}
                  onClick={() => setDnsProvider(prov.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    dnsProvider === prov.id
                      ? "bg-zinc-800/90 border-sky-500 text-white"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                  }`}
                >
                  <div>
                    <h4 className="font-semibold">{prov.name}</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{prov.desc}</p>
                  </div>
                  {dnsProvider === prov.id && (
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-bold text-[10px]">
                      ATIVO
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: LoComunite & Kernel Subsystems */}
        {activeTab === "locomunite" && (
          <div className="max-w-2xl space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-white">LoComunite • Código do Sistema & Sub-Kernels</h3>
              </div>
              <p className="text-zinc-400 mt-1">
                Gerencie o código-fonte do sistema operacional e alterne entre as versões do Kernel KobaireKe.
              </p>
            </div>

            {/* Kernel Selector Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: Standard LobaireOS (No LOPS) */}
              <div
                onClick={() => setSystemEdition?.("standard")}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-3 ${
                  systemEdition === "standard"
                    ? "bg-zinc-900 border-sky-500 shadow-lg shadow-sky-500/10"
                    : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-300 border border-zinc-700">
                      OFICIAL
                    </span>
                    {systemEdition === "standard" && (
                      <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-bold">
                        EM EXECUÇÃO
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-white text-sm mt-2">LobaireOS Padrão</h4>
                  <p className="font-mono text-xs text-sky-400 mt-1">KobaireKe -- LobaireOS No LOPS</p>
                  <p className="text-[11px] text-zinc-400 mt-2">
                    Kernel de produção blindado com isolamento rígido de memória, sem rotinas experimentais LOPS.
                  </p>
                </div>
                <div className="pt-2 border-t border-zinc-800 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                  <span>LOPS: Desabilitado</span>
                  <span className="text-emerald-400">Zero-Trust V4.19</span>
                </div>
              </div>

              {/* Option 2: LoComunite (LOPS) */}
              <div
                onClick={() => setSystemEdition?.("locomunite")}
                className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-3 ${
                  systemEdition === "locomunite"
                    ? "bg-zinc-900 border-sky-500 shadow-lg shadow-sky-500/10"
                    : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-sky-500/10 text-[10px] font-mono text-sky-300 border border-sky-500/30">
                      LOCOMUNITE
                    </span>
                    {systemEdition === "locomunite" && (
                      <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-bold">
                        EM EXECUÇÃO
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-white text-sm mt-2">LoComunite (Código Fonte)</h4>
                  <p className="font-mono text-xs text-sky-400 mt-1">KobaireKe -- LobaireOS LOPS</p>
                  <p className="text-[11px] text-zinc-400 mt-2">
                    Edição aberta com o subsistema otimizado de processos LOPS (Lobaire Optimized Process Subsystem) ativo.
                  </p>
                </div>
                <div className="pt-2 border-t border-zinc-800 text-[10px] font-mono text-zinc-400 flex items-center justify-between">
                  <span className="text-sky-300">LOPS: Ativo (Comunidade)</span>
                  <span className="text-emerald-400">Open Source</span>
                </div>
              </div>
            </div>

            {/* LoComunite System Code Box */}
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-sky-400" />
                  Código do Kernel KobaireKe (kobaire_kernel.c)
                </span>
                <span className="text-[10px] font-mono text-zinc-400">LoComunite v3.4</span>
              </div>
              <pre className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono text-[11px] text-zinc-300 overflow-x-auto">
{`#include <lobaire/security.h>
#include <lobaire/sandbox.h>

#ifdef CONFIG_LOBAIRE_LOPS
#define KERNEL_RELEASE "KobaireKe -- LobaireOS LOPS"
#define LOPS_OPTIMIZED_SUBSYSTEM 1
#else
#define KERNEL_RELEASE "KobaireKe -- LobaireOS No LOPS"
#define LOPS_OPTIMIZED_SUBSYSTEM 0
#endif

int init_kobaire_kernel(void) {
    printk("[KobaireKe] Booting Kernel: %s\\n", KERNEL_RELEASE);
    printk("[KobaireKe] LOPS Subsystem: %s\\n", 
           LOPS_OPTIMIZED_SUBSYSTEM ? "ENABLED (LoComunite)" : "DISABLED (No LOPS)");
    enforce_process_isolation();
    return 0;
}`}
              </pre>
            </div>
          </div>
        )}

        {/* Tab 5: About LobaireOS */}
        {activeTab === "about" && (
          <div className="max-w-xl space-y-4">
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-3xl mx-auto shadow-xl">
                🐺
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">{activeKernelInfo.editionName}</h3>
                <p className="text-xs text-sky-400 font-mono font-semibold">{activeKernelInfo.kernelName}</p>
                <p className="text-[11px] text-zinc-400 mt-1">{activeKernelInfo.tagline}</p>
              </div>
              <p className="text-xs text-zinc-300 max-w-md mx-auto leading-relaxed">
                {activeKernelInfo.description}. Desenvolvido para oferecer máxima segurança, soberania de dados e privacidade absoluta.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1.5 font-mono text-[11px] text-zinc-400">
              <p>• Kernel Ativo: <span className="text-sky-300 font-bold">{activeKernelInfo.kernelName}</span></p>
              <p>• Base de Código: LoComunite Open Security Subsystem</p>
              <p>• Suíte Criptográfica: AES-256-GCM, PBKDF2-SHA256, Ed25519</p>
              <p>• Motor de IA: Lobaire Guardian (Gemini 3.7 Flash)</p>
              <p>• Arquitetura de Memória: Zero-Leak Volatile Sandbox</p>
              <p>• Licença: Código Aberto & Soberano</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

