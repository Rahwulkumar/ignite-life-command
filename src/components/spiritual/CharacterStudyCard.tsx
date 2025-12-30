import { User, Calendar, MessageCircle, BookOpen, ChevronRight, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

interface Character {
  id: string;
  name: string;
  description: string;
  image?: string;
}

const popularCharacters: Character[] = [
  { id: "david", name: "David", description: "A man after God's own heart" },
  { id: "moses", name: "Moses", description: "Leader of the Exodus" },
  { id: "joseph", name: "Joseph", description: "From pit to palace" },
  { id: "paul", name: "Paul", description: "Apostle to the Gentiles" },
  { id: "esther", name: "Esther", description: "For such a time as this" },
  { id: "abraham", name: "Abraham", description: "Father of faith" },
];

interface CharacterStudyCardProps {
  currentCharacter?: {
    name: string;
    daysCompleted: number;
    totalDays: number;
    todayScripture: string;
    lastDiscussion?: string;
  };
  onSelectCharacter: (character: Character) => void;
  onStartDiscussion: () => void;
  onReadScripture: () => void;
}

export const CharacterStudyCard = ({
  currentCharacter,
  onSelectCharacter,
  onStartDiscussion,
  onReadScripture,
}: CharacterStudyCardProps) => {
  const [showCharacterPicker, setShowCharacterPicker] = useState(!currentCharacter);

  if (showCharacterPicker && !currentCharacter) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-card border border-border/50 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-spiritual/10">
            <User className="w-5 h-5 text-spiritual" />
          </div>
          <div>
            <h3 className="font-medium">Choose Your Character</h3>
            <p className="text-sm text-muted-foreground">Study one character for 30 days</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {popularCharacters.map((character) => (
            <button
              key={character.id}
              onClick={() => onSelectCharacter(character)}
              className="p-4 rounded-lg bg-muted/30 border border-border/30 hover:border-spiritual/50 hover:bg-spiritual/5 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-spiritual/10 flex items-center justify-center mb-3 group-hover:bg-spiritual/20 transition-colors">
                <span className="text-spiritual font-semibold">{character.name[0]}</span>
              </div>
              <p className="font-medium text-sm">{character.name}</p>
              <p className="text-xs text-muted-foreground">{character.description}</p>
            </button>
          ))}
        </div>

        <button className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-border hover:border-spiritual/50 text-muted-foreground hover:text-spiritual transition-colors text-sm">
          <Plus className="w-4 h-4" />
          Search for another character
        </button>
      </motion.div>
    );
  }

  const progress = currentCharacter
    ? (currentCharacter.daysCompleted / currentCharacter.totalDays) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-card border border-border/50 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-spiritual/10 flex items-center justify-center">
            <span className="text-spiritual font-bold text-lg">
              {currentCharacter?.name[0]}
            </span>
          </div>
          <div>
            <h3 className="font-medium">{currentCharacter?.name}</h3>
            <p className="text-sm text-muted-foreground">30-Day Character Study</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 text-xs">
          <Calendar className="w-3 h-3" />
          Day {currentCharacter?.daysCompleted}/{currentCharacter?.totalDays}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Journey Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-spiritual to-spiritual/60 rounded-full"
          />
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="space-y-3 mb-6">
        <button
          onClick={onReadScripture}
          className="w-full flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border/30 hover:border-spiritual/30 transition-colors text-left group"
        >
          <div className="p-2 rounded-lg bg-spiritual/10 group-hover:bg-spiritual/20 transition-colors">
            <BookOpen className="w-4 h-4 text-spiritual" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Today's Scripture</p>
            <p className="text-xs text-muted-foreground">{currentCharacter?.todayScripture}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-spiritual transition-colors" />
        </button>

        <button
          onClick={onStartDiscussion}
          className="w-full flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border/30 hover:border-spiritual/30 transition-colors text-left group"
        >
          <div className="p-2 rounded-lg bg-spiritual/10 group-hover:bg-spiritual/20 transition-colors">
            <MessageCircle className="w-4 h-4 text-spiritual" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Discuss with Sage</p>
            <p className="text-xs text-muted-foreground">
              {currentCharacter?.lastDiscussion || "Start a conversation about " + currentCharacter?.name}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-spiritual transition-colors" />
        </button>
      </div>

      {/* Change Character */}
      <button
        onClick={() => setShowCharacterPicker(true)}
        className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Change character study
      </button>
    </motion.div>
  );
};
