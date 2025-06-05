import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddUser } from "../hooks/useUtilisateurs";
import "../Style/common.css";

const FormUtilisateur = () => {
  const navigate = useNavigate();
  const addUser = useAddUser();
  const [formData, setFormData] = useState({
    nom: "",
    phone: "",
    password: "",
    role: "vigile", // Par défaut
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await addUser.mutateAsync(formData);
      navigate("/dashboard/utilisateurs");
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue");
    }
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-card">
        <div className="form-container">
          <h2 className="form-title">Ajouter un nouvel utilisateur</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="custom-form">
            <div className="form-group">
              <label htmlFor="nom">Nom complet</label>
              <input
                type="text"
                className="form-control"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                name="phone"
                placeholder="611603912"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Rôle</label>
              <select
                className="form-control"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="user">vigile</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="form-buttons">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/dashboard/utilisateurs")}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={addUser.isLoading}
              >
                {addUser.isLoading ? "Création en cours..." : "Créer l'utilisateur"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormUtilisateur; 