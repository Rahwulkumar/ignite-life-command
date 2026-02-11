import { User, Calendar, ChevronRight, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export interface Character {
  id: string;
  name: string;
  description: string;
}

interface CharacterStudyCardProps {
  characters: Character[];
  currentCharacter?: {
    name: string;
    daysCompleted: number;
    totalDays: number;
    todayScripture: string;
  };
  onSelectCharacter: (character: Character) => void;
  onStartDiscussion: () => void;
  onReadScripture: () => void;
}

export const CharacterStudyCard = ({
  characters,
  currentCharacter,
  onSelectCharacter,
  onStartDiscussion,
  onReadScripture,
}: CharacterStudyCardProps) => {
  const [showPicker, setShowPicker] = useState(!currentCharacter);

  if (showPicker && !currentCharacter) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <User className="w-4 h-4 text-muted-foreground" />
          <p className="font-medium">Choose a Character</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {characters.map((character) => (
            <button
              key={character.id}
              onClick={() => onSelectCharacter(character)}
              className="p-4 rounded-lg border border-border hover:border-foreground/20 transition-colors text-left"
            >
              <p className="font-medium text-sm">{character.name}</p>
              <p className="text-xs text-muted-foreground">{character.description}</p>
            </button>
          ))}
        </div>
      </motion.div>
    );
  }

  const progress = currentCharacter
    ? (currentCharacter.daysCompleted / currentCharacter.totalDays) * 100
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <span className="font-medium">{currentCharacter?.name[0]}</span>
          </div>
          <div>
            <p className="font-medium">{currentCharacter?.name}</p>
            <p className="text-xs text-muted-foreground">30-Day Study</p>
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          Day {currentCharacter?.daysCompleted}/{currentCharacter?.totalDays}
        </span>
      </div>

      <div className="h-1 bg-muted rounded-full mb-6 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-foreground rounded-full"
        />
      </div>

      <div className="space-y-2">
        <button
          onClick={onReadScripture}
          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
        >
          <div>
            <p className="text-sm font-medium">Today's Reading</p>
            <p className="text-xs text-muted-foreground">{currentCharacter?.todayScripture}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>

        <button
          onClick={onStartDiscussion}
          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
        >
          <div>
            <p className="text-sm font-medium">Discuss with Sage</p>
            <p className="text-xs text-muted-foreground">AI-guided conversation</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <button
        onClick={() => setShowPicker(true)}
        className="w-full mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        Change character
      </button>
    </motion.div>
  );
};
