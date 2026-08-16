import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Wifi,
  Lock,
  EyeOff,
  Radio,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Globe,
  Terminal,
  Activity,
  Zap,
} from "lucide-react";
import { SecurityIncident } from "../../types";

interface WolfShieldAppProps {
  firewallActive: boolean;
  setFirewallActive: React.Dispatch<React.SetStateAction<boolean>>;
  stealthMode: boolean;
  setStealthMode: React.Dispatch<React.SetStateAction<boolean>>;
  torRouting: boolean;
  setTorRouting: React.Dispatch<React.SetStateAction<boolean>>;
  camMicBlocked: boolean;
  setCamMicBlocked: React.Dispatch<React.SetStateAction<boolean>>;
  trackersBlocked: number;
  setTrackersBlocked: React.Dispatch<React.SetStateAction<number>>;
  incidents: SecurityIncident[];
  dnsProvider: string;
  setDnsProvider: React.Dispatch<React.SetStateAction<string>>;
}

export const WolfShieldApp: React.FC<WolfShieldAppProps> = ({
  firewallActive,
  setFirewallActive,
  stealthMode,
  setStealthMode,
  torRouting,
  setTorRouting,
  camMicBlocked,
  setCamMicBlocked,
  trackersBlocked,
  setTrackersBlocked,
  incidents,
  dnsProvider,
  setDnsProvider,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "firewall" | "leaktest" | "telemetry">("overview");
  const [isTestingLeaks, setIsTestingLeaks] = useState(false);
  const [leakResults, setLeakResults] = useState<{
    dnsLeak: boolean;
    webrtcLeak: boolean;
    canvasNoise: boolean;
    ipExposed: boolean;
  }>({
    dnsLeak: false,
    webrtcLeak: false,
    canvasNoise: true,
    ipExposed: false,
  });

  const [firewallRules, setFirewallRules] = useState([
    { id: 1, name: "Bloquear Analytics & Telemetria", port: "443/80", target: "*.google-analytics.com, *.doubleclick.net", status: "BLOCKED", active: true },
    { id: 2, name: "Proteção contra WebRTC STUN", port: "3478, 19302", target: "stun.*, *.stunprotocol.org", status: "BLOCKED", active: true },
    { id: 3, name: "Forçar DNS over HTTPS (DoH)", port: "853 / 443", target: "Quad9 / Cloudflare DoH", status: "ROUTED", active: true },
    { id: 4, name: "Isolamento de Processos Host", port: "Local IPC", target: "Sockets de Domínio Unix", status: "SANDBOXED", active: true },
    { id: 5, name: "Filtro de Conexões de Entrada (Stealth)", port: "ALL INBOUND", target: "0.0.0.0/0", status: "DROP_SILENT", active: firewallActive },
  ]);

  // Simulate real-time tracker blocking increment
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        setTrackersBlocked((prev) => prev + Math.floor(Math.random() * 2) + 1);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [setTrackersBlocked]);

  const runLeakTest = () => {
    setIsTestingLeaks(true);
    setTimeout(() => {
      setLeakResults({
        dnsLeak: false,
        webrtcLeak: false,
        canvasNoise: true,
        ipExposed: false,
      });
      setIsTestingLeaks(false);
    }, 1800);
  };

  const securityScore =
    (firewallActive ? 25 : 0) +
    (stealthMode ? 25 : 10) +
    (torRouting ? 25 : 15) +
    (camMicBlocked ? 25 : 15);

  return (
    <div id="wolfshield-app" className="h-full flex flex-col bg-slate-950/90 text-slate-100 select-none">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              WolfShield Cyber Center
              <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                ATIVO
              </span>
            </h2>
            <p className="text-xs text-slate-400">Proteção de Nível Soberano • Zero Telemetria • Modo Sandbox</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === "overview" ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab("firewall")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === "firewall" ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Firewall ({firewallRules.filter((r) => r.active).length})
          </button>
          <button
            onClick={() => setActiveTab("leaktest")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === "leaktest" ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Auditoria de Vazamentos
          </button>
          <button
            onClick={() => setActiveTab("telemetry")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === "telemetry" ? "bg-cyan-500 text-slate-950 shadow" : "text-slate-400 hover:text-white"
            }`}
          >
            Feed de Bloqueios
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Top Score Banner */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium uppercase tracking-wider">Índice de Blindagem</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="my-2 flex items-baseline gap-2">
                  <span className="text-3xl font-bold font-mono text-emerald-400">{securityScore}%</span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${securityScore}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium uppercase tracking-wider">Rastreadores Abortados</span>
                  <EyeOff className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="my-2">
                  <span className="text-3xl font-bold font-mono text-cyan-400">{trackersBlocked.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-slate-400">Telemetrias e scripts bloqueados</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium uppercase tracking-wider">Túnel DNS Criptografado</span>
                  <Globe className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="my-2">
                  <span className="text-lg font-bold font-mono text-indigo-300 truncate">{dnsProvider}</span>
                </div>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> DoH Zero-Log Ativo
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium uppercase tracking-wider">Hardware Killswitch</span>
                  <Radio className="w-4 h-4 text-amber-400" />
                </div>
                <div className="my-2">
                  <span className={`text-base font-bold font-mono ${camMicBlocked ? "text-emerald-400" : "text-amber-400"}`}>
                    {camMicBlocked ? "DESCONECTADO" : "MONITORADO"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Câmera e Microfone isolados</p>
              </div>
            </div>

            {/* Quick Toggle Matrix */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Matriz de Proteção Instantânea
                </h3>
                <span className="text-xs text-slate-400">Ajustes imediatos do Kernel</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Toggle 1: Firewall */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${firewallActive ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-400"}`}>
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">Firewall de Pacotes Profundo</p>
                      <p className="text-[11px] text-slate-400">Descarta silenciosamente conexões não autorizadas</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFirewallActive(!firewallActive)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      firewallActive ? "bg-emerald-500" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        firewallActive ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle 2: Stealth Mode */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${stealthMode ? "bg-cyan-500/10 text-cyan-400" : "bg-slate-800 text-slate-400"}`}>
                      <EyeOff className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">Modo Stealth & Anti-Fingerprint</p>
                      <p className="text-[11px] text-slate-400">Injeta ruído aleatório em Canvas, WebGL e AudioContext</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStealthMode(!stealthMode)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      stealthMode ? "bg-cyan-500" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        stealthMode ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle 3: Tor Onion Routing */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${torRouting ? "bg-purple-500/10 text-purple-400" : "bg-slate-800 text-slate-400"}`}>
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">Roteamento em Cebola (Tor Network)</p>
                      <p className="text-[11px] text-slate-400">Encaminha tráfego através de 3 relés criptografados</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setTorRouting(!torRouting)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      torRouting ? "bg-purple-500" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        torRouting ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Toggle 4: Cam & Mic Killswitch */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${camMicBlocked ? "bg-amber-500/10 text-amber-400" : "bg-slate-800 text-slate-400"}`}>
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white">Trava de Câmera & Microfone</p>
                      <p className="text-[11px] text-slate-400">Corta acesso de drivers no nível da interface</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCamMicBlocked(!camMicBlocked)}
                    className={`w-11 h-6 rounded-full transition-colors relative ${
                      camMicBlocked ? "bg-amber-500" : "bg-slate-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        camMicBlocked ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Live Security Log Preview */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Últimos Eventos de Defesa
                </span>
                <span className="text-[11px] font-mono text-slate-400">Status: VIGILÂNCIA TOTAL</span>
              </div>
              <div className="space-y-2">
                {incidents.slice(0, 3).map((inc) => (
                  <div key={inc.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs">
                    <span className="font-mono text-[10px] text-slate-400 px-1.5 py-0.5 rounded bg-slate-800">{inc.timestamp}</span>
                    <div className="flex-1">
                      <p className="font-medium text-slate-200">{inc.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{inc.details}</p>
                    </div>
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {inc.severity.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Firewall Rules */}
        {activeTab === "firewall" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-white">Regras de Filtragem de Pacotes</h3>
                <p className="text-xs text-slate-400">Inspeção profunda de cabeçalhos e portas de rede</p>
              </div>
              <button
                onClick={() => setFirewallActive(!firewallActive)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition ${
                  firewallActive ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                }`}
              >
                <Flame className="w-4 h-4" />
                {firewallActive ? "Firewall Operacional" : "Firewall Pausado"}
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="p-3">Regra de Segurança</th>
                    <th className="p-3">Porta / Protocolo</th>
                    <th className="p-3">Destino / Padrão</th>
                    <th className="p-3">Ação</th>
                    <th className="p-3 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                  {firewallRules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-slate-800/30 transition">
                      <td className="p-3 font-sans font-medium text-white">{rule.name}</td>
                      <td className="p-3 text-cyan-400">{rule.port}</td>
                      <td className="p-3 text-slate-400">{rule.target}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-amber-300">{rule.status}</span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setFirewallRules((prev) =>
                              prev.map((r) => (r.id === rule.id ? { ...r, active: !r.active } : r))
                            );
                          }}
                          className={`px-2.5 py-1 rounded text-[10px] font-semibold ${
                            rule.active ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-500"
                          }`}
                        >
                          {rule.active ? "HABILITADO" : "DESATIVADO"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Leak Test */}
        {activeTab === "leaktest" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-cyan-400" />
                  Auditoria de Vazamentos de Privacidade (Leak Inspector)
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Testa se o seu endereço IP, solicitações DNS e requisições WebRTC STUN estão vazando para fora do túnel seguro.
                </p>
              </div>
              <button
                onClick={runLeakTest}
                disabled={isTestingLeaks}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-2 transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isTestingLeaks ? "animate-spin" : ""}`} />
                {isTestingLeaks ? "Auditando Conexão..." : "Executar Teste Completo"}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Vazamento de DNS (DNS Leak)</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/20 text-emerald-400">
                    PROTEGIDO (ZERO LEAK)
                  </span>
                </div>
                <p className="text-xs text-slate-400">Todas as consultas são criptografadas em DoH via Quad9/Tor. Nenhum servidor ISP detectado.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Vazamento WebRTC (Local & Public IP)</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/20 text-emerald-400">
                    BLOQUEADO
                  </span>
                </div>
                <p className="text-xs text-slate-400">Candidatos STUN bloqueados no navegador. Seu IP local e público permanecem anônimos.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Injeção Anti-Fingerprinting (Canvas / WebGL)</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-cyan-500/20 text-cyan-400">
                    RUÍDO ATIVO
                  </span>
                </div>
                <p className="text-xs text-slate-400">Hash de renderização gráfica alterado a cada sessão para impossibilitar o rastreamento único.</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Exposição do IP Real</span>
                  <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/20 text-emerald-400">
                    OCULTO (NÓ SAÍDA ANON)
                  </span>
                </div>
                <p className="text-xs text-slate-400">IP mascarado com sucesso pelo circuito de anonimato do LobaireOS.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Telemetry Feed */}
        {activeTab === "telemetry" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-white">Registro em Tempo Real de Ameaças Interceptadas</h3>
                <p className="text-xs text-slate-400">Logs mantidos apenas em memória volátil (RAM)</p>
              </div>
              <span className="text-xs font-mono text-cyan-400 px-3 py-1 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                Total Bloqueado: {trackersBlocked}
              </span>
            </div>

            <div className="space-y-2">
              {incidents.map((inc) => (
                <div key={inc.id} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                    {inc.category === "fingerprint" ? <EyeOff className="w-4 h-4 text-cyan-400" /> : <ShieldAlert className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-medium text-white">{inc.title}</h4>
                      <span className="text-[10px] font-mono text-slate-400">{inc.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">{inc.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
