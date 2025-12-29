import { MainLayout } from "@/components/layout/MainLayout";
import { Bookmark, Plus, Folder, ExternalLink, Video, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const folders = [
  { id: 1, name: "Learning", count: 34, color: "tech" },
  { id: 2, name: "Entertainment", count: 45, color: "music" },
  { id: 3, name: "Inspiration", count: 28, color: "spiritual" },
  { id: 4, name: "Tech Tutorials", count: 21, color: "tech" },
];

const recentItems = [
  { id: 1, title: "React Server Components Deep Dive", type: "video", source: "YouTube", date: "Today" },
  { id: 2, title: "Minimalist Desk Setup Inspo", type: "reel", source: "Instagram", date: "Yesterday" },
  { id: 3, title: "System Design Interview Prep", type: "video", source: "YouTube", date: "Dec 27" },
  { id: 4, title: "Morning Routine for Productivity", type: "reel", source: "Instagram", date: "Dec 26" },
];

const stats = [
  { label: "Total Saved", value: "128" },
  { label: "Folders", value: "12" },
  { label: "This Week", value: "+8" },
];

const folderColors: Record<string, string> = {
  tech: "bg-tech/10 text-tech",
  music: "bg-music/10 text-music",
  spiritual: "bg-spiritual/10 text-spiritual",
};

const ContentPage = () => {
  return (
    <MainLayout>
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-content/10">
              <Bookmark className="w-6 h-6 text-content" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Content</h1>
              <p className="text-sm text-muted-foreground">Saved reels, videos, and notes</p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Save Content
          </Button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="p-5 bg-card rounded-xl border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <span className="font-mono text-2xl font-medium">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Folders */}
        <div className="mb-8">
          <h2 className="font-medium mb-4">Folders</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {folders.map((folder) => (
              <button
                key={folder.id}
                className="p-4 bg-card rounded-xl border border-border/50 hover:bg-card-elevated transition-colors text-left"
              >
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center mb-3", folderColors[folder.color])}>
                  <Folder className="w-4 h-4" />
                </div>
                <p className="font-medium text-sm">{folder.name}</p>
                <p className="text-xs text-muted-foreground">{folder.count} items</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Items */}
        <div className="bg-card rounded-xl border border-border/50">
          <div className="p-5 border-b border-border/50">
            <h2 className="font-medium">Recently Saved</h2>
          </div>
          <div className="divide-y divide-border/50">
            {recentItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
                    {item.type === "video" ? (
                      <Video className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Image className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.source} • {item.date}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ContentPage;
