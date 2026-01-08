import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { 
  Code2, MessageSquare, Calendar, Flame, ChevronLeft, ChevronRight,
  Zap, Target, TrendingUp
} from "lucide-react";
import { AtlasChat } from "@/components/tech/AtlasChat";
import { MonthlyFocusSlot, FocusTopic } from "@/components/tech/MonthlyFocusSlot";
import { DailyDSASection, DSAProblem } from "@/components/tech/DailyDSASection";
import { DomainPageHeader } from "@/components/shared/DomainPageHeader";
import { DomainStatsBar } from "@/components/shared/DomainStatsBar";
import { AIChatSidebar } from "@/components/shared/AIChatSidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

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

  const stats = [
    { icon: Flame, label: "Streak", value: totalStreak, suffix: "days", color: "text-trading" },
    { icon: Target, label: "Focus", value: `${focusTopics.filter(Boolean).length}/2`, color: "text-tech" },
    { icon: Zap, label: "DSA Solved", value: completedDSA, suffix: "problems", color: "text-finance" },
    { icon: TrendingUp, label: "Videos", value: totalVideos, suffix: "queued", color: "text-spiritual" },
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

          {/* Month Selector */}
          <div className="px-8 pb-6">
            <div className="max-w-5xl mx-auto">
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

          {/* Main Content */}
          <div className="max-w-5xl mx-auto px-8 pb-8 space-y-10">
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
