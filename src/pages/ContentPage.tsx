import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { GradientOrb, GridPattern, StatDisplay } from "@/components/ui/decorative";
import { Bookmark, Plus, Folder, ExternalLink, Video, Image, Play, Sparkles, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const folders = [
  { id: 1, name: "Learning", count: 34, color: "tech", emoji: "📚" },
  { id: 2, name: "Entertainment", count: 45, color: "music", emoji: "🎬" },
  { id: 3, name: "Inspiration", count: 28, color: "spiritual", emoji: "✨" },
  { id: 4, name: "Tech Tutorials", count: 21, color: "tech", emoji: "💻" },
];

const recentItems = [
  { id: 1, title: "React Server Components Deep Dive", type: "video", source: "YouTube", date: "Today", duration: "24:30", thumbnail: "tech" },
  { id: 2, title: "Minimalist Desk Setup Inspo", type: "reel", source: "Instagram", date: "Yesterday", duration: "0:45", thumbnail: "content" },
  { id: 3, title: "System Design Interview Prep", type: "video", source: "YouTube", date: "Dec 27", duration: "45:12", thumbnail: "tech" },
  { id: 4, title: "Morning Routine for Productivity", type: "reel", source: "Instagram", date: "Dec 26", duration: "1:20", thumbnail: "spiritual" },
];

const stats = [
  { label: "Total Saved", value: "128", icon: <Bookmark className="w-4 h-4" />, color: "content" },
  { label: "Folders", value: "12", icon: <Folder className="w-4 h-4" />, color: "content" },
  { label: "This Week", value: "+8", icon: <TrendingUp className="w-4 h-4" />, trend: "+23%", trendUp: true, color: "content" },
];

const folderGradients: Record<string, string> = {
  tech: "from-tech/20 to-tech/5",
  music: "from-music/20 to-music/5",
  spiritual: "from-spiritual/20 to-spiritual/5",
  content: "from-content/20 to-content/5",
};

const thumbnailColors: Record<string, string> = {
  tech: "from-tech/30 via-tech/10 to-transparent",
  content: "from-content/30 via-content/10 to-transparent",
  spiritual: "from-spiritual/30 via-spiritual/10 to-transparent",
  music: "from-music/30 via-music/10 to-transparent",
};

const ContentPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="relative p-8 max-w-6xl mx-auto min-h-screen">
          {/* Background decorative elements */}
          <GradientOrb color="content" size="lg" className="-top-20 -right-20 opacity-30" />
          <GradientOrb color="tech" size="md" className="bottom-40 -left-20 opacity-20" />
          <GridPattern />

          {/* Header */}
          <header className="relative flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-content/20 to-content/5 border border-content/20">
                  <Bookmark className="w-7 h-7 text-content" />
                </div>
                <div className="absolute -inset-2 bg-content/20 rounded-2xl blur-xl -z-10" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-content animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Content</h1>
                <p className="text-sm text-muted-foreground">Saved reels, videos, and notes</p>
              </div>
            </div>
            <Button className="gap-2 bg-content hover:bg-content/90 text-background">
              <Plus className="w-4 h-4" />
              Save Content
            </Button>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {stats.map((stat) => (
              <StatDisplay
                key={stat.label}
                value={stat.value}
                label={stat.label}
                icon={stat.icon}
                trend={stat.trend}
                trendUp={stat.trendUp}
                color={stat.color}
              />
            ))}
          </div>

          {/* Folders */}
          <div className="mb-10">
            <h2 className="font-medium mb-5 flex items-center gap-2">
              <Folder className="w-4 h-4 text-muted-foreground" />
              Folders
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  className={cn(
                    "group relative p-5 rounded-2xl border border-border/50 hover:border-border transition-all duration-300 text-left overflow-hidden",
                    "hover:shadow-[0_0_40px_-10px_hsl(var(--content)/0.3)]"
                  )}
                >
                  {/* Gradient background */}
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-50 group-hover:opacity-100 transition-opacity",
                    folderGradients[folder.color]
                  )} />
                  
                  <div className="relative">
                    <div className="text-3xl mb-3">{folder.emoji}</div>
                    <p className="font-medium">{folder.name}</p>
                    <p className="text-sm text-muted-foreground">{folder.count} items</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Items with visual thumbnails */}
          <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
            {/* Decorative gradient line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-content/50 to-transparent" />
            
            <div className="p-5 border-b border-border/50">
              <h2 className="font-medium flex items-center gap-2">
                <Play className="w-4 h-4 text-content" />
                Recently Saved
              </h2>
            </div>
            <div className="divide-y divide-border/50">
              {recentItems.map((item) => (
                <div key={item.id} className="group flex items-center gap-5 p-5 hover:bg-card-elevated/50 transition-colors">
                  {/* Visual Thumbnail */}
                  <div className={cn(
                    "relative w-20 h-14 rounded-lg overflow-hidden flex items-center justify-center",
                    "bg-gradient-to-br",
                    thumbnailColors[item.thumbnail]
                  )}>
                    <div className="absolute inset-0 bg-card/50" />
                    {item.type === "video" ? (
                      <Video className="w-6 h-6 text-foreground/70 relative z-10" />
                    ) : (
                      <Image className="w-6 h-6 text-foreground/70 relative z-10" />
                    )}
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-8 h-8 rounded-full bg-foreground/90 flex items-center justify-center">
                        <Play className="w-3.5 h-3.5 text-background ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-background/80 backdrop-blur-sm">
                      {item.duration}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate group-hover:text-content transition-colors">
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className={cn(
                        "px-1.5 py-0.5 rounded-full text-[10px] font-medium",
                        item.type === "video" ? "bg-tech/10 text-tech" : "bg-music/10 text-music"
                      )}>
                        {item.type}
                      </span>
                      {item.source} • {item.date}
                    </p>
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
