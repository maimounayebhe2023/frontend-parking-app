import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaUser, FaSave, FaKey } from "react-icons/fa";
import { useUserDetails, useUpdateUser } from "../hooks/useUtilisateurs";
import "../Style/common.css";
import "../Style/FormAjou.css";

const ModifierUtilisateur = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: userData, isLoading: isLoadingUser } = useUserDetails(id);
  const updateUser = useUpdateUser();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    role: "vigile",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (userData?.utilisateur) {
      setFormData({
        name: userData.utilisateur.name || "",
        phone: userData.utilisateur.phone || "",
        role: userData.utilisateur.role || "vigile",
        password: "",
      });
    }
  }, [userData]);

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^[0-9]{8,15}$/;

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Numéro de téléphone invalide (8 à 15 chiffres)";
    }

    if (!formData.role) {
      newErrors.role = "Le rôle est requis";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSuccessMessage("");
    setErrorMessage("");

    try {
      const dataToSend = { ...formData };
      if (!dataToSend.password) {
        delete dataToSend.password;
      }
      await updateUser.mutateAsync({ id, ...dataToSend });
      setSuccessMessage("Utilisateur modifié avec succès");
      setTimeout(() => {
        navigate("/dashboard/utilisateurs");
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Erreur lors de la modification de l'utilisateur"
      );
    }
  };

  if (isLoadingUser) {
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

  return (
    <div className="dashboard-content">
      <div className="dashboard-card">
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Modifier l'utilisateur</h2>
            <FaUser className="form-title-icon" />
          </div>

          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-content">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">
                  <FaUser className="input-icon" />
                  Nom complet
                  <span className="required">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  placeholder="Entrez le nom complet"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={updateUser.isPending}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">
                  <FaUser className="input-icon" />
                  Téléphone
                  <span className="required">*</span>
                </label>
                <input
                  id="phone"
                  type="text"
                  name="phone"
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  placeholder="Ex: 611789655"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={updateUser.isPending}
                />
                {errors.phone && (
                  <div className="invalid-feedback">{errors.phone}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="role">
                  <FaUser className="input-icon" />
                  Rôle
                  <span className="required">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  className={`form-select ${errors.role ? "is-invalid" : ""}`}
                  value={formData.role}
                  onChange={handleChange}
                  disabled={updateUser.isPending}
                >
                  <option value="vigile">Vigile</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <div className="invalid-feedback">{errors.role}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <FaKey className="input-icon" />
                  Mot de passe
                  <span className="text-muted ms-2">(Optionnel)</span>
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  placeholder="Laissez vide pour ne pas modifier"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={updateUser.isPending}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => navigate("/dashboard/utilisateurs")}
                disabled={updateUser.isPending}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={updateUser.isPending}
              >
                {updateUser.isPending ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Modification en cours...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    Enregistrer les modifications
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModifierUtilisateur; 