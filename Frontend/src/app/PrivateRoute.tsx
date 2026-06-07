import { Navigate, Outlet } from "react-router";
import { useAuth } from "./contexts/AuthContext";

export function PrivateRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground animate-pulse font-medium">
          Carregando sistema...
        </p>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
