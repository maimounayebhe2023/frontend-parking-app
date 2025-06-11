/*import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'*/
//import axios from 'axios';
import React from "react";
import FormAjou from "./Pages/FormAjou";
import SortieForm from "./Pages/ValideSortie";
import EnregistrementsList from "./Pages/Liste";
import EnregistrementsParDate from "./Pages/Historique";
import CodePinSearch from "./Pages/Recherche";
import AfficherEnregistrement from "./Pages/details";
import DashboardLayout from "./components/DashboardLayout";
import Accueil from "./Pages/Accueil";
import NotFound from "./Pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import Login from "./Pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { Navigate } from "react-router-dom";
import ListeUtilisateurs from "./Pages/ListeUtilisateurs";
import FormUtilisateur from "./Pages/FormUtilisateur";
import ModifierUtilisateur from "./Pages/ModifierUtilisateur";

import "./App.css";
import "./Style/Dashboard.css";
import "./Style/Login.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";

// Layout protégé qui englobe toutes les routes authentifiées
const ProtectedLayout = () => {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Routes>
          <Route index element={<Accueil />} />
          <Route path="validation-sortie" element={<SortieForm />} />
          <Route path="nouvelle-entree" element={<FormAjou />} />
          <Route path="liste-actuelle" element={<EnregistrementsList />} />
          <Route path="historique" element={<EnregistrementsParDate />} />
          <Route path="recherche" element={<CodePinSearch />} />
          <Route path="details/:id" element={<AfficherEnregistrement />} />
          <Route path="utilisateurs" element={<ListeUtilisateurs />} />
          <Route path="utilisateurs/nouveau" element={<FormUtilisateur />} />
          <Route path="utilisateurs/:id" element={<ModifierUtilisateur />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Route publique */}
        <Route path="/login" element={<Login />} />

        {/* Redirection de la racine vers le dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Toutes les routes protégées sous /dashboard */}
        <Route path="/dashboard/*" element={<ProtectedLayout />} />

        {/* Capture toutes les autres routes et redirige vers le dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
