import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { BookOpen, Plus, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const entries = [
  { id: 1, date: "Today", duration: "45 min", notes: "Morning devotion - Psalm 23" },
  { id: 2, date: "Yesterday", duration: "30 min", notes: "Prayer and meditation" },
  { id: 3, date: "Dec 27", duration: "1 hr", notes: "Bible study - Romans 8" },
  { id: 4, date: "Dec 26", duration: "25 min", notes: "Evening prayer" },
];

const stats = [
  { label: "Streak", value: "45d" },
  { label: "Weekly", value: "5.2h" },
  { label: "Sessions", value: "22" },
];

const SpiritualPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="p-10 max-w-4xl mx-auto">
          <header className="flex items-center justify-between mb-16">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
                <h1 className="text-4xl font-medium tracking-tight">Spiritual</h1>
              </div>
              <p className="text-muted-foreground">Prayer and Bible study</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Log Session
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
            <h2 className="text-sm text-muted-foreground mb-6">Sessions</h2>
            <div className="space-y-0">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between py-4 border-b border-border/50"
                >
                  <div className="flex items-center gap-4">
                    <CheckCircle2 className="w-4 h-4 text-spiritual" />
                    <div>
                      <p className="font-medium">{entry.notes}</p>
                      <p className="text-sm text-muted-foreground">{entry.date}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground tabular-nums">{entry.duration}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default SpiritualPage;
