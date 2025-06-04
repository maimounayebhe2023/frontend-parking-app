import React from "react";
import {
  FaDatabase,
  FaUserPlus,
  FaEye,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { useUsersList, useDeleteUser } from  "../hooks/useUtilisateurs";
import "../Style/common.css";
import "../Style/Liste.css";

const ListeUtilisateurs = () => {
  // Utilisation des hooks personnalisés
  const { data: utilisateurs = [], isLoading, error } = useUsersList();
  const deleteUser = useDeleteUser();

  const handleDelete = async (id) => {
    if (
      !window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      return;
    }

    try {
      await deleteUser.mutateAsync(id);
    } catch (err) {
      console.error("Erreur:", err);
    }
  };

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
              onClick={() => {/* TODO: Implémenter l'ajout d'utilisateur */}}
            >
              <FaUserPlus />
              Nouvel Utilisateur
            </button>
          </div>

          {(deleteUser.error || error) && (
            <div className="alert alert-danger mt-3" role="alert">
              {deleteUser.error?.message || error?.message || "Une erreur est survenue"}
            </div>
          )}

          {isLoading ? (
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
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Date de création</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {utilisateurs.map((user) => (
                    <tr key={user.id}>
                      <td>{user.nom}</td>
                      <td>{user.email}</td>
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
                        {new Date(user.date_creation).toLocaleString()}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            title="Voir détails"
                            disabled={isLoading || deleteUser.isLoading}
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning"
                            title="Modifier"
                            disabled={isLoading || deleteUser.isLoading}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            title="Supprimer"
                            onClick={() => handleDelete(user.id)}
                            disabled={isLoading || deleteUser.isLoading}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!isLoading && utilisateurs.length === 0 && (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        Aucun utilisateur trouvé
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

export default ListeUtilisateurs; 