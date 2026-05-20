import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
/* import Verify from "./pages/Verify.tsx"; */
import Dashboard from "./pages/Dashboard.tsx";
import ChecklistRun from "./pages/ChecklistRun.tsx";
import NewChecklist from "./pages/NewChecklist.tsx";
import History from "./pages/History.tsx";
import AccessHistory from "./pages/AccessHistory.tsx";
import Tutorial from "./pages/Tutorial.tsx";

import AppShell from "./components/AppShell.tsx";
import RequireAuth from "./components/RequireAuth.tsx";

const queryClient = new QueryClient();

const wrap = (node: React.ReactNode) => (
  <RequireAuth><AppShell>{node}</AppShell></RequireAuth>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
{/*           <Route path="/verify" element={<Verify />} /> */}
          <Route path="/app" element={wrap(<Dashboard />)} />
          <Route path="/app/checklist/novo" element={wrap(<NewChecklist />)} />
          <Route path="/app/checklists/:id" element={wrap(<ChecklistRun />)} />
          <Route path="/app/historico" element={wrap(<History />)} />
          <Route path="/app/acessos" element={wrap(<AccessHistory />)} />
          <Route path="/app/tutorial" element={wrap(<Tutorial />)} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
