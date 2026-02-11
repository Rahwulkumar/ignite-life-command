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
import { AddGoalDialog } from "@/components/spiritual/AddGoalDialog";
import { toast } from "@/hooks/use-toast";
import { useBibleReadingPlan, useUpdateBibleProgress, useCreateBiblePlan } from "@/hooks/useBibleReading";
import { useScriptureVerses, useUpdateVerseProgress } from "@/hooks/useScriptureMemory";
import { useSpiritualGoals, useAddSpiritualGoal, useUpdateGoalProgress } from "@/hooks/useSpiritualGoals";
import { useSpiritualJournal, useAddJournalEntry } from "@/hooks/useSpiritualJournal";

const SpiritualPage = () => {
  const [showDevotionReminder, setShowDevotionReminder] = useState(true);
  const [activeTab, setActiveTab] = useState("reading");
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
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

  // -- HOOKS --
  const { data: biblePlan } = useBibleReadingPlan();
  const updateBibleProgress = useUpdateBibleProgress();
  const createBiblePlan = useCreateBiblePlan(); // In case no plan exists

  const { data: verses = [] } = useScriptureVerses();
  const updateVerseProgress = useUpdateVerseProgress();

  const { data: goals = [] } = useSpiritualGoals();
  const addGoal = useAddSpiritualGoal();
  // const updateGoalProgress = useUpdateGoalProgress(); // Hook exists but not currently used in UI

  const { data: journalEntries = [] } = useSpiritualJournal();
  const addJournalEntry = useAddJournalEntry();

  // -- DATA MAPPING --
  const mappedGoals = goals.map(g => ({
    id: g.id,
    title: g.title,
    progress: g.progress,
    isCompleted: g.is_completed,
    category: g.category || "growth",
  }));

  const mappedVerses = verses.map(v => ({
    id: v.id,
    reference: v.reference,
    verseText: v.verse_text,
    masteryLevel: v.mastery_level,
  }));

  const mappedEntries = journalEntries.map(e => ({
    id: e.id,
    date: e.created_at || new Date().toISOString(),
    // @ts-ignore - content is Json type but we know structure
    excerpt: e.title || (e.content?.body ? String(e.content.body).substring(0, 50) + "..." : "No content"),
    characterName: undefined // Not stored in current separate field, could be added to metadata
  }));

  const stats = [
    { icon: BookOpen, label: "Chapters", value: biblePlan?.completed_chapters.toString() || "0", suffix: "read", color: "text-spiritual" },
    { icon: BookMarked, label: "Verses", value: verses.length.toString(), suffix: "memorized", color: "text-spiritual" },
    { icon: Flame, label: "Streak", value: "0", suffix: "days", color: "text-trading" }, // Streak logic to be implemented
    { icon: Heart, label: "Goals", value: goals.filter(g => !g.is_completed).length.toString(), suffix: "active", color: "text-music" },
  ];

  // -- HANDLERS --

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
    if (!biblePlan) {
      // Create default plan if none exists
      createBiblePlan.mutate({ name: "One Year Bible", totalChapters: 1189 }); // 1189 chapters in Bible
      toast({ title: "Reading Plan Created", description: "Started a new Bible reading plan." });
      return;
    }

    // Increment chapter
    const newCount = (biblePlan.completed_chapters || 0) + 1;
    updateBibleProgress.mutate({
      id: biblePlan.id,
      completedChapters: newCount,
    });

    toast({
      title: "Chapter Completed",
      description: "Great job! Your reading progress has been updated.",
    });
  };

  const handleViewEntry = (id: string) => {
    // In future: Open modal with entry details
    // For now find entry and show toast
    const entry = journalEntries.find(e => e.id === id);
    if (!entry) return;

    // Retrieve body from JSON content if structure matches
    // @ts-ignore
    const body = entry.content?.body || "No content";

    toast({
      title: entry.title,
      description: body.substring(0, 100) + (body.length > 100 ? "..." : ""),
    });
  };

  const handleReviewComplete = (id: string, correct: boolean) => {
    // Determine mastery level change
    const verse = verses.find(v => v.id === id);
    if (!verse) return;

    let newLevel = verse.mastery_level;
    if (correct && newLevel < 5) newLevel++;
    if (!correct && newLevel > 0) newLevel--; // Only decrease if not correct? Or reset? Logic choice.

    updateVerseProgress.mutate({ id, masteryLevel: newLevel, correct });

    toast({
      title: correct ? "Correct!" : "Keep Practicing",
      description: correct
        ? "Your mastery level has increased."
        : "Review this verse again tomorrow.",
    });
  };

  const handleAddGoal = () => {
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = (goal: { title: string; category: string; targetDate?: Date }) => {
    addGoal.mutate(goal);
    toast({
      title: "Goal Added",
      description: "Your new spiritual goal has been set.",
    });
  };

  const handleSaveJournalEntry = (data: {
    characterInsights: string;
    attributesOfGod: string[];
    scriptureMeditation: string;
    personalReflection: string;
    prayerPoints: string[];
  }) => {
    // Format the structured data into a single content string for the note
    const content = `
## Character Insights
${data.characterInsights}

## Attributes of God
${data.attributesOfGod.join(", ")}

## Scripture Meditation
${data.scriptureMeditation}

## Personal Reflection
${data.personalReflection}

## Prayer Points
${data.prayerPoints.map(p => `- ${p}`).join("\n")}
    `.trim();

    const title = `Journal: ${data.attributesOfGod[0] || "Reflection"} - ${new Date().toLocaleDateString()}`;

    addJournalEntry.mutate({ title, content });
    toast({
      title: "Journal Entry Saved",
      description: "Your reflection has been saved successfully.",
    });
    setIsJournalModalOpen(false);
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
              currentBook={biblePlan?.current_book || "Genesis"}
              currentChapter={biblePlan?.current_chapter || 1}
              completedChapters={biblePlan?.completed_chapters || 0}
              totalChapters={biblePlan?.total_chapters || 1189}
              onMarkComplete={handleMarkComplete}
            />
          ),
        },
        {
          value: "character",
          label: "Character Study",
          component: (
            <CharacterStudyCard
              characters={[
                { id: "david", name: "David", description: "A man after God's own heart" },
                { id: "moses", name: "Moses", description: "Leader of the Exodus" },
                { id: "joseph", name: "Joseph", description: "From pit to palace" },
                { id: "paul", name: "Paul", description: "Apostle to the Gentiles" },
                { id: "esther", name: "Esther", description: "For such a time as this" },
                { id: "abraham", name: "Abraham", description: "Father of faith" },
              ]}
              currentCharacter={currentCharacter}
              onSelectCharacter={handleSelectCharacter}
              onStartDiscussion={() => { /* Open AI side? */ }}
              onReadScripture={() => setActiveTab("reading")}
            />
          ),
        },
        {
          value: "journal",
          label: "Journal",
          component: (
            <SpiritualJournalCard
              recentEntries={mappedEntries}
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
              verses={mappedVerses}
              onReviewComplete={handleReviewComplete}
            />
          ),
        },
        {
          value: "goals",
          label: "Goals",
          component: (
            <SpiritualGoalsCard
              goals={mappedGoals}
              onAddGoal={handleAddGoal}
            />
          ),
        },
      ]}
      aiCoach={{
        name: "Sage",
        role: "Spiritual Guide",
        component: (
          <SageChat />
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

      {/* Add Goal Dialog */}
      <AddGoalDialog
        open={isGoalModalOpen}
        onOpenChange={setIsGoalModalOpen}
        onSave={handleSaveGoal}
      />
    </DomainPageTemplate>
  );
};

export default SpiritualPage;
