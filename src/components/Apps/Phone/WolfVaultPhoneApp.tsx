import React, { useState } from "react";
import {
  Lock,
  Key,
  ShieldCheck,
  Plus,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  Share2,
} from "lucide-react";

interface VaultItem {
  id: string;
  title: string;
  account: string;
  secret: string;
  category: "password" | "token" | "note";
}

export const WolfVaultPhoneApp: React.FC = () => {
  const [items, setItems] = useState<VaultItem[]>([
    { id: "1", title: "Conta LoComunite", account: "lobaite-user", secret: "w0lf_s3cur3_k3y_99", category: "password" },
    { id: "2", title: "Chave PGP Primária", account: "master-pgp", secret: "0x98EF_4B12_C890_LOBAITE", category: "token" },
    { id: "3", title: "Seed de Recuperação", account: "sovereign-wallet", secret: "alpha wolf zero trust sovereign vault pine shadow", category: "note" },
  ]);

  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAccount, setNewAccount] = useState("");
  const [newSecret, setNewSecret] = useState("");

  const toggleShowSecret = (id: string) => {
    setShowSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSecret) return;
    const newItem: VaultItem = {
      id: Date.now().toString(),
      title: newTitle,
      account: newAccount || "default",
      secret: newSecret,
      category: "password",
    };
    setItems([newItem, ...items]);
    setNewTitle("");
    setNewAccount("");
    setNewSecret("");
    setShowAddModal(false);
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div id="wolfvault-phone-app" className="h-full flex flex-col bg-zinc-950 text-zinc-100 p-4 space-y-4 font-sans select-none">
      {/* Mobile Vault Header Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-950/30 via-zinc-900 to-zinc-950 border border-amber-500/30 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">WolfVault Mobile</h3>
            <p className="text-[11px] text-amber-400 font-mono">AES-256-GCM / PBKDF2</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold active:scale-95 transition shadow-lg shadow-amber-500/20"
          title="Adicionar Chave"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Vault Items List */}
      <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-2.5 shadow-md hover:border-amber-500/30 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-[10px] text-zinc-400 font-mono">{item.account}</p>
              </div>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="text-zinc-600 hover:text-rose-400 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 font-mono text-xs">
              <span className="text-amber-300 font-medium truncate max-w-[190px]">
                {showSecrets[item.id] ? item.secret : "••••••••••••••••"}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => toggleShowSecret(item.id)}
                  className="p-1 text-zinc-400 hover:text-white"
                >
                  {showSecrets[item.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => handleCopy(item.id, item.secret)}
                  className="p-1 text-zinc-400 hover:text-amber-400"
                >
                  {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <form
            onSubmit={handleAddItem}
            className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-white">Adicionar Credencial Criptografada</h3>
            <div className="space-y-3 text-xs">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Título (ex: WiFi Seguro, Login)"
                required
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
              <input
                type="text"
                value={newAccount}
                onChange={(e) => setNewAccount(e.target.value)}
                placeholder="Identificador / Usuário"
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
              <input
                type="password"
                value={newSecret}
                onChange={(e) => setNewSecret(e.target.value)}
                placeholder="Chave secreta ou senha"
                required
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 text-xs font-bold hover:bg-amber-400"
              >
                Salvar Chave
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
