import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import utilisateurService from "../services/utilisateurService";

// Hook pour obtenir la liste des utilisateurs
export const useUsersList = () => {
  return useQuery({
    queryKey: ["utilisateurs"],
    queryFn: utilisateurService.getListe,
    staleTime: 30 * 1000, // Les données sont considérées comme fraîches pendant 30 secondes
  });
};

// Hook pour ajouter un nouvel utilisateur
export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: utilisateurService.ajouter,
    onSuccess: () => {
      // Invalider et recharger la liste des utilisateurs
      queryClient.invalidateQueries({ queryKey: ["utilisateurs"] });
    },
  });
};

// Hook pour modifier un utilisateur
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: utilisateurService.modifier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utilisateurs"] });
    },
  });
};

// Hook pour supprimer un utilisateur
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: utilisateurService.supprimer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utilisateurs"] });
    },
  });
};

// Hook pour obtenir les détails d'un utilisateur
export const useUserDetails = (id) => {
  return useQuery({
    queryKey: ["utilisateur", id],
    queryFn: () => utilisateurService.getDetails(id),
    enabled: !!id, // La requête ne sera exécutée que si un ID est fourni
  });
};

// Hook pour changer le mot de passe d'un utilisateur
export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ id, ...passwordData }) => 
      utilisateurService.changerMotDePasse(id, passwordData),
  });
};

// Hook pour réinitialiser le mot de passe d'un utilisateur (admin seulement)
export const useResetPassword = () => {
  return useMutation({
    mutationFn: utilisateurService.reinitialiserMotDePasse,
  });
}; 