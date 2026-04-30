import { Card } from "@/components/ui/card";
import { Smartphone, Cloud, ScanFace, Database, Lock, Workflow, GitBranch, Zap, CheckCircle2, AlertTriangle } from "lucide-react";

export default function Architecture() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <header className="space-y-3">
        <p className="text-xs mono uppercase tracking-widest text-accent">PLANEJAMENTO TÉCNICO</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold">Arquitetura do app mobile</h1>
        <p className="text-muted-foreground max-w-3xl">
          Plano de referência para implementar o checklist com biometria facial e integração SharePoint
          como aplicativo nativo multiplataforma. Este protótipo web simula o fluxo final.
        </p>
      </header>

      {/* Diagram */}
      <Card className="p-6 sm:p-10 shadow-elegant border-border/60 overflow-hidden relative">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div className="relative grid lg:grid-cols-3 gap-6 items-stretch">
          {/* Mobile */}
          <div className="space-y-3">
            <div className="rounded-2xl gradient-hero text-primary-foreground p-5 shadow-elegant">
              <div className="flex items-center gap-3 mb-3">
                <Smartphone className="w-6 h-6 text-accent" />
                <p className="font-display font-bold">App Mobile</p>
              </div>
              <ul className="text-xs space-y-1.5 mono opacity-90">
                <li>• Flutter / React Native</li>
                <li>• Camera + Biometric SDK</li>
                <li>• SQLite offline-first</li>
                <li>• MSAL (Azure AD)</li>
              </ul>
            </div>
            <div className="text-[10px] mono text-center text-muted-foreground uppercase">Cliente</div>
          </div>

          {/* Backend */}
          <div className="space-y-3">
            <div className="rounded-2xl bg-card border-2 border-accent/40 p-5 shadow-glow">
              <div className="flex items-center gap-3 mb-3">
                <Workflow className="w-6 h-6 text-accent" />
                <p className="font-display font-bold">API Gateway (BFF)</p>
              </div>
              <ul className="text-xs space-y-1.5 mono text-muted-foreground">
                <li>• Node.js / .NET</li>
                <li>• OAuth2 + JWT</li>
                <li>• Rate limiting</li>
                <li>• Orquestração</li>
              </ul>
            </div>
            <div className="text-[10px] mono text-center text-muted-foreground uppercase">Camada de orquestração</div>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <div className="rounded-2xl bg-card border p-5 shadow-card space-y-3">
              <div className="flex items-center gap-3">
                <ScanFace className="w-5 h-5 text-accent" />
                <p className="text-sm font-semibold">AWS Rekognition</p>
              </div>
              <div className="flex items-center gap-3">
                <Cloud className="w-5 h-5 text-primary" />
                <p className="text-sm font-semibold">Microsoft Graph</p>
              </div>
              <div className="flex items-center gap-3">
                <Database className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm font-semibold">SharePoint Lists + Docs</p>
              </div>
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-warning" />
                <p className="text-sm font-semibold">Azure AD / Entra ID</p>
              </div>
            </div>
            <div className="text-[10px] mono text-center text-muted-foreground uppercase">Serviços externos</div>
          </div>
        </div>
      </Card>

      {/* Stack comparison */}
      <section className="space-y-5">
        <h2 className="font-display text-2xl font-bold">Flutter vs React Native</h2>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              name: "Flutter",
              tagline: "Dart · Engine própria · UI consistente",
              color: "from-[hsl(200_85%_45%)] to-[hsl(220_85%_30%)]",
              pros: [
                "Performance nativa via compilação AOT",
                "UI idêntica em iOS/Android (sem fragmentação)",
                "google_mlkit_face_detection integra direto à câmera",
                "Excelente para apps com muita captura visual",
              ],
              cons: [
                "Equipe precisa dominar Dart",
                "Menos libs prontas para Microsoft ecosystem",
                "Bundle inicial maior",
              ],
              fit: "Recomendado se UX consistente e câmera/ML são prioridade.",
            },
            {
              name: "React Native (Expo)",
              tagline: "TypeScript · OTA updates · Ecossistema JS",
              color: "from-[hsl(178_78%_42%)] to-[hsl(178_90%_30%)]",
              pros: [
                "Mesma stack do web (TypeScript/React)",
                "OTA updates via EAS — correções sem app store",
                "react-native-msal e Graph SDK maduros",
                "Reuso de lógica com este protótipo web",
              ],
              cons: [
                "Bridge nativa pode adicionar overhead",
                "Câmera + ML exige libs nativas (vision-camera + frame processors)",
                "UI pode divergir entre plataformas",
              ],
              fit: "Recomendado se a equipe já é JS/TS e quer iterar rápido.",
            },
          ].map((s) => (
            <Card key={s.name} className="overflow-hidden shadow-card border-border/60">
              <div className={`h-2 bg-gradient-to-r ${s.color}`} />
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-display text-2xl font-bold">{s.name}</h3>
                  <p className="text-xs mono text-muted-foreground mt-1">{s.tagline}</p>
                </div>
                <div className="space-y-2">
                  {s.pros.map((p) => (
                    <div key={p} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </div>
                  ))}
                  {s.cons.map((p) => (
                    <div key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t text-sm font-medium text-accent">{s.fit}</div>
              </div>
            </Card>
          ))}
        </div>
        <Card className="p-5 border-accent/40 bg-accent/5">
          <p className="text-sm">
            <span className="font-display font-bold text-base">Recomendação:</span>{" "}
            <span className="font-semibold">Flutter</span> para máxima qualidade de câmera + ML on-device,
            ou <span className="font-semibold">React Native + Expo</span> se a equipe já trabalha com TS e
            quer aproveitar este protótipo. Ambas atendem 100% dos requisitos.
          </p>
        </Card>
      </section>

      {/* Auth flow */}
      <section className="space-y-5">
        <h2 className="font-display text-2xl font-bold">Fluxo de validação facial</h2>
        <Card className="p-6 shadow-card border-border/60">
          <ol className="space-y-4">
            {[
              { t: "Login Azure AD", d: "MSAL inicia OAuth2 com Entra ID. Token JWT armazenado no Keychain/Keystore." },
              { t: "Captura ao vivo", d: "Câmera frontal + detecção de liveness (piscar / virar a cabeça) via Rekognition Face Liveness." },
              { t: "CompareFaces", d: "Frame enviado ao backend → S3 → Rekognition.CompareFaces contra a foto cadastral. Threshold ≥ 95%." },
              { t: "Assinatura digital", d: "Hash do checklist + biometric proof + timestamp gravados como metadados na lista SharePoint." },
              { t: "Auditoria", d: "Logs imutáveis (CloudWatch + SharePoint audit log) garantem rastreabilidade LGPD/SOX." },
            ].map((s, i) => (
              <li key={s.t} className="flex gap-4">
                <div className="w-9 h-9 shrink-0 rounded-xl gradient-accent text-accent-foreground grid place-items-center font-display font-bold">
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold">{s.t}</p>
                  <p className="text-sm text-muted-foreground">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </section>

      {/* SharePoint integration */}
      <section className="space-y-5">
        <h2 className="font-display text-2xl font-bold">Integração SharePoint — Microsoft Graph</h2>
        <Card className="p-6 shadow-card border-border/60 space-y-4">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Recomendação:</strong> Microsoft Graph API (v1.0) com
            autenticação MSAL/Azure AD. Padrão moderno, suportado oficialmente, funciona com SharePoint Online
            e cobre listas, bibliotecas de documentos e permissões.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { ep: "GET /sites/{id}/lists", u: "Descobrir listas disponíveis" },
              { ep: "POST /sites/{id}/lists/{lid}/items", u: "Criar registro do checklist" },
              { ep: "PUT /drives/{id}/items/{path}:/content", u: "Upload de fotos" },
              { ep: "PATCH /lists/{lid}/items/{iid}/fields", u: "Atualizar status" },
            ].map((e) => (
              <div key={e.ep} className="p-3 rounded-lg bg-secondary/60 border">
                <code className="text-[11px] mono text-accent block">{e.ep}</code>
                <p className="text-xs text-muted-foreground mt-1">{e.u}</p>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/30 text-sm">
            <strong>Resiliência offline:</strong> SQLite local + fila de sincronização (BackgroundFetch).
            Conflitos resolvidos por timestamp + ETag do Graph.
          </div>
        </Card>
      </section>

      {/* Roadmap */}
      <section className="space-y-5">
        <h2 className="font-display text-2xl font-bold">Roadmap proposto</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { p: "Fase 1", t: "Fundação", d: "2 sem", items: ["Setup projeto", "Azure AD", "Design system"] },
            { p: "Fase 2", t: "Biometria", d: "3 sem", items: ["Câmera + liveness", "Rekognition", "Cadastro facial"] },
            { p: "Fase 3", t: "Checklist", d: "3 sem", items: ["CRUD offline", "Evidências foto", "Sync queue"] },
            { p: "Fase 4", t: "SharePoint", d: "2 sem", items: ["Graph API", "Audit log", "Hardening + store"] },
          ].map((f, i) => (
            <Card key={f.p} className="p-5 shadow-card border-border/60 relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-30 ${i % 2 ? "bg-accent" : "bg-primary"}`} />
              <div className="relative">
                <p className="text-xs mono text-accent uppercase">{f.p} · {f.d}</p>
                <h3 className="font-display text-lg font-bold mt-1">{f.t}</h3>
                <ul className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                  {f.items.map((x) => (
                    <li key={x} className="flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-accent" /> {x}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="space-y-5">
        <h2 className="font-display text-2xl font-bold">Segurança & compliance</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { i: Lock, t: "TLS 1.3 + cert pinning" },
            { i: ScanFace, t: "Liveness anti-spoofing" },
            { i: GitBranch, t: "Logs imutáveis (LGPD)" },
            { i: Database, t: "Criptografia at-rest AES-256" },
          ].map((x) => (
            <Card key={x.t} className="p-5 text-center shadow-card border-border/60">
              <x.i className="w-6 h-6 mx-auto text-accent mb-2" />
              <p className="text-sm font-medium">{x.t}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
