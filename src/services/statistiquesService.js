import api from "./api";

export const statistiquesService = {
  getStats: () => {
    return api.get("/stats").then((response) => response.data);
  },
};
