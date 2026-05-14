import { BookOpen, ScanFace, ClipboardList, Camera, Cloud, History, Filter, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const steps = [
  {
    icon: ScanFace,
    title: "1. Login + Biometria",
    body: "Acesse com e-mail e senha. Em seguida, sua identidade é confirmada por reconhecimento facial (AWS Rekognition). Esse acesso fica registrado em Histórico de Acesso.",
  },
  {
    icon: PlayCircle,
    title: "2. Iniciar novo Checklist",
    body: "Na tela inicial, clique em \"Fazer novo Checklist\". Preencha Linha, SKU e Responsável. O responsável é validado por biometria antes do início.",
  },
  {
    icon: ClipboardList,
    title: "3. Executar os itens",
    body: "Marque cada item como OK ou Falha. Itens com tag \"foto\" exigem evidência: você pode tirar uma foto pela câmera ou escolher do dispositivo.",
  },
  {
    icon: Camera,
    title: "4. Evidências fotográficas",
    body: "Use \"Tirar foto\" para abrir a câmera ao vivo, ou \"Escolher do dispositivo\" para usar a galeria. Cada foto é vinculada ao item correspondente.",
  },
  {
    icon: Cloud,
    title: "5. Assinar e enviar",
    body: "Ao concluir, clique em \"Assinar e enviar ao SharePoint\". Uma nova validação biométrica final confirma a autoria. Os dados (Linha, SKU, Responsável, hora de início e fim) são compilados e enviados.",
  },
  {
    icon: Filter,
    title: "6. Histórico e filtros",
    body: "Em Histórico de Checklist você pode filtrar registros por período, turno (Manhã/Tarde/Noite) e linha de produção.",
  },
  {
    icon: History,
    title: "7. Histórico de Acesso",
    body: "Acompanhe quem acessou a plataforma, em qual data e horário. Útil para auditoria.",
  },
];

export default function Tutorial() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="space-y-2">
        <p className="text-xs mono uppercase tracking-widest text-accent">TUTORIAL</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold flex items-center gap-3">
          <BookOpen className="w-7 h-7 text-accent" /> Como usar a plataforma
        </h1>
        <p className="text-muted-foreground">Guia passo a passo para realizar checklists com biometria e sincronização SharePoint.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        {steps.map((s) => (
          <Card key={s.title} className="p-5 shadow-card border-border/60 hover:shadow-elegant transition-smooth">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl gradient-hero grid place-items-center shadow-glow shrink-0">
                <s.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-display font-bold">{s.title}</h3>
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{s.body}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6 shadow-card border-accent/30 bg-accent/5">
        <h3 className="font-display font-bold">Dica</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Para tirar fotos, é necessário permitir acesso à câmera no navegador. Em dispositivos móveis, prefira utilizar HTTPS.
        </p>
      </Card>
    </div>
  );
}
