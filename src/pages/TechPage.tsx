import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Code2, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DSATracker } from "@/components/tech/DSATracker";
import { StudyLog } from "@/components/tech/StudyLog";
import { LearningResources } from "@/components/tech/LearningResources";
import { AtlasChat } from "@/components/tech/AtlasChat";
import { TechCategories } from "@/components/tech/TechCategories";
import { CategoryDetail } from "@/components/tech/CategoryDetail";

interface TechCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  topicsCount: number;
  completedCount: number;
}

const stats = [
  { label: "Solved", value: "47" },
  { label: "Hours", value: "24h" },
  { label: "Streak", value: "12d" },
];

const TechPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<TechCategory | null>(null);

  return (
    <MainLayout>
      <PageTransition>
        <div className="p-10 max-w-5xl mx-auto">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <Code2 className="w-5 h-5 text-muted-foreground" />
              <h1 className="text-4xl font-medium tracking-tight">Tech</h1>
            </div>
            <p className="text-muted-foreground">DSA, system design, and engineering skills</p>
          </header>

          <div className="grid grid-cols-3 gap-8 mb-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-medium tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>

          <Tabs defaultValue="tracks" className="space-y-6">
            <TabsList>
              <TabsTrigger value="tracks">Learning Tracks</TabsTrigger>
              <TabsTrigger value="problems">DSA Problems</TabsTrigger>
              <TabsTrigger value="study">Study Log</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="atlas" className="gap-2">
                <MessageSquare className="w-3 h-3" />
                Atlas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tracks">
              {selectedCategory ? (
                <CategoryDetail 
                  category={selectedCategory} 
                  onBack={() => setSelectedCategory(null)} 
                />
              ) : (
                <TechCategories onSelectCategory={setSelectedCategory} />
              )}
            </TabsContent>
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
