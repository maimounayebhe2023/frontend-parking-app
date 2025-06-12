import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaDatabase,
  FaFileDownload,
  FaFileExcel,
  FaFileCsv,
  FaEye,
  FaTrash,
  FaSearch,
} from "react-icons/fa";
import { useEnregistrementsList } from "../hooks/useEnregistrements";
import { useExportEnregistrements } from "../hooks/useExport";
import "../Style/common.css";
import "../Style/Liste.css";

const EnregistrementsList = () => {
  const navigate = useNavigate();
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportMenuRef] = useState(React.createRef());
  const [exportMessage, setExportMessage] = useState("");
  const [recherche, setRecherche] = useState("");

  const {
    data: enregistrements = [],
    isLoading,
    error,
    refetch,
  } = useEnregistrementsList();
  const { exportEnregistrements, isExporting, exportError } =
    useExportEnregistrements();

  // Filtrage des données en fonction de la recherche
  const donneesFiltrees = useMemo(() => {
    if (!recherche.trim()) return enregistrements;

    const termeRecherche = recherche.toLowerCase().trim();
    return enregistrements.filter((item) => {
      return (
        item.plaque_engin?.toLowerCase().includes(termeRecherche) ||
        item.code_pin?.toLowerCase().includes(termeRecherche) ||
        item.tel?.toLowerCase().includes(termeRecherche) ||
        item.typeengin?.toLowerCase().includes(termeRecherche) ||
        new Date(item.date_enregistrement)
          .toLocaleString()
          .toLowerCase()
          .includes(termeRecherche)
      );
    });
  }, [enregistrements, recherche]);

  // Gestion du clic en dehors du menu d'export
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        exportMenuRef.current &&
        !exportMenuRef.current.contains(event.target)
      ) {
        setShowExportMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExportClick = () => {
    if (donneesFiltrees.length === 0) {
      setExportMessage("Aucune donnée à exporter");
      setTimeout(() => setExportMessage(""), 3000);
      return;
    }
    setShowExportMenu(!showExportMenu);
  };

  const handleExport = async (format) => {
    try {
      if (format === "excel") {
        await exportEnregistrements(donneesFiltrees);
      } else if (format === "csv") {
        await exportEnregistrements(donneesFiltrees, "csv");
      }
      setShowExportMenu(false);
    } catch (error) {
      setExportMessage(error.message || "Erreur lors de l'exportation");
      setTimeout(() => setExportMessage(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer cet enregistrement ?")
    ) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/api/enregistrements/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      await refetch();
    } catch (err) {
      console.error("Erreur:", err);
      setExportMessage("Erreur lors de la suppression");
      setTimeout(() => setExportMessage(""), 3000);
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/dashboard/details/${id}`);
  };

  return (
    <div className="dashboard-content">
      {/* Carte de recherche */}
      <div className="dashboard-card mb-4">
        <div className="filter-container">
          <div className="filter-header">
            <div className="filter-title-container">
              <h2 className="filter-title">Recherche</h2>
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
                  (plaque, code PIN, n° téléphone)
                </span>
              </label>
              <input
                id="recherche"
                type="text"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Entrez votre recherche..."
                disabled={isLoading}
                className="form-control"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Carte principale */}
      <div className="dashboard-card">
        <div className="results-container">
          <div className="results-header">
            <div className="d-flex align-items-center gap-3">
              <h3 className="results-title">Liste des Enregistrements</h3>
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
            <div className="export-dropdown" ref={exportMenuRef}>
              <button
                className="export-btn"
                onClick={handleExportClick}
                disabled={isLoading || isExporting}
              >
                <FaFileDownload />
                {isExporting ? "Exportation..." : "Exporter"}
              </button>
              {showExportMenu && (
                <div className="export-menu">
                  <button onClick={() => handleExport("excel")}>
                    <FaFileExcel /> Excel
                  </button>
                  <button onClick={() => handleExport("csv")}>
                    <FaFileCsv /> CSV
                  </button>
                </div>
              )}
            </div>
          </div>

          {(exportMessage || error || exportError) && (
            <div
              className={`alert ${
                exportMessage || exportError ? "alert-warning" : "alert-danger"
              } mt-3`}
              role="alert"
            >
              {exportMessage ||
                exportError?.message ||
                error?.message ||
                "Une erreur est survenue"}
            </div>
          )}

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
                    <th>Plaque</th>
                    <th>Type d'engin</th>
                    <th>Date d'enregistrement</th>
                    <th>Date de sortie</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {donneesFiltrees.map((item, index) => (
                    <tr key={index}>
                      <td>{item.plaque_engin || "—"}</td>
                      <td>
                        <span
                          className={`badge ${
                            item.typeengin === "Voiture"
                              ? "bg-primary"
                              : "bg-info"
                          }`}
                        >
                          {item.typeengin || "—"}
                        </span>
                      </td>
                      <td>
                        {new Date(item.date_enregistrement).toLocaleString()}
                      </td>
                      <td>
                        {item.date_sortie ? (
                          new Date(item.date_sortie).toLocaleString()
                        ) : (
                          <span className="badge bg-warning">
                            En stationnement
                          </span>
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            item.date_sortie ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {item.date_sortie ? "récuperé" : "Non récuperé"}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="Voir détails"
                            disabled={isLoading}
                            onClick={() => handleViewDetails(item.id)}
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Supprimer"
                            onClick={() => handleDelete(item.id)}
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
                      <td colSpan="6" className="text-center py-4">
                        Aucun enregistrement trouvé
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnregistrementsList;
