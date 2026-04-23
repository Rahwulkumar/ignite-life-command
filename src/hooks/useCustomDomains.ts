import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export type CustomDomainColor =
  | "finance"
  | "trading"
  | "tech"
  | "spiritual"
  | "music"
  | "content"
  | "work";

export type CustomDomainTemplate =
  | "tracker"
  | "library"
  | "journal"
  | "pipeline";

export type CustomDomainFieldType =
  | "text"
  | "textarea"
  | "select"
  | "status"
  | "date"
  | "url"
  | "number";

export interface CustomDomainSummary {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  iconKey: string;
  color: CustomDomainColor;
  template: CustomDomainTemplate;
  fieldCount: number;
  recordCount: number;
}

export interface CustomDomainField {
  id: string;
  key: string;
  label: string;
  fieldType: CustomDomainFieldType;
  isRequired: boolean;
  config: Record<string, unknown>;
  orderIndex: number;
}

export interface CustomDomainRecord {
  id: string;
  title: string;
  values: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomDomainView {
  id: string;
  viewKey: string;
  name: string;
  layout: Record<string, unknown>;
  orderIndex: number;
}

export interface CustomDomainDetail {
  domain: Omit<CustomDomainSummary, "fieldCount" | "recordCount">;
  fields: CustomDomainField[];
  records: CustomDomainRecord[];
  views: CustomDomainView[];
}

export function useCustomDomains() {
  return useQuery({
    queryKey: ["custom-domains"],
    queryFn: () => api.get<CustomDomainSummary[]>("/api/custom-domains"),
  });
}

export function useCustomDomain(slug?: string) {
  return useQuery({
    queryKey: ["custom-domain", slug],
    queryFn: () => api.get<CustomDomainDetail>(`/api/custom-domains/${slug}`),
    enabled: Boolean(slug),
  });
}

export function useCreateCustomDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      name: string;
      subtitle?: string;
      iconKey?: string;
      color?: CustomDomainColor;
      template?: CustomDomainTemplate;
    }) =>
      api.post<Omit<CustomDomainSummary, "fieldCount" | "recordCount">>(
        "/api/custom-domains",
        payload,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-domains"] });
    },
  });
}

export function useCreateCustomDomainRecord(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      title: string;
      values: Record<string, unknown>;
    }) =>
      api.post<CustomDomainRecord>(`/api/custom-domains/${slug}/records`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-domain", slug] });
      queryClient.invalidateQueries({ queryKey: ["custom-domains"] });
    },
  });
}

export function useCreateCustomDomainField(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      label: string;
      key?: string;
      fieldType: CustomDomainFieldType;
      isRequired?: boolean;
      options?: string[];
    }) =>
      api.post<CustomDomainField>(`/api/custom-domains/${slug}/fields`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-domain", slug] });
      queryClient.invalidateQueries({ queryKey: ["custom-domains"] });
    },
  });
}

export function useDeleteCustomDomainField(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fieldId: string) =>
      api.delete<{ success: true }>(`/api/custom-domains/${slug}/fields/${fieldId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-domain", slug] });
      queryClient.invalidateQueries({ queryKey: ["custom-domains"] });
    },
  });
}

export function useDeleteCustomDomain() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) =>
      api.delete<{ success: true; slug: string }>(`/api/custom-domains/${slug}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-domains"] });
      queryClient.removeQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "custom-domain",
      });
    },
  });
}
