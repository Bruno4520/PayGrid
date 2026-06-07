import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { api } from "../../services/api";

interface User {
  id: number;
  nome: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (token: string, userData: User) => void;
  signOut: () => void;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storedToken = localStorage.getItem("@PayGrid:token");

      if (storedToken) {
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        try {
          const response = await api.get<User>("/usuarios/perfil");
          setUser(response.data);
        } catch {
          toast.error("Sessão expirada. Por favor, faça login novamente.");
          signOut();
        }
      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  const signIn = (token: string, userData: User) => {
    localStorage.setItem("@PayGrid:token", token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  };

  const signOut = () => {
    localStorage.removeItem("@PayGrid:token");
    api.defaults.headers.common["Authorization"] = "";
    setUser(null);
  };

  const updateUser = (updatedData: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signIn,
        signOut,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
