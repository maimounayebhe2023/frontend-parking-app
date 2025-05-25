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
  FaExclamationTriangle,
} from "react-icons/fa";
import { useEnregistrementsStats } from "../hooks/useEnregistrements";
import StatCardSkeleton from "../components/StatCardSkeleton";
import "../Style/Accueil.css";

const StatCard = ({ icon: Icon, title, value, className }) => (
  <div className="stat-card">
    <div className={`stat-icon ${className}`}>
      <Icon />
    </div>
    <div className="stat-info">
      <h3>{title}</h3>
      <p className="stat-value">{value ?? <StatCardSkeleton />}</p>
    </div>
  </div>
);

const Accueil = () => {
  const { data: stats, isLoading, error, refetch } = useEnregistrementsStats();

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

  return (
    <div className="dashboard-content">
      <section className="welcome-section">
        <h1>Bienvenue au Parking UNC</h1>
        <p>Gérez efficacement votre stationnement</p>
      </section>

      <section className="stats-grid">
        {isLoading ? (
          // Afficher 4 skeletons pendant le chargement
          Array(4)
            .fill(null)
            .map((_, index) => <StatCardSkeleton key={index} />)
        ) : error ? (
          // Afficher un message d'erreur non-bloquant
          <div className="error-banner">
            <FaExclamationTriangle />
            <p>{error.message}</p>
            <button onClick={() => refetch()} className="retry-button">
              Réessayer
            </button>
          </div>
        ) : (
          // Afficher les statistiques
          <>
            <StatCard
              icon={FaParking}
              title="Total Véhicules"
              value={stats?.total}
              className="total"
            />
            <StatCard
              icon={FaCar}
              title="Véhicules Actifs"
              value={stats?.active}
              className="active"
            />
            <StatCard
              icon={FaMotorcycle}
              title="Véhicules Sortis"
              value={stats?.exited}
              className="exited"
            />
            <StatCard
              icon={FaParking}
              title="Taux d'Occupation"
              value={stats?.occupation ? `${stats.occupation}%` : null}
              className="occupation"
            />
          </>
        )}
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
