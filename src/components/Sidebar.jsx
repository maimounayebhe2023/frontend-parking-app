import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaList,
  FaHistory,
  FaSearch,
  FaBars,
  FaTimes,
  FaHome,
  FaUsers,
} from "react-icons/fa";

const Sidebar = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  // Effet pour gérer la fermeture automatique du sidebar sur les petits écrans
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    {
      path: "/dashboard",
      icon: <FaHome />,
      label: "Accueil",
      tooltip: "Retour à la page d'accueil",
    },
    {
      path: "/dashboard/nouvelle-entree",
      icon: <FaSignInAlt />,
      label: "Nouvel Enregitrement",
      tooltip: "Effectuer un nouveau enregistrement",
    },
    {
      path: "/dashboard/validation-sortie",
      icon: <FaSignOutAlt />,
      label: "Une recupération",
      tooltip: "Autoriser une recupération ",
    },
    {
      path: "/dashboard/liste-actuelle",
      icon: <FaList />,
      label: "Liste Actuelle",
      tooltip: "Voir les engins en stationnement",
    },
    {
      path: "/dashboard/historique",
      icon: <FaHistory />,
      label: "Historique",
      tooltip: "Consulter l'historique des entrées/sorties",
    },
    {
      path: "/dashboard/recherche",
      icon: <FaSearch />,
      label: "Recherche",
      tooltip: "Rechercher un véhicule",
    },
    {
      path: "/dashboard/utilisateurs",
      icon: <FaUsers />,
      label: "Utilisateurs",
      tooltip: "Gérer les utilisateurs",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        <img src="/parking-icon.svg" alt="Parking UNC" className="logo-icon" />
        <h2>UNCPARK</h2>
        <button
          className="toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          data-tooltip={sidebarOpen ? "Réduire le menu" : "Agrandir le menu"}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className="sidebar-content">
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? "active" : ""}`}
              data-tooltip={item.tooltip}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <button
          className="nav-item logout-btn"
          onClick={onLogout}
          data-tooltip="Se déconnecter"
        >
          <FaSignOutAlt />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
