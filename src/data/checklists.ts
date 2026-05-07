export type ChecklistItem = {
  id: string;
  label: string;
  description?: string;
  required: boolean;
  requiresPhoto?: boolean;
  status: "pending" | "ok" | "fail";
  note?: string;
  photo?: string; // dataURL
  completedAt?: string;
};

export type Checklist = {
  id: string;
  title: string;
  area: string;
  description: string;
  sharepointListId: string;
  estimatedMinutes: number;
  items: ChecklistItem[];
};

export const seedChecklists: Checklist[] = [
  {
    id: "cl-setup",
    title: "CheckList de Setup",
    area: "Setup",
    description: "Checklist padrão de setup com validação biométrica e sincronização SharePoint.",
    sharepointListId: "Lists/CheckListSetup",
    estimatedMinutes: 10,
    items: [
      { id: "i1", label: "Equipamento ligado e operacional", required: true, requiresPhoto: true, status: "pending" },
      { id: "i2", label: "Conexão de rede ativa", required: true, status: "pending" },
      { id: "i3", label: "Periféricos conectados", required: true, status: "pending" },
      { id: "i4", label: "Ambiente organizado", required: false, requiresPhoto: true, status: "pending" },
    ],
  },
];
