import { useState } from "react";
import { BookOpen, Brain, Target } from "lucide-react";
import { DomainPageTemplate } from "@/components/shared/DomainPageTemplate";
import { BibleReadingCard } from "@/components/spiritual/BibleReadingCard";
import { DailyFocusCard } from "@/components/spiritual/DailyFocusCard";
import { CharacterStudyCard } from "@/components/spiritual/CharacterStudyCard";
import { SpiritualJournalCard } from "@/components/spiritual/SpiritualJournalCard";
import { JournalEntryModal } from "@/components/spiritual/JournalEntryModal";
import { SageChat } from "@/components/spiritual/SageChat";
import { ScriptureMemoryCard } from "@/components/spiritual/ScriptureMemoryCard";
import { SpiritualGoalsCard } from "@/components/spiritual/SpiritualGoalsCard";
import { AddGoalDialog } from "@/components/spiritual/AddGoalDialog";
import { toast } from "@/hooks/use-toast";

import {
  useBibleReadingPlan,
  useUpdateBibleProgress,
  useCreateBiblePlan,
} from "@/hooks/useBibleReading";
import {
  useScriptureVerses,
  useUpdateVerseProgress,
} from "@/hooks/useScriptureMemory";
import {
  useSpiritualJournal,
  useAddJournalEntry,
} from "@/hooks/useSpiritualJournal";
import {
  useSpiritualGoals,
  useAddSpiritualGoal,
} from "@/hooks/useSpiritualGoals";
import { calculateReadingProgress } from "@/lib/bibleBooks";
import { BookMarked, Flame } from "lucide-react";

const SpiritualPage = () => {
  const [activeTab, setActiveTab] = useState("reading");
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);

  const hour = new Date().getHours();

  // ── Hooks ─────────────────────────────────────────────────
  const { data: biblePlan, refetch: refetchBiblePlan } = useBibleReadingPlan();
  const updateBibleProgress = useUpdateBibleProgress();
  const createBiblePlan = useCreateBiblePlan();

  const { data: verses = [] } = useScriptureVerses();
  const updateVerseProgress = useUpdateVerseProgress();

  const { data: journalEntries = [] } = useSpiritualJournal();
  const addJournalEntry = useAddJournalEntry();

  const { data: goals = [] } = useSpiritualGoals();
  const addGoal = useAddSpiritualGoal();

  // ── Data Mapping ───────────────────────────────────────────
  interface JournalEntryContent {
    body?: string;
  }

  // FIX BUG 9: Use camelCase field names matching Drizzle output
  const readingProgress = biblePlan
    ? calculateReadingProgress(
        biblePlan.currentBook ?? "Genesis",
        biblePlan.currentChapter ?? 1,
        biblePlan.currentVerse ?? 1,
      )
    : 0;

  const mappedVerses = verses.map((v) => ({
    id: v.id,
    reference: v.reference,
    verseText: v.verse_text,
    masteryLevel: v.mastery_level,
  }));

  const mappedEntries = journalEntries.map((e) => {
    const content = e.content as unknown as JournalEntryContent;
    return {
      id: e.id,
      date: e.created_at || new Date().toISOString(),
      excerpt:
        e.title ||
        (content?.body
          ? String(content.body).substring(0, 50) + "..."
          : "No content"),
      characterName: undefined,
    };
  });

  const mappedGoals = goals.map((g) => ({
    id: g.id,
    title: g.title,
    progress: g.progress ?? 0,
    isCompleted: g.is_completed ?? false,
    category: g.category ?? "general",
  }));

  const stats = [
    {
      icon: BookOpen,
      label: "Reading",
      value: readingProgress.toFixed(0),
      suffix: "%",
      color: "text-spiritual",
    },
    {
      icon: BookMarked,
      label: "Verses",
      value: verses.length.toString(),
      suffix: "memorized",
      color: "text-spiritual",
    },
    {
      icon: Flame,
      label: "Streak",
      value: "0",
      suffix: "days",
      color: "text-trading",
    },
  ];

  // ── Handlers ──────────────────────────────────────────────

  const handleUpdateReading = async (
    book: string,
    chapter: number,
    verse: number,
  ) => {
    if (!biblePlan) {
      createBiblePlan.mutate(
        { bookName: book, chapter, verse },
        {
          onSuccess: () => {
            refetchBiblePlan();
            toast({
              title: "Reading Plan Started",
              description: `Tracking ${book} - Ch ${chapter}:${verse}`,
            });
          },
        },
      );
      return;
    }
    updateBibleProgress.mutate(
      {
        id: biblePlan.id,
        currentBook: book,
        currentChapter: chapter,
        currentVerse: verse,
      },
      {
        onSuccess: () => {
          refetchBiblePlan();
          toast({
            title: "Progress Updated",
            description: `${book} — Ch ${chapter}, Vs ${verse}`,
          });
        },
      },
    );
  };

  const handleViewEntry = (id: string) => {
    const entry = journalEntries.find((e) => e.id === id);
    if (!entry) return;
    const content = entry.content as unknown as JournalEntryContent;
    const body = content?.body || "No content";
    toast({
      title: entry.title,
      description: body.substring(0, 100) + (body.length > 100 ? "..." : ""),
    });
  };

  const handleReviewComplete = (id: string, correct: boolean) => {
    const verse = verses.find((v) => v.id === id);
    if (!verse) return;
    let newLevel = verse.mastery_level ?? 0;
    if (correct && newLevel < 5) newLevel++;
    if (!correct && newLevel > 0) newLevel--;
    updateVerseProgress.mutate({ id, masteryLevel: newLevel, correct });
    toast({
      title: correct ? "Correct! 🎉" : "Keep Practicing",
      description: correct
        ? "Mastery level increased."
        : "Review this verse again tomorrow.",
    });
  };

  const handleSaveJournalEntry = (data: {
    characterInsights: string;
    attributesOfGod: string[];
    scriptureMeditation: string;
    personalReflection: string;
    prayerPoints: string[];
  }) => {
    const content =
      `## Character Insights\n${data.characterInsights}\n\n## Attributes of God\n${data.attributesOfGod.join(", ")}\n\n## Scripture Meditation\n${data.scriptureMeditation}\n\n## Personal Reflection\n${data.personalReflection}\n\n## Prayer Points\n${data.prayerPoints.map((p) => `- ${p}`).join("\n")}`.trim();
    const title = `Reflection: ${data.attributesOfGod[0] || "Journal"} — ${new Date().toLocaleDateString()}`;
    addJournalEntry.mutate({ title, content });
    toast({
      title: "Journal Entry Saved",
      description: "Your reflection has been saved.",
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
              currentBook={biblePlan?.currentBook ?? "Genesis"}
              currentChapter={biblePlan?.currentChapter ?? 1}
              currentVerse={biblePlan?.currentVerse ?? 1}
              onUpdate={handleUpdateReading}
            />
          ),
        },
        // FIX BUG 2: Scripture Memory tab was built but never shown
        {
          value: "memory",
          label: "Scripture Memory",
          component: (
            <ScriptureMemoryCard
              verses={mappedVerses}
              onReviewComplete={handleReviewComplete}
            />
          ),
        },
        {
          value: "character",
          label: "Character Study",
          component: <CharacterStudyCard />,
        },
        // FIX BUG 3: Spiritual Goals tab was built but never shown
        {
          value: "goals",
          label: "Goals",
          component: (
            <SpiritualGoalsCard
              goals={mappedGoals}
              onAddGoal={() => setIsGoalDialogOpen(true)}
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
      ]}
      aiCoach={{
        name: "Sage",
        role: "Spiritual Guide",
        component: <SageChat />,
      }}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* Daily Focus */}
      <div className="mb-8">
        <DailyFocusCard />
      </div>

      {/* Journal Entry Modal */}
      <JournalEntryModal
        isOpen={isJournalModalOpen}
        onClose={() => setIsJournalModalOpen(false)}
        characterName={undefined}
        onSave={handleSaveJournalEntry}
      />

      {/* Add Goal Dialog */}
      <AddGoalDialog
        open={isGoalDialogOpen}
        onOpenChange={setIsGoalDialogOpen}
        onSave={({ title, category, targetDate }) => {
          addGoal.mutate({ title, category, targetDate });
          toast({
            title: "Goal Added",
            description: `"${title}" added to your spiritual goals.`,
          });
        }}
      />
    </DomainPageTemplate>
  );
};

export default SpiritualPage;
