import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Music, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PracticeTracker } from "@/components/music/PracticeTracker";
import { RepertoireCard } from "@/components/music/RepertoireCard";
import { AriaChat } from "@/components/music/AriaChat";

const stats = [
  { label: "Weekly", value: "3.5h" },
  { label: "Focus", value: "Guitar" },
  { label: "Sessions", value: "5" },
];

const MusicPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="p-10 max-w-5xl mx-auto">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Music className="w-5 h-5 text-muted-foreground" />
              <h1 className="text-4xl font-medium tracking-tight">Music</h1>
            </div>
            <p className="text-muted-foreground">Practice sessions, repertoire, and technique</p>
          </header>

          <div className="grid grid-cols-3 gap-8 mb-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-medium tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>

          <Tabs defaultValue="practice" className="space-y-6">
            <TabsList>
              <TabsTrigger value="practice">Practice</TabsTrigger>
              <TabsTrigger value="repertoire">Repertoire</TabsTrigger>
              <TabsTrigger value="aria" className="gap-2">
                <MessageSquare className="w-3 h-3" />
                Aria
              </TabsTrigger>
            </TabsList>

            <TabsContent value="practice">
              <PracticeTracker />
            </TabsContent>
            <TabsContent value="repertoire">
              <RepertoireCard />
            </TabsContent>
            <TabsContent value="aria">
              <AriaChat />
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default MusicPage;
