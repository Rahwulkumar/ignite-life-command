import { Music2, CheckCircle2, Circle, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Song {
  id: number;
  title: string;
  artist: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status: "mastered" | "learning" | "queued";
  progress: number;
}

const mockRepertoire: Song[] = [
  { id: 1, title: "Wonderwall", artist: "Oasis", difficulty: "Beginner", status: "mastered", progress: 100 },
  { id: 2, title: "Hotel California", artist: "Eagles", difficulty: "Intermediate", status: "learning", progress: 75 },
  { id: 3, title: "Stairway to Heaven", artist: "Led Zeppelin", difficulty: "Intermediate", status: "learning", progress: 40 },
  { id: 4, title: "Blackbird", artist: "The Beatles", difficulty: "Intermediate", status: "queued", progress: 0 },
  { id: 5, title: "Classical Gas", artist: "Mason Williams", difficulty: "Advanced", status: "queued", progress: 0 },
];

export function RepertoireCard() {
  const mastered = mockRepertoire.filter(s => s.status === "mastered").length;
  const learning = mockRepertoire.filter(s => s.status === "learning").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground">Repertoire</h2>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
          <Plus className="w-3 h-3" />
          Add Song
        </Button>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-finance" />
          <span className="text-sm">{mastered} mastered</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-music" />
          <span className="text-sm">{learning} learning</span>
        </div>
      </div>

      {/* Song List */}
      <div className="space-y-0">
        {mockRepertoire.map((song) => (
          <div
            key={song.id}
            className="py-4 border-b border-border/50"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {song.status === "mastered" ? (
                  <CheckCircle2 className="w-5 h-5 text-finance" />
                ) : song.status === "learning" ? (
                  <Clock className="w-5 h-5 text-music" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">{song.title}</p>
                  <p className="text-xs text-muted-foreground">{song.artist}</p>
                </div>
              </div>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded",
                song.difficulty === "Beginner" ? "text-finance bg-finance/10" :
                song.difficulty === "Intermediate" ? "text-music bg-music/10" :
                "text-destructive bg-destructive/10"
              )}>
                {song.difficulty}
              </span>
            </div>
            {song.status === "learning" && (
              <div className="flex items-center gap-3 ml-8">
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-music rounded-full"
                    style={{ width: `${song.progress}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">{song.progress}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
