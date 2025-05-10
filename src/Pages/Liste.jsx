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

  if (loading) return <p>Chargement en cours...</p>;
  if (erreur) return <p>{erreur}</p>;

  return (
    <div>
      <h2>Liste des enregistrements</h2>
      <table className='p-5 w-100 h-100 bg-light rounded shadow' cellPadding="5">
       
        <tbody>
          {enregistrements.map((item, index) => (
            <tr key={index}>
              <td>{item.date_enregistrement}</td>
              <td>{item.nom_conducteur}</td>
              <td>{item.prenom_conducteur}</td>
              <td>{item.plaque_engin || '—'}</td>
              <td>{item.typeengin || '—'}</td>
              <td >{item.date_sortie || <span className='text-danger' >{'Non Sorti'}</span> }</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EnregistrementsList;
