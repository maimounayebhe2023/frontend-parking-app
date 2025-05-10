import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CodePinSearch = () => {
  const [pin, setPin] = useState('');
  const [donnees, setDonnees] = useState([]); // liste affichée
  const [erreur, setErreur] = useState('');

  // Récupérer tous les enregistrements au chargement
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/index')
      .then((res) => setDonnees(res.data))
      .catch(() => setErreur("Erreur lors du chargement des données."));
  }, []);

  const rechercher = () => {
    if (pin.trim() === '') return;

    axios.get(`http://localhost:8000/api/enregistrement/${pin}`)
      .then((res) => {
        setDonnees([res.data]); // un seul résultat dans un tableau
        setErreur('');
      })
      .catch(() => {
        setErreur("Code PIN introuvable.");
        setDonnees([]);
      });
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Application de gestion de parking</h2>

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Entrer un code PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
        <button className="btn btn-primary" onClick={rechercher}>
          Rechercher
        </button>
      </div>

      {erreur && <div className="alert alert-danger">{erreur}</div>}

      <div className="row">
        {donnees.map((donnee, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title">
                  {donnee.conducteur?.nom} {donnee.conducteur?.prenom}
                </h5>
                <h6 className="card-subtitle mb-2 text-muted">
                  {donnee.conducteur?.categorie?.nom}
                </h6>
                <p className="card-text">
                  <strong>Voiture :</strong> {donnee.engin?.plaque_immatricu}<br />
                  <strong>Type :</strong> {donnee.engin?.type_engin}<br />
                  <strong>Date :</strong> {donnee.enregistrement?.date_sortie ?? '---'}<br />
                  <strong>Code PIN :</strong> {donnee.enregistrement?.code_pin}
                </p>
                <button className="btn btn-primary me-2">Détails</button>
                <button className="btn btn-danger">Supprimer</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CodePinSearch;
