import React, { useState, useEffect } from "react";
import {
  FaDatabase,
  FaFileDownload,
  FaFileExcel,
  FaFileCsv,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../Style/common.css";
import "../Style/Liste.css";

const EnregistrementsList = () => {
  const [enregistrements, setEnregistrements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportMenuRef] = useState(React.createRef());
  const [exportMessage, setExportMessage] = useState("");

  useEffect(() => {
    fetchEnregistrements();
  }, []);

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
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/index");
      if (!response.ok) {
        throw new Error("Erreur lors du chargement des données");
      }
      const data = await response.json();
      setEnregistrements(data);
      setErreur(null);
    } catch (err) {
      setErreur("Erreur lors du chargement des enregistrements");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
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
    saveAs(blob, "liste_enregistrements.xlsx");
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
    saveAs(blob, "liste_enregistrements.csv");
    setShowExportMenu(false);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer cet enregistrement ?")
    ) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/enregistrements/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      await fetchEnregistrements();
    } catch (err) {
      setErreur("Erreur lors de la suppression");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-content">
      {/* Carte principale */}
      <div className="dashboard-card">
        <div className="results-container">
          <div className="results-header">
            <div className="d-flex align-items-center gap-3">
              <h3 className="results-title">Liste des Enregistrements</h3>
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
          </div>

          {exportMessage && (
            <div className="alert alert-warning mt-3" role="alert">
              {exportMessage}
            </div>
          )}

          {erreur && (
            <div className="alert alert-danger mt-3" role="alert">
              {erreur}
            </div>
          )}

          {loading ? (
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
                  {enregistrements.map((item, index) => (
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
                          {item.date_sortie ? "Sorti" : "Non sorti"}
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
                            onClick={() => handleDelete(item.id)}
                            disabled={loading}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && enregistrements.length === 0 && (
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
