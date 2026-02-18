import { useState, useEffect } from "react";
import { BookOpen, Flame, Heart, BookMarked } from "lucide-react";
import { DomainPageTemplate } from "@/components/shared/DomainPageTemplate";
import { BibleReadingCard } from "@/components/spiritual/BibleReadingCard";

import { DailyFocusCard } from "@/components/spiritual/DailyFocusCard";
import { CharacterStudyCard } from "@/components/spiritual/CharacterStudyCard";
import { SpiritualJournalCard } from "@/components/spiritual/SpiritualJournalCard";
import { JournalEntryModal } from "@/components/spiritual/JournalEntryModal";
import { SageChat } from "@/components/spiritual/SageChat";


import { toast } from "@/hooks/use-toast";
import { useBibleReadingPlan, useUpdateBibleProgress, useCreateBiblePlan } from "@/hooks/useBibleReading";
import { useScriptureVerses, useUpdateVerseProgress } from "@/hooks/useScriptureMemory";

import { useSpiritualJournal, useAddJournalEntry } from "@/hooks/useSpiritualJournal";


import { calculateReadingProgress } from "@/lib/bibleBooks";

const SpiritualPage = () => {
  const [showDevotionReminder, setShowDevotionReminder] = useState(true);
  const [activeTab, setActiveTab] = useState("reading");
  const [isJournalModalOpen, setIsJournalModalOpen] = useState(false);
  // Legacy character state removed


  // Determine time of day for devotion reminder
  const hour = new Date().getHours();
  const timeOfDay: "morning" | "evening" = hour < 12 ? "morning" : "evening";

  // -- HOOKS --
  const { data: biblePlan, refetch: refetchBiblePlan } = useBibleReadingPlan();
  const updateBibleProgress = useUpdateBibleProgress();
  const createBiblePlan = useCreateBiblePlan(); // In case no plan exists

  const { data: verses = [] } = useScriptureVerses();
  const updateVerseProgress = useUpdateVerseProgress();



  const { data: journalEntries = [] } = useSpiritualJournal();
  const addJournalEntry = useAddJournalEntry();

  // -- DATA MAPPING --
  interface JournalEntryContent {
    body?: string;
  }



  const mappedVerses = verses.map(v => ({
    id: v.id,
    reference: v.reference,
    verseText: v.verse_text,
    masteryLevel: v.mastery_level,
  }));

  const mappedEntries = journalEntries.map(e => {
    const content = e.content as unknown as JournalEntryContent;
    return {
      id: e.id,
      date: e.created_at || new Date().toISOString(),
      excerpt: e.title || (content?.body ? String(content.body).substring(0, 50) + "..." : "No content"),
      characterName: undefined
    };
  });

  // Calculate reading progress percentage
  const readingProgress = biblePlan
    ? calculateReadingProgress(
      biblePlan.current_book || 'Genesis',
      biblePlan.current_chapter || 1,
      biblePlan.current_verse || 1
    )
    : 0;

  const stats = [
    { icon: BookOpen, label: "Reading", value: readingProgress.toFixed(0), suffix: "%", color: "text-spiritual" },
    { icon: BookMarked, label: "Verses", value: verses.length.toString(), suffix: "memorized", color: "text-spiritual" },
    { icon: Flame, label: "Streak", value: "0", suffix: "days", color: "text-trading" },
  ];

  // -- HANDLERS --

  // Legacy character handler removed

  const handleStartDevotion = () => {
    setShowDevotionReminder(false);
    setActiveTab("reading");
  };

  const handleUpdateReading = async (book: string, chapter: number, verse: number) => {
    if (!biblePlan) {
      // Create plan with initial data
      createBiblePlan.mutate({
        bookName: book,
        chapter: chapter,
        verse: verse,
      }, {
        onSuccess: () => {
          refetchBiblePlan();
          toast({
            title: "Reading Plan Started",
            description: `Tracking ${book} - Chapter ${chapter}, Verse ${verse}`
          });
        }
      });
      return;
    }

    // Update existing plan
    updateBibleProgress.mutate({
      id: biblePlan.id,
      currentBook: book,
      currentChapter: chapter,
      currentVerse: verse,
    }, {
      onSuccess: () => {
        refetchBiblePlan();
        toast({
          title: "Progress Updated",
          description: `${book} - Chapter ${chapter}, Verse ${verse}`,
        });
      }
    });
  };

  const handleViewEntry = (id: string) => {
    // In future: Open modal with entry details
    // For now find entry and show toast
    const entry = journalEntries.find(e => e.id === id);
    if (!entry) return;

    // Retrieve body from JSON content if structure matches
    const content = entry.content as unknown as JournalEntryContent;
    const body = content?.body || "No content";

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
              currentVerse={biblePlan?.current_verse || 1}
              onUpdate={handleUpdateReading}
            />
          ),
        },
        {
          value: "character",
          label: "Character Study",
          component: (
            <CharacterStudyCard />
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
        component: (
          <SageChat />
        ),
      }}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {/* Daily Focus - Replaces Devotion Reminder */}
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


      {/* DEBUG TOOL: Remove after fixing */}
      <div className="mt-8">

      </div>

    </DomainPageTemplate>
  );
};

export default SpiritualPage;
