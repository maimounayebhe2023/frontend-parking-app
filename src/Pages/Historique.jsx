import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaSearch,
  FaFileExcel,
  FaDatabase,
  FaFileDownload,
  FaFileCsv,
  FaEye,
} from "react-icons/fa";
import { useEnregistrementsList } from "../hooks/useEnregistrements";
import { useExportEnregistrements } from "../hooks/useExport";
import "../Style/Historique.css";
import { useNavigate } from "react-router-dom";

function EnregistrementsParDate() {
  const [dateDebutForm, setDateDebutForm] = useState("");
  const [dateFinForm, setDateFinForm] = useState("");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportMenuRef] = useState(React.createRef());
  const [exportMessage, setExportMessage] = useState("");
  const navigate = useNavigate();

  const {
    data: enregistrements = [],
    isLoading,
    error,
  } = useEnregistrementsList({
    ...(dateDebut && dateFin && dateFin >= dateDebut
      ? {
          date_debut: dateDebut,
          date_fin: dateFin,
        }
      : {}),
  });

  const { exportEnregistrements, isExporting, exportError } =
    useExportEnregistrements();

  // Supprimer le filtrage côté client car il est maintenant géré par l'API
  const enregistrementsFiltres = enregistrements;

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
    if (enregistrementsFiltres.length === 0) {
      setExportMessage("Aucune donnée à exporter");
      setTimeout(() => setExportMessage(""), 3000);
      return;
    }
    setShowExportMenu(!showExportMenu);
  };

  const handleExport = async (format) => {
    try {
      if (format === "excel") {
        await exportEnregistrements(enregistrementsFiltres);
      } else if (format === "csv") {
        // Utiliser le même hook mais avec un format différent
        await exportEnregistrements(enregistrementsFiltres, "csv");
      }
      setShowExportMenu(false);
    } catch (error) {
      setExportMessage(error.message || "Erreur lors de l'exportation");
      setTimeout(() => setExportMessage(""), 3000);
    }
  };

  const getMessage = () => {
    if (error) return "Erreur lors du chargement des données";
    if (exportError) return exportError.message;
    if (!dateDebut || !dateFin)
      return "Veuillez sélectionner une date de début et une date de fin.";
    if (dateFin < dateDebut)
      return "La date de fin doit être postérieure ou égale à la date de début.";
    if (
      enregistrementsFiltres.length === 0 &&
      dateDebut &&
      dateFin &&
      dateFin >= dateDebut
    )
      return "Aucun enregistrement trouvé pour cette période.";
    return "";
  };

  return (
    <div className="dashboard-content">
      {/* Carte de filtres */}
      <div className="dashboard-card">
        <div className="filter-container">
          <div className="filter-header">
            <div className="filter-title-container">
              <h2 className="filter-title">Historique des enregistrements</h2>
              <div className="d-flex align-items-center gap-3">
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
                <FaCalendarAlt className="filter-title-icon" />
              </div>
            </div>
          </div>

          <form
            className="filter-form"
            onSubmit={(e) => {
              e.preventDefault();
              setDateDebut(dateDebutForm);
              setDateFin(dateFinForm);
            }}
          >
            <div className="filter-group">
              <label htmlFor="dateDebut">
                Date de début
                <span className="text-muted"> (requis)</span>
              </label>
              <input
                id="dateDebut"
                type="date"
                value={dateDebutForm}
                onChange={(e) => setDateDebutForm(e.target.value)}
                disabled={isLoading}
                required
                max={dateFinForm || undefined}
              />
            </div>

            <div className="filter-group">
              <label htmlFor="dateFin">
                Date de fin
                <span className="text-muted"> (requis)</span>
              </label>
              <input
                id="dateFin"
                type="date"
                value={dateFinForm}
                onChange={(e) => setDateFinForm(e.target.value)}
                disabled={isLoading}
                required
                min={dateDebutForm || undefined}
              />
            </div>

            <div className="filter-actions">
              <button
                type="submit"
                className="search-btn"
                disabled={isLoading || !dateDebutForm || !dateFinForm}
              >
                <FaSearch />
                {isLoading ? "Chargement..." : "Rechercher"}
              </button>
            </div>
          </form>

          {(getMessage() || exportMessage) && (
            <div
              className={`alert ${
                exportMessage ? "alert-warning" : "alert-info"
              } mt-3`}
              role="alert"
            >
              {exportMessage || getMessage()}
            </div>
          )}
        </div>
      </div>

      {/* Carte des résultats */}
      <div className="dashboard-card">
        <div className="results-container">
          <div className="results-header">
            <h3 className="results-title">Résultats de la recherche</h3>
            {enregistrementsFiltres.length > 0 && (
              <span className="results-count">
                <FaDatabase />
                <span>
                  {enregistrementsFiltres.length} enregistrement
                  {enregistrementsFiltres.length > 1 ? "s" : ""}
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
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Type d'engin</th>
                    <th>N° Plaque</th>
                    <th>Date d'enregistrement</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {enregistrementsFiltres.length > 0 ? (
                    enregistrementsFiltres.map((item) => (
                      <tr key={item.id}>
                        <td>{item.nom_conducteur}</td>
                        <td>{item.prenom_conducteur}</td>
                        <td>
                          <span
                            className={`badge ${
                              item.typeengin === "Voiture"
                                ? "bg-primary"
                                : "bg-info"
                            }`}
                          >
                            {item.typeengin || "-"}
                          </span>
                        </td>
                        <td>{item.plaque_engin || "-"}</td>
                        <td>
                          {new Date(item.date_enregistrement).toLocaleString()}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              title="Voir détails"
                              onClick={() => navigate(`/dashboard/details/${item.id}`)}
                            >
                              <FaEye />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center text-secondary py-4"
                      >
                        Aucun enregistrement à afficher
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
}

export default EnregistrementsParDate;
