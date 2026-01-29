import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Bookmark, FolderOpen, Plus, Clock } from "lucide-react";
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

          <div className="px-8 pb-8">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <ContentFolders />
                <SavedItems />
              </div>
            </div>
          </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default ContentPage;
