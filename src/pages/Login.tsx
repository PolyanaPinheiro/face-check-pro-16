import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Sparkles, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("ana.lima@empresa.com");
  const [password, setPassword] = useState("••••••••");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("flow_pending_user", JSON.stringify({
      name: "Ana Lima",
      email,
      role: "Supervisora de Operações",
    }));
    navigate("/verify");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="relative gradient-hero text-primary-foreground p-8 sm:p-12 flex flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full gradient-accent blur-3xl opacity-30" />

        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-accent grid place-items-center shadow-glow">
            <ShieldCheck className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <p className="font-display text-lg font-bold">FaceCheck</p>
            <p className="text-xs mono opacity-70 uppercase tracking-wider">SharePoint sync</p>
          </div>
        </div>

        <div className="relative space-y-6 max-w-lg animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-xs mono">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            CHECKLIST + BIOMETRIA + SHAREPOINT
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold leading-[1.05]">
            Auditoria com <span className="text-gradient">prova</span> de quem executou.
          </h1>
          <p className="text-base opacity-80 leading-relaxed">
            Cada item do checklist é assinado biometricamente e sincronizado em tempo real com suas listas
            do Microsoft SharePoint. Sem fraudes. Sem retrabalho.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { k: "99.6%", v: "Confiança média" },
              { k: "<2s", v: "Validação facial" },
              { k: "100%", v: "Rastreável" },
            ].map((s) => (
              <div key={s.k} className="border-l-2 border-accent/50 pl-3">
                <p className="font-display text-2xl font-bold">{s.k}</p>
                <p className="text-xs opacity-70">{s.v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs mono opacity-60">
          AWS Rekognition · Microsoft Graph · Azure AD
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center p-8 sm:p-12">
        <form onSubmit={submit} className="w-full max-w-sm space-y-6 animate-fade-up">
          <div>
            <h2 className="font-display text-3xl font-bold">Acessar conta</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Após a senha você fará a validação facial obrigatória.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail corporativo</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full gap-2 gradient-accent text-accent-foreground hover:opacity-90 shadow-glow">
            Continuar para validação
            <ArrowRight className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center pt-2">
            <Lock className="w-3 h-3" />
            Protegido com Azure AD · MFA + biometria
          </div>
        </form>
      </div>
    </div>
  );
}
