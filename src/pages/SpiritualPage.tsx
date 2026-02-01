import { Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { BookOpen, MessageSquare, Flame, Heart, BookMarked, StickyNote } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BibleReadingCard } from "@/components/spiritual/BibleReadingCard";
import { ScriptureMemoryCard } from "@/components/spiritual/ScriptureMemoryCard";
import { SpiritualGoalsCard } from "@/components/spiritual/SpiritualGoalsCard";
import { SermonNotesCard } from "@/components/spiritual/SermonNotesCard";
import { SageChat } from "@/components/spiritual/SageChat";
import { DevotionReminderCard } from "@/components/spiritual/DevotionReminderCard";
import { CharacterStudyCard } from "@/components/spiritual/CharacterStudyCard";
import { SpiritualJournalCard } from "@/components/spiritual/SpiritualJournalCard";
import { JournalEntryModal } from "@/components/spiritual/JournalEntryModal";
import { useSpiritualGuide } from "@/hooks/useSpiritualGuide";
import { DomainPageHeader } from "@/components/shared/DomainPageHeader";
import { DomainStatsBar } from "@/components/shared/DomainStatsBar";
import { AIChatSidebar } from "@/components/shared/AIChatSidebar";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

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
  { icon: BookOpen, label: "Chapters", value: "245", suffix: "read", color: "text-spiritual" },
  { icon: BookMarked, label: "Verses", value: "18", suffix: "memorized", color: "text-spiritual" },
  { icon: Flame, label: "Streak", value: "7", suffix: "days", color: "text-trading" },
  { icon: Heart, label: "Goals", value: "3", suffix: "active", color: "text-music" },
];

const SpiritualPage = () => {
  const { messages, isLoading, sendMessage } = useSpiritualGuide();
  const [showDevotionReminder, setShowDevotionReminder] = useState(true);
  const [activeTab, setActiveTab] = useState("reading");
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [showSage, setShowSage] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState<{
    name: string;
    daysCompleted: number;
    totalDays: number;
    todayScripture: string;
    lastDiscussion?: string;
  } | undefined>(undefined);

  // Determine time of day for devotion reminder
  const hour = new Date().getHours();
  const timeOfDay: "morning" | "evening" = hour < 12 ? "morning" : "evening";

  const handleSelectCharacter = (character: { id: string; name: string; description: string }) => {
    setCurrentCharacter({
      name: character.name,
      daysCompleted: 1,
      totalDays: 30,
      todayScripture: "1 Samuel 16:1-13",
      lastDiscussion: undefined,
    });
  };

  const handleStartDevotion = () => {
    setShowDevotionReminder(false);
    setActiveTab("reading");
  };

  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen flex">
          <div className="flex-1">
            <DomainPageHeader
              icon={BookOpen}
              title="Spiritual"
              subtitle="Deepen your faith journey"
              domainColor="spiritual"
              action={{
                icon: MessageSquare,
                label: "Ask Sage",
                onClick: () => setShowSage(true),
              }}
            />

            <DomainStatsBar stats={stats} />

            <div className="px-8 pb-8">
              <div className="max-w-5xl mx-auto">
                {/* Devotion Reminder */}
                {showDevotionReminder && (
                  <div className="mb-8">
                    <DevotionReminderCard
                      timeOfDay={timeOfDay}
                      onStartDevotion={handleStartDevotion}
                      onDismiss={() => setShowDevotionReminder(false)}
                    />
                  </div>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                  <TabsList className="flex-wrap">
                    <TabsTrigger value="reading">Reading</TabsTrigger>
                    <TabsTrigger value="character">Character Study</TabsTrigger>
                    <TabsTrigger value="journal">Journal</TabsTrigger>
                    <TabsTrigger value="memory">Memory</TabsTrigger>
                    <TabsTrigger value="goals">Goals</TabsTrigger>
                    <TabsTrigger value="notes" asChild>
                      <Link to="/notes" state={{ domain: 'spiritual' }} className="flex items-center gap-1.5">
                        <StickyNote className="w-3.5 h-3.5" />
                        Notes
                      </Link>
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
                  <TabsContent value="character">
                    <CharacterStudyCard
                      currentCharacter={currentCharacter}
                      onSelectCharacter={handleSelectCharacter}
                      onStartDiscussion={() => setShowSage(true)}
                      onReadScripture={() => setActiveTab("reading")}
                    />
                  </TabsContent>
                  <TabsContent value="journal">
                    <SpiritualJournalCard
                      recentEntries={[]}
                      onNewEntry={() => setIsJournalModalOpen(true)}
                      onViewEntry={(id) => console.log("View entry:", id)}
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
                </Tabs>

                {/* Journal Entry Modal */}
                <JournalEntryModal
                  isOpen={isJournalModalOpen}
                  onClose={() => setIsJournalModalOpen(false)}
                  characterName={currentCharacter?.name}
                  onSave={(entry) => console.log("Save entry:", entry)}
                />
              </div>
            </div>
          </div>

          <Sheet open={showSage} onOpenChange={setShowSage}>
            <SheetContent className="w-full sm:max-w-lg p-0">
              <AIChatSidebar name="Sage" role="Spiritual Guide" domainColor="spiritual">
                <SageChat
                  messages={messages}
                  onSendMessage={sendMessage}
                  isLoading={isLoading}
                />
              </AIChatSidebar>
            </SheetContent>
          </Sheet>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default SpiritualPage;
