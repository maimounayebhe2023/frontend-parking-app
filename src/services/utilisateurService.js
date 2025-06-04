import api from "./api";

const utilisateurService = {
  // Récupérer la liste des utilisateurs
  getListe: async () => {
    const response = await api.get("/utilisateurs");
    return response.data;
  },

  // Ajouter un nouvel utilisateur
  ajouter: async (userData) => {
    const response = await api.post("/utilisateurs", userData);
    return response.data;
  },

  // Modifier un utilisateur existant
  modifier: async ({ id, ...userData }) => {
    const response = await api.put(`/utilisateurs/${id}`, userData);
    return response.data;
  },

  // Supprimer un utilisateur
  supprimer: async (id) => {
    const response = await api.delete(`/utilisateurs/${id}`);
    return response.data;
  },

  // Récupérer les détails d'un utilisateur
  getDetails: async (id) => {
    const response = await api.get(`/utilisateurs/${id}`);
    return response.data;
  },

  // Changer le mot de passe d'un utilisateur
  changerMotDePasse: async (id, { ancienMotDePasse, nouveauMotDePasse }) => {
    const response = await api.post(`/utilisateurs/${id}/changer-mot-de-passe`, {
      ancien_mot_de_passe: ancienMotDePasse,
      nouveau_mot_de_passe: nouveauMotDePasse,
    });
    return response.data;
  },

  // Réinitialiser le mot de passe d'un utilisateur (admin seulement)
  reinitialiserMotDePasse: async (id) => {
    const response = await api.post(`/utilisateurs/${id}/reinitialiser-mot-de-passe`);
    return response.data;
  },
};

export default utilisateurService; 