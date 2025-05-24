import React, { useState, useEffect } from "react";
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
import "../Style/Accueil.css";

const Accueil = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    exited: 0,
    occupation: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8000/api/stats");
      if (!response.ok)
        throw new Error("Erreur lors du chargement des statistiques");
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError("Impossible de charger les statistiques");
      console.error("Erreur:", err);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
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
        <p>{error}</p>
        <button onClick={fetchStats} className="retry-button">
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
