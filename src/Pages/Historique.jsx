import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import "../style/Historique.css";

function EnregistrementsParDate() {
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [enregistrements, setEnregistrements] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchEnregistrements = async () => {
    if (!dateDebut || !dateFin) {
      setMessage('Veuillez sélectionner une date de début et une date de fin.');
      setEnregistrements([]);
      return;
    }
    if (dateFin < dateDebut) {
      setMessage('La date de fin doit être postérieure ou égale à la date de début.');
      setEnregistrements([]);
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const response = await axios.get('http://localhost:8000/api/enregistrement', {
        params: { date_debut: dateDebut, date_fin: dateFin }
      });

      if (response.status === 200) {
        if (response.data.length === 0) {
          setMessage('Aucun enregistrement trouvé pour cette période.');
          setEnregistrements([]);
        } else {
          setEnregistrements(response.data);
          setMessage('');
        }
      } else {
        setMessage(response.data.message || 'Erreur lors de la récupération des données.');
        setEnregistrements([]);
      }
    } catch (error) {
      console.error('Erreur :', error);
      setMessage('Une erreur est survenue lors de la récupération des données.');
      setEnregistrements([]);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(enregistrements);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Enregistrements');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'historique_enregistrements.xlsx');
  };

  return (
    <div className="container mt-4 p-4 rounded bg-custom min-height">
      <h2 className="mb-4 text-primary">Historique des enregistrements</h2>

      <div className="row mb-3 gy-2 align-items-end">
        <div className="col-sm-6 col-md-3">
          <label htmlFor="dateDebut" className="form-label small text-secondary text-start">Date début</label>
          <input
            id="dateDebut"
            type="date"
            className="form-control form-control-sm"
            value={dateDebut}
            onChange={e => setDateDebut(e.target.value)}
          />
        </div>
        <div className="col-sm-6 col-md-3">
          <label htmlFor="dateFin" className="form-label small text-secondary text-start">Date fin</label>
          <input
            id="dateFin"
            type="date"
            className="form-control form-control-sm"
            value={dateFin}
            onChange={e => setDateFin(e.target.value)}
          />
        </div>
        <div className="col-sm-12 col-md-6 d-flex gap-2">
          <button
            className="btn btn-primary btn-sm flex-fill"
            onClick={fetchEnregistrements}
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Rechercher'}
          </button>
          <button
            className="btn btn-success btn-sm flex-fill"
            onClick={exportToExcel}
            disabled={enregistrements.length === 0 || loading}
          >
            Exporter Excel
          </button>
        </div>
      </div>

      {message && (
        <div className="alert alert-info" role="alert">
          {message}
        </div>
      )}

      <div className="table-responsive">
        <table className="ttable table table-striped table-hover m-0 no-col-borders  text-start">
          <thead className="table-primary fw-bold custom-header-texttable-primary text-white fw-bold">
            <tr>
              <th>Date Enregistrement</th>
              <th>Date Sortie</th>
              <th>Nom </th>
              <th>Prénom </th>
              <th>N° Plaque</th>
              <th>Type Engin</th>
            </tr>
          </thead>
          <tbody>
            {enregistrements.length > 0 ? (
              enregistrements.map((item, index) => (
                <tr key={index} className="ligne-enregistrement">
                  <td>{item.date_enregistrement}</td>
                  <td>{item.date_sortie || '-'}</td>
                  <td>{item.nom_conducteur}</td>
                  <td>{item.prenom_conducteur}</td>
                  <td>{item.plaque_immatricu || '-'}</td>
                  <td>{item.type_engin || '-'}</td>
                </tr>
              ))
            ) : (
              !message && (
                <tr>
                  <td colSpan="6" className="text-center text-secondary">
                    Aucun enregistrement à afficher
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EnregistrementsParDate;
