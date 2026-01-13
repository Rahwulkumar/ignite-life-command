import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Code2, MessageSquare, Flame, Zap, Target, TrendingUp, Clock } from "lucide-react";
import { AtlasChat } from "@/components/tech/AtlasChat";
import { MonthlyFocusSlot, FocusTopic } from "@/components/tech/MonthlyFocusSlot";
import { DomainPageHeader } from "@/components/shared/DomainPageHeader";
import { DomainStatsBar } from "@/components/shared/DomainStatsBar";
import { AIChatSidebar } from "@/components/shared/AIChatSidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyGoals } from "@/components/tech/WeeklyGoals";
import { EnhancedDSATracker } from "@/components/tech/EnhancedDSATracker";
import { TechRoadmapView } from "@/components/tech/TechRoadmapView";
import { EnhancedStudyLog } from "@/components/tech/EnhancedStudyLog";
import { EnhancedResources } from "@/components/tech/EnhancedResources";

const availableTopics = [
  "React & Next.js", "TypeScript", "Node.js", "Python", "AI/ML",
  "System Design", "DevOps", "Databases", "Mobile Dev", "Web3",
];

const TechPage = () => {
  const [focusTopics, setFocusTopics] = useState<(FocusTopic | null)[]>([null, null]);
  const [showAtlas, setShowAtlas] = useState(false);

  const handleSelectTopic = (slot: number, name: string) => {
    const newTopic: FocusTopic = {
      id: Date.now().toString(),
      name,
      videos: [],
      dailyPractice: [],
      streak: 0,
    };
    const updated = [...focusTopics];
    updated[slot] = newTopic;
    setFocusTopics(updated);
  };

  const handleAddVideo = (topicId: string, url: string, title: string) => {
    setFocusTopics(focusTopics.map(topic => {
      if (topic?.id === topicId) {
        return {
          ...topic,
          videos: [...topic.videos, { id: Date.now().toString(), title, url, completed: false }],
        };
      }
      return topic;
    }));
  };

  const handleToggleVideo = (topicId: string, videoId: string) => {
    setFocusTopics(focusTopics.map(topic => {
      if (topic?.id === topicId) {
        return {
          ...topic,
          videos: topic.videos.map(v => v.id === videoId ? { ...v, completed: !v.completed } : v),
        };
      }
      return topic;
    }));
  };

  const handleLogPractice = (topicId: string) => {
    const today = new Date().toDateString();
    setFocusTopics(focusTopics.map(topic => {
      if (topic?.id === topicId && !topic.dailyPractice.includes(today)) {
        return {
          ...topic,
          dailyPractice: [...topic.dailyPractice, today],
          streak: topic.streak + 1,
        };
      }
      return topic;
    }));
  };

  const hasPracticedToday = (topicId: string) => {
    const topic = focusTopics.find(t => t?.id === topicId);
    return topic?.dailyPractice.includes(new Date().toDateString()) ?? false;
  };

  const selectedTopics = focusTopics.filter(Boolean).map(t => t!.name);
  const availableForSelection = availableTopics.filter(t => !selectedTopics.includes(t));

  const stats = [
    { icon: Flame, label: "Streak", value: 7, suffix: "days", color: "text-trading" },
    { icon: Target, label: "Focus", value: `${focusTopics.filter(Boolean).length}/2`, color: "text-tech" },
    { icon: Zap, label: "DSA Solved", value: 24, suffix: "problems", color: "text-finance" },
    { icon: Clock, label: "This Week", value: "16.5", suffix: "hours", color: "text-spiritual" },
  ];

  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen">
          <DomainPageHeader
            icon={Code2}
            title="Tech & Learning"
            subtitle="Master your craft, one day at a time"
            domainColor="tech"
            action={{
              icon: MessageSquare,
              label: "Ask Atlas",
              onClick: () => setShowAtlas(true),
            }}
          />

          <DomainStatsBar stats={stats} />

          <div className="max-w-5xl mx-auto px-8 pb-8">
            <Tabs defaultValue="focus" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 mb-6">
                <TabsTrigger value="focus" className="rounded-none border-b-2 border-transparent data-[state=active]:border-tech data-[state=active]:bg-transparent px-4 py-3">
                  Focus
                </TabsTrigger>
                <TabsTrigger value="dsa" className="rounded-none border-b-2 border-transparent data-[state=active]:border-tech data-[state=active]:bg-transparent px-4 py-3">
                  DSA
                </TabsTrigger>
                <TabsTrigger value="roadmap" className="rounded-none border-b-2 border-transparent data-[state=active]:border-tech data-[state=active]:bg-transparent px-4 py-3">
                  Roadmap
                </TabsTrigger>
                <TabsTrigger value="study" className="rounded-none border-b-2 border-transparent data-[state=active]:border-tech data-[state=active]:bg-transparent px-4 py-3">
                  Study Log
                </TabsTrigger>
                <TabsTrigger value="resources" className="rounded-none border-b-2 border-transparent data-[state=active]:border-tech data-[state=active]:bg-transparent px-4 py-3">
                  Resources
                </TabsTrigger>
              </TabsList>

              <TabsContent value="focus" className="space-y-8 mt-0">
                <div className="grid grid-cols-2 gap-5">
                  {[0, 1].map((slot) => (
                    <MonthlyFocusSlot
                      key={slot}
                      slot={slot + 1}
                      topic={focusTopics[slot]}
                      availableTopics={availableForSelection}
                      onSelectTopic={(name) => handleSelectTopic(slot, name)}
                      onAddVideo={handleAddVideo}
                      onToggleVideo={handleToggleVideo}
                      onLogPractice={handleLogPractice}
                      hasPracticedToday={focusTopics[slot] ? hasPracticedToday(focusTopics[slot]!.id) : false}
                    />
                  ))}
                </div>
                <div className="p-5 rounded-xl border border-border/50 bg-card">
                  <WeeklyGoals />
                </div>
              </TabsContent>

              <TabsContent value="dsa" className="mt-0">
                <EnhancedDSATracker />
              </TabsContent>

              <TabsContent value="roadmap" className="mt-0">
                <TechRoadmapView />
              </TabsContent>

              <TabsContent value="study" className="mt-0">
                <EnhancedStudyLog />
              </TabsContent>

              <TabsContent value="resources" className="mt-0">
                <EnhancedResources />
              </TabsContent>
            </Tabs>
          </div>

          <Sheet open={showAtlas} onOpenChange={setShowAtlas}>
            <SheetContent className="w-full sm:max-w-lg p-0">
              <AIChatSidebar name="Atlas" role="Tech Mentor" domainColor="tech">
                <AtlasChat />
              </AIChatSidebar>
            </SheetContent>
          </Sheet>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default TechPage;
