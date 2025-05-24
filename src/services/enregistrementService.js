import api from "./api";

// Service pour les enregistrements
const enregistrementService = {
  // Ajouter un nouvel enregistrement
  ajouter: async (data) => {
    const response = await api.post("/enregistrement/ajouter", data);
    return response.data;
  },

  // Valider une sortie
  validerSortie: async (codePin) => {
    const response = await api.patch(`/enregistrement/${codePin}`, { codePin });
    return response.data;
  },

  // Obtenir la liste des enregistrements
  getListe: async () => {
    const response = await api.get("/enregistrement/liste");
    return response.data;
  },

  // Obtenir les statistiques
  getStatistiques: async () => {
    const response = await api.get("/enregistrement/statistiques");
    return response.data;
  },
};

export default enregistrementService;
