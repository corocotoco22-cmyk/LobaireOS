import React, { useState, useEffect } from "react";
import {
  Lock,
  Key,
  CreditCard,
  FileText,
  Shield,
  Plus,
  Search,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles,
  Sliders,
  Clock,
  Trash2,
  Star,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { VaultItem } from "../../types";
import { INITIAL_VAULT_ITEMS } from "../../utils/systemData";
import { calculatePasswordEntropy, generateWolfPassword, generateTOTPCode } from "../../utils/crypto";

export const WolfVaultApp: React.FC = () => {
  const [items, setItems] = useState<VaultItem[]>(INITIAL_VAULT_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(INITIAL_VAULT_ITEMS[0]);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Password Generator State
  const [genLength, setGenLength] = useState(20);
  const [genUpper, setGenUpper] = useState(true);
  const [genLower, setGenLower] = useState(true);
  const [genNumbers, setGenNumbers] = useState(true);
  const [genSymbols, setGenSymbols] = useState(true);
  const [genAvoidAmbiguous, setGenAvoidAmbiguous] = useState(true);
  const [generatedPass, setGeneratedPass] = useState("");
  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [showNewItemModal, setShowNewItemModal] = useState(false);

  // New Item Form State
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<"login" | "key" | "card" | "note">("login");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newCategory, setNewCategory] = useState("Geral");
  const [newNotes, setNewNotes] = useState("");

  // TOTP live simulation
  const [totpData, setTotpData] = useState<{ code: string; secondsRemaining: number }>({
    code: "891 245",
    secondsRemaining: 30,
  });

  useEffect(() => {
    const updateTotp = () => {
      if (selectedItem?.totpSecret) {
        setTotpData(generateTOTPCode(selectedItem.totpSecret));
      }
    };
    updateTotp();
    const interval = setInterval(updateTotp, 1000);
    return () => clearInterval(interval);
  }, [selectedItem]);

  useEffect(() => {
    generateNewPassword();
  }, [genLength, genUpper, genLower, genNumbers, genSymbols, genAvoidAmbiguous]);

  const generateNewPassword = () => {
    const p = generateWolfPassword({
      length: genLength,
      useUpper: genUpper,
      useLower: genLower,
      useNumbers: genNumbers,
      useSymbols: genSymbols,
      avoidAmbiguous: genAvoidAmbiguous,
    });
    setGeneratedPass(p);
  };

  const copyToClipboard = (field: string, text?: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const entropyObj = calculatePasswordEntropy(newPassword);

    const newItem: VaultItem = {
      id: "v-" + Date.now(),
      title: newTitle,
      type: newType,
      username: newUsername,
      password: newPassword,
      category: newCategory,
      notes: newNotes,
      entropy: entropyObj.entropy,
      updatedAt: "Agora",
    };

    setItems((prev) => [newItem, ...prev]);
    setSelectedItem(newItem);
    setShowNewItemModal(false);
    // Reset
    setNewTitle("");
    setNewUsername("");
    setNewPassword("");
    setNewNotes("");
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    if (selectedItem?.id === id) {
      setSelectedItem(items.find((it) => it.id !== id) || null);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "favorites" && item.isFavorite) ||
      item.type === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.username && item.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const passEntropy = selectedItem?.password ? calculatePasswordEntropy(selectedItem.password) : null;
  const genEntropy = calculatePasswordEntropy(generatedPass);

  return (
    <div id="wolfvault-app" className="h-full flex flex-col bg-slate-950/90 text-slate-100 select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              WolfVault Cripto Safe
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                AES-256-GCM
              </span>
            </h2>
            <p className="text-xs text-slate-400">Armazenamento Zero-Knowledge • Chaves Derivadas PBKDF2</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGeneratorModal(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-cyan-300 font-medium flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Gerador Militar</span>
          </button>
          <button
            onClick={() => setShowNewItemModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Registro</span>
          </button>
        </div>
      </div>

      {/* Main Vault Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Categories */}
        <div className="w-48 border-r border-slate-800 bg-slate-950/40 p-3 space-y-1 text-xs">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition font-medium ${
              selectedCategory === "all" ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Todos ({items.length})</span>
          </button>
          <button
            onClick={() => setSelectedCategory("favorites")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition font-medium ${
              selectedCategory === "favorites" ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Star className="w-4 h-4 text-amber-400" />
            <span>Favoritos</span>
          </button>
          <button
            onClick={() => setSelectedCategory("login")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition font-medium ${
              selectedCategory === "login" ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Lock className="w-4 h-4 text-indigo-400" />
            <span>Senhas</span>
          </button>
          <button
            onClick={() => setSelectedCategory("key")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition font-medium ${
              selectedCategory === "key" ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Key className="w-4 h-4 text-emerald-400" />
            <span>Chaves PGP/SSH</span>
          </button>
          <button
            onClick={() => setSelectedCategory("card")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition font-medium ${
              selectedCategory === "card" ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Cartões</span>
          </button>
          <button
            onClick={() => setSelectedCategory("note")}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition font-medium ${
              selectedCategory === "note" ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-4 h-4 text-rose-400" />
            <span>Notas Seguras</span>
          </button>
        </div>

        {/* List of items */}
        <div className="w-72 border-r border-slate-800 bg-slate-900/40 flex flex-col">
          <div className="p-3 border-b border-slate-800">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filtrar cofre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedItem(item);
                  setShowPassword(false);
                }}
                className={`p-2.5 rounded-xl cursor-pointer transition border ${
                  selectedItem?.id === item.id
                    ? "bg-slate-800/90 border-cyan-500/40 text-white shadow-md shadow-black/20"
                    : "bg-slate-950/40 border-transparent hover:bg-slate-800/40 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">{item.title}</span>
                  {item.isFavorite && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span className="truncate">{item.username || item.category}</span>
                  {item.entropy && (
                    <span className="font-mono text-[10px] text-emerald-400">{item.entropy}b</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Item Details */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/60">
          {selectedItem ? (
            <div className="max-w-xl space-y-6">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {selectedItem.title}
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {selectedItem.category}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Atualizado: {selectedItem.updatedAt}</p>
                </div>
                <button
                  onClick={() => handleDeleteItem(selectedItem.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                  title="Excluir registro"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Fields */}
              <div className="space-y-4 text-xs">
                {selectedItem.username && (
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 mb-1">
                      <span className="font-medium">Identificador / Usuário</span>
                      <button
                        onClick={() => copyToClipboard("user", selectedItem.username)}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono text-[10px]"
                      >
                        {copiedField === "user" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copiar</span>
                      </button>
                    </div>
                    <p className="text-sm font-mono text-white select-text">{selectedItem.username}</p>
                  </div>
                )}

                {selectedItem.password && (
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-medium">Segredo / Senha Master</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{showPassword ? "Ocultar" : "Mostrar"}</span>
                        </button>
                        <button
                          onClick={() => copyToClipboard("pass", selectedItem.password)}
                          className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono text-[10px]"
                        >
                          {copiedField === "pass" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Copiar</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-sm font-mono text-white select-text break-all">
                      {showPassword ? selectedItem.password : "••••••••••••••••••••••••"}
                    </p>

                    {passEntropy && (
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">
                          Entropia: <strong className="text-emerald-400 font-mono">{passEntropy.entropy} bits</strong> ({passEntropy.strength})
                        </span>
                        <span className="text-slate-400">Quebra estimada: {passEntropy.crackTime}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* 2FA TOTP Code Widget if item has totpSecret */}
                {selectedItem.totpSecret && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        Código 2FA / TOTP Integrado
                      </span>
                      <span className="text-[10px] font-mono text-indigo-300">
                        Renova em {totpData.secondsRemaining}s
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-mono font-bold tracking-widest text-indigo-200">
                        {totpData.code}
                      </span>
                      <button
                        onClick={() => copyToClipboard("totp", totpData.code.replace(/\s/g, ""))}
                        className="px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30 text-xs font-mono flex items-center gap-1 transition"
                      >
                        {copiedField === "totp" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copiar Token</span>
                      </button>
                    </div>
                  </div>
                )}

                {selectedItem.notes && (
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                    <span className="text-slate-400 font-medium">Notas / Dados Criptografados</span>
                    <p className="text-xs text-slate-200 whitespace-pre-wrap font-mono select-text">{selectedItem.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <Lock className="w-8 h-8 text-slate-700" />
              <p className="text-xs">Selecione um item do cofre para visualizar os segredos.</p>
            </div>
          )}
        </div>
      </div>

      {/* Password Generator Modal */}
      {showGeneratorModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Gerador Militar WolfGrade
              </h3>
              <button onClick={() => setShowGeneratorModal(false)} className="text-slate-400 hover:text-white text-base font-bold">
                ✕
              </button>
            </div>

            {/* Display Generated */}
            <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">Senha Criptográfica:</span>
                <button onClick={generateNewPassword} className="text-cyan-400 hover:text-cyan-300 text-[11px] flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Gerar Nova
                </button>
              </div>
              <p className="font-mono text-sm text-cyan-300 font-bold break-all select-text">{generatedPass}</p>
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                <span>Entropia: <strong className="text-emerald-400">{genEntropy.entropy} bits</strong> ({genEntropy.strength})</span>
                <span>Crack: {genEntropy.crackTime}</span>
              </div>
            </div>

            {/* Sliders and Toggles */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-slate-300 mb-1">
                  <span>Comprimento da Senha:</span>
                  <span className="font-mono font-bold text-cyan-400">{genLength} caracteres</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="48"
                  value={genLength}
                  onChange={(e) => setGenLength(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-300 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={genUpper} onChange={(e) => setGenUpper(e.target.checked)} className="accent-cyan-500" />
                  <span>Maiúsculas (A-Z)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={genLower} onChange={(e) => setGenLower(e.target.checked)} className="accent-cyan-500" />
                  <span>Minúsculas (a-z)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={genNumbers} onChange={(e) => setGenNumbers(e.target.checked)} className="accent-cyan-500" />
                  <span>Números (0-9)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={genSymbols} onChange={(e) => setGenSymbols(e.target.checked)} className="accent-cyan-500" />
                  <span>Símbolos (!@#$)</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  copyToClipboard("modal-gen", generatedPass);
                  setShowGeneratorModal(false);
                }}
                className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar e Usar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Item Modal */}
      {showNewItemModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleAddItem}
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-cyan-400" />
                Criar Novo Registro Seguro
              </h3>
              <button type="button" onClick={() => setShowNewItemModal(false)} className="text-slate-400 hover:text-white text-base font-bold">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">Título do Item</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Bitwarden, Servidor SSH, Banco"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Tipo de Registro</label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none"
                  >
                    <option value="login">Senha / Login</option>
                    <option value="key">Chave PGP/SSH</option>
                    <option value="card">Cartão de Crédito</option>
                    <option value="note">Nota Confidencial</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Categoria</label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Usuário / Email / ID</label>
                <input
                  type="text"
                  placeholder="admin@dominio.onion"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-400 mb-1">
                  <span>Senha / Segredo</span>
                  <button
                    type="button"
                    onClick={() => {
                      const p = generateWolfPassword({ length: 24, useUpper: true, useLower: true, useNumbers: true, useSymbols: true, avoidAmbiguous: true });
                      setNewPassword(p);
                    }}
                    className="text-cyan-400 hover:text-cyan-300 text-[10px] flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Gerar Forte
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Segredo ultrasseguro..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-white outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Notas Confidenciais</label>
                <textarea
                  rows={2}
                  placeholder="Instruções adicionais de recuperação..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white outline-none focus:border-cyan-500/50 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowNewItemModal(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
              >
                Criptografar e Salvar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
