import { RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./providers/theme-provider";
import { router } from "./routes";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
          <RouterProvider router={router} />
        </div>
        <Toaster richColors position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}
