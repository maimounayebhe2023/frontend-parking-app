import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";

export const useAuth = () => {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = useCallback(
    async (phoneNumber, password) => {
      try {
        setLoading(true);
        setError(null);
        const data = await authService.login(phoneNumber, password);
        setUser(data);
        navigate("/");
        return data;
      } catch (err) {
        setError(err.message || "Une erreur est survenue lors de la connexion");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [navigate]
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    navigate("/login");
  }, [navigate]);

  const isAuthenticated = useCallback(() => {
    return authService.isAuthenticated();
  }, []);

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
  };
};
