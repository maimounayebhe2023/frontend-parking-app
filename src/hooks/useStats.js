import { useQuery } from "@tanstack/react-query";
import { statistiquesService } from "../services/statistiquesService";

export const useStats = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: statistiquesService.getStats,
    // Les données sont considérées comme fraîches pendant 1 minute
    staleTime: 60 * 1000,
  });
};
