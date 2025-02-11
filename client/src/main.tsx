import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";
import { ThemeProvider } from "./context/ThemeProvider.tsx";
createRoot(document.getElementById("root")!).render(
  <>
      <ThemeProvider>
        <App />
        <Toaster />
      </ThemeProvider>

   </>
);
