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

import "./App.css";
import "./Style/Dashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Accueil />} />
          <Route path="validation-sortie" element={<SortieForm />} />
          <Route path="nouvelle-entree" element={<FormAjou />} />
          <Route path="liste-actuelle" element={<EnregistrementsList />} />
          <Route path="historique" element={<EnregistrementsParDate />} />
          <Route path="recherche" element={<CodePinSearch />} />
          <Route path="details/:id" element={<AfficherEnregistrement />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
