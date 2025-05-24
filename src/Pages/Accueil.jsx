import React from "react";
import { Link } from "react-router-dom";
import {
  FaCar,
  FaMotorcycle,
  FaParking,
  FaSignInAlt,
  FaSignOutAlt,
  FaList,
  FaHistory,
  FaSearch,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import { useStats } from "../hooks/useStats";
import "../Style/Accueil.css";

const Accueil = () => {
  const { data: stats, isLoading, error, refetch } = useStats();

  const quickActions = [
    {
      title: "Nouvelle Entrée",
      description: "Enregistrer un nouveau véhicule",
      icon: <FaSignInAlt />,
      path: "/nouvelle-entree",
      color: "#3498db",
    },
    {
      title: "Validation Sortie",
      description: "Valider la sortie d'un véhicule",
      icon: <FaSignOutAlt />,
      path: "/validation-sortie",
      color: "#2ecc71",
    },
    {
      title: "Liste Actuelle",
      description: "Voir les véhicules en stationnement",
      icon: <FaList />,
      path: "/liste-actuelle",
      color: "#e74c3c",
    },
    {
      title: "Historique",
      description: "Consulter l'historique complet",
      icon: <FaHistory />,
      path: "/historique",
      color: "#9b59b6",
    },
    {
      title: "Recherche",
      description: "Rechercher un véhicule",
      icon: <FaSearch />,
      path: "/recherche",
      color: "#f1c40f",
    },
  ];

  if (isLoading) {
    return (
      <div className="loading-spinner">
        <FaSpinner className="spinner" />
        <p>Chargement des statistiques...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <FaExclamationTriangle />
        <p>{error.message}</p>
        <button onClick={() => refetch()} className="retry-button">
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <section className="welcome-section">
        <h1>Bienvenue au Parking UNC</h1>
        <p>Gérez efficacement votre stationnement</p>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaParking />
          </div>
          <div className="stat-info">
            <h3>Total Véhicules</h3>
            <p className="stat-value">{stats.total}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon active">
            <FaCar />
          </div>
          <div className="stat-info">
            <h3>Véhicules Actifs</h3>
            <p className="stat-value">{stats.active}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon exited">
            <FaMotorcycle />
          </div>
          <div className="stat-info">
            <h3>Véhicules Sortis</h3>
            <p className="stat-value">{stats.exited}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon occupation">
            <FaParking />
          </div>
          <div className="stat-info">
            <h3>Taux d'Occupation</h3>
            <p className="stat-value">{stats.occupation}%</p>
          </div>
        </div>
      </section>

      <section className="quick-actions-section">
        <h2>Actions Rapides</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action) => (
            <Link
              key={action.path}
              to={action.path}
              className="quick-action-card"
              style={{ "--action-color": action.color }}
            >
              <div
                className="action-icon"
                style={{ backgroundColor: action.color }}
              >
                {action.icon}
              </div>
              <div className="action-info">
                <h3>{action.title}</h3>
                <p>{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Accueil;
