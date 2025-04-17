import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import EditorLayout from "./app/EditorLayout.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EditorLayout />
  </StrictMode>
);
