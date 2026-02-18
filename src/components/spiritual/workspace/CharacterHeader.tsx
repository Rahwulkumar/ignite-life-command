import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { SpiritualCharacter } from "@/hooks/useSpiritualCharacters";

interface CharacterHeaderProps {
    character: SpiritualCharacter;
}

export function CharacterHeader({ character }: CharacterHeaderProps) {
    const navigate = useNavigate();

    return (
        <div className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 transition-all duration-300">
            <div className="flex items-center gap-4 px-6 h-16">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 -ml-2 hover:bg-muted"
                    onClick={() => navigate("/spiritual/library")}
                >
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div className="flex flex-col">
                    <h1 className="text-xl font-serif font-medium leading-none tracking-tight">{character.name}</h1>
                    <p className="text-xs text-muted-foreground mt-1 tracking-wide uppercase">Spiritual Character Study</p>
                </div>
            </div>
        </div>
    );
}
