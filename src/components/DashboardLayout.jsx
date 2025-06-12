import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
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

const DashboardLayout = ({ children }) => {
  const { logout, user } = useAuth();
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
      label: "Enregistrement",
      tooltip: "Effectuer un nouveau enregistrement",
    },
    {
      path: "/dashboard/validation-sortie",
      icon: <FaSignOutAlt />,
      label: "Recuperation",
      tooltip: "Autoriser une recuperation",
    },
    {
      path: "/dashboard/liste-actuelle",
      icon: <FaList />,
      label: "Liste",
      tooltip: "Voir les engins en stationnement",
    },
    {
      path: "/dashboard/historique",
      icon: <FaHistory />,
      label: "Historique",
      tooltip: "Consulter l'historique des stationnements",
    },
    ...(user?.role === "admin"
      ? [
          {
            path: "/dashboard/utilisateurs",
            icon: <FaUsers />,
            label: "Utilisateurs",
            tooltip: "Gérer les utilisateurs",
          },
        ]
      : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <img
            src="/parking-icon.svg"
            alt="Parking UNC"
            className="logo-icon"
          />
          <h2>Parking UNC</h2>
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
            onClick={logout}
            data-tooltip="Se déconnecter"
          >
            <FaSignOutAlt />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <button
                className="header-menu-btn"
                onClick={() => setSidebarOpen(true)}
                style={{ display: sidebarOpen ? "none" : "flex" }}
              >
                <FaBars />
              </button>
              <h1>
                {menuItems.find((item) => item.path === location.pathname)
                  ?.label || "Dashboard"}
              </h1>
            </div>
            <div className="header-actions">
              <span className="current-time">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </header>
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default DashboardLayout;
