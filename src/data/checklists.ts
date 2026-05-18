export type ChecklistItem = {
  id: string;
  label: string;
  description?: string;
  section?: string;
  responsible?: string;
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
    title: "Check de Liberação de Set Up - Estamparia",
    area: "Estamparia",
    description:
      "Checklist formal de liberação de setup conforme procedimento Ambev (revisão 22/09/25), contemplando pré-setup, inspeções de equipamentos, validação de laboratório e pós-setup.",
    sharepointListId: "Lists/CheckListSetup",
    estimatedMinutes: 45,
    items: [
      // ===== PRÉ SETUP =====
      {
        id: "pre-01",
        section: "Pré Setup",
        responsible: "OP 1",
        label: "Comunicação à área de Qualidade e Técnicos",
        description:
          "Informar o técnico da qualidade e o GPA Eletricista do turno sobre o início do setup. Aplicável a Prensa e Liner.",
        required: true,
        status: "pending",
      },
      {
        id: "pre-02",
        section: "Pré Setup",
        responsible: "OP 1",
        label: "Comunicação à área de Embalagem",
        description:
          "Informar a área da embalagem sobre o SETUP, o SKU e o LOTE NOVO a ser produzido. Aplicável ao Liner.",
        required: true,
        status: "pending",
      },
      {
        id: "pre-03",
        section: "Pré Setup",
        responsible: "OP 1",
        label: "Etiquetas do novo SKU",
        description:
          "Disponibilizar as etiquetas do novo SKU e o material necessário para limpeza. Aplicável ao Liner.",
        required: true,
        requiresPhoto: true,
        status: "pending",
      },
      {
        id: "pre-04",
        section: "Pré Setup",
        responsible: "OP 1",
        label: "Operadores para realização do SETUP",
        description:
          "Disponibilizar 2 operadores para a execução do setup, sendo no mínimo 1 habilitado em NR-35. Caso haja linha em modulação, solicitar apoio de um terceiro operador.",
        required: true,
        status: "pending",
      },
      {
        id: "pre-05",
        section: "Pré Setup",
        responsible: "OP 1",
        label: "EPI de altura e chave do transporte",
        description:
          "Disponibilizar cinto de segurança, talabarte duplo, capacete e a chave da escada marinheiro na área. Aplicável a Prensa e Liner.",
        required: true,
        requiresPhoto: true,
        status: "pending",
      },
      {
        id: "pre-06",
        section: "Pré Setup",
        responsible: "QA",
        label: "Rolhas teste para CVS",
        description:
          "Disponibilizar rolhas teste do novo SKU para o teste do CVS, contemplando o SKU a ser produzido e todos os defeitos a serem avaliados pela Qualidade.",
        required: true,
        status: "pending",
      },
      {
        id: "pre-07",
        section: "Pré Setup",
        responsible: "OP 1",
        label: "Fardo novo posicionado",
        description:
          "Verificar se o novo fardo já foi colocado ao lado da PTC. Aplicável à Prensa.",
        required: true,
        requiresPhoto: true,
        status: "pending",
      },
      {
        id: "pre-08",
        section: "Pré Setup",
        responsible: "OP 1",
        label: "PVC correto conforme produto",
        description:
          "Solicitar o PVC correto conforme o produto a ser produzido: EPCRXTCF (Etiqueta Branca - Twist OFF / LN - 30009501); EPCRXPCF (Etiqueta Azul - Pry OFF / PO - 30009873); EPCRXPAF (Etiqueta Laranja - NON SCAVENGER - 30005674); INTELLOX QR 4.0 WHITE (Etiqueta Branca - PVC Free - 30004249); SVELLOX (Etiqueta Branca - PVC Free - 30004407).",
        required: true,
        requiresPhoto: true,
        status: "pending",
      },
      {
        id: "pre-09",
        section: "Pré Setup",
        responsible: "QA",
        label: "Pulmão (Silo) sem rolhas residuais",
        description:
          "Realizar verificação 360º dentro dos Silos para confirmar que não existem rolhas presas. Caso existam, comunicar o operador para remoção imediata.",
        required: true,
        status: "pending",
      },
      {
        id: "pre-10",
        section: "Pré Setup",
        responsible: "QA",
        label: "Tremonha e Prato Giratório sem rolhas residuais",
        description:
          "Realizar verificação 360º na Tremonha e no Prato Giratório para confirmar que não existem rolhas presas. Caso existam, comunicar o operador para remoção imediata.",
        required: true,
        status: "pending",
      },

      // ===== SETUP - EQUIPAMENTO =====
      {
        id: "set-16",
        section: "Setup - Equipamento",
        responsible: "OP 2",
        label: "Tipo de SKU: Pry Off ou Twist Off (PVC)",
        description:
          "Conferir se o PVC a ser utilizado corresponde ao produto correto e realizar o setup de PVC se necessário. Para PVC Free, consultar parâmetros no procedimento FRO-500037. Lembrar de setar a temperatura do Chiller em -3 ºC.",
        required: true,
        requiresPhoto: true,
        status: "pending",
      },
      {
        id: "set-17",
        section: "Setup - Equipamento",
        responsible: "OP 1 / OP 2",
        label: "Limpeza da Tremonha e Prato Giratório",
        description:
          "Aplicar jato de ar comprimido dentro das tremonhas e proteções do prato giratório, em cima e embaixo do prato. Acionar o botão 'ciclo fim de lote' e verificar se há rolhas; repetir até a remoção completa.",
        required: true,
        status: "pending",
      },
      {
        id: "set-18",
        section: "Setup - Equipamento",
        responsible: "OP 1 / OP 2",
        label: "Canaletas e base do Prato Giratório",
        description: "Realizar limpeza com jato de ar comprimido.",
        required: true,
        status: "pending",
      },
      {
        id: "set-19",
        section: "Setup - Equipamento",
        responsible: "OP 1 / OP 2",
        label: "Cabine dos Liners (Carrosséis)",
        description:
          "Realizar limpeza entre, embaixo e sobre os carrosséis com jato de ar comprimido. Utilizar pano umedecido com álcool nas partes internas, externas e superior da proteção de acrílico da cabine.",
        required: true,
        requiresPhoto: true,
        status: "pending",
      },
      {
        id: "set-20",
        section: "Setup - Equipamento",
        responsible: "OP 1 / OP 2",
        label: "Esteira de transporte de saída dos Liners",
        description:
          "Verificar se há rolhas presas ou sujidades e efetuar a limpeza com jato de ar comprimido e pano.",
        required: true,
        status: "pending",
      },
      {
        id: "set-21",
        section: "Setup - Equipamento",
        responsible: "OP 1 / OP 2",
        label: "Separador de rolhas",
        description:
          "Levantar o divisor de rolhas e aplicar jato de ar comprimido até expulsar todas as rolhas.",
        required: true,
        status: "pending",
      },
      {
        id: "set-22",
        section: "Setup - Equipamento",
        responsible: "OP 1 / OP 2",
        label: "Cabine de resfriamento",
        description:
          "Remover as rolhas e aplicar jato de ar comprimido nas laterais e centro da esteira até a remoção total. Passar pano nas proteções laterais de acrílico.",
        required: true,
        status: "pending",
      },
      {
        id: "set-23",
        section: "Setup - Equipamento",
        responsible: "OP 1 / OP 2",
        label: "Encaixotadora",
        description:
          "Remover as rolhas jogadas utilizando ímã, com atenção às rolhas presas entre a estrutura da máquina. NÃO utilizar jato de ar caso esteja passando caixa na esteira.",
        required: true,
        status: "pending",
      },
      {
        id: "set-24",
        section: "Setup - Equipamento",
        responsible: "OP 1",
        label: "Etiquetadora - dados de impressão",
        description: "Ajustar na etiquetadora os dados de impressão: lote e linha de produção.",
        required: true,
        requiresPhoto: true,
        status: "pending",
      },

      // ===== INSPETOR ELETRÔNICO - CVS =====
      {
        id: "cvs-25",
        section: "Inspetor Eletrônico - CVS",
        responsible: "OP 1",
        label: "Cadastro de SKU no inspetor eletrônico",
        description:
          "Checar se há cadastro da receita do SKU do setup. Caso não haja, acionar o time do ITF e/ou técnico da estamparia treinado para criação padrão da receita. O setup só será liberado após a criação da receita.",
        required: true,
        status: "pending",
      },
      {
        id: "cvs-26",
        section: "Inspetor Eletrônico - CVS",
        responsible: "OP 1",
        label: "Análise de CVS",
        description:
          "Realizar o teste de CVS com as rolhas teste do SKU a ser produzido.",
        required: true,
        requiresPhoto: true,
        status: "pending",
      },

      // ===== ETIQUETADORA - VIDEOJET =====
      {
        id: "vj-27",
        section: "Etiquetadora - Videojet",
        responsible: "OP 1",
        label: "Cadastro de SKU na Videojet",
        description:
          "Verificar se o SKU a ser produzido está cadastrado nas etiquetadoras. Caso negativo, realizar o cadastro conforme o procedimento FRO-500275, disponível no Acadia.",
        required: true,
        status: "pending",
      },

      // ===== LIVEMES =====
      {
        id: "lm-28",
        section: "LiveMes",
        responsible: "OP 1",
        label: "Cadastro de SKU no LiveMes",
        description:
          "Verificar se o SKU a ser produzido está cadastrado no LiveMes, com código e ordem de produção.",
        required: true,
        status: "pending",
      },

      // ===== CÂMERA INSPETORA - VIBRADORA =====
      {
        id: "cam-29",
        section: "Câmera Inspetora - Vibradora",
        responsible: "OP 1",
        label: "Cadastro de SKU na câmera vibradora",
        description:
          "Verificar se o SKU está cadastrado e configurado no equipamento conforme o procedimento FRO-500230, anexo 4.4. Caso negativo, solicitar criação da receita ao time do ITF ou pessoas habilitadas.",
        required: true,
        status: "pending",
      },

      // ===== ROBÔ / EMBALAGEM =====
      {
        id: "emb-30",
        section: "Robô / Embalagem",
        responsible: "OP Embalagem",
        label: "Caixa fracionada do lote anterior",
        description:
          "Verificar se as caixas fracionadas do lote anterior estão identificadas com etiqueta 'FRACIONADA' em ambos os lados e posicionadas nos cantos laterais da última camada. Consultar procedimento FRO-11266, anexo 4.8 (Inspeção/Liberação dos Paletes).",
        required: true,
        requiresPhoto: true,
        status: "pending",
      },
      {
        id: "emb-31",
        section: "Robô / Embalagem",
        responsible: "OP Embalagem",
        label: "Retirada de palete do SKU anterior",
        description:
          "Verificar o horário de liberação e retirar o palete do SKU anterior da célula de paletização.",
        required: true,
        status: "pending",
      },
      {
        id: "emb-32",
        section: "Robô / Embalagem",
        responsible: "OP Embalagem / Téc. Elet.",
        label: "Câmera Inspetora da Embalagem",
        description:
          "Verificar se o SKU a ser produzido está cadastrado e configurado no equipamento conforme o procedimento FRO-500230, anexo 4.4. Caso negativo, solicitar a criação da receita ao time do ITF ou pessoas habilitadas.",
        required: true,
        status: "pending",
      },

      // ===== PÓS SETUP =====
      {
        id: "pos-01",
        section: "Pós Setup",
        responsible: "OP 1",
        label: "Devolução de EPI de altura e chave do transporte",
        description:
          "Devolver ao supervisor o cinto de segurança e a chave da escada marinheiro.",
        required: true,
        status: "pending",
      },
      {
        id: "pos-02",
        section: "Pós Setup",
        responsible: "OP 1",
        label: "5S - Organização da área",
        description: "Organizar a área de trabalho conforme padrão 5S.",
        required: true,
        requiresPhoto: true,
        status: "pending",
      },

      // ===== VALIDAÇÃO DO LABORATÓRIO DE ROLHAS =====
      {
        id: "lab-04",
        section: "Validação do Laboratório de Rolhas",
        responsible: "Téc. QA",
        label: "Caixa fracionada identificada",
        description:
          "Verificar se as caixas fracionadas do lote anterior estão identificadas com etiqueta 'FRACIONADA' em ambos os lados.",
        required: true,
        status: "pending",
      },
      {
        id: "lab-05",
        section: "Validação do Laboratório de Rolhas",
        responsible: "Téc. QA",
        label: "Troca de lote da impressora",
        description: "Realizar o check das 4 primeiras caixas do lote novo.",
        required: true,
        requiresPhoto: true,
        status: "pending",
      },
      {
        id: "lab-06",
        section: "Validação do Laboratório de Rolhas",
        responsible: "Téc. QA",
        label: "Funcionamento do flap e vibrador",
        description:
          "Checar se o flap da cabine de resfriamento está atuando em automático e se o vibrador de caixas está funcionando e parametrizado para vibrar no mínimo a cada 2.500 rolhas.",
        required: true,
        status: "pending",
      },
      {
        id: "lab-07",
        section: "Validação do Laboratório de Rolhas",
        responsible: "Téc. QA",
        label: "Impressão de lote novo",
        description:
          "Checar se o produto está com as informações de SKU, código e lote corretas na etiqueta e no sistema LiveMes.",
        required: true,
        requiresPhoto: true,
        status: "pending",
      },
      {
        id: "lab-08",
        section: "Validação do Laboratório de Rolhas",
        responsible: "Supervisor / Líder de turno",
        label: "Retenção das 2 caixas de setup",
        description: "Abrir retenção para as DUAS primeiras caixas de cada LINER.",
        required: true,
        status: "pending",
      },

      // ===== DEVOLUÇÃO DE MATÉRIA-PRIMA =====
      {
        id: "dev-01",
        section: "Devolução de Matéria-Prima",
        responsible: "Supervisor",
        label: "Devolução de insumos do SKU anterior",
        description:
          "Realizar a reserva de devolução dos insumos do SKU anterior à Logística via transação SAP 'MB21'. Garantir que o fardo (aço) fracionado esteja com laudo de identificação, cantoneira, stretch e quantificação correta para devolução.",
        required: true,
        status: "pending",
      },
    ],
  },
];
