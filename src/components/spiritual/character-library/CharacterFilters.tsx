import { Button } from "@/components/ui/button";

interface CharacterFiltersProps {
    activeFilter: string;
    onFilterChange: (filter: string) => void;
}

export function CharacterFilters({ activeFilter, onFilterChange }: CharacterFiltersProps) {
    const filters = ["All", "Old Testament", "New Testament", "King", "Prophet", "Apostle"];

    return (
        <div className="flex flex-wrap gap-2 pb-6">
            {filters.map((filter) => (
                <Button
                    key={filter}
                    variant={activeFilter === filter ? "default" : "outline"}
                    size="sm"
                    onClick={() => onFilterChange(filter)}
                    className={`rounded-full transition-all duration-300 ${activeFilter === filter
                            ? "bg-spiritual hover:bg-spiritual/90 text-white shadow-md hover:shadow-lg"
                            : "hover:bg-spiritual/10 hover:text-spiritual hover:border-spiritual/30"
                        }`}
                >
                    {filter}
                </Button>
            ))}
        </div>
    );
}
