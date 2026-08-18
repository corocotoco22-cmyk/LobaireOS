import React, { useState, useEffect } from "react";
import {
  Activity,
  Shield,
  Radio,
  Cpu,
  Wifi,
  Zap,
  ArrowDown,
  ArrowUp,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export const ThreatMonitorPhoneApp: React.FC = () => {
  const [downloadSpeed, setDownloadSpeed] = useState(4.2);
  const [uploadSpeed, setUploadSpeed] = useState(1.1);
  const [cpuUsage, setCpuUsage] = useState(14);
  const [memoryUsage, setMemoryUsage] = useState(184);

  useEffect(() => {
    const interval = setInterval(() => {
      setDownloadSpeed(Number((Math.random() * 3 + 3).toFixed(1)));
      setUploadSpeed(Number((Math.random() * 1.5 + 0.8).toFixed(1)));
      setCpuUsage(Math.floor(Math.random() * 12 + 10));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="threatmonitor-phone-app" className="h-full flex flex-col bg-zinc-950 text-zinc-100 p-4 space-y-3 font-sans select-none">
      {/* Phone Header */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-red-950/40 via-zinc-900 to-zinc-950 border border-red-500/30 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Monitor de Telefone</h3>
            <p className="text-[11px] text-red-400 font-mono">Conexões & Consumo 5G</p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
          ESTÁVEL
        </span>
      </div>

      {/* Grid of Mobile Metrics */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span className="flex items-center gap-1"><ArrowDown className="w-3 h-3 text-cyan-400" /> Download</span>
            <span className="font-mono text-cyan-400">5G Tor</span>
          </div>
          <p className="text-xl font-mono font-extrabold text-white">{downloadSpeed} MB/s</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span className="flex items-center gap-1"><ArrowUp className="w-3 h-3 text-purple-400" /> Upload</span>
            <span className="font-mono text-purple-400">Cripto</span>
          </div>
          <p className="text-xl font-mono font-extrabold text-white">{uploadSpeed} MB/s</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span className="flex items-center gap-1"><Cpu className="w-3 h-3 text-emerald-400" /> CPU Lobaite</span>
            <span className="font-mono text-emerald-400">8 Cores</span>
          </div>
          <p className="text-xl font-mono font-extrabold text-white">{cpuUsage}%</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-[10px]">
            <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-400" /> RAM Zero-Trace</span>
            <span className="font-mono text-amber-400">Volátil</span>
          </div>
          <p className="text-xl font-mono font-extrabold text-white">{memoryUsage} MB</p>
        </div>
      </div>

      {/* Live Socket Logs for Phone */}
      <div className="flex-1 overflow-y-auto p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800 space-y-2 text-xs">
        <h4 className="font-bold text-zinc-300">Conexões de Rede Móvel em Tempo Real:</h4>
        <div className="space-y-1.5 font-mono text-[10px] text-zinc-400">
          <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
            <span className="text-purple-300">tcp://127.0.0.1:9050 (Tor Relay)</span>
            <span className="text-emerald-400 font-bold">ESTABLISHED</span>
          </div>
          <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
            <span className="text-sky-300">dns://9.9.9.9:853 (Quad9 DoH)</span>
            <span className="text-emerald-400 font-bold">ACTIVE</span>
          </div>
          <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-between">
            <span className="text-zinc-300">ipc:///run/lobaite/modem.sock</span>
            <span className="text-cyan-400 font-bold">SANDBOXED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
