import { Checklist, seedChecklists } from "@/data/checklists";

const USER_KEY = "flow_user";
const CHECKLISTS_KEY = "flow_checklists";
const SUBMISSIONS_KEY = "flow_submissions";

export type FlowUser = {
  name: string;
  email: string;
  role: string;
  faceVerifiedAt: string;
  confidence: number;
};

export type Submission = {
  id: string;
  checklistId: string;
  checklistTitle: string;
  user: string;
  completedAt: string;
  durationSec: number;
  okCount: number;
  failCount: number;
  syncedToSharePoint: boolean;
  sharepointItemId?: string;
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
};
