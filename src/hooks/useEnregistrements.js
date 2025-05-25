import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import enregistrementService from "../services/enregistrementService";

// Hook pour obtenir la liste des enregistrements
export const useEnregistrementsList = (filters = {}) => {
  return useQuery({
    queryKey: ["enregistrements", filters],
    queryFn: () => enregistrementService.getListe(filters),
    staleTime: 30 * 1000, // Les données sont considérées comme fraîches pendant 30 secondes
  });
};

// Hook pour ajouter un nouvel enregistrement
export const useAddEnregistrement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enregistrementService.ajouter,
    onSuccess: () => {
      // Invalider et recharger la liste des enregistrements
      queryClient.invalidateQueries({ queryKey: ["enregistrements"] });
      // Invalider et recharger les statistiques
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
};

// Hook pour valider une sortie
export const useValiderSortie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: enregistrementService.validerSortie,
    onSuccess: () => {
      // Invalider et recharger la liste des enregistrements
      queryClient.invalidateQueries({ queryKey: ["enregistrements"] });
      // Invalider et recharger les statistiques
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
};

// Hook pour obtenir les statistiques des enregistrements
export const useEnregistrementsStats = () => {
  return useQuery({
    queryKey: ["enregistrements-stats"],
    queryFn: enregistrementService.getStatistiques,
    staleTime: 60 * 1000, // Les données sont considérées comme fraîches pendant 1 minute
  });
};
