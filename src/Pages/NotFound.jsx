import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaExclamationTriangle } from "react-icons/fa";
import "../Style/NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <FaExclamationTriangle className="not-found-icon" />
        <h1>404</h1>
        <h2>Page non trouvée</h2>
        <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>

        <div className="not-found-actions">
          <Link to="/" className="action-button home-button">
            <FaHome className="button-icon" />
            Retour à l'accueil
          </Link>
          <Link to="/recherche" className="action-button search-button">
            <FaSearch className="button-icon" />
            Faire une recherche
          </Link>
        </div>

        <div className="suggestions">
          <h3>Suggestions :</h3>
          <ul>
            <li>Vérifiez l'URL pour d'éventuelles erreurs de frappe</li>
            <li>Retournez à la page d'accueil et naviguez depuis le menu</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
