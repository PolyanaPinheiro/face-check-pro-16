import { Checklist, seedChecklists } from "@/data/checklists";

const USER_KEY = "flow_user";
const CHECKLISTS_KEY = "flow_checklists_v2";
const SUBMISSIONS_KEY = "flow_submissions";
const ACCESS_KEY = "flow_access_log";
const CONTEXT_KEY = "flow_active_context";

export type FlowUser = {
  name: string;
  email: string;
  role: string;
  faceVerifiedAt: string;
  confidence: number;
};

export type StartContext = {
  line: string;
  sku: string;
  responsavel: string;
  responsavelConfidence: number;
  startedAt: string;
};

export type Submission = {
  id: string;
  checklistId: string;
  checklistTitle: string;
  user: string;
  line?: string;
  sku?: string;
  responsavel?: string;
  shift?: "Manhã" | "Tarde" | "Noite";
  startedAt?: string;
  endedAt?: string;
  completedAt: string;
  durationSec: number;
  okCount: number;
  failCount: number;
  syncedToSharePoint: boolean;
  sharepointItemId?: string;
};

export type AccessLog = {
  id: string;
  user: string;
  email: string;
  at: string;
  confidence: number;
};

export const inferShift = (iso: string): Submission["shift"] => {
  const h = new Date(iso).getHours();
  if (h >= 6 && h < 14) return "Manhã";
  if (h >= 14 && h < 22) return "Tarde";
  return "Noite";
};

export const storage = {
  getUser(): FlowUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setUser(u: FlowUser) { localStorage.setItem(USER_KEY, JSON.stringify(u)); },
  clearUser() { localStorage.removeItem(USER_KEY); },

  getChecklists(): Checklist[] {
    const raw = localStorage.getItem(CHECKLISTS_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(CHECKLISTS_KEY, JSON.stringify(seedChecklists));
    return seedChecklists;
  },
  saveChecklist(cl: Checklist) {
    const all = storage.getChecklists();
    const next = all.map((c) => (c.id === cl.id ? cl : c));
    localStorage.setItem(CHECKLISTS_KEY, JSON.stringify(next));
  },
  resetChecklist(id: string) {
    const fresh = seedChecklists.find((c) => c.id === id);
    if (!fresh) return;
    const all = storage.getChecklists();
    const next = all.map((c) => (c.id === id ? structuredClone(fresh) : c));
    localStorage.setItem(CHECKLISTS_KEY, JSON.stringify(next));
  },

  getSubmissions(): Submission[] {
    const raw = localStorage.getItem(SUBMISSIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  },
  addSubmission(s: Submission) {
    const all = storage.getSubmissions();
    all.unshift(s);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(all));
  },

  getAccesses(): AccessLog[] {
    const raw = localStorage.getItem(ACCESS_KEY);
    return raw ? JSON.parse(raw) : [];
  },
  addAccess(a: AccessLog) {
    const all = storage.getAccesses();
    all.unshift(a);
    localStorage.setItem(ACCESS_KEY, JSON.stringify(all.slice(0, 200)));
  },

  getContext(): StartContext | null {
    const raw = sessionStorage.getItem(CONTEXT_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setContext(c: StartContext) { sessionStorage.setItem(CONTEXT_KEY, JSON.stringify(c)); },
  clearContext() { sessionStorage.removeItem(CONTEXT_KEY); },
};
