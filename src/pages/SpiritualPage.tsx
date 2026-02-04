import { useState, useEffect } from "react";
import { BookOpen, Flame, Heart, BookMarked } from "lucide-react";
import { DomainPageTemplate } from "@/components/shared/DomainPageTemplate";
import { BibleReadingCard } from "@/components/spiritual/BibleReadingCard";
import { ScriptureMemoryCard } from "@/components/spiritual/ScriptureMemoryCard";
import { SpiritualGoalsCard } from "@/components/spiritual/SpiritualGoalsCard";
import { DevotionReminderCard } from "@/components/spiritual/DevotionReminderCard";
import { CharacterStudyCard } from "@/components/spiritual/CharacterStudyCard";
import { SpiritualJournalCard } from "@/components/spiritual/SpiritualJournalCard";
import { JournalEntryModal } from "@/components/spiritual/JournalEntryModal";
import { SageChat } from "@/components/spiritual/SageChat";
import { useSpiritualGuide } from "@/hooks/useSpiritualGuide";
import { toast } from "@/hooks/use-toast";
import { spiritualMockData } from "@/lib/mockData";

// Use centralized mock data
const { verses: mockVerses, goals: mockGoals, bibleReading } = spiritualMockData;

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
    toast({
      title: "Character Study Started",
      description: `Starting 30-day study of ${character.name}`,
    });
  };

  const handleStartDevotion = () => {
    setShowDevotionReminder(false);
    setActiveTab("reading");
  };

  const handleMarkComplete = () => {
    toast({
      title: "Chapter Completed",
      description: "Great job! Your reading progress has been updated.",
    });
    // TODO: Implement actual chapter completion logic with Supabase
  };

  const handleViewEntry = (id: string) => {
    toast({
      title: "Opening Journal Entry",
      description: `Loading entry ${id}...`,
    });
    // TODO: Implement journal entry viewing
  };

  const handleReviewComplete = (id: string, correct: boolean) => {
    toast({
      title: correct ? "Correct!" : "Keep Practicing",
      description: correct
        ? "Your mastery level has increased."
        : "Review this verse again tomorrow.",
    });
    // TODO: Implement spaced repetition logic
  };

  const handleAddGoal = () => {
    toast({
      title: "Add New Goal",
      description: "Goal creation feature coming soon.",
    });
    // TODO: Implement goal creation
  };

  const handleSaveJournalEntry = (entry: {
    title: string;
    content: string;
    characterName?: string;
  }) => {
    toast({
      title: "Journal Entry Saved",
      description: "Your reflection has been saved successfully.",
    });
    setIsJournalModalOpen(false);
    // TODO: Implement journal entry saving to Supabase
  };

  return (
    <DomainPageTemplate
      domain={{
        icon: BookOpen,
        title: "Spiritual",
        subtitle: "Deepen your faith journey",
        color: "spiritual",
      }}
      stats={stats}
      tabs={[
        {
          value: "reading",
          label: "Reading",
          component: (
            <BibleReadingCard
              currentBook={bibleReading.currentBook}
              currentChapter={bibleReading.currentChapter}
              completedChapters={bibleReading.completedChapters}
              totalChapters={bibleReading.totalChapters}
              onMarkComplete={handleMarkComplete}
            />
          ),
        },
        {
          value: "character",
          label: "Character Study",
          component: (
            <CharacterStudyCard
              currentCharacter={currentCharacter}
              onSelectCharacter={handleSelectCharacter}
              onStartDiscussion={() => { }} // Opens AI chat sidebar
              onReadScripture={() => setActiveTab("reading")}
            />
          ),
        },
        {
          value: "journal",
          label: "Journal",
          component: (
            <SpiritualJournalCard
              recentEntries={[]}
              onNewEntry={() => setIsJournalModalOpen(true)}
              onViewEntry={handleViewEntry}
            />
          ),
        },
        {
          value: "memory",
          label: "Memory",
          component: (
            <ScriptureMemoryCard
              verses={mockVerses}
              onReviewComplete={handleReviewComplete}
            />
          ),
        },
        {
          value: "goals",
          label: "Goals",
          component: (
            <SpiritualGoalsCard
              goals={mockGoals}
              onAddGoal={handleAddGoal}
            />
          ),
        },
      ]}
      aiCoach={{
        name: "Sage",
        role: "Spiritual Guide",
        component: (
          <SageChat
            messages={messages}
            onSendMessage={sendMessage}
            isLoading={isLoading}
          />
        ),
      }}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* Devotion Reminder - shown before tabs */}
      {showDevotionReminder && (
        <div className="mb-8">
          <DevotionReminderCard
            timeOfDay={timeOfDay}
            onStartDevotion={handleStartDevotion}
            onDismiss={() => setShowDevotionReminder(false)}
          />
        </div>
      )}

      {/* Journal Entry Modal */}
      <JournalEntryModal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
        characterName={currentCharacter?.name}
        onSave={handleSaveJournalEntry}
      />
    </DomainPageTemplate>
  );
};

export default SpiritualPage;
