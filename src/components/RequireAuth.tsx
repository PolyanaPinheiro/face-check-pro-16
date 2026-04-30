import { Navigate } from "react-router-dom";
import { storage } from "@/lib/storage";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = storage.getUser();
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}
