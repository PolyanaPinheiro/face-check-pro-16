import { Navigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import Login from "./Login";

const Index = () => {
  const user = storage.getUser();
  if (user) return <Navigate to="/app" replace />;
  return <Login />;
};

export default Index;
