import { Calendar, User, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SpiritualCharacter } from "@/hooks/useSpiritualCharacters";
import { useNavigate } from "react-router-dom";
import { useDeleteCharacter } from "@/hooks/useSpiritualCharacters";
import { toast } from "@/hooks/use-toast";

interface CharacterCardProps {
    character: SpiritualCharacter;
}

export function CharacterCard({ character }: CharacterCardProps) {
    const navigate = useNavigate();
    const deleteCharacter = useDeleteCharacter();

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Are you sure you want to delete "${character.name}"? This action cannot be undone.`)) {
            deleteCharacter.mutate(character.id, {
                onSuccess: () => {
                    toast({
                        title: "Character deleted",
                        description: `${character.name} has been removed from your library.`,
                        variant: "spiritual" as any,
                    });
                },
                onError: (error) => {
                    toast({
                        title: "Error deleting character",
                        description: error.message,
                        variant: "destructive",
                    });
                },
            });
        }
    };

    return (
        <Card
            className="group hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm"
            onClick={() => navigate(`/spiritual/character/${character.id}`)}
        >
            <div className="h-32 w-full bg-gradient-to-br from-spiritual/20 to-spiritual/5 relative overflow-hidden">
                {/* Placeholder pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-spiritual via-background to-background" />
                <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-md shadow-sm border-0">
                        {character.role || "Character"}
                    </Badge>
                </div>
            </div>

            <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-medium tracking-tight text-foreground group-hover:text-primary transition-colors">
                        {character.name}
                    </h3>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            {character.testament}
                        </Badge>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={handleDelete}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-4 pb-4">
                <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {character.description || "No description available."}
                </p>
            </CardContent>
        </Card>
    );
}
