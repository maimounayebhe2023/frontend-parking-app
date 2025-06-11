import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function AfficherEnregistrement() {
  const [codePin, setCodePin] = useState('');
  const [donnees, setDonnees] = useState(null);
  const [erreur, setErreur] = useState('');

  const rechercher = () => {
    if (!codePin.trim()) return;

    axios.get(`http://127.0.0.1:8000/api/Affiche/${id}`)
      .then((res) => {
        setDonnees(res.data);
        setErreur('');
      })
      .catch(() => {
        setErreur("Aucun enregistrement trouvé.");
        setDonnees(null);
      });
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Rechercher un enregistrement par code PIN</h3>

      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Entrez le code PIN"
          value={codePin}
          onChange={(e) => setCodePin(e.target.value)}
        />
        <button className="btn btn-primary" onClick={rechercher}>
          Rechercher
        </button>
      </div>

      {erreur && (
        <div className="alert alert-danger">{erreur}</div>
      )}

      {donnees && (
        <div className="card mt-4 shadow">
          <div className="card-body">
            <h5 className="card-title">Informations de l'enregistrement</h5>
            <ul className="list-group list-group-flush mt-3">
              <li className="list-group-item"><strong>Nom:</strong> {donnees.conducteur.nom}</li>
              <li className="list-group-item"><strong>Prénom:</strong> {donnees.conducteur.prenom}</li>
              <li className="list-group-item"><strong>Téléphone:</strong> {donnees.conducteur.tel}</li>
              <li className="list-group-item"><strong>Catégorie:</strong> {donnees.categorie?.nom || 'Non défini'}</li>
              <li className="list-group-item"><strong>Plaque:</strong> {donnees.plaque_engin || 'N/A'}</li>
              <li className="list-group-item"><strong>Type d'engin:</strong> {donnees.engin?.type_engin || 'N/A'}</li>
              <li className="list-group-item"><strong>Code PIN:</strong> {codePin}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
export default AfficherEnregistrement; 
