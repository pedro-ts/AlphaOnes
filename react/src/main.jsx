import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "./index.css";
import App from "./App.jsx";
// Router
import router from "./router.jsx";
// context
import { ContextProvider } from "./context/ContextProvider.jsx";
import { LoadingProvider } from "./context/LoadingContext.jsx";

createRoot(document.getElementById("root")).render(
 
    <ContextProvider>
      <LoadingProvider>
      <RouterProvider router={router} />
      </LoadingProvider>
    </ContextProvider>

);
