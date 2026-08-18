import React, { useState } from "react";
import {
  Sliders,
  Shield,
  Lock,
  Globe,
  Radio,
  Eye,
  Smartphone,
  Check,
  Moon,
  Sun,
  Palette,
} from "lucide-react";
import { SystemEdition, SystemTheme } from "../../../types";

interface SystemSettingsPhoneAppProps {
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

export const SystemSettingsPhoneApp: React.FC<SystemSettingsPhoneAppProps> = ({
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
  const [pinInput, setPinInput] = useState(lockPin);
  const [toast, setToast] = useState<string | null>(null);

  const handleSavePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length < 4) return;
    setLockPin(pinInput);
    setToast("PIN de bloqueio atualizado com sucesso!");
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div id="systemsettings-phone-app" className="h-full flex flex-col bg-zinc-950 text-zinc-100 p-4 space-y-4 font-sans select-none overflow-y-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
          <Sliders className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Ajustes do Telefone</h3>
          <p className="text-[11px] text-zinc-400 font-mono">LobaiteOS Mobile Configuration</p>
        </div>
      </div>

      {toast && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono text-center">
          {toast}
        </div>
      )}

      {/* Security & PIN */}
      <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
        <h4 className="text-xs font-bold text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400" />
          Segurança & PIN de Bloqueio
        </h4>
        <form onSubmit={handleSavePin} className="flex items-center gap-2">
          <input
            type="password"
            maxLength={6}
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            placeholder="Novo PIN (4-6 dígitos)"
            className="flex-1 px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 font-mono text-center"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-500 text-zinc-950 font-bold text-xs hover:bg-emerald-400 active:scale-95 transition"
          >
            Salvar
          </button>
        </form>
      </div>

      {/* DNS Provider */}
      <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
        <h4 className="text-xs font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-sky-400" />
          Provedor DNS Seguro Móvel
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {["Quad9", "Cloudflare DoH", "Mullvad", "AdGuard"].map((dns) => (
            <button
              key={dns}
              onClick={() => setDnsProvider(dns)}
              className={`p-2.5 rounded-xl border text-xs font-mono text-center transition ${
                dnsProvider === dns
                  ? "bg-sky-500/20 border-sky-500 text-sky-300 font-bold"
                  : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white"
              }`}
            >
              {dns}
            </button>
          ))}
        </div>
      </div>

      {/* System Edition */}
      <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white">Edição Ativa:</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {systemEdition === "standard" ? "Standard (Kobaire)" : "LoComunite Edition"}
          </span>
        </div>
        {setSystemEdition && (
          <button
            onClick={() =>
              setSystemEdition((prev) => (prev === "standard" ? "locomunite" : "standard"))
            }
            className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 transition"
          >
            Alternar para {systemEdition === "standard" ? "LoComunite Edition" : "Standard"}
          </button>
        )}
      </div>
    </div>
  );
};
