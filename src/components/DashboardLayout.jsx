import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  FaParking,
  FaSignInAlt,
  FaSignOutAlt,
  FaList,
  FaHistory,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    {
      path: "/form",
      icon: <FaSignInAlt />,
      label: "Nouvelle Entrée",
      tooltip: "Enregistrer une nouvelle entrée",
    },
    {
      path: "/ValideSortie",
      icon: <FaSignOutAlt />,
      label: "Validation Sortie",
      tooltip: "Valider une sortie de véhicule",
    },
    {
      path: "/Liste",
      icon: <FaList />,
      label: "Liste Actuelle",
      tooltip: "Voir les véhicules en stationnement",
    },
    {
      path: "/His",
      icon: <FaHistory />,
      label: "Historique",
      tooltip: "Consulter l'historique des entrées/sorties",
    },
    {
      path: "/Recherche",
      icon: <FaSearch />,
      label: "Recherche",
      tooltip: "Rechercher un véhicule",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <FaParking className="logo-icon" />
          <h2>Gestion du Parking</h2>
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            data-tooltip={sidebarOpen ? "Réduire le menu" : "Agrandir le menu"}
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

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
      </aside>

      {/* Main Content */}
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

        <div className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
