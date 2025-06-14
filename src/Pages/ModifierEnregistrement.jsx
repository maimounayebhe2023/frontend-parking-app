import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCar, FaSave, FaUser, FaIdCard } from "react-icons/fa";
import { useEnregistrementDetails, useModifierEnregistrement } from "../hooks/useEnregistrements";
import "../Style/common.css";
import "../Style/FormAjou.css";

const ModifierEnregistrement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: enregistrementData, isLoading: isLoadingEnregistrement } = useEnregistrementDetails(id);
  const modifierEnregistrement = useModifierEnregistrement();

  const [formData, setFormData] = useState({
    nom_conducteur: "",
    prenom_conducteur: "",
    tel: "",
    plaque_engin: "",
    type_engin: "voiture",
    categorie_id: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (enregistrementData?.enregistrement) {
      const enregistrement = enregistrementData.enregistrement;
      setFormData({
        nom_conducteur: enregistrement.conducteur?.nom || "",
        prenom_conducteur: enregistrement.conducteur?.prenom || "",
        tel: enregistrement.conducteur?.tel || "",
        plaque_engin: enregistrement.engin?.plaque_immatricu || "",
        type_engin: enregistrement.engin?.type_engin?.toLowerCase() || "voiture",
        categorie_id: enregistrement.conducteur?.categorie?.id || "",
      });
    }
  }, [enregistrementData]);

  const validate = () => {
    const newErrors = {};
    const phoneRegex = /^[0-9]{8,15}$/;

    if (!formData.nom_conducteur.trim()) {
      newErrors.nom_conducteur = "Le nom est requis";
    }

    if (!formData.prenom_conducteur.trim()) {
      newErrors.prenom_conducteur = "Le prénom est requis";
    }

    if (!formData.tel.trim()) {
      newErrors.tel = "Le numéro de téléphone est requis";
    } else if (!phoneRegex.test(formData.tel)) {
      newErrors.tel = "Numéro de téléphone invalide (8 à 15 chiffres)";
    }

    if (!formData.plaque_engin.trim()) {
      newErrors.plaque_engin = "La plaque d'immatriculation est requise";
    }

    if (!formData.type_engin) {
      newErrors.type_engin = "Le type d'engin est requis";
    }

    if (!formData.categorie_id) {
      newErrors.categorie_id = "La catégorie est requise";
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
      const dataToSend = {
        nom: formData.nom_conducteur,
        prenom: formData.prenom_conducteur,
        tel: formData.tel,
        plaque_immatricu: formData.plaque_engin,
        type_engin: formData.type_engin,
        categorie_nom: formData.categorie_id === "1" ? "Etudiant" : 
                      formData.categorie_id === "2" ? "Personnel" : 
                      formData.categorie_id === "3" ? "Proffesseur" : "Autres"
      };

      const response = await modifierEnregistrement.mutateAsync({ 
        id, 
        data: dataToSend 
      });

      if (response.message === "Mise à jour effectuée avec succès") {
        setSuccessMessage("Enregistrement modifié avec succès");
        setTimeout(() => {
          navigate(`/dashboard/details/${id}`);
        }, 1000);
      } else {
        setErrorMessage("Erreur inattendue lors de la modification");
      }
    } catch (error) {
      console.error("Erreur complète:", error);
      setErrorMessage(
        error.response?.data?.message || "Erreur lors de la modification de l'enregistrement"
      );
    }
  };

  useEffect(() => {
    console.log("formData mis à jour:", formData);
  }, [formData]);

  if (isLoadingEnregistrement) {
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
            <h2 className="form-title">Modifier l'enregistrement</h2>
            <FaCar className="form-title-icon" />
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
                <label htmlFor="nom_conducteur">
                  <FaUser className="input-icon" />
                  Nom du conducteur
                  <span className="required">*</span>
                </label>
                <input
                  id="nom_conducteur"
                  type="text"
                  name="nom_conducteur"
                  className={`form-control ${errors.nom_conducteur ? "is-invalid" : ""}`}
                  placeholder="Entrez le nom de la personne"
                  value={formData.nom_conducteur}
                  onChange={handleChange}
                  disabled={modifierEnregistrement.isPending}
                />
                {errors.nom_conducteur && (
                  <div className="invalid-feedback">{errors.nom_conducteur}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="prenom_conducteur">
                  <FaUser className="input-icon" />
                  Prénom du conducteur
                  <span className="required">*</span>
                </label>
                <input
                  id="prenom_conducteur"
                  type="text"
                  name="prenom_conducteur"
                  className={`form-control ${errors.prenom_conducteur ? "is-invalid" : ""}`}
                  placeholder="Entrez le prénom de la personne"
                  value={formData.prenom_conducteur}
                  onChange={handleChange}
                  disabled={modifierEnregistrement.isPending}
                />
                {errors.prenom_conducteur && (
                  <div className="invalid-feedback">{errors.prenom_conducteur}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="tel">
                  <FaUser className="input-icon" />
                  Téléphone
                  <span className="required">*</span>
                </label>
                <input
                  id="tel"
                  type="text"
                  name="tel"
                  className={`form-control ${errors.tel ? "is-invalid" : ""}`}
                  placeholder="Ex: 611789655"
                  value={formData.tel}
                  onChange={handleChange}
                  disabled={modifierEnregistrement.isPending}
                />
                {errors.tel && (
                  <div className="invalid-feedback">{errors.tel}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="plaque_engin">
                  <FaIdCard className="input-icon" />
                  Plaque d'immatriculation
                  <span className="required">*</span>
                </label>
                <input
                  id="plaque_engin"
                  type="text"
                  name="plaque_engin"
                  className={`form-control ${errors.plaque_engin ? "is-invalid" : ""}`}
                  placeholder="Entrez la plaque d'immatriculation"
                  value={formData.plaque_engin}
                  onChange={handleChange}
                  disabled={modifierEnregistrement.isPending}
                />
                {errors.plaque_engin && (
                  <div className="invalid-feedback">{errors.plaque_engin}</div>
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
                  className={`form-select ${errors.type_engin ? "is-invalid" : ""}`}
                  value={formData.type_engin}
                  onChange={handleChange}
                  disabled={modifierEnregistrement.isPending}
                >
                  <option value="voiture">Voiture</option>
                  <option value="moto">Moto</option>
                  <option value="moto">Autres</option>
                </select>
                {errors.type_engin && (
                  <div className="invalid-feedback">{errors.type_engin}</div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="categorie_id">
                  <FaUser className="input-icon" />
                  Catégorie
                  <span className="required">*</span>
                </label>
                <select
                  id="categorie_id"
                  name="categorie_id"
                  className={`form-select ${errors.categorie_id ? "is-invalid" : ""}`}
                  value={formData.categorie_id}
                  onChange={handleChange}
                  disabled={modifierEnregistrement.isPending}
                >
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="1">Etudiant</option>
                  <option value="2">Enseignant</option>
                  <option value="3">Professeur</option>
                  <option value="4">Autres</option>
                </select>
                {errors.categorie_id && (
                  <div className="invalid-feedback">{errors.categorie_id}</div>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => navigate(`/dashboard/details/${id}`)}
                disabled={modifierEnregistrement.isPending}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={modifierEnregistrement.isPending}
              >
                {modifierEnregistrement.isPending ? (
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

export default ModifierEnregistrement; 