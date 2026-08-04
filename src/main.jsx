import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./standalone/App.jsx";
import AppErrorBoundary from "./standalone/AppErrorBoundary.jsx";
import { registerVisualDrillOffline } from "./standalone/registerVisualDrillOffline.js";
import "./styles/global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <App />
        </HashRouter>
      </QueryClientProvider>
    </AppErrorBoundary>
  </React.StrictMode>
);

registerVisualDrillOffline();
