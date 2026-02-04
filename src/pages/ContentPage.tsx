import { Bookmark, FolderOpen, Plus, Clock } from "lucide-react";
import { DomainPageTemplate } from "@/components/shared/DomainPageTemplate";
import { ContentFolders } from "@/components/content/ContentFolders";
import { SavedItems } from "@/components/content/SavedItems";

const stats = [
  { icon: Bookmark, label: "Saved", value: "128", suffix: "items", color: "text-content" },
  { icon: FolderOpen, label: "Folders", value: "8", suffix: "active", color: "text-muted-foreground" },
  { icon: Plus, label: "This week", value: "+8", suffix: "new", color: "text-finance" },
  { icon: Clock, label: "Reading", value: "2.5", suffix: "hours", color: "text-content" },
];

const ContentPage = () => {
  return (
    <DomainPageTemplate
      domain={{
        icon: Bookmark,
        title: "Content",
        subtitle: "Saved reels, videos, articles, and notes",
        color: "content",
      }}
      stats={stats}
      tabs={[
        {
          value: "browse",
          label: "Browse",
          component: (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
              <ContentFolders />
              <SavedItems />
            </div>
          ),
        },
      ]}
    />
  );
};

export default ContentPage;
