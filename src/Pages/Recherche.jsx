import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CodePinSearch = () => {
  const [recherche, setRecherche] = useState('');
  const [donnees, setDonnees] = useState([]);
  const [erreur, setErreur] = useState('');
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [pageActuelle, setPageActuelle] = useState(1);
  const elementsParPage = 5;

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/index')
      .then((res) => setDonnees(res.data))
      .catch(() => setErreur("Erreur lors du chargement des données."));
  }, []);
  

  const rechercher = () => {
    if (recherche.trim() === '') return;
    const valeur = recherche.trim();
    let params = {};
  
    if (/(^(\d{4})[-\/\.]\d{2}[-\/\.]\d{2}$)/.test(valeur)) {
      params.date_enregistrement = valeur.replace(/[-\/\.]/g, '-'); 
    }
   
    else if (/[A-Za-z]/.test(valeur) && /\d/.test(valeur) && valeur.length > 5 ) {
      params.plaque_engin = valeur;
    }
   
    else if (valeur.startsWith('6')) {
      params.tel = valeur;
    }
   
    else {
      params.code_pin = valeur;
    }
  
    // Envoi de la requête
    axios.get('http://127.0.0.1:8000/api/index', { params })
      .then((res) => {
        setDonnees(res.data);
        setErreur('');
        setPageActuelle(1);
      })
      .catch(() => {
        setErreur("Aucun enregistrement trouvé.");
        setDonnees([]);
      });
  };
  

  const indexDernier = pageActuelle * elementsParPage;
  const indexPremier = indexDernier - elementsParPage;
  const donneesPage = donnees.slice(indexPremier, indexDernier);
  const pagesTotal = Math.ceil(donnees.length / elementsParPage);

  return (
    <div>
     
      {/* Barre de navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-4 py-3">
        <a className="navbar-brand fw-bold" href="#">UNC-PINParking</a>

        <div className="d-flex flex-grow-1">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Entrez votre tel, code PIN ou date"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
          />
          <button className="btn btn-light text-primary fw-bold" onClick={rechercher}>
            Rechercher
          </button>
        </div>

        <div className="ms-3 position-relative">
          <button
            className="btn btn-light"
            onClick={() => setMenuOuvert(!menuOuvert)}
          >
            &#8942;
          </button>
          {menuOuvert && (
            <div className="position-absolute end-0 mt-2 bg-white shadow rounded p-2 z-index-1" style={{ minWidth: '150px' }}>
              <a href="#" className="dropdown-item text-dark">Se déconnecter</a>
              <a href="#" className="dropdown-item text-dark">+ Enregistrement</a>
              <a href="#" className="dropdown-item text-dark">+ Sortie</a>
            </div>
          )}
        </div>
      </nav>

      <div className="container mt-4">
        {erreur && <div className="alert alert-danger">{erreur}</div>} 
         <div className='bg-primary px-2 py-2 mb-3 text-white'>Liste des enregistremetns</div>
        <div className="table-responsive">
          <table className="table table table-striped table-hover m-0 no-col-borders  text-start">
            <thead className="table-primary fw-bold custom-header-texttable-primary text-white fw-bold">
              <tr>
                <th>N°</th>
                <th>Plaque</th>
                <th>Date D'enregistrement</th>
                <th>Date sortie</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donneesPage.map((donnee, index) => (
                <tr key={index} className={index % 2 === 0 ? 'table-light' : ''}>
                  <td>{donnee.id}</td>
                  <td>{donnee.plaque_engin}</td>
                  <td>{donnee.date_enregistrement}</td>
                  <td>{donnee.date_sortie ? <span className="text-success fw-bold"> Sorti</span> :
                    <span className="text-danger  fw-bold">Non Sorti</span>}
                  </td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2" title="Détails">
                      <i className="bi bi-eye"></i>
                    </button>
                    <button className="btn btn-sm btn-danger" title="Supprimer">
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {donnees.length === 0 && (
                <tr>
                  <td colSpan="8">Aucun enregistrement trouvé.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        
      </div>
    </div>
  );
};

export default CodePinSearch;