import React, { useState, useEffect } from "react";
import {
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  ShieldCheck,
  ShieldAlert,
  Flame,
  RefreshCw,
  Zap,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { SystemProcess } from "../../types";
import { INITIAL_PROCESSES } from "../../utils/systemData";

export const ThreatMonitorApp: React.FC = () => {
  const [processes, setProcesses] = useState<SystemProcess[]>(INITIAL_PROCESSES);
  const [cpuUsage, setCpuUsage] = useState(4.2);
  const [memoryUsedMb, setMemoryUsedMb] = useState(210);
  const [networkSpeedKb, setNetworkSpeedKb] = useState(38);
  const [isFlushingRam, setIsFlushingRam] = useState(false);
  const [flushMessage, setFlushMessage] = useState<string | null>(null);

  // Dynamic system stats fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage((prev) => +(Math.min(12, Math.max(2, prev + (Math.random() * 2 - 1))).toFixed(1)));
      setNetworkSpeedKb((prev) => Math.max(12, Math.min(220, Math.floor(prev + (Math.random() * 20 - 10)))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleFlushRam = () => {
    setIsFlushingRam(true);
    setTimeout(() => {
      setMemoryUsedMb(142);
      setIsFlushingRam(false);
      setFlushMessage("Memória RAM sanitizada: Páginas desocupadas zeradas com segurança.");
      setTimeout(() => setFlushMessage(null), 4000);
    }, 1500);
  };

  const handleKillProcess = (pid: number) => {
    setProcesses((prev) => prev.filter((p) => p.pid !== pid));
  };

  return (
    <div id="threat-monitor-app" className="h-full flex flex-col bg-slate-950/90 text-slate-100 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              Monitor de Ameaças & Recursos
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                SANDBOX KERNEL
              </span>
            </h2>
            <p className="text-xs text-slate-400">Inspeção de Processos em Tempo Real & Isolamento de Memória</p>
          </div>
        </div>

        <button
          onClick={handleFlushRam}
          disabled={isFlushingRam}
          className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFlushingRam ? "animate-spin" : ""}`} />
          <span>{isFlushingRam ? "Zerando Memória..." : "Sanitizar Memória RAM"}</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">Uso de CPU</span>
              <Cpu className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-cyan-300">{cpuUsage}%</span>
              <span className="text-[10px] text-slate-400">/ 8 Cores Virtuais</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-cyan-400 h-full transition-all duration-300" style={{ width: `${cpuUsage * 5}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">Memória Volátil</span>
              <HardDrive className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-emerald-300">{memoryUsedMb} MB</span>
              <span className="text-[10px] text-slate-400">/ 16 GB</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-400 h-full transition-all duration-300" style={{ width: `${(memoryUsedMb / 1000) * 100}%` }} />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">Tráfego Criptografado</span>
              <Wifi className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold font-mono text-indigo-300">{networkSpeedKb} KB/s</span>
              <span className="text-[10px] text-slate-400">Via Tor / DoH</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-400 h-full transition-all duration-300" style={{ width: `${(networkSpeedKb / 300) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* Flush toast notice if triggered */}
        {flushMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{flushMessage}</span>
          </div>
        )}

        {/* Process Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Processos em Execução ({processes.length})
            </h3>
            <span className="text-[10px] font-mono text-slate-500">SELEÇÃO ESTÁVEL</span>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/60 text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-3">PID</th>
                  <th className="p-3">Nome do Processo</th>
                  <th className="p-3">CPU</th>
                  <th className="p-3">Memória</th>
                  <th className="p-3">Isolamento</th>
                  <th className="p-3">Status de Risco</th>
                  <th className="p-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {processes.map((proc) => (
                  <tr key={proc.pid} className="hover:bg-slate-800/30 transition">
                    <td className="p-3 text-slate-400">{proc.pid}</td>
                    <td className="p-3 font-sans font-medium text-white">{proc.name}</td>
                    <td className="p-3 text-cyan-400">{proc.cpu}%</td>
                    <td className="p-3 text-emerald-400">{proc.memoryMb} MB</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-cyan-300">
                        {proc.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">
                        {proc.threatScore}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleKillProcess(proc.pid)}
                        className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        title="Finalizar processo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
