import { useState } from "react";
import { BookOpen, Plus } from "lucide-react";
import { DomainPageTemplate } from "@/components/shared/DomainPageTemplate";
import { CharacterGrid } from "@/components/spiritual/character-library/CharacterGrid";
import { CharacterFilters } from "@/components/spiritual/character-library/CharacterFilters";
import { AddCharacterDialog } from "@/components/spiritual/character-library/AddCharacterDialog";
import { useSpiritualCharacters } from "@/hooks/useSpiritualCharacters";

export default function CharacterLibraryPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const { data: characters = [], isLoading } = useSpiritualCharacters();

    const filteredCharacters = characters.filter((char) => {
        if (activeFilter === "All") return true;
        if (activeFilter === "Old Testament") return char.testament === "Old";
        if (activeFilter === "New Testament") return char.testament === "New";
        return char.role?.includes(activeFilter);
    });

    return (
        <DomainPageTemplate
            domain={{
                icon: BookOpen,
                title: "Character Library",
                subtitle: "Deepen your understanding by studying the lives of key figures in Scripture.",
                color: "spiritual",
            }}
            stats={[]} // No stats for library yet, or could add character count
            headerAction={{
                icon: Plus,
                label: "Add Character",
                onClick: () => setIsAddDialogOpen(true),
            }}
            tabs={[
                {
                    value: "browsing",
                    label: "Browse",
                    component: (
                        <div className="flex flex-col items-center space-y-8">
                            <CharacterFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
                            <div className="w-full">
                                <CharacterGrid characters={filteredCharacters} isLoading={isLoading} />
                            </div>
                        </div>
                    ),
                },
            ]}
        >
            <AddCharacterDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
        </DomainPageTemplate>
    );
}
