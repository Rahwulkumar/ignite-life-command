import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Bookmark, FolderOpen, Plus, Clock, StickyNote } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentFolders } from "@/components/content/ContentFolders";
import { SavedItems } from "@/components/content/SavedItems";
import { DomainPageHeader } from "@/components/shared/DomainPageHeader";
import { DomainStatsBar } from "@/components/shared/DomainStatsBar";

const stats = [
  { icon: Bookmark, label: "Saved", value: "128", suffix: "items", color: "text-content" },
  { icon: FolderOpen, label: "Folders", value: "8", suffix: "active", color: "text-muted-foreground" },
  { icon: Plus, label: "This week", value: "+8", suffix: "new", color: "text-finance" },
  { icon: Clock, label: "Reading", value: "2.5", suffix: "hours", color: "text-content" },
];

const ContentPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen flex">
          <div className="flex-1">
            <DomainPageHeader
            icon={Bookmark}
            title="Content"
            subtitle="Saved reels, videos, articles, and notes"
            domainColor="content"
          />

          <DomainStatsBar stats={stats} />

          <div className="px-4 sm:px-6 lg:px-8 pb-8">
            <div className="max-w-5xl mx-auto">
              <Tabs defaultValue="browse" className="space-y-6">
                <TabsList className="flex-wrap">
                  <TabsTrigger value="browse">Browse</TabsTrigger>
                  <TabsTrigger value="notes" asChild>
                    <Link to="/notes" state={{ domain: 'content' }} className="flex items-center gap-1.5">
                      <StickyNote className="w-3.5 h-3.5" />
                      Notes
                    </Link>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="browse">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
                    <ContentFolders />
                    <SavedItems />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default ContentPage;
