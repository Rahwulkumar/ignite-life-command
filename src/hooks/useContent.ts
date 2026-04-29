import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ContentFolder } from "@/components/content/ContentFolders";
import type { SavedItem } from "@/components/content/SavedItems";

interface ContentFolderApi {
  id: string;
  name: string;
  itemCount: number;
  color: string;
}

interface ContentItemApi {
  id: string;
  title: string;
  source: string;
  type: SavedItem["type"];
  summary?: string | null;
  dateLabel: string;
  url: string;
  folderId?: string | null;
  folderName?: string | null;
}

interface ContentResponse {
  folders: ContentFolderApi[];
  items: ContentItemApi[];
}

export interface ContentOverview {
  folders: ContentFolder[];
  items: SavedItem[];
}

function normalizeContentOverview(data: ContentResponse): ContentOverview {
  return {
    folders: data.folders.map((folder) => ({
      id: folder.id,
      name: folder.name,
      count: folder.itemCount,
      color: folder.color,
    })),
    items: data.items.map((item) => ({
      id: item.id,
      title: item.title,
      source: item.source,
      type: item.type,
      date: item.dateLabel,
      url: item.url,
      summary: item.summary ?? null,
      folderName: item.folderName ?? null,
    })),
  };
}

export function useContentOverview() {
  return useQuery({
    queryKey: ["content"],
    queryFn: async () => {
      const response = await api.get<ContentResponse>("/api/content");
      return normalizeContentOverview(response);
    },
  });
}

export function useCreateContentFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      name,
      color,
    }: {
      name: string;
      color?: string;
    }) =>
      api.post<ContentFolderApi>("/api/content/folders", {
        name,
        color,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
}

export function useCreateContentItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      title,
      source,
      type,
      dateLabel,
      url,
      folderName,
    }: {
      title?: string;
      source?: string;
      type?: SavedItem["type"];
      dateLabel?: string;
      url?: string;
      folderName?: string;
    }) =>
      api.post<ContentItemApi>("/api/content/items", {
        title,
        source,
        type,
        dateLabel,
        url,
        folderName,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["content"] });
    },
  });
}
