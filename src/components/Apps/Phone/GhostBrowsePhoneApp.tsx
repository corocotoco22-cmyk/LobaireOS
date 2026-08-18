import React, { useState } from "react";
import {
  Globe,
  Shield,
  Lock,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Search,
  EyeOff,
  Flame,
  ExternalLink,
  CheckCircle,
  Share2,
} from "lucide-react";

export const GhostBrowsePhoneApp: React.FC = () => {
  const [urlInput, setUrlInput] = useState("https://wolfos.sovereign.onion");
  const [activeUrl, setActiveUrl] = useState("https://wolfos.sovereign.onion");
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let dest = urlInput.trim();
    if (!dest.startsWith("http://") && !dest.startsWith("https://")) {
      dest = "https://" + dest;
    }
    setIsLoading(true);
    setTimeout(() => {
      setActiveUrl(dest);
      setIsLoading(false);
    }, 600);
  };

  const bookmarks = [
    { title: "Lobaite Sovereign Onion", url: "https://wolfos.sovereign.onion", tag: ".onion" },
    { title: "DuckDuckGo Onion", url: "https://duckduckgogg42xjoc72x3sjasowoarfbgcmvfimaftt6twagswzczad.onion", tag: "Busca Tor" },
    { title: "ProtonMail Tor", url: "https://protonmailrmez3lotccipshtkleegetolb73fuirgj7r4o4vfu7nid.onion", tag: "Email Seguro" },
    { title: "LoComunite Hub", url: "https://github.com/corocotoco22-cmyk/LobaireOS", tag: "Repositório" },
  ];

  return (
    <div id="ghostbrowse-phone-app" className="h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans select-none">
      {/* Mobile Browser URL & Search Header */}
      <form onSubmit={handleNavigate} className="p-3 bg-zinc-900 border-b border-zinc-800 space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative flex items-center">
            <Lock className="w-3.5 h-3.5 absolute left-3 text-purple-400" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Digite um link .onion ou pesquise com Tor..."
              className="w-full pl-8 pr-8 py-2 rounded-2xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-purple-500 font-mono"
            />
            {isLoading && (
              <RotateCw className="w-3.5 h-3.5 absolute right-3 text-purple-400 animate-spin" />
            )}
          </div>
          <button
            type="submit"
            className="p-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white active:scale-95 transition"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Tor Onion Circuit status badge */}
        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono px-1">
          <span className="flex items-center gap-1 text-purple-300">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            Tor Circuit 5G: Islândia → Suíça → Romênia
          </span>
          <span className="text-emerald-400">Zero Cookies</span>
        </div>
      </form>

      {/* Browser Viewport */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeUrl === "https://wolfos.sovereign.onion" ? (
          <div className="space-y-4">
            <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/40 via-zinc-900 to-zinc-950 border border-purple-500/30 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto">
                <Globe className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">GhostBrowse Mobile</h3>
                <p className="text-[11px] text-purple-400 font-mono">Navegação Anônima em Rede Cebola</p>
              </div>
              <p className="text-xs text-zinc-400">
                Seu endereço IP de celular e dados de GPS estão mascarados por 3 camadas criptográficas.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-300 px-1">Favoritos & Portais .onion:</h4>
              <div className="space-y-2">
                {bookmarks.map((bm, i) => (
                  <div
                    key={i}
                    onClick={() => {
                      setUrlInput(bm.url);
                      setActiveUrl(bm.url);
                    }}
                    className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-between cursor-pointer hover:border-purple-500/40 transition active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{bm.title}</p>
                        <p className="text-[10px] font-mono text-zinc-500 truncate max-w-[190px]">{bm.url}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-purple-300 border border-purple-500/20">
                      {bm.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 text-center space-y-3">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-white">Página Carregada com Segurança</h4>
            <p className="text-xs font-mono text-zinc-400">{activeUrl}</p>
            <div className="p-3 rounded-xl bg-zinc-950 text-left font-mono text-[11px] text-zinc-400 space-y-1">
              <p>• Handshake TLS: TLS 1.3 / ChaCha20-Poly1305</p>
              <p>• Cookies & Cache: Isolados em RAM Volátil</p>
              <p>• Rastreadores Móveis: 0 permitidos</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
