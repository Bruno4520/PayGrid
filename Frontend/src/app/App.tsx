import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./providers/theme-provider";
import { ThemeToggle } from "./components/ui/theme-toggle";

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <ThemeToggle />
    </ThemeProvider>
  );
}
