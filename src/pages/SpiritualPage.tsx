import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { BookOpen, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BibleReadingCard } from "@/components/spiritual/BibleReadingCard";
import { ScriptureMemoryCard } from "@/components/spiritual/ScriptureMemoryCard";
import { SpiritualGoalsCard } from "@/components/spiritual/SpiritualGoalsCard";
import { SermonNotesCard } from "@/components/spiritual/SermonNotesCard";
import { SageChat } from "@/components/spiritual/SageChat";
import { useSpiritualGuide } from "@/hooks/useSpiritualGuide";

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

const stats = [
  { label: "Chapters", value: "245" },
  { label: "Verses", value: "18" },
  { label: "Streak", value: "7d" },
];

const SpiritualPage = () => {
  const { messages, isLoading, sendMessage } = useSpiritualGuide();

  return (
    <MainLayout>
      <PageTransition>
        <div className="p-10 max-w-5xl mx-auto">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-muted-foreground" />
              <h1 className="text-4xl font-medium tracking-tight">Spiritual</h1>
            </div>
            <p className="text-muted-foreground">Deepen your faith journey</p>
          </header>

          <div className="grid grid-cols-3 gap-8 mb-10">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-medium tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>

          <Tabs defaultValue="reading" className="space-y-6">
            <TabsList>
              <TabsTrigger value="reading">Reading</TabsTrigger>
              <TabsTrigger value="memory">Memory</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="sage" className="gap-2">
                <MessageSquare className="w-3 h-3" />
                Sage
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reading">
              <BibleReadingCard
                currentBook="Romans"
                currentChapter={8}
                completedChapters={245}
                totalChapters={1189}
                onMarkComplete={() => console.log("Mark complete")}
              />
            </TabsContent>
            <TabsContent value="memory">
              <ScriptureMemoryCard
                verses={mockVerses}
                onReviewComplete={(id, correct) => console.log("Review:", id, correct)}
              />
            </TabsContent>
            <TabsContent value="goals">
              <SpiritualGoalsCard
                goals={mockGoals}
                onAddGoal={() => console.log("Add goal")}
              />
            </TabsContent>
            <TabsContent value="notes">
              <SermonNotesCard
                notes={mockNotes}
                onAddNote={() => console.log("Add note")}
              />
            </TabsContent>
            <TabsContent value="sage">
              <SageChat
                messages={messages}
                onSendMessage={sendMessage}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default SpiritualPage;
