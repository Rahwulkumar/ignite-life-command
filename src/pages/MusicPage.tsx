import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { GradientOrb, GridPattern, ProgressRing } from "@/components/ui/decorative";
import { Music, Plus, Clock, Target, Sparkles, Headphones, Play, Guitar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const sessions = [
  { id: 1, date: "Today", duration: "45 min", focus: "Chord progressions", instrument: "Guitar", emoji: "🎸", intensity: 85 },
  { id: 2, date: "Yesterday", duration: "30 min", focus: "Scales practice", instrument: "Guitar", emoji: "🎵", intensity: 70 },
  { id: 3, date: "Dec 27", duration: "1 hr", focus: "Song learning - Hotel California", instrument: "Guitar", emoji: "🎶", intensity: 95 },
  { id: 4, date: "Dec 26", duration: "20 min", focus: "Fingerpicking patterns", instrument: "Guitar", emoji: "✨", intensity: 60 },
];

const stats = [
  { label: "Weekly Practice", value: "3.5", unit: "hours", icon: Clock, progress: 70 },
  { label: "Current Focus", value: "Guitar", unit: "", icon: Guitar, progress: 100 },
  { label: "Sessions This Week", value: "5", unit: "sessions", icon: Target, progress: 71 },
];

const MusicPage = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="relative p-8 max-w-6xl mx-auto min-h-screen">
          {/* Background decorative elements */}
          <GradientOrb color="music" size="lg" className="-top-20 -right-20 opacity-30" />
          <GradientOrb color="spiritual" size="sm" className="bottom-40 left-10 opacity-20" />
          <GridPattern />

          {/* Header */}
          <header className="relative flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-music/20 to-music/5 border border-music/20">
                  <Music className="w-7 h-7 text-music" />
                </div>
                <div className="absolute -inset-2 bg-music/20 rounded-2xl blur-xl -z-10" />
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-music animate-pulse" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">Music</h1>
                <p className="text-sm text-muted-foreground">Practice sessions and progress</p>
              </div>
            </div>
            <Button className="gap-2 bg-music hover:bg-music/90 text-background">
              <Plus className="w-4 h-4" />
              Log Practice
            </Button>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {stats.map((stat) => (
              <div 
                key={stat.label} 
                className="group relative p-6 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden hover:border-music/30 transition-all duration-300"
              >
                <div className="absolute inset-0 gradient-music opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                      <stat.icon className="w-4 h-4" />
                      {stat.label}
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono text-3xl font-semibold">{stat.value}</span>
                      {stat.unit && <span className="text-sm text-muted-foreground">{stat.unit}</span>}
                    </div>
                  </div>
                  
                  <ProgressRing 
                    progress={stat.progress} 
                    size={50} 
                    strokeWidth={4} 
                    color="music"
                    className="opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Practice Sessions */}
          <div className="relative bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-music/50 to-transparent" />
            
            <div className="p-5 border-b border-border/50">
              <h2 className="font-medium flex items-center gap-2">
                <Headphones className="w-4 h-4 text-music" />
                Recent Practice
              </h2>
            </div>
            <div className="divide-y divide-border/50">
              {sessions.map((session) => (
                <div key={session.id} className="group flex items-center justify-between p-5 hover:bg-card-elevated/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-music/20 to-music/5 flex items-center justify-center text-2xl">
                      {session.emoji}
                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                        <Play className="w-5 h-5 text-music ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{session.focus}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <Guitar className="w-3 h-3 text-music" />
                        {session.instrument}
                        <span className="text-muted-foreground/50">•</span>
                        {session.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Intensity bar */}
                    <div className="w-20 flex flex-col items-end gap-1">
                      <span className="text-[10px] text-muted-foreground">Intensity</span>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-music/60 to-music rounded-full transition-all"
                          style={{ width: `${session.intensity}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground font-mono px-3 py-1.5 rounded-lg bg-muted/50 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {session.duration}
                    </span>
                  </div>
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
