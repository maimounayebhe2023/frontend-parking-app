/*import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'*/
//import axios from 'axios';
import React, { useState } from 'react';
import FormAjou from './Pages/FormAjou';
import SortieForm from './Pages/ValideSortie';
import EnregistrementsList from './Pages/Liste';
import EnregistrementsParDate from './Pages/Historique';
import CodePinSearch from './Pages/Recherche';

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { Routes, Route } from 'react-router-dom';

function App() {
 /* const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
 ;*/
 return(
    <Routes>
      <Route path='/form' element= { < FormAjou /> } /> 
      <Route path='/ValideSortie' element= { < SortieForm />} />
      <Route path='/Liste' element={ <EnregistrementsList/>} />
      <Route path='/His' element={ <EnregistrementsParDate/>} />
      
      <Route path='/Recherche' element={ <CodePinSearch />} />
    </Routes>
   
 )
 
}


export default App
