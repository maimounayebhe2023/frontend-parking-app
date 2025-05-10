import React, { useState } from 'react';
import axios from 'axios';

function EnregistrementsParDate() {
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [enregistrements, setEnregistrements] = useState([]);
  const [message, setMessage] = useState('');

  const fetchEnregistrements = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/enregistrement', {
      date_debut: dateDebut,
      date_fin: dateFin,
    });

    if(response.status === 201) {
      setMessage(response.data.message);
      setEnregistrements([]);
    } else {
      setEnregistrements(response.data);
      setMessage('');
    }
    } catch (error) {
      console.error('Erreur :', error);
      setMessage('Une erreur est survenue');
    }
  };

  return (
      <div className="container mt-4">
    <h2 className="mb-4">Recherche des enregistrements par date</h2>
    <div className="row mb-3">
      <div className="col">
        <label>Date début</label>
        <input
          type="date"
          className="form-control"
          value={dateDebut}
          onChange={(e) => setDateDebut(e.target.value)}
        />
      </div>
      <div className="col">
        <label>Date fin</label>
        <input
          type="date"
          className="form-control"
          value={dateFin}
          onChange={(e) => setDateFin(e.target.value)}
        />
      </div>
      <div className="col d-flex align-items-end">
        <button className="btn btn-primary w-100" onClick={fetchEnregistrements}>
          Rechercher
        </button>
      </div>
    </div>

    {message && <div className="alert alert-warning">{message}</div>}

    {enregistrements.length > 0 && (
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-light">
            <tr>
              <th>Date Enregistrement</th>
              <th>Date Sortie</th>
              <th>Nom Conducteur</th>
              <th>Prénom Conducteur</th>
              <th>Plaque</th>
              <th>Type Engin</th>
            </tr>
          </thead>
          <tbody>
            {enregistrements.map((item, index) => (
              <tr key={index}>
                <td>{item.date_enregistrement}</td>
                <td>{item.date_sortie || '-'}</td>
                <td>{item.nom_conducteur}</td>
                <td>{item.prenom_conducteur}</td>
                <td>{item.plaque_immatricu || '-'}</td>
                <td>{item.type_engin || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
  );
}

export default EnregistrementsParDate;
