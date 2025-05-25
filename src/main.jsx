import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ReactDom from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Créer une instance de QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Désactive le rechargement automatique lors du focus
      retry: 1, // Nombre de tentatives en cas d'échec
      staleTime: 5 * 60 * 1000, // Les données sont considérées comme fraîches pendant 5 minutes
    },
  },
});

const root = ReactDom.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
