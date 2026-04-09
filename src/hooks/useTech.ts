import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Certification } from "@/components/tech/CertificationCard";
import type { ResearchEntry } from "@/components/tech/ResearchEntryCard";
import type { SkillDomain } from "@/components/tech/SkillsTracker";
import type { TechResource } from "@/components/tech/TechLibrary";
import { api } from "@/lib/api";

interface TechResponse {
  domains: SkillDomain[];
  certifications: Certification[];
  researchEntries: ResearchEntry[];
  resources: TechResource[];
}

export function useTechOverview() {
  return useQuery({
    queryKey: ["tech"],
    queryFn: () => api.get<TechResponse>("/api/tech"),
  });
}

export function useReplaceSkillDomains() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (domains: SkillDomain[]) =>
      api.put<{ success: boolean }>("/api/tech/skill-domains", { domains }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tech"] });
    },
  });
}

export function useReplaceCertifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (certifications: Certification[]) =>
      api.put<{ success: boolean }>("/api/tech/certifications", { certifications }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tech"] });
    },
  });
}

export function useReplaceResearchEntries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entries: ResearchEntry[]) =>
      api.put<{ success: boolean }>("/api/tech/research-entries", { entries }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tech"] });
    },
  });
}

export function useReplaceResources() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resources: TechResource[]) =>
      api.put<{ success: boolean }>("/api/tech/resources", { resources }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tech"] });
    },
  });
}
