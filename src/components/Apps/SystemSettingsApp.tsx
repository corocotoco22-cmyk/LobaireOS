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
  ExternalLink,
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
                <h3 className="text-sm font-bold text-white">LoComunite • Repositório Oficial do LobaireOS</h3>
              </div>
              <p className="text-zinc-400 mt-1">
                Acesse o código-fonte aberto, gerencie os sub-kernels KobaireKe e colabore no desenvolvimento soberano.
              </p>
            </div>

            {/* Official GitHub Card */}
            <div className="p-5 rounded-2xl bg-zinc-900/90 border border-sky-500/30 space-y-4 shadow-xl shadow-sky-500/5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-700 flex items-center justify-center text-xl text-white">
                    🐙
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-sky-400 font-bold">corocotoco22-cmyk /</span>
                      <span className="font-mono text-sm text-white font-bold">LobaireOS</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                        Public
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Repositório Oficial & Comunidade LoComunite (Kernel: Kobaire -- LobaireOS)
                    </p>
                  </div>
                </div>

                <a
                  href="https://github.com/corocotoco22-cmyk/LobaireOS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold text-xs transition shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Acessar no GitHub</span>
                </a>
              </div>

              {/* Git clone box */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-zinc-400">Clone via HTTPS:</span>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-sky-300">
                  <span className="truncate">git clone https://github.com/corocotoco22-cmyk/LobaireOS.git</span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText("git clone https://github.com/corocotoco22-cmyk/LobaireOS.git");
                      setPinMessage("Comando Git copiado!");
                      setTimeout(() => setPinMessage(null), 2500);
                    }}
                    className="ml-2 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] transition"
                  >
                    Copiar
                  </button>
                </div>
              </div>

              {/* Repo Stats */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] block">KERNEL</span>
                  <span className="font-bold text-sky-400 font-mono text-[11px]">Kobaire -- LobaireOS</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] block">LICENÇA</span>
                  <span className="font-bold text-white font-mono">GPL-3.0</span>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                  <span className="text-zinc-500 text-[10px] block">SEGURANÇA</span>
                  <span className="font-bold text-emerald-400 font-mono">Zero-Trust</span>
                </div>
              </div>
            </div>

            {/* Kernel Card */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs font-mono flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-sky-400" />
                  Kernel do Sistema: Kobaire -- LobaireOS
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono">
                  ATIVO
                </span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                O kernel unificado <strong>Kobaire -- LobaireOS</strong> gerencia as páginas de memória volátil sob isolamento rígido AES-256 e sandboxing estrito em todos os processos.
              </p>
            </div>

            {/* LoComunite System Code Box */}
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-sky-400" />
                  Código do Kernel Kobaire (kobaire_kernel.c)
                </span>
                <span className="text-[10px] font-mono text-zinc-400">github.com/corocotoco22-cmyk/LobaireOS</span>
              </div>
              <pre className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 font-mono text-[11px] text-zinc-300 overflow-x-auto">
{`/*
 * Repositório Oficial: https://github.com/corocotoco22-cmyk/LobaireOS
 * Kernel: Kobaire -- LobaireOS
 */
#include <lobaire/security.h>
#include <lobaire/sandbox.h>

#define KERNEL_RELEASE "Kobaire -- LobaireOS"

int init_kobaire_kernel(void) {
    printk("[Kobaire] Booting Kernel: %s\\n", KERNEL_RELEASE);
    printk("[Kobaire] Repository: https://github.com/corocotoco22-cmyk/LobaireOS\\n");
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

