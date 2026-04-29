import { useMemo, useState } from "react";
import { Bookmark, FolderOpen, PlayCircle, FileText } from "lucide-react";
import { ContentFolders } from "@/components/content/ContentFolders";
import { SavedItems } from "@/components/content/SavedItems";
import { DomainPageTemplate } from "@/components/shared/DomainPageTemplate";
import { useContentOverview } from "@/hooks/useContent";

const ContentPage = () => {
  const { data, isLoading } = useContentOverview();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const folders = data?.folders ?? [];
  const items = data?.items ?? [];
  const selectedFolder = folders.find((folder) => folder.id === selectedFolderId) ?? null;

  const visibleItems = useMemo(() => {
    if (!selectedFolder) {
      return items;
    }

    return items.filter((item) => item.folderName === selectedFolder.name);
  }, [items, selectedFolder]);

  const videoCount = items.filter((item) => item.type === "video" || item.type === "reel").length;
  const readingCount = items.filter((item) => item.type === "article" || item.type === "resource").length;

  const stats = [
    {
      icon: Bookmark,
      label: "Saved",
      value: isLoading ? "..." : items.length,
      suffix: "items",
      color: "text-content",
    },
    {
      icon: FolderOpen,
      label: "Folders",
      value: isLoading ? "..." : folders.length,
      suffix: "active",
      color: "text-muted-foreground",
    },
    {
      icon: PlayCircle,
      label: "Video",
      value: isLoading ? "..." : videoCount,
      suffix: "items",
      color: "text-finance",
    },
    {
      icon: FileText,
      label: "Reading",
      value: isLoading ? "..." : readingCount,
      suffix: "items",
      color: "text-content",
    },
  ];

  const emptyStateMessage = selectedFolder
    ? `No items in ${selectedFolder.name} yet`
    : "Share a YouTube link, reel, article, or URL to Telegram and it will appear here";

  return (
    <DomainPageTemplate
      domain={{
        icon: Bookmark,
        title: "Content",
        subtitle: "Smartly filed reels, videos, articles, and saved links",
        color: "content",
        notesDomain: "content",
      }}
      stats={stats}
      tabs={[
        {
          value: "browse",
          label: "Browse",
          component: (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.3fr] lg:gap-10">
              <ContentFolders
                folders={folders}
                selectedFolderId={selectedFolderId}
                onSelectFolder={setSelectedFolderId}
              />
              <SavedItems
                items={visibleItems}
                emptyStateMessage={isLoading ? "Loading content..." : emptyStateMessage}
              />
            </div>
          ),
        },
      ]}
    >
      <div className="mb-4 rounded-xl border border-content/20 bg-content/5 px-4 py-3 text-sm text-muted-foreground">
        Shared links from Telegram are filed here automatically. Open a folder to narrow the list.
      </div>
    </DomainPageTemplate>
  );
};

export default ContentPage;
