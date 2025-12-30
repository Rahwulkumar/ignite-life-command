import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Bookmark } from "lucide-react";
import { ContentFolders } from "@/components/content/ContentFolders";
import { SavedItems } from "@/components/content/SavedItems";

const stats = [
  { label: "Saved", value: "128" },
  { label: "Folders", value: "8" },
  { label: "This week", value: "+8" },
];

const ContentPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="p-10 max-w-5xl mx-auto">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Bookmark className="w-5 h-5 text-muted-foreground" />
              <h1 className="text-4xl font-medium tracking-tight">Content</h1>
            </div>
            <p className="text-muted-foreground">Saved reels, videos, articles, and notes</p>
          </header>

          <div className="grid grid-cols-3 gap-8 mb-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-medium tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <ContentFolders />
            <SavedItems />
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default ContentPage;
