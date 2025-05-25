import axios from "axios";

// Configuration de base d'axios
const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur pour gérer les erreurs globalement
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Vous pouvez ajouter ici une logique globale de gestion des erreurs
    // Par exemple, rediriger vers la page de login si l'erreur est 401
    if (error.response?.status === 401) {
      // Gérer l'expiration de la session
      console.error("Session expirée");
    }
    return Promise.reject(error);
  }
);

// Service pour les enregistrements
export const enregistrementService = {
  // Ajouter un nouvel enregistrement
  ajouter: async (data) => {
    try {
      const response = await api.post("/enregistrement/ajouter", data);
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Une erreur est survenue lors de l'ajout",
        }
      );
    }
  },

  // Valider une sortie
  validerSortie: async (codePin) => {
    try {
      const response = await api.patch(`/enregistrement/${codePin}`, {
        codePin,
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Une erreur est survenue lors de la validation",
        }
      );
    }
  },

  // Obtenir la liste des enregistrements
  getListe: async () => {
    try {
      const response = await api.get("/enregistrement/liste");
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message:
            "Une erreur est survenue lors de la récupération des données",
        }
      );
    }
  },

  // Obtenir les statistiques
  getStatistiques: async () => {
    try {
      const response = await api.get("/enregistrement/statistiques");
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || {
          message:
            "Une erreur est survenue lors de la récupération des statistiques",
        }
      );
    }
  },
};

// Vous pouvez ajouter d'autres services ici selon les besoins
// Par exemple :
// export const authService = { ... }
// export const userService = { ... }

export default api;
