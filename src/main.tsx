import "./index.css";
import "./lib/chart-setup.ts";

import App from "./App.tsx";
import { StrictMode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
    <Toaster />
  </StrictMode>
);
