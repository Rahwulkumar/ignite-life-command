import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Music, Plus, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const sessions = [
  { id: 1, date: "Today", duration: "45 min", focus: "Chord progressions", instrument: "Guitar" },
  { id: 2, date: "Yesterday", duration: "30 min", focus: "Scales practice", instrument: "Guitar" },
  { id: 3, date: "Dec 27", duration: "1 hr", focus: "Song learning - Hotel California", instrument: "Guitar" },
  { id: 4, date: "Dec 26", duration: "20 min", focus: "Fingerpicking patterns", instrument: "Guitar" },
];

const stats = [
  { label: "Weekly", value: "3.5h" },
  { label: "Focus", value: "Guitar" },
  { label: "Sessions", value: "5" },
];

const MusicPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="p-10 max-w-4xl mx-auto">
          <header className="flex items-center justify-between mb-16">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Music className="w-5 h-5 text-muted-foreground" />
                <h1 className="text-4xl font-medium tracking-tight">Music</h1>
              </div>
              <p className="text-muted-foreground">Practice sessions and progress</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Log Practice
            </Button>
          </header>

          <div className="grid grid-cols-3 gap-8 mb-16">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-medium tabular-nums">{stat.value}</p>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-sm text-muted-foreground mb-6">Practice</h2>
            <div className="space-y-0">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between py-4 border-b border-border/50"
                >
                  <div className="flex items-center gap-4">
                    <Clock className="w-4 h-4 text-music" />
                    <div>
                      <p className="font-medium">{session.focus}</p>
                      <p className="text-sm text-muted-foreground">{session.date}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground tabular-nums">{session.duration}</span>
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
