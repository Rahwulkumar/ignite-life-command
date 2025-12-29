import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Music, Plus, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const sessions = [
  { id: 1, date: "Today", duration: "45 min", focus: "Chord progressions", instrument: "Guitar" },
  { id: 2, date: "Yesterday", duration: "30 min", focus: "Scales practice", instrument: "Guitar" },
  { id: 3, date: "Dec 27", duration: "1 hr", focus: "Song learning - Hotel California", instrument: "Guitar" },
  { id: 4, date: "Dec 26", duration: "20 min", focus: "Fingerpicking patterns", instrument: "Guitar" },
];

const stats = [
  { label: "Weekly Practice", value: "3.5h" },
  { label: "Current Focus", value: "Guitar" },
  { label: "Sessions This Week", value: "5" },
];

const MusicPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-music/10">
              <Music className="w-6 h-6 text-music" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Music</h1>
              <p className="text-sm text-muted-foreground">Practice sessions and progress</p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Log Practice
          </Button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="p-5 bg-card rounded-xl border border-border/50">
              <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
              <span className="font-mono text-2xl font-medium">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Practice Sessions */}
        <div className="bg-card rounded-xl border border-border/50">
          <div className="p-5 border-b border-border/50">
            <h2 className="font-medium">Recent Practice</h2>
          </div>
          <div className="divide-y divide-border/50">
            {sessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-music/10 flex items-center justify-center">
                    <Target className="w-4 h-4 text-music" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{session.focus}</p>
                    <p className="text-xs text-muted-foreground">{session.instrument} • {session.date}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {session.duration}
                </span>
              </div>
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default MusicPage;
