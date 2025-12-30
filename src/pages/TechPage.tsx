import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { 
  Code2, Sparkles, Calendar, Flame, ChevronLeft, ChevronRight,
  Zap, Target, TrendingUp, Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AtlasChat } from "@/components/tech/AtlasChat";
import { MonthlyFocusSlot, FocusTopic } from "@/components/tech/MonthlyFocusSlot";
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

  const totalStreak = Math.max(dsaStreak, ...focusTopics.filter(Boolean).map(t => t!.streak));
  const selectedTopics = focusTopics.filter(Boolean).map(t => t!.name);
  const availableForSelection = availableTopics.filter(t => !selectedTopics.includes(t));

  // Stats
  const completedDSA = dsaProblems.filter(p => p.status === "completed").length;
  const totalVideos = focusTopics.reduce((sum, t) => sum + (t?.videos.length ?? 0), 0);

  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen">
          {/* Hero Header with Gradient */}
          <div className="relative overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-tech/20 via-background to-background" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-tech/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative px-8 pt-10 pb-8">
              <div className="max-w-5xl mx-auto">
                {/* Top Row */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-tech to-tech/50 flex items-center justify-center shadow-lg shadow-tech/20"
                    >
                      <Code2 className="w-7 h-7 text-white" />
                    </motion.div>
                    <div>
                      <h1 className="text-2xl font-semibold tracking-tight">Tech & Learning</h1>
                      <p className="text-muted-foreground">Master your craft, one day at a time</p>
                    </div>
                  </div>

                  <Sheet open={showAtlas} onOpenChange={setShowAtlas}>
                    <SheetTrigger asChild>
                      <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-all hover:scale-[1.02] active:scale-[0.98]">
                        <Sparkles className="w-4 h-4 text-tech" />
                        <span className="text-sm font-medium">Ask Atlas</span>
                      </button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:max-w-lg p-0">
                      <div className="h-full">
                        <AtlasChat />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 rounded-xl bg-card border border-border/50"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Flame className="w-4 h-4 text-trading" />
                      <span className="text-xs text-muted-foreground">Streak</span>
                    </div>
                    <p className="text-2xl font-semibold">{totalStreak}<span className="text-sm text-muted-foreground ml-1">days</span></p>
                  </motion.div>

                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15 }}
                    className="p-4 rounded-xl bg-card border border-border/50"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-tech" />
                      <span className="text-xs text-muted-foreground">Focus</span>
                    </div>
                    <p className="text-2xl font-semibold">{focusTopics.filter(Boolean).length}<span className="text-sm text-muted-foreground ml-1">/2</span></p>
                  </motion.div>

                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-4 rounded-xl bg-card border border-border/50"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-finance" />
                      <span className="text-xs text-muted-foreground">DSA Solved</span>
                    </div>
                    <p className="text-2xl font-semibold">{completedDSA}<span className="text-sm text-muted-foreground ml-1">problems</span></p>
                  </motion.div>

                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 }}
                    className="p-4 rounded-xl bg-card border border-border/50"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-spiritual" />
                      <span className="text-xs text-muted-foreground">Videos</span>
                    </div>
                    <p className="text-2xl font-semibold">{totalVideos}<span className="text-sm text-muted-foreground ml-1">queued</span></p>
                  </motion.div>
                </div>

                {/* Month Selector */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50">
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
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-5xl mx-auto px-8 py-8 space-y-10">
            {/* Monthly Focus Section */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-medium mb-1">Monthly Focus</h2>
                  <p className="text-sm text-muted-foreground">Choose 2 technologies to master this month</p>
                </div>
              </div>

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
            </section>

            {/* Daily DSA Section */}
            <section>
              <div className="mb-5">
                <h2 className="text-lg font-medium mb-1">Daily DSA Practice</h2>
                <p className="text-sm text-muted-foreground">Consistency beats intensity — solve one problem every day</p>
              </div>
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
