import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Login from "./pages/Login.tsx";
import Verify from "./pages/Verify.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Checklists from "./pages/Checklists.tsx";
import ChecklistRun from "./pages/ChecklistRun.tsx";

import AppShell from "./components/AppShell.tsx";
import RequireAuth from "./components/RequireAuth.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<Verify />} />
          <Route
            path="/app"
            element={
              <RequireAuth>
                <AppShell><Dashboard /></AppShell>
              </RequireAuth>
            }
          />
          <Route
            path="/app/checklists"
            element={
              <RequireAuth>
                <AppShell><Checklists /></AppShell>
              </RequireAuth>
            }
          />
          <Route
            path="/app/checklists/:id"
            element={
              <RequireAuth>
                <AppShell><ChecklistRun /></AppShell>
              </RequireAuth>
            }
          />
          <Route
            path="/app/architecture"
            element={
              <RequireAuth>
                <AppShell><Architecture /></AppShell>
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
