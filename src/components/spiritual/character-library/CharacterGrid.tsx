import type { SpiritualCharacter } from "@/hooks/useSpiritualCharacters";
import { CharacterCard } from "./CharacterCard";
import { motion } from "framer-motion";

interface CharacterGridProps {
    characters: SpiritualCharacter[];
    isLoading: boolean;
}

export function CharacterGrid({ characters, isLoading }: CharacterGridProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="h-64 rounded-xl bg-muted/20 animate-pulse" />
                ))}
            </div>
        );
    }

    if (characters.length === 0) {
        return (
            <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed border-border/50">
                <p className="text-muted-foreground">No characters found matching your criteria.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {characters.map((character, index) => (
                <motion.div
                    key={character.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                    <CharacterCard character={character} />
                </motion.div>
            ))}
        </div>
    );
}
