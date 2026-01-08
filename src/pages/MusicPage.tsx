import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Music, MessageSquare, Clock, Guitar, Flame } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PracticeTracker } from "@/components/music/PracticeTracker";
import { RepertoireCard } from "@/components/music/RepertoireCard";
import { AriaChat } from "@/components/music/AriaChat";
import { DomainPageHeader } from "@/components/shared/DomainPageHeader";
import { DomainStatsBar } from "@/components/shared/DomainStatsBar";
import { AIChatSidebar } from "@/components/shared/AIChatSidebar";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const stats = [
  { icon: Clock, label: "Weekly", value: "3.5", suffix: "hours", color: "text-music" },
  { icon: Guitar, label: "Focus", value: "Guitar", color: "text-muted-foreground" },
  { icon: Flame, label: "Sessions", value: "5", suffix: "this week", color: "text-trading" },
  { icon: Music, label: "Pieces", value: "12", suffix: "learning", color: "text-music" },
];

const MusicPage = () => {
  const [showAria, setShowAria] = useState(false);

  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen flex">
          <div className="flex-1">
            <DomainPageHeader
              icon={Music}
              title="Music"
              subtitle="Practice sessions, repertoire, and technique"
              domainColor="music"
              action={{
                icon: MessageSquare,
                label: "Ask Aria",
                onClick: () => setShowAria(true),
              }}
            />

            <DomainStatsBar stats={stats} />

            <div className="px-8 pb-8">
              <div className="max-w-5xl mx-auto">
                <Tabs defaultValue="practice" className="space-y-6">
                  <TabsList>
                    <TabsTrigger value="practice">Practice</TabsTrigger>
                    <TabsTrigger value="repertoire">Repertoire</TabsTrigger>
                  </TabsList>

                  <TabsContent value="practice">
                    <PracticeTracker />
                  </TabsContent>
                  <TabsContent value="repertoire">
                    <RepertoireCard />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          <Sheet open={showAria} onOpenChange={setShowAria}>
            <SheetContent className="w-full sm:max-w-lg p-0">
              <AIChatSidebar name="Aria" role="Music Instructor" domainColor="music">
                <AriaChat />
              </AIChatSidebar>
            </SheetContent>
          </Sheet>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default MusicPage;
