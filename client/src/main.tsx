import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "sonner";
import { ThemeProvider } from "./context/ThemeProvider.tsx";
import { RecoilRoot } from "recoil";

createRoot(document.getElementById("root")!).render(
  <>
    <RecoilRoot>
      <ThemeProvider>
        <App />
        <Toaster />
      </ThemeProvider>
    </RecoilRoot>
   </>
);
