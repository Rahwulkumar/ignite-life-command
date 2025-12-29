import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { BookOpen, Plus, Flame, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const entries = [
  { id: 1, date: "Today", duration: "45 min", notes: "Morning devotion - Psalm 23", completed: true },
  { id: 2, date: "Yesterday", duration: "30 min", notes: "Prayer and meditation", completed: true },
  { id: 3, date: "Dec 27", duration: "1 hr", notes: "Bible study - Romans 8", completed: true },
  { id: 4, date: "Dec 26", duration: "25 min", notes: "Evening prayer", completed: true },
];

const stats = [
  { label: "Current Streak", value: "45 days", icon: Flame },
  { label: "Weekly Hours", value: "5.2h" },
  { label: "This Month", value: "22 sessions" },
];

const SpiritualPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-spiritual/10">
              <BookOpen className="w-6 h-6 text-spiritual" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Spiritual</h1>
              <p className="text-sm text-muted-foreground">Prayer and Bible study tracking</p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Log Session
          </Button>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="p-5 bg-card rounded-xl border border-border/50">
              <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                {stat.icon && <stat.icon className="w-4 h-4 text-trading" />}
                {stat.label}
              </p>
              <span className="font-mono text-2xl font-medium">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Journal Entries */}
        <div className="bg-card rounded-xl border border-border/50">
          <div className="p-5 border-b border-border/50">
            <h2 className="font-medium">Recent Sessions</h2>
          </div>
          <div className="divide-y divide-border/50">
            {entries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-5 h-5 text-spiritual" />
                  <div>
                    <p className="font-medium text-sm">{entry.notes}</p>
                    <p className="text-xs text-muted-foreground">{entry.date}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground font-mono">{entry.duration}</span>
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
