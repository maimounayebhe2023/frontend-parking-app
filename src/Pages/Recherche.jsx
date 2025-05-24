import React, { useState, useEffect } from "react";
import { FaSearch, FaEye, FaTrash, FaDatabase } from "react-icons/fa";
import "../Style/common.css";
import "../Style/Recherche.css";

const CodePinSearch = () => {
  const [recherche, setRecherche] = useState("");
  const [donnees, setDonnees] = useState([]);
  const [erreur, setErreur] = useState("");
  const [pageActuelle, setPageActuelle] = useState(1);
  const [loading, setLoading] = useState(false);
  const elementsParPage = 5;

  useEffect(() => {
    fetchEnregistrements();
  }, []);

  const fetchEnregistrements = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/enregistrements");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des données");
      }
      const data = await response.json();
      setDonnees(data);
      setErreur("");
    } catch (error) {
      setErreur("Erreur lors du chargement des données.");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const rechercher = async () => {
    if (recherche.trim() === "") return;
    const valeur = recherche.trim();

    try {
      setLoading(true);
      const response = await fetch(
        `/api/enregistrements/recherche?q=${encodeURIComponent(valeur)}`
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la recherche");
      }
      const data = await response.json();
      setDonnees(data);
      setErreur(data.length === 0 ? "Aucun enregistrement trouvé." : "");
      setPageActuelle(1);
    } catch (error) {
      setErreur("Erreur lors de la recherche.");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer cet enregistrement ?")
    ) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/enregistrements/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      await fetchEnregistrements();
    } catch (error) {
      setErreur("Erreur lors de la suppression.");
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const indexDernier = pageActuelle * elementsParPage;
  const indexPremier = indexDernier - elementsParPage;
  const donneesPage = donnees.slice(indexPremier, indexDernier);
  const pagesTotal = Math.ceil(donnees.length / elementsParPage);

  return (
    <div className="dashboard-content">
      {/* Carte de recherche */}
      <div className="dashboard-card">
        <div className="filter-container">
          <div className="filter-header">
            <div className="filter-title-container">
              <h2 className="filter-title">Recherche avancée</h2>
              <FaSearch className="filter-title-icon" />
            </div>
          </div>

          <form
            className="filter-form"
            onSubmit={(e) => {
              e.preventDefault();
              rechercher();
            }}
          >
            <div className="filter-group">
              <label htmlFor="recherche">
                Rechercher
                <span className="text-muted">
                  {" "}
                  (nom, plaque, téléphone, code PIN ou date)
                </span>
              </label>
              <input
                id="recherche"
                type="text"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Entrez votre recherche..."
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="search-btn"
              disabled={loading || !recherche.trim()}
            >
              <FaSearch />
              {loading ? "Recherche..." : "Rechercher"}
            </button>
          </form>

          {erreur && (
            <div className="alert alert-info mt-3" role="alert">
              {erreur}
            </div>
          )}
        </div>
      </div>

      {/* Carte des résultats */}
      <div className="dashboard-card">
        <div className="results-container">
          <div className="results-header">
            <h3 className="results-title">Résultats de la recherche</h3>
            {donnees.length > 0 && (
              <span className="results-count">
                <FaDatabase />
                <span>
                  {donnees.length} enregistrement{donnees.length > 1 ? "s" : ""}
                </span>
              </span>
            )}
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          )}

          {!loading && (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Plaque</th>
                    <th>Type</th>
                    <th>Date Entrée</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donneesPage.map((donnee) => (
                    <tr key={donnee.id}>
                      <td>{donnee.id}</td>
                      <td>{`${donnee.nom} ${donnee.prenom}`}</td>
                      <td>{donnee.plaque_immatricu}</td>
                      <td>
                        <span
                          className={`badge ${
                            donnee.type_engin === "Voiture"
                              ? "bg-primary"
                              : "bg-info"
                          }`}
                        >
                          {donnee.type_engin}
                        </span>
                      </td>
                      <td>{new Date(donnee.date_entree).toLocaleString()}</td>
                      <td>
                        <span
                          className={`badge ${
                            donnee.statut === "entree"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                        >
                          {donnee.statut === "entree"
                            ? "En stationnement"
                            : "Sorti"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="Voir détails"
                            disabled={loading}
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Supprimer"
                            onClick={() => handleDelete(donnee.id)}
                            disabled={loading}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && donnees.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        Aucun enregistrement trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && pagesTotal > 1 && (
            <div className="pagination-container">
              <button
                className="btn btn-outline-primary"
                onClick={() => setPageActuelle((p) => Math.max(1, p - 1))}
                disabled={pageActuelle === 1 || loading}
              >
                Précédent
              </button>
              <span className="pagination-info">
                Page {pageActuelle} sur {pagesTotal}
              </span>
              <button
                className="btn btn-outline-primary"
                onClick={() =>
                  setPageActuelle((p) => Math.min(pagesTotal, p + 1))
                }
                disabled={pageActuelle === pagesTotal || loading}
              >
                Suivant
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodePinSearch;
