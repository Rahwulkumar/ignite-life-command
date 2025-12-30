import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Code2, Sparkles, Calendar, Flame, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AtlasChat } from "@/components/tech/AtlasChat";
import { MonthlyFocusSlot, FocusTopic, Video } from "@/components/tech/MonthlyFocusSlot";
import { DailyDSASection, DSAProblem } from "@/components/tech/DailyDSASection";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const availableTopics = [
  "React & Next.js",
  "TypeScript",
  "Node.js",
  "Python",
  "AI/ML",
  "System Design",
  "DevOps",
  "Databases",
  "Mobile Dev",
  "Web3",
];

const initialProblems: DSAProblem[] = [
  { id: "1", title: "Two Sum", difficulty: "Easy", status: "completed", topic: "Arrays", leetcodeId: 1, completedAt: new Date().toISOString() },
  { id: "2", title: "Valid Parentheses", difficulty: "Easy", status: "completed", topic: "Stack", leetcodeId: 20 },
  { id: "3", title: "Merge Intervals", difficulty: "Medium", status: "in-progress", topic: "Arrays", leetcodeId: 56 },
  { id: "4", title: "LRU Cache", difficulty: "Medium", status: "pending", topic: "Design", leetcodeId: 146 },
  { id: "5", title: "Binary Tree Level Order", difficulty: "Medium", status: "pending", topic: "Trees", leetcodeId: 102 },
  { id: "6", title: "Word Search II", difficulty: "Hard", status: "pending", topic: "Trie", leetcodeId: 212 },
];

const TechPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [focusTopics, setFocusTopics] = useState<(FocusTopic | null)[]>([null, null]);
  const [dsaProblems, setDsaProblems] = useState<DSAProblem[]>(initialProblems);
  const [dsaStreak, setDsaStreak] = useState(7);
  const [showAtlas, setShowAtlas] = useState(false);

  const monthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentMonth(newDate);
  };

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

  const handleAddDSAProblem = (problem: Omit<DSAProblem, "id" | "status">) => {
    setDsaProblems([...dsaProblems, { ...problem, id: Date.now().toString(), status: "pending" }]);
  };

  const handleCompleteDSA = (id: string) => {
    setDsaProblems(dsaProblems.map(p => 
      p.id === id ? { ...p, status: "completed", completedAt: new Date().toISOString() } : p
    ));
  };

  const handleStartDSA = (id: string) => {
    setDsaProblems(dsaProblems.map(p => 
      p.id === id ? { ...p, status: "in-progress" } : p
    ));
  };

  // Calculate overall stats
  const totalStreak = Math.max(dsaStreak, ...focusTopics.filter(Boolean).map(t => t!.streak));
  const selectedTopics = focusTopics.filter(Boolean).map(t => t!.name);
  const usedTopicNames = selectedTopics;
  const availableForSelection = availableTopics.filter(t => !usedTopicNames.includes(t));

  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen pb-20">
          {/* Header */}
          <div className="px-8 pt-8 pb-6 border-b border-border">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-tech/10 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-tech" />
                  </div>
                  <div>
                    <h1 className="text-xl font-medium">Tech & Learning</h1>
                    <p className="text-sm text-muted-foreground">Focus on what matters</p>
                  </div>
                </div>

                <Sheet open={showAtlas} onOpenChange={setShowAtlas}>
                  <SheetTrigger asChild>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-sm">Ask Atlas</span>
                    </button>
                  </SheetTrigger>
                  <SheetContent className="w-full sm:max-w-lg p-0">
                    <div className="h-full">
                      <AtlasChat />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Month Selector */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{monthName}</span>
                  </div>
                  <button
                    onClick={() => navigateMonth(1)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {totalStreak > 0 && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-trading/10 text-trading">
                    <Flame className="w-4 h-4" />
                    <span className="text-sm font-medium">{totalStreak} day streak</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto px-8 py-8 space-y-8">
            {/* Monthly Focus Section */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm text-muted-foreground uppercase tracking-wider">
                  This Month's Focus
                </h2>
                <p className="text-xs text-muted-foreground">
                  {focusTopics.filter(Boolean).length}/2 selected
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
            </section>

            {/* Daily DSA Section */}
            <section>
              <DailyDSASection
                problems={dsaProblems}
                streak={dsaStreak}
                onAddProblem={handleAddDSAProblem}
                onCompleteProblem={handleCompleteDSA}
                onStartProblem={handleStartDSA}
              />
            </section>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default TechPage;
