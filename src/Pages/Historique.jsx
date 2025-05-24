import React, { useState, useEffect, useRef } from "react";
import {
  FaCalendarAlt,
  FaSearch,
  FaFileExcel,
  FaDatabase,
  FaFileDownload,
  FaFileCsv,
  FaFilePdf,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../Style/Historique.css";

// Mock temporaire
const mockEnregistrements = [
  {
    id: 1,
    date_enregistrement: "2024-03-20 08:30:00",
    date_sortie: "2024-03-20 10:15:00",
    nom_conducteur: "Dupont",
    prenom_conducteur: "Jean",
    plaque_immatricu: "AB-123-CD",
    type_engin: "Voiture",
  },
  {
    id: 2,
    date_enregistrement: "2024-03-20 09:45:00",
    date_sortie: null,
    nom_conducteur: "Martin",
    prenom_conducteur: "Sophie",
    plaque_immatricu: "EF-456-GH",
    type_engin: "Moto",
  },
  // Ajoutez plus d'enregistrements mock si nécessaire
];

function EnregistrementsParDate() {
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [enregistrements, setEnregistrements] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportMenuRef] = useState(React.createRef());
  const [exportMessage, setExportMessage] = useState("");

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

  const fetchEnregistrements = async () => {
    if (!dateDebut || !dateFin) {
      setMessage("Veuillez sélectionner une date de début et une date de fin.");
      setEnregistrements([]);
      return;
    }
    if (dateFin < dateDebut) {
      setMessage(
        "La date de fin doit être postérieure ou égale à la date de début."
      );
      setEnregistrements([]);
      return;
    }

    setLoading(true);
    setMessage("");

    // Simulation d'appel API avec le mock
    setTimeout(() => {
      const filteredData = mockEnregistrements.filter((item) => {
        const date = new Date(item.date_enregistrement);
        return (
          date >= new Date(dateDebut) && date <= new Date(dateFin + "T23:59:59")
        );
      });

      if (filteredData.length === 0) {
        setMessage("Aucun enregistrement trouvé pour cette période.");
        setEnregistrements([]);
      } else {
        setEnregistrements(filteredData);
        setMessage("");
      }
      setLoading(false);
    }, 1000);
  };

  const handleExportClick = () => {
    if (enregistrements.length === 0) {
      setExportMessage("Aucune donnée à exporter");
      setTimeout(() => setExportMessage(""), 3000);
      return;
    }
    setShowExportMenu(!showExportMenu);
  };

  const exportToExcel = () => {
    if (enregistrements.length === 0) {
      setExportMessage("Aucune donnée à exporter");
      setTimeout(() => setExportMessage(""), 3000);
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(enregistrements);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Enregistrements");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "historique_enregistrements.xlsx");
    setShowExportMenu(false);
  };

  const exportToCSV = () => {
    if (enregistrements.length === 0) {
      setExportMessage("Aucune donnée à exporter");
      setTimeout(() => setExportMessage(""), 3000);
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(enregistrements);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "historique_enregistrements.csv");
    setShowExportMenu(false);
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
                    disabled={loading}
                  >
                    <FaFileDownload />
                    Exporter
                  </button>
                  {showExportMenu && (
                    <div className="export-menu">
                      <button onClick={exportToExcel}>
                        <FaFileExcel /> Excel
                      </button>
                      <button onClick={exportToCSV}>
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
              fetchEnregistrements();
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
                value={dateDebut}
                onChange={(e) => setDateDebut(e.target.value)}
                disabled={loading}
                required
                max={dateFin || undefined}
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
                value={dateFin}
                onChange={(e) => setDateFin(e.target.value)}
                disabled={loading}
                required
                min={dateDebut || undefined}
              />
            </div>

            <div className="filter-actions">
              <button
                type="submit"
                className="search-btn"
                disabled={loading || !dateDebut || !dateFin}
              >
                <FaSearch />
                {loading ? "Recherche..." : "Rechercher"}
              </button>
            </div>
          </form>

          {message && (
            <div className="alert alert-info mt-3" role="alert">
              {message}
            </div>
          )}

          {exportMessage && (
            <div className="alert alert-warning mt-3" role="alert">
              {exportMessage}
            </div>
          )}
        </div>
      </div>

      {/* Carte des résultats */}
      <div className="dashboard-card">
        <div className="results-container">
          <div className="results-header">
            <h3 className="results-title">Résultats de la recherche</h3>
            {enregistrements.length > 0 && (
              <span className="results-count">
                <FaDatabase />
                <span>
                  {enregistrements.length} enregistrement
                  {enregistrements.length > 1 ? "s" : ""}
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
                    <th>Date Enregistrement</th>
                    <th>Date Sortie</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>N° Plaque</th>
                    <th>Type Engin</th>
                  </tr>
                </thead>
                <tbody>
                  {enregistrements.length > 0
                    ? enregistrements.map((item) => (
                        <tr key={item.id}>
                          <td>
                            {new Date(
                              item.date_enregistrement
                            ).toLocaleString()}
                          </td>
                          <td>
                            {item.date_sortie
                              ? new Date(item.date_sortie).toLocaleString()
                              : "-"}
                          </td>
                          <td>{item.nom_conducteur}</td>
                          <td>{item.prenom_conducteur}</td>
                          <td>{item.plaque_immatricu || "-"}</td>
                          <td>
                            <span
                              className={`badge ${
                                item.type_engin === "Voiture"
                                  ? "bg-primary"
                                  : "bg-info"
                              }`}
                            >
                              {item.type_engin || "-"}
                            </span>
                          </td>
                        </tr>
                      ))
                    : !message && (
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
