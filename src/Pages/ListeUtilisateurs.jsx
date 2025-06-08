import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaDatabase,
  FaUserPlus,
  FaEye,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { useUsersList, useDeleteUser } from "../hooks/useUtilisateurs";
import "../Style/common.css";
import "../Style/Liste.css";

const ListeUtilisateurs = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useUsersList();
  const deleteUser = useDeleteUser();

  // Effet pour logger les données reçues
  useEffect(() => {
    console.log("État du chargement:", isLoading);
    console.log("Données reçues:", data);
    console.log("Erreur éventuelle:", error);
  }, [data, isLoading, error]);

  // S'assurer que data est un tableau
  const utilisateurs = Array.isArray(data?.utilisateurs) ? data.utilisateurs : [];

  const handleDelete = async (id) => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      return;
    }

    try {
      await deleteUser.mutateAsync(id);
    } catch (err) {
      console.error("Erreur de suppression:", err);
    }
  };

  // Afficher le chargement
  if (isLoading) {
    return (
      <div className="dashboard-content">
        <div className="dashboard-card">
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Chargement...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Afficher l'erreur si elle existe
  if (error) {
    return (
      <div className="dashboard-content">
        <div className="dashboard-card">
          <div className="alert alert-danger" role="alert">
            Erreur de chargement: {error.message || "Une erreur est survenue"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="dashboard-card">
        <div className="results-container">
          <div className="results-header">
            <div className="d-flex align-items-center gap-3">
              <h3 className="results-title">Liste des Utilisateurs</h3>
              {utilisateurs.length > 0 && (
                <span className="results-count">
                  <FaDatabase />
                  <span>
                    {utilisateurs.length} utilisateur
                    {utilisateurs.length > 1 ? "s" : ""}
                  </span>
                </span>
              )}
            </div>
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              onClick={() => navigate("/dashboard/utilisateurs/nouveau")}
            >
              <FaUserPlus />
              Nouvel Utilisateur
            </button>
          </div>

          {deleteUser.error && (
            <div className="alert alert-danger mt-3" role="alert">
              {deleteUser.error.message || "Erreur lors de la suppression"}
            </div>
          )}

          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Date de création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {utilisateurs.length > 0 ? (
                  utilisateurs.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.phone}</td>
                      <td>
                        <span
                          className={`badge ${
                            user.role === "admin" ? "bg-primary" : "bg-info"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>
                        {new Date(user.created_at).toLocaleString()}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-outline-warning"
                            title="Modifier"
                            onClick={() => navigate(`/dashboard/utilisateurs/${user.id}`)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Supprimer"
                            onClick={() => handleDelete(user.id)}
                            disabled={deleteUser.isLoading}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeUtilisateurs; 