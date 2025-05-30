import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaUser,
  FaPhone,
  FaCar,
  FaIdCard,
  FaCalendarAlt,
  FaClock,
  FaKey,
  FaUserShield,
} from "react-icons/fa";
import { useEnregistrementDetails } from "../hooks/useEnregistrements";
import "../Style/common.css";
import "../Style/Details.css";

const AfficherEnregistrement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: enregistrement,
    isLoading,
    error,
  } = useEnregistrementDetails(id);

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="dashboard-content">
        <div className="dashboard-card">
          <div className="details-container">
            <div className="details-header">
              <h2 className="details-title">Détails de l'enregistrement</h2>
            </div>
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-content">
        <div className="dashboard-card">
          <div className="details-container">
            <div className="details-header">
              <h2 className="details-title">Détails de l'enregistrement</h2>
            </div>
            <div className="alert alert-danger" role="alert">
              {error.message ||
                "Une erreur est survenue lors du chargement des détails"}
            </div>
            <button className="btn btn-primary mt-3" onClick={handleBack}>
              <FaArrowLeft /> Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!enregistrement) {
    return (
      <div className="dashboard-content">
        <div className="dashboard-card">
          <div className="details-container">
            <div className="details-header">
              <h2 className="details-title">Détails de l'enregistrement</h2>
            </div>
            <div className="alert alert-info" role="alert">
              Aucun enregistrement trouvé
            </div>
            <button className="btn btn-primary mt-3" onClick={handleBack}>
              <FaArrowLeft /> Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="dashboard-card">
        <div className="details-container">
          <div className="details-header">
            <button
              className="btn btn-outline-primary back-button"
              onClick={handleBack}
            >
              <FaArrowLeft /> Retour
            </button>
            <h2 className="details-title">Détails de l'enregistrement</h2>
          </div>

          <div className="details-content">
            <div className="detail-item">
              <div className="code-pin-container">
                <div className="code-pin-label">
                  <FaKey className="code-pin-icon" />
                  Code PIN
                </div>
                <div className="code-pin-value">{enregistrement.code_pin}</div>
              </div>
            </div>

            <div className="details-section">
              <h3 className="section-title">
                <FaUserShield className="section-icon" /> Informations de
                l'enregistrement
              </h3>
              <div className="details-grid">
                <div className="detail-item">
                  <label>
                    <FaCalendarAlt className="detail-icon" /> Date d'entrée
                  </label>
                  <span>
                    {new Date(enregistrement.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="detail-item">
                  <label>
                    <FaCalendarAlt className="detail-icon" /> Date de sortie
                  </label>
                  <span>
                    {enregistrement.date_sortie ? (
                      new Date(enregistrement.date_sortie).toLocaleString()
                    ) : (
                      <span className="badge bg-warning">En stationnement</span>
                    )}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Statut</label>
                  <span
                    className={`badge ${
                      enregistrement.date_sortie ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {enregistrement.date_sortie ? "Sorti" : "Non sorti"}
                  </span>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h3 className="section-title">
                <FaUser className="section-icon" /> Informations du conducteur
              </h3>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Nom</label>
                  <span>{enregistrement.conducteur?.nom || "—"}</span>
                </div>
                <div className="detail-item">
                  <label>Prénom</label>
                  <span>{enregistrement.conducteur?.prenom || "—"}</span>
                </div>
                <div className="detail-item">
                  <label>
                    <FaPhone className="detail-icon" /> Téléphone
                  </label>
                  <span>{enregistrement.conducteur?.tel || "—"}</span>
                </div>
                <div className="detail-item">
                  <label>Catégorie</label>
                  <span className="badge bg-info">
                    {enregistrement.conducteur?.categorie?.nom || "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h3 className="section-title">
                <FaCar className="section-icon" /> Informations du véhicule
              </h3>
              <div className="details-grid">
                <div className="detail-item">
                  <label>
                    <FaIdCard className="detail-icon" /> Plaque
                    d'immatriculation
                  </label>
                  <span>{enregistrement.engin?.plaque_immatricu || "—"}</span>
                </div>
                <div className="detail-item">
                  <label>Type d'engin</label>
                  <span
                    className={`badge ${
                      enregistrement.engin?.type_engin?.toLowerCase() ===
                      "voiture"
                        ? "bg-primary"
                        : enregistrement.engin?.type_engin?.toLowerCase() ===
                          "moto"
                        ? "bg-warning"
                        : "bg-info"
                    }`}
                  >
                    {enregistrement.engin?.type_engin || "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="details-section">
              <h3 className="section-title">
                <FaUserShield className="section-icon" /> Informations du vigile
              </h3>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Nom</label>
                  <span>{enregistrement.user?.name || "—"}</span>
                </div>
                <div className="detail-item">
                  <label>
                    <FaPhone className="detail-icon" /> Téléphone
                  </label>
                  <span>{enregistrement.user?.phone || "—"}</span>
                </div>
                <div className="detail-item">
                  <label>Rôle</label>
                  <span className="badge bg-secondary">
                    {enregistrement.user?.role || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AfficherEnregistrement;
