import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { BookOpen, Sparkles } from "lucide-react";
import { BibleReadingCard } from "@/components/spiritual/BibleReadingCard";
import { ScriptureMemoryCard } from "@/components/spiritual/ScriptureMemoryCard";
import { SpiritualGoalsCard } from "@/components/spiritual/SpiritualGoalsCard";
import { SermonNotesCard } from "@/components/spiritual/SermonNotesCard";
import { SageChat } from "@/components/spiritual/SageChat";
import { useSpiritualGuide } from "@/hooks/useSpiritualGuide";
import { motion } from "framer-motion";

// Mock data - replace with real data from Supabase
const mockVerses = [
  {
    id: "1",
    reference: "Romans 8:28",
    verseText: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    masteryLevel: 3,
  },
  {
    id: "2",
    reference: "Philippians 4:13",
    verseText: "I can do all this through him who gives me strength.",
    masteryLevel: 4,
  },
  {
    id: "3",
    reference: "Jeremiah 29:11",
    verseText: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
    masteryLevel: 2,
  },
];

const mockGoals = [
  { id: "1", title: "Read through Psalms", progress: 65, isCompleted: false, category: "reading" },
  { id: "2", title: "Memorize Romans 8", progress: 40, isCompleted: false, category: "memory" },
  { id: "3", title: "Daily morning prayer", progress: 80, isCompleted: false, category: "prayer" },
];

const mockNotes = [
  { id: "1", title: "The Power of Faith", speaker: "Pastor John", date: "2024-12-29" },
  { id: "2", title: "Walking in Love", speaker: "Pastor Sarah", date: "2024-12-22" },
  { id: "3", title: "Christmas Message", speaker: "Pastor John", date: "2024-12-25" },
];

const SpiritualPage = () => {
  const { messages, isLoading, sendMessage } = useSpiritualGuide();

  return (
    <MainLayout>
      <PageTransition>
        <div className="relative min-h-screen">
          {/* Ambient background effects */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-spiritual/5 rounded-full blur-[100px] animate-breathe" />
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-spiritual/5 rounded-full blur-[100px] animate-breathe" style={{ animationDelay: "2s" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-spiritual/3 rounded-full blur-[150px] animate-float" />
          </div>

          <div className="relative p-8 lg:p-12 max-w-7xl mx-auto">
            {/* Header */}
            <motion.header
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-spiritual/10">
                  <BookOpen className="w-5 h-5 text-spiritual" />
                </div>
                <h1 className="text-3xl font-medium tracking-tight">Spiritual</h1>
              </div>
              <p className="text-muted-foreground ml-12">Deepen your faith journey</p>
            </motion.header>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left column - Tracking cards */}
              <div className="space-y-6">
                <BibleReadingCard
                  currentBook="Romans"
                  currentChapter={8}
                  completedChapters={245}
                  totalChapters={1189}
                  onMarkComplete={() => console.log("Mark complete")}
                />

                <ScriptureMemoryCard
                  verses={mockVerses}
                  onReviewComplete={(id, correct) => console.log("Review:", id, correct)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <SpiritualGoalsCard
                    goals={mockGoals}
                    onAddGoal={() => console.log("Add goal")}
                  />
                  <SermonNotesCard
                    notes={mockNotes}
                    onAddNote={() => console.log("Add note")}
                  />
                </div>
              </div>

              {/* Right column - Sage AI Chat */}
              <div>
                <SageChat
                  messages={messages}
                  onSendMessage={sendMessage}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default SpiritualPage;
