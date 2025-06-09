import api from "./api";

const utilisateurService = {
  // Récupérer la liste des utilisateurs
  getListe: async () => {
    const response = await api.get("/utilisateurs");
    return response.data;
  },

  // Ajouter un nouvel utilisateur
  ajouter: async (userData) => {
    const response = await api.post("/admin/create-vigile", userData);
    return response.data;
  },

  // Modifier un utilisateur existant
  modifier: async ({ id, ...userData }) => {
    const response = await api.patch(`/utilisateurs/${id}`, userData);
    return response.data;
  },

  // Supprimer un utilisateur
  supprimer: async (id) => {
    const response = await api.delete(`/utilisateurs/sup/${id}`);
    return response.data;
  },


};

export default utilisateurService; 