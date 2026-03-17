import { Bookmark, FolderOpen, Plus, Clock } from "lucide-react";
import { DomainPageTemplate } from "@/components/shared/DomainPageTemplate";
import { ContentFolders, ContentFolder } from "@/components/content/ContentFolders";
import { SavedItems, SavedItem } from "@/components/content/SavedItems";

// Mock data for Content domain
const mockFolders: ContentFolder[] = [
  { id: 1, name: "Learning", count: 34, color: "bg-tech" },
  { id: 2, name: "Entertainment", count: 45, color: "bg-music" },
  { id: 3, name: "Inspiration", count: 28, color: "bg-spiritual" },
  { id: 4, name: "Tech Tutorials", count: 21, color: "bg-trading" },
  { id: 5, name: "Music Theory", count: 15, color: "bg-music" },
  { id: 6, name: "Design Inspo", count: 32, color: "bg-content" },
  { id: 7, name: "Productivity", count: 18, color: "bg-finance" },
  { id: 8, name: "Watch Later", count: 67, color: "bg-muted-foreground" },
];

const mockSavedItems: SavedItem[] = [
  { id: 1, title: "React Server Components Deep Dive", source: "YouTube", type: "video", date: "Today", url: "#" },
  { id: 2, title: "Minimalist Desk Setup Inspo", source: "Instagram", type: "reel", date: "Yesterday", url: "#" },
  { id: 3, title: "System Design Interview Prep", source: "YouTube", type: "video", date: "Dec 27", url: "#" },
  { id: 4, title: "Morning Routine for Productivity", source: "Instagram", type: "reel", date: "Dec 26", url: "#" },
  { id: 5, title: "Advanced TypeScript Patterns", source: "Medium", type: "article", date: "Dec 25", url: "#" },
];

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
        notesDomain: "content",
      }}
      stats={stats}
      tabs={[
        {
          value: "browse",
          label: "Browse",
          component: (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
              <ContentFolders folders={mockFolders} />
              <SavedItems items={mockSavedItems} />
            </div>
          ),
        },
      ]}
    />
  );
};

export default ContentPage;
