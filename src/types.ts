export type AppId =
  | "shield"
  | "guardian"
  | "vault"
  | "ghostbrowse"
  | "files"
  | "terminal"
  | "notes"
  | "settings"
  | "monitor"
  | "locomunite"
  | "lfp";

export interface AppMetadata {
  id: AppId;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  category: "security" | "privacy" | "system" | "utilities";
  badge?: string;
}

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  customData?: any;
}

export interface SecurityIncident {
  id: string;
  timestamp: string;
  title: string;
  category: "tracker" | "firewall" | "dns" | "fingerprint" | "sandbox";
  severity: "info" | "warning" | "blocked";
  details: string;
}

export interface VaultItem {
  id: string;
  title: string;
  type: "login" | "note" | "key" | "card" | "totp";
  username?: string;
  password?: string;
  url?: string;
  notes?: string;
  category: string;
  totpSecret?: string;
  entropy?: number;
  updatedAt: string;
  isFavorite?: boolean;
}

export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  parentId: string | null;
  size?: string;
  mimeType?: string;
  content?: string;
  isEncrypted: boolean;
  checksum?: string;
  updatedAt: string;
  hasExif?: boolean;
}

export interface TorCircuitNode {
  name: string;
  ip: string;
  country: string;
  flag: string;
  latencyMs: number;
  type: "guard" | "middle" | "exit";
}

export interface GhostTab {
  id: string;
  url: string;
  title: string;
  isTor: boolean;
  trackersBlocked: number;
  sslSecure: boolean;
  contentCategory: "search" | "wiki" | "news" | "portal" | "tools" | "custom";
}

export interface SystemProcess {
  pid: number;
  name: string;
  appId?: AppId;
  cpu: number;
  memoryMb: number;
  networkKb: number;
  status: "sandboxed" | "isolated" | "running";
  threatScore: "SAFE" | "AUDITED" | "FLAGGED";
}

export interface SystemTheme {
  id: "elegant-dark" | "cyber-wolf" | "obsidian-black" | "stealth-slate" | "arctic-frost" | "emerald-matrix";
  name: string;
  primary: string;
  accent: string;
  bgGradient: string;
  panelBg: string;
  border: string;
  textColor: string;
}

export type SystemEdition = "standard" | "locomunite";

