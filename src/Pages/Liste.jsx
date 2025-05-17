import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EnregistrementsList = () => {
  const [enregistrements, setEnregistrements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/index')
      .then(response => {
        setEnregistrements(response.data);
        setLoading(false);
      })
      .catch(error => {
        setErreur('Erreur lors du chargement des enregistrements');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-muted mt-5">Chargement en cours...</p>;
  if (erreur) return <p className="text-danger text-center mt-5">{erreur}</p>;

  return (
    <div className="bg-light min-vh-100 text-start">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">UNC-PINParking</a>
        </div>
      </nav>

      {/* Contenu principal */}
      <div className="container mt-5">
        <div className="card shadow-sm border-0">
          <div className="card-header bg-light border-bottom w-100 m-5 ml-0 border">
            <h5 className="p-2 text-primary fw-bold text-center ">Liste des Enregistrements</h5>
          </div>
          <div className="card-body bg-white p-0">
            <table className="table  table-hover m-0">
              <thead className="table-primary">
                <tr>
                 
                  <th>Plaque</th>
                  <th>Type d'engin</th>
                  <th>Date d'enregistrement</th>
                  <th>Date de sortie</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {enregistrements.map((item, index) => (
                  <tr key={index}>
                    <td>{item.plaque_engin || '—'}</td>
                    <td>{item.typeengin || '—'}</td>
                    
                    <td>{item.date_enregistrement}</td>
                    <td>{item.date_sortie ? item.date_sortie :
                      <span className="text-danger">Non Sorti</span>}
                    </td>
                    <td><button className='btn btn-light'> details</button> </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnregistrementsList;
