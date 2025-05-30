import { publicApi } from "./api";

const authService = {
  login: async (phoneNumber, password) => {
    try {
      const { data } = await publicApi.post("/login", {
        phone: phoneNumber,
        password,
      });
        
      if (data.token) {
        localStorage.setItem("user", JSON.stringify(data));
      }

      return data;
    } catch (error) {
      throw (
        error.response?.data || {
          message: "Une erreur est survenue lors de la connexion",
        }
      );
    }
  },

  logout: () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    const user = authService.getCurrentUser();
    return !!user?.token;
  },
};

export default authService;
