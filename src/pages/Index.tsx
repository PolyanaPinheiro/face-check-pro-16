import { Navigate } from "react-router-dom";
import { storage } from "@/lib/storage";

const Index = () => {
  const user = storage.getUser();
  return <Navigate to={user ? "/app" : "/login"} replace />;
};

export default Index;
