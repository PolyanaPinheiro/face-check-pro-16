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
    id: "cl-001",
    title: "Inspeção de Segurança — Galpão A",
    area: "Operações",
    description: "Verificação diária dos itens críticos de segurança e EPI no galpão A.",
    sharepointListId: "Lists/InspecaoGalpaoA",
    estimatedMinutes: 12,
    items: [
      { id: "i1", label: "Extintores no prazo de validade", required: true, requiresPhoto: true, status: "pending" },
      { id: "i2", label: "Saídas de emergência desobstruídas", required: true, status: "pending" },
      { id: "i3", label: "Iluminação de emergência funcional", required: true, status: "pending" },
      { id: "i4", label: "EPIs disponíveis na entrada", required: true, requiresPhoto: true, status: "pending" },
      { id: "i5", label: "Sinalização de piso visível", required: false, status: "pending" },
    ],
  },
  {
    id: "cl-002",
    title: "Abertura de Loja — Filial Centro",
    area: "Varejo",
    description: "Checklist padrão para abertura segura da loja com validação do responsável.",
    sharepointListId: "Lists/AberturaLoja",
    estimatedMinutes: 8,
    items: [
      { id: "i1", label: "Cofre conferido e lacrado", required: true, status: "pending" },
      { id: "i2", label: "Sistema de PDV operacional", required: true, status: "pending" },
      { id: "i3", label: "Equipe presente e uniformizada", required: true, requiresPhoto: true, status: "pending" },
      { id: "i4", label: "Vitrine sem avarias", required: false, requiresPhoto: true, status: "pending" },
    ],
  },
  {
    id: "cl-003",
    title: "Manutenção Preventiva — Sala Técnica",
    area: "TI / Infra",
    description: "Verificação semanal dos racks, climatização e nobreak.",
    sharepointListId: "Lists/ManutencaoTI",
    estimatedMinutes: 15,
    items: [
      { id: "i1", label: "Temperatura da sala < 22°C", required: true, status: "pending" },
      { id: "i2", label: "Nobreak sem alarmes", required: true, status: "pending" },
      { id: "i3", label: "Cabeamento organizado", required: false, requiresPhoto: true, status: "pending" },
      { id: "i4", label: "Backup do dia concluído", required: true, status: "pending" },
    ],
  },
];
