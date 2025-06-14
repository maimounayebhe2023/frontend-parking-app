import React, { useState } from "react";
import { FaUser, FaPhone, FaCar, FaIdCard, FaSave } from "react-icons/fa";
import { useAddEnregistrement } from "../hooks/useEnregistrements";
import "../Style/common.css";
import "../Style/FormAjou.css";
import { useNavigate } from "react-router-dom";

const AjoutForm = () => {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    tel: "",
    categorie_nom: "personnel",
    plaque_immatricu: "",
    type_engin: "Voiture",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const addEnregistrement = useAddEnregistrement();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^[0-9]{8,15}$/;
    const plaqueRegex = /^[A-Z0-9-]{5,10}$/;

    if (!formData.nom.trim()) {
      newErrors.nom = "Le nom est requis";
    }

    if (!formData.prenom.trim()) {
      newErrors.prenom = "Le prénom est requis";
    }

    if (!formData.tel.trim()) {
      newErrors.tel = "Le numéro de téléphone est requis";
    } else if (!phoneRegex.test(formData.tel)) {
      newErrors.tel = "Numéro de téléphone invalide (8 à 15 chiffres)";
    }

    if (!formData.plaque_immatricu.trim()) {
      newErrors.plaque_immatricu = "La plaque d'immatriculation est requise";
    } else if (!plaqueRegex.test(formData.plaque_immatricu)) {
      newErrors.plaque_immatricu = "Format de plaque invalide (ex: AB-123-CD)";
    }

    if (!formData.type_engin) {
      newErrors.type_engin = "Le type d'engin est requis";
    }

    if (!formData.categorie_nom) {
      newErrors.categorie_nom = "La catégorie est requise";
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
      const response = await addEnregistrement.mutateAsync(formData);
      setSuccessMessage("Enregistrement ajouté avec succès");
      setTimeout(() => {
        navigate(`/dashboard/details/${response.enregistrement.id}`);
      }, 1000);
    } catch (error) {
      setErrorMessage(
        error.message || "Erreur lors de l'ajout de l'enregistrement"
      );
    }
  };

  return (
    <div className="dashboard-content">
      <div className="dashboard-card">
        <div className="form-container">
          <div className="form-header">
            <h2 className="form-title">Nouvel Enregistrement</h2>
            <FaSave className="form-title-icon" />
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
                <label htmlFor="nom">
                  <FaUser className="input-icon" />
                  Nom
                  <span className="required">*</span>
                </label>
                <input
                  id="nom"
                  type="text"
                  name="nom"
                  className={`form-control ${errors.nom ? "is-invalid" : ""}`}
                  placeholder="Entrez le nom"
                  value={formData.nom}
                  onChange={handleChange}
                  disabled={addEnregistrement.isPending}
                />
                {errors.nom && (
                  <div className="invalid-feedback">{errors.nom}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="prenom">
                  <FaUser className="input-icon" />
                  Prénom
                  <span className="required">*</span>
                </label>
                <input
                  id="prenom"
                  type="text"
                  name="prenom"
                  className={`form-control ${
                    errors.prenom ? "is-invalid" : ""
                  }`}
                  placeholder="Entrez le prénom"
                  value={formData.prenom}
                  onChange={handleChange}
                  disabled={addEnregistrement.isPending}
                />
                {errors.prenom && (
                  <div className="invalid-feedback">{errors.prenom}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="tel">
                  <FaPhone className="input-icon" />
                  Téléphone
                  <span className="required">*</span>
                </label>
                <input
                  id="tel"
                  type="tel"
                  name="tel"
                  className={`form-control ${errors.tel ? "is-invalid" : ""}`}
                  placeholder="Ex: 611789655"
                  value={formData.tel}
                  onChange={handleChange}
                  disabled={addEnregistrement.isPending}
                />
                {errors.tel && (
                  <div className="invalid-feedback">{errors.tel}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="categorie_nom">
                  <FaUser className="input-icon" />
                  Catégorie
                  <span className="required">*</span>
                </label>
                <select
                  id="categorie_nom"
                  name="categorie_nom"
                  className={`form-select ${
                    errors.categorie_nom ? "is-invalid" : ""
                  }`}
                  value={formData.categorie_nom}
                  onChange={handleChange}
                  disabled={addEnregistrement.isPending}
                >
                  <option value="personnel">Personnel</option>
                  <option value="etudiant">Étudiant</option>
                  <option value="enseignant">Enseignant</option>
                  <option value="parent">Parent</option>
                  <option value="autres">Autres</option>
                </select>
                {errors.categorie_nom && (
                  <div className="invalid-feedback">{errors.categorie_nom}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="type_engin">
                  <FaCar className="input-icon" />
                  Type d'engin
                  <span className="required">*</span>
                </label>
                <select
                  id="type_engin"
                  name="type_engin"
                  className={`form-select ${
                    errors.type_engin ? "is-invalid" : ""
                  }`}
                  value={formData.type_engin}
                  onChange={handleChange}
                  disabled={addEnregistrement.isPending}
                >
                  <option value="Voiture">Voiture</option>
                  <option value="Moto">Moto</option>
                </select>
                {errors.type_engin && (
                  <div className="invalid-feedback">{errors.type_engin}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="plaque_immatricu">
                  <FaIdCard className="input-icon" />
                  Plaque d'immatriculation
                  <span className="required">*</span>
                </label>
                <input
                  id="plaque_immatricu"
                  type="text"
                  name="plaque_immatricu"
                  className={`form-control ${
                    errors.plaque_immatricu ? "is-invalid" : ""
                  }`}
                  placeholder="Ex: AB-123-CD"
                  value={formData.plaque_immatricu}
                  onChange={handleChange}
                  disabled={addEnregistrement.isPending}
                />
                {errors.plaque_immatricu && (
                  <div className="invalid-feedback">
                    {errors.plaque_immatricu}
                  </div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="submit-btn"
                disabled={addEnregistrement.isPending}
              >
                {addEnregistrement.isPending ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Ajout en cours...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" />
                    Enregistrer
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

export default AjoutForm;
