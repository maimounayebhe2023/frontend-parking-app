import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaEye, FaTrash, FaDatabase } from "react-icons/fa";
import { useEnregistrementsList } from "../hooks/useEnregistrements";
import "../Style/common.css";
import "../Style/Recherche.css";

const CodePinSearch = () => {
  const [recherche, setRecherche] = useState("");
  const [pageActuelle, setPageActuelle] = useState(1);
  const elementsParPage = 5;

  const {
    data: enregistrements = [],
    isLoading,
    error,
    refetch,
  } = useEnregistrementsList();

  const navigate = useNavigate();

  // Filtrage des données en fonction de la recherche
  const donneesFiltrees = useMemo(() => {
    if (!recherche.trim()) return enregistrements;

    const termeRecherche = recherche.toLowerCase().trim();
    return enregistrements.filter((item) => {
      return (
        item.nom_conducteur?.toLowerCase().includes(termeRecherche) ||
        item.prenom_conducteur?.toLowerCase().includes(termeRecherche) ||
        item.plaque_engin?.toLowerCase().includes(termeRecherche) ||
        item.code_pin?.toLowerCase().includes(termeRecherche) ||
        new Date(item.date_enregistrement)
          .toLocaleString()
          .toLowerCase()
          .includes(termeRecherche)
      );
    });
  }, [enregistrements, recherche]);

  const handleDelete = async (id) => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer cet enregistrement ?")
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/enregistrements/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      await refetch();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/dashboard/details/${id}`);
  };

  // Calcul de la pagination
  const indexDernier = pageActuelle * elementsParPage;
  const indexPremier = indexDernier - elementsParPage;
  const donneesPage = donneesFiltrees.slice(indexPremier, indexDernier);
  const pagesTotal = Math.ceil(donneesFiltrees.length / elementsParPage);

  // Réinitialiser la page quand la recherche change
  useEffect(() => {
    setPageActuelle(1);
  }, [recherche]);

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
            }}
          >
            <div className="filter-group">
              <label htmlFor="recherche">
                Rechercher
                <span className="text-muted">
                  {" "}
                  (plaque, téléphone, code PIN)
                </span>
              </label>
              <input
                id="recherche"
                type="text"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Entrez votre recherche..."
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="search-btn"
              disabled={isLoading || !recherche.trim()}
            >
              <FaSearch />
              {isLoading ? "Chargement..." : "Rechercher"}
            </button>
          </form>

          {error && (
            <div className="alert alert-info mt-3" role="alert">
              {error.message ||
                "Une erreur est survenue lors du chargement des données"}
            </div>
          )}

          {!error && recherche.trim() && donneesFiltrees.length === 0 && (
            <div className="alert alert-info mt-3" role="alert">
              Aucun enregistrement trouvé pour cette recherche.
            </div>
          )}
        </div>
      </div>

      {/* Carte des résultats */}
      <div className="dashboard-card">
        <div className="results-container">
          <div className="results-header">
            <h3 className="results-title">Résultats de la recherche</h3>
            {donneesFiltrees.length > 0 && (
              <span className="results-count">
                <FaDatabase />
                <span>
                  {donneesFiltrees.length} enregistrement
                  {donneesFiltrees.length > 1 ? "s" : ""}
                </span>
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          ) : (
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
                      <td>{`${donnee.nom_conducteur} ${donnee.prenom_conducteur}`}</td>
                      <td>{donnee.plaque_engin}</td>
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
                      <td>
                        {new Date(donnee.date_enregistrement).toLocaleString()}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            !donnee.date_sortie ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {!donnee.date_sortie ? "En stationnement" : "Sorti"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="Voir détails"
                            disabled={isLoading}
                            onClick={() => handleViewDetails(donnee.id)}
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Supprimer"
                            onClick={() => handleDelete(donnee.id)}
                            disabled={isLoading}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!isLoading && donneesFiltrees.length === 0 && (
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
          {!isLoading && pagesTotal > 1 && (
            <div className="pagination-container">
              <button
                className="btn btn-outline-primary"
                onClick={() => setPageActuelle((p) => Math.max(1, p - 1))}
                disabled={pageActuelle === 1 || isLoading}
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
                disabled={pageActuelle === pagesTotal || isLoading}
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
