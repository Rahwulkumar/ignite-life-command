import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Code2, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DSATracker } from "@/components/tech/DSATracker";
import { StudyLog } from "@/components/tech/StudyLog";
import { LearningResources } from "@/components/tech/LearningResources";
import { AtlasChat } from "@/components/tech/AtlasChat";

const stats = [
  { label: "Solved", value: "47" },
  { label: "Hours", value: "24h" },
  { label: "Streak", value: "12d" },
];

const TechPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="p-10 max-w-5xl mx-auto">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Code2 className="w-5 h-5 text-muted-foreground" />
              <h1 className="text-4xl font-medium tracking-tight">Tech</h1>
            </div>
            <p className="text-muted-foreground">DSA, system design, and AI engineering</p>
          </header>

          <div className="grid grid-cols-3 gap-8 mb-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-medium tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>

          <Tabs defaultValue="problems" className="space-y-6">
            <TabsList>
              <TabsTrigger value="problems">Problems</TabsTrigger>
              <TabsTrigger value="study">Study Log</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="atlas" className="gap-2">
                <MessageSquare className="w-3 h-3" />
                Atlas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="problems">
              <DSATracker />
            </TabsContent>
            <TabsContent value="study">
              <StudyLog />
            </TabsContent>
            <TabsContent value="resources">
              <LearningResources />
            </TabsContent>
            <TabsContent value="atlas">
              <AtlasChat />
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default TechPage;
