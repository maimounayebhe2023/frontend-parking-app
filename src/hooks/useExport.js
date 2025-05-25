import { useMutation } from "@tanstack/react-query";
import enregistrementService from "../services/enregistrementService";

/**
 * Hook pour gérer l'exportation des enregistrements
 * @returns {Object} Mutation pour l'exportation
 */
export const useExportEnregistrements = () => {
  const mutation = useMutation({
    mutationFn: async (enregistrements) => {
      if (!enregistrements?.length) {
        throw new Error("Aucun enregistrement à exporter");
      }

      try {
        await enregistrementService.exportToExcel(enregistrements);
        return { success: true };
      } catch (error) {
        console.error("Erreur lors de l'exportation:", error);
        throw new Error("Erreur lors de la génération du fichier Excel");
      }
    },
  });

  return {
    exportEnregistrements: mutation.mutateAsync,
    isExporting: mutation.isPending,
    exportError: mutation.error,
  };
};
