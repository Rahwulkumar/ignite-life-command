import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Bookmark, Plus, Folder, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const folders = [
  { id: 1, name: "Learning", count: 34 },
  { id: 2, name: "Entertainment", count: 45 },
  { id: 3, name: "Inspiration", count: 28 },
  { id: 4, name: "Tech Tutorials", count: 21 },
];

const recentItems = [
  { id: 1, title: "React Server Components Deep Dive", source: "YouTube", date: "Today" },
  { id: 2, title: "Minimalist Desk Setup Inspo", source: "Instagram", date: "Yesterday" },
  { id: 3, title: "System Design Interview Prep", source: "YouTube", date: "Dec 27" },
  { id: 4, title: "Morning Routine for Productivity", source: "Instagram", date: "Dec 26" },
];

const stats = [
  { label: "Saved", value: "128" },
  { label: "Folders", value: "12" },
  { label: "This week", value: "+8" },
];

const ContentPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="p-10 max-w-4xl mx-auto">
          <header className="flex items-center justify-between mb-16">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Bookmark className="w-5 h-5 text-muted-foreground" />
                <h1 className="text-4xl font-medium tracking-tight">Content</h1>
              </div>
              <p className="text-muted-foreground">Saved reels, videos, and notes</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Save
            </Button>
          </header>

          <div className="grid grid-cols-3 gap-8 mb-16">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-medium tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-12">
            <h2 className="text-sm text-muted-foreground mb-6">Folders</h2>
            <div className="grid grid-cols-4 gap-4">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  className="text-left p-4 border border-border/50 rounded-lg hover:border-border transition-colors"
                >
                  <Folder className="w-4 h-4 text-muted-foreground mb-2" />
                  <p className="font-medium text-sm">{folder.name}</p>
                  <p className="text-xs text-muted-foreground">{folder.count}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm text-muted-foreground mb-6">Recent</h2>
            <div className="space-y-0">
              {recentItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-4 border-b border-border/50 group"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.source} · {item.date}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default ContentPage;
