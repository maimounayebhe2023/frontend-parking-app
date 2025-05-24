/*import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'*/
//import axios from 'axios';
import React, { useState } from "react";
import FormAjou from "./Pages/FormAjou";
import SortieForm from "./Pages/ValideSortie";
import EnregistrementsList from "./Pages/Liste";
import EnregistrementsParDate from "./Pages/Historique";
import CodePinSearch from "./Pages/Recherche";
import AfficherEnregistrement from "./Pages/details";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/form" element={<FormAjou />} />
      <Route path="/ValideSortie" element={<SortieForm />} />
      <Route path="/Liste" element={<EnregistrementsList />} />
      <Route path="/His" element={<EnregistrementsParDate />} />
      <Route path="/Details" element={<AfficherEnregistrement />} />

      <Route path="/Recherche" element={<CodePinSearch />} />
    </Routes>
  );
}

export default App;
