import { useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import axios from "axios";
import "../Style/ValideSortie.css";

const SortieForm = () => {
  const [errors, setErrors] = useState("");
  const [codePin, setCodePin] = useState("");
  const [message, setMessage] = useState("");
  const [succes, setSucces] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!codePin.trim()) {
      setErrors("Le code PIN est requis");
      return false;
    }
    setErrors("");
    return true;
  };

  const handleChange = (e) => {
    setCodePin(e.target.value);
    setMessage("");
    setErrors("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setMessage("");
    setSucces("");

    try {
      const response = await axios.patch(
        `http://localhost:8000/api/enregistrement/${codePin}`,
        codePin
      );
      setCodePin("");
      setSucces(response.data.message);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      }
      setMessage(error.response?.data?.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sortie-dashboard-content">
      <div className="sortie-dashboard-card">
        <div className="sortie-form-container">
          <div className="sortie-form-header">
            <h2 className="sortie-form-title">Validation de Sortie</h2>
            <FaSignOutAlt className="sortie-form-title-icon" />
          </div>

          {succes && (
            <div className="sortie-alert sortie-alert-success">{succes}</div>
          )}
          {message && (
            <div className="sortie-alert sortie-alert-danger">{message}</div>
          )}

          <form onSubmit={handleSubmit} className="sortie-form-content">
            <div className="sortie-form-group">
              <input
                type="text"
                name="code_pin"
                className="sortie-form-control"
                value={codePin}
                onChange={handleChange}
                placeholder="Saisissez le code PIN"
                disabled={loading}
              />
              {errors && <p className="sortie-text-danger">{errors}</p>}
            </div>

            <div className="sortie-form-actions">
              <button
                type="submit"
                className="sortie-submit-button"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Validation en cours...
                  </>
                ) : (
                  <>
                    <FaSignOutAlt className="me-2" />
                    Valider la sortie
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

export default SortieForm;
