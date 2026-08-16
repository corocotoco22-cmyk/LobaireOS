import { AppMetadata, FileItem, SecurityIncident, SystemProcess, SystemTheme, VaultItem } from "../types";

export const APP_REGISTRY: Record<string, AppMetadata> = {
  shield: {
    id: "shield",
    name: "WolfShield Center",
    shortName: "WolfShield",
    description: "Central de Segurança, Firewall de Rede e Bloqueador de Rastreadores",
    icon: "ShieldCheck",
    defaultWidth: 840,
    defaultHeight: 580,
    category: "security",
    badge: "98% Seguro",
  },
  guardian: {
    id: "guardian",
    name: "Lobaire Guardian AI",
    shortName: "Guardian AI",
    description: "Auditor Inteligente de Ameaças, Phishing e Privacidade Digital",
    icon: "Bot",
    defaultWidth: 760,
    defaultHeight: 560,
    category: "security",
    badge: "Gemini 3.7",
  },
  vault: {
    id: "vault",
    name: "WolfVault Segredos",
    shortName: "WolfVault",
    description: "Cofre Criptografado AES-256 de Senhas, Chaves PGP e 2FA TOTP",
    icon: "Lock",
    defaultWidth: 820,
    defaultHeight: 560,
    category: "privacy",
  },
  ghostbrowse: {
    id: "ghostbrowse",
    name: "GhostBrowse Tor",
    shortName: "GhostBrowse",
    description: "Navegador Anônimo com Circuito Tor e Anti-Fingerprinting",
    icon: "Globe",
    defaultWidth: 880,
    defaultHeight: 600,
    category: "privacy",
  },
  files: {
    id: "files",
    name: "WolfFiles & Shredder",
    shortName: "Arquivos",
    description: "Gerenciador Criptografado, Triturador DoD e Limpador de EXIF",
    icon: "FolderLock",
    defaultWidth: 800,
    defaultHeight: 540,
    category: "utilities",
  },
  terminal: {
    id: "terminal",
    name: "WolfShell Terminal",
    shortName: "Terminal",
    description: "Console Seguro com Utilitários Criptográficos e Auditor de Rede",
    icon: "Terminal",
    defaultWidth: 740,
    defaultHeight: 480,
    category: "system",
  },
  notes: {
    id: "notes",
    name: "Stealth Notes",
    shortName: "Notas",
    description: "Editor de Notas Criptografadas com Camuflagem Instantânea e Autodestruição",
    icon: "FileText",
    defaultWidth: 720,
    defaultHeight: 520,
    category: "utilities",
  },
  monitor: {
    id: "monitor",
    name: "Monitor de Processos",
    shortName: "Monitor",
    description: "Inspetor de Processos em Tempo Real e Sanitizador de Memória RAM",
    icon: "Activity",
    defaultWidth: 760,
    defaultHeight: 500,
    category: "system",
  },
  settings: {
    id: "settings",
    name: "Configurações LobaireOS",
    shortName: "Ajustes",
    description: "Temas Minimalistas, Políticas de Privacidade e Proteções de Hardware",
    icon: "Sliders",
    defaultWidth: 760,
    defaultHeight: 540,
    category: "system",
  },
};

export const INITIAL_SECURITY_INCIDENTS: SecurityIncident[] = [
  {
    id: "inc-1",
    timestamp: "15:24:10",
    title: "Tentativa de Canvas Fingerprinting Bloqueada",
    category: "fingerprint",
    severity: "blocked",
    details: "Script de telemetria tentou ler hash de renderização gráfica. Ruído pseudoaleatório injetado com sucesso.",
  },
  {
    id: "inc-2",
    timestamp: "15:20:04",
    title: "Vazamento de WebRTC Neutralizado",
    category: "dns",
    severity: "blocked",
    details: "Requisição STUN externa bloqueada para impedir exposição do IP real.",
  },
  {
    id: "inc-3",
    timestamp: "15:18:45",
    title: "Conexão Criptografada DoH Estabelecida",
    category: "dns",
    severity: "info",
    details: "DNS over HTTPS roteado com segurança através de Quad9 (Zero Logging & Malware Block).",
  },
  {
    id: "inc-4",
    timestamp: "15:12:30",
    title: "Isolamento de Sandbox de Processo",
    category: "sandbox",
    severity: "info",
    details: "GhostBrowse iniciado em contêiner de memória com permissão restrita de leitura/escrita.",
  },
  {
    id: "inc-5",
    timestamp: "15:05:12",
    title: "Rastreador de Terceiros Abortado",
    category: "tracker",
    severity: "blocked",
    details: "Beacon analytics-collect.net descartado pelo Firewall de Pacotes do WolfShield.",
  },
];

export const INITIAL_VAULT_ITEMS: VaultItem[] = [
  {
    id: "v-1",
    title: "ProtonMail Soberano",
    type: "login",
    username: "lobaire.sec@proton.me",
    password: "Wolf#99!kP$2026_AlphaShield",
    url: "https://mail.proton.me",
    category: "Comunicação",
    entropy: 94,
    updatedAt: "Hoje, 14:30",
    isFavorite: true,
    totpSecret: "PROTON_LOBAIRE_2FA_SEED",
  },
  {
    id: "v-2",
    title: "Chave Mestra GPG / PGP",
    type: "key",
    username: "0x89FA9931CDE8812A",
    password: "4096R/0x89FA9931CDE8812A [ED25519 SOBERANO]",
    notes: "Chave primária para assinatura de pacotes do kernel LobaireOS e commits git.",
    category: "Criptografia",
    entropy: 98,
    updatedAt: "Ontem, 19:10",
    isFavorite: true,
  },
  {
    id: "v-3",
    title: "Servidor Tor Relay Pessoal",
    type: "login",
    username: "root@onion-node-99.onion",
    password: "Kx$89#vLm!Qz_77WolfCore",
    url: "ssh://onion-node-99.onion:2222",
    category: "Infraestrutura",
    entropy: 91,
    updatedAt: "12/08/2026",
    isFavorite: false,
    totpSecret: "TOR_RELAY_AUTH_KEY_2026",
  },
  {
    id: "v-4",
    title: "Cartão de Crédito Virtual Descartável",
    type: "card",
    username: "L. SILVA LOBAIRE",
    password: "4532 •••• •••• 9812 | CVV: 742 | Exp: 09/29",
    notes: "Cartão com limite travado de R$ 50 para assinaturas anônimas.",
    category: "Finanças",
    entropy: 80,
    updatedAt: "10/08/2026",
    isFavorite: false,
  },
  {
    id: "v-5",
    title: "Semente de Recuperação BIP-39 (Hardware Wallet)",
    type: "note",
    notes: "timber wolf silent shield cipher arctic zero trust orbit neon carbon pulse matrix secure sovereign",
    category: "Backup Crítico",
    entropy: 99,
    updatedAt: "08/08/2026",
    isFavorite: true,
  },
];

export const INITIAL_FILES: FileItem[] = [
  {
    id: "f-root-docs",
    name: "Documentos Confidenciais",
    type: "folder",
    parentId: null,
    isEncrypted: true,
    updatedAt: "16/08/2026",
  },
  {
    id: "f-root-media",
    name: "Fotos & Metadados EXIF",
    type: "folder",
    parentId: null,
    isEncrypted: false,
    updatedAt: "15/08/2026",
  },
  {
    id: "f-root-keys",
    name: "Chaves & Certificados",
    type: "folder",
    parentId: null,
    isEncrypted: true,
    updatedAt: "14/08/2026",
  },
  {
    id: "f-1",
    name: "manifesto_privacidade_soberana.md",
    type: "file",
    parentId: "f-root-docs",
    size: "4.2 KB",
    mimeType: "text/markdown",
    isEncrypted: true,
    checksum: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    updatedAt: "Hoje, 11:20",
    content: `# Manifesto LobaireOS: Privacidade é um Direito Inegociável

A privacidade não é sobre esconder algo errado; é sobre proteger tudo o que é certo: sua identidade, seus pensamentos, sua autonomia e sua liberdade intelectual.

1. **Zero-Knowledge por Padrão**: Nenhum dado deixa este dispositivo sem criptografia de ponta com chaves que só você possui.
2. **Anti-Fingerprinting**: Nenhum anunciante ou corporação tem o direito de rastrear seu rastro digital.
3. **Soberania do Usuário**: Você controla as portas de rede, os periféricos e a memória viva da sua máquina.
4. **Minimalismo Eficiente**: Sem bloatware, sem telemetrias obscuras, apenas código limpo e performático.`,
  },
  {
    id: "f-2",
    name: "contrato_seguranca_audit.pdf",
    type: "file",
    parentId: "f-root-docs",
    size: "128 KB",
    mimeType: "application/pdf",
    isEncrypted: true,
    checksum: "872fbc09d3b145a90098f9872145eebac88712398abcef90123849503412aafe",
    updatedAt: "15/08/2026",
    content: "[CONTEÚDO CRIPTOGRAFADO COM AES-256-GCM LOBAIRE-VAULT]",
  },
  {
    id: "f-3",
    name: "foto_viagem_com_gps_exif.jpg",
    type: "file",
    parentId: "f-root-media",
    size: "2.4 MB",
    mimeType: "image/jpeg",
    isEncrypted: false,
    hasExif: true,
    checksum: "1928374650abcdef1029384756cba987456321efdcba0987123456789abcdef0",
    updatedAt: "14/08/2026",
    content: "Imagem contendo metadados EXIF: Câmera Sony A7IV, Lente 24-70mm, GPS: -23.550520, -46.633308 (São Paulo, BR), Data: 12/08/2026 14:22.",
  },
  {
    id: "f-4",
    name: "id_ed25519_wolf.pub",
    type: "file",
    parentId: "f-root-keys",
    size: "380 B",
    mimeType: "text/plain",
    isEncrypted: false,
    checksum: "99887766554433221100aabbccddeeff00112233445566778899aabbccddeeff",
    updatedAt: "10/08/2026",
    content: "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKb4G98Z1kLobaireOSWolfShield2026Sovereign admin@lobaire.os",
  },
  {
    id: "f-root-locomunite",
    name: "LoComunite (Código Fonte do Sistema)",
    type: "folder",
    parentId: null,
    isEncrypted: false,
    updatedAt: "Hoje, 15:30",
  },
  {
    id: "f-loco-1",
    name: "kobaire_kernel.c",
    type: "file",
    parentId: "f-root-locomunite",
    size: "8.6 KB",
    mimeType: "text/x-c",
    isEncrypted: false,
    checksum: "4b825dc642cb6eb9a060e54bf8d69288fbee4904ceecd112d991b5c468a3560f",
    updatedAt: "Hoje, 15:35",
    content: `/*
 * KobaireKe - Core Kernel Subsystem
 * Editions:
 *   - Production Standard: "KobaireKe -- LobaireOS No LOPS"
 *   - LoComunite Edition:   "KobaireKe -- LobaireOS LOPS"
 *
 * Copyright (C) 2026 LoComunite Open Security Initiative
 */

#include <lobaire/security.h>
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
    printk("[KobaireKe] Memory Vault: AES-256 Volatile Page Guard Active\\n");
    printk("[KobaireKe] LOPS Subsystem: %s\\n", LOPS_OPTIMIZED_SUBSYSTEM ? "ENABLED (LoComunite)" : "DISABLED (No LOPS)");
    
    // Enforce Zero-Trust Sandboxing
    enforce_process_isolation();
    return 0;
}
`,
  },
  {
    id: "f-loco-2",
    name: "README_LOCOMUNITE.md",
    type: "file",
    parentId: "f-root-locomunite",
    size: "3.1 KB",
    mimeType: "text/markdown",
    isEncrypted: false,
    checksum: "c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2",
    updatedAt: "Hoje, 15:32",
    content: `# LoComunite: Repositório & Código do Sistema LobaireOS

Bem-vindo ao **LoComunite**, a iniciativa aberta de código-fonte soberano do LobaireOS.

### Matriz de Kernels:
- **LobaireOS Standard (Produção)**: Kernel \`KobaireKe -- LobaireOS No LOPS\` (Sem rotinas LOPS)
- **LoComunite Community (Desenvolvimento & Comunidade)**: Kernel \`KobaireKe -- LobaireOS LOPS\` (Com suporte LOPS - Lobaire Optimized Process Subsystem)

### Diretrizes de Segurança:
1. Todo código é inspecionado sob modelo Zero-Trust.
2. Isolamento rígido de memória em sandbox por aplicação.
3. Telemetrias e chaves mestras externas são estritamente proibidas.`,
  },
  {
    id: "f-loco-3",
    name: "locomunite_config.json",
    type: "file",
    parentId: "f-root-locomunite",
    size: "1.4 KB",
    mimeType: "application/json",
    isEncrypted: false,
    checksum: "9f83ac03a48e7186178a994efd7065ec0ca9876543210fedcba9876543210fed",
    updatedAt: "Hoje, 15:28",
    content: `{
  "system": "LoComunite",
  "project": "LobaireOS Sovereign WebOS",
  "defaultKernel": "KobaireKe -- LobaireOS No LOPS",
  "communityKernel": "KobaireKe -- LobaireOS LOPS",
  "features": {
    "lopsEnabled": true,
    "zeroTrustSandboxing": true,
    "memoryWipeOnPanic": true
  }
}`,
  },
];

export const KERNEL_INFO = {
  standard: {
    id: "standard" as const,
    editionName: "LobaireOS 3.4 Hardened",
    kernelName: "KobaireKe -- LobaireOS No LOPS",
    tagline: "Kernel de Produção Zero-Trust",
    description: "Versão oficial estritamente blindada e imutável sem módulos LOPS",
  },
  locomunite: {
    id: "locomunite" as const,
    editionName: "LoComunite (Código Fonte Aberto)",
    kernelName: "KobaireKe -- LobaireOS LOPS",
    tagline: "Kernel Comunitário LOPS Habilitado",
    description: "Árvore de código comunitária do sistema com LOPS (Lobaire Optimized Process Subsystem)",
  },
};


export const INITIAL_PROCESSES: SystemProcess[] = [
  { pid: 101, name: "lobaire-kernel", cpu: 0.8, memoryMb: 42, networkKb: 0, status: "sandboxed", threatScore: "SAFE" },
  { pid: 104, name: "wolfshield-firewall", appId: "shield", cpu: 1.2, memoryMb: 28, networkKb: 14, status: "running", threatScore: "SAFE" },
  { pid: 110, name: "tor-daemon-onion", appId: "ghostbrowse", cpu: 2.1, memoryMb: 68, networkKb: 120, status: "sandboxed", threatScore: "SAFE" },
  { pid: 118, name: "vault-crypto-engine", appId: "vault", cpu: 0.3, memoryMb: 22, networkKb: 0, status: "isolated", threatScore: "SAFE" },
  { pid: 125, name: "guardian-ai-bridge", appId: "guardian", cpu: 0.5, memoryMb: 35, networkKb: 8, status: "sandboxed", threatScore: "SAFE" },
  { pid: 132, name: "shredder-wipe-daemon", appId: "files", cpu: 0.1, memoryMb: 16, networkKb: 0, status: "sandboxed", threatScore: "SAFE" },
  { pid: 140, name: "stealth-notes-worker", appId: "notes", cpu: 0.2, memoryMb: 18, networkKb: 0, status: "isolated", threatScore: "SAFE" },
];

export const THEMES: SystemTheme[] = [
  {
    id: "elegant-dark",
    name: "Elegant Dark (Soberano)",
    primary: "#38bdf8",
    accent: "#10b981",
    bgGradient: "radial-gradient(ellipse at 50% 0%, #151821 0%, #050505 100%)",
    panelBg: "rgba(9, 9, 11, 0.88)",
    border: "rgba(39, 39, 42, 0.8)",
    textColor: "#d4d4d8",
  },
  {
    id: "cyber-wolf",
    name: "Cyber Wolf (Cobalto)",
    primary: "#06b6d4",
    accent: "#10b981",
    bgGradient: "radial-gradient(ellipse at top, #0b1528 0%, #030712 100%)",
    panelBg: "rgba(10, 18, 33, 0.85)",
    border: "rgba(30, 58, 102, 0.6)",
    textColor: "#f3f4f6",
  },
  {
    id: "obsidian-black",
    name: "Deep Obsidian (Total Stealth)",
    primary: "#71717a",
    accent: "#38bdf8",
    bgGradient: "radial-gradient(ellipse at top, #09090b 0%, #000000 100%)",
    panelBg: "rgba(14, 14, 17, 0.92)",
    border: "rgba(39, 39, 42, 0.7)",
    textColor: "#e4e4e7",
  },
  {
    id: "stealth-slate",
    name: "Stealth Slate (Minimalista)",
    primary: "#818cf8",
    accent: "#a78bfa",
    bgGradient: "radial-gradient(ellipse at top, #182234 0%, #090e17 100%)",
    panelBg: "rgba(15, 23, 42, 0.88)",
    border: "rgba(51, 65, 85, 0.6)",
    textColor: "#f8fafc",
  },
  {
    id: "emerald-matrix",
    name: "Emerald Matrix (Hacker Defense)",
    primary: "#10b981",
    accent: "#34d399",
    bgGradient: "radial-gradient(ellipse at top, #06241a 0%, #020d09 100%)",
    panelBg: "rgba(4, 26, 19, 0.90)",
    border: "rgba(16, 185, 129, 0.3)",
    textColor: "#ecfdf5",
  },
];
