import { cn } from "@/lib/utils";
import { BookOpen, Play, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DomainId, DOMAIN_COLORS } from "@/lib/domain-colors";

export interface Lesson {
  title: string;
  description: string;
  domain: DomainId;
  duration: string;
  completed: boolean;
}

interface DailyLessonsProps {
  lessons: Lesson[];
  completedCount?: number;
  onViewAll?: () => void;
}

export function DailyLessons({ lessons, completedCount, onViewAll }: DailyLessonsProps) {
  const completed = completedCount ?? lessons.filter(l => l.completed).length;

  return (
    <div className="glass rounded-xl p-5 opacity-0 animate-fade-in" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h3 className="font-display font-semibold text-lg">Today's Lessons</h3>
        </div>
        <span className="text-sm text-muted-foreground">{completed}/{lessons.length} completed</span>
      </div>

      <div className="space-y-3">
        {lessons.map((lesson, index) => {
          const colors = DOMAIN_COLORS[lesson.domain];

          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer group",
                lesson.completed
                  ? "bg-muted/30 border-border/50 opacity-60"
                  : "bg-muted/50 border-border hover:border-primary/30"
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border",
                  colors.bgSubtle,
                  colors.border
                )}
              >
                {lesson.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-finance" />
                ) : (
                  <Play className={cn("w-4 h-4", colors.text)} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "font-medium text-sm truncate",
                    lesson.completed ? "text-muted-foreground line-through" : "text-foreground"
                  )}
                >
                  {lesson.title}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {lesson.description}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className={cn("text-xs font-medium", colors.text)}>
                  {lesson.duration}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <Button
        variant="ghost"
        className="w-full mt-4 text-muted-foreground hover:text-foreground"
        onClick={onViewAll}
      >
        View All Lessons
      </Button>
    </div>
  );
}

// Default lessons for backward compatibility
export const DEFAULT_LESSONS: Lesson[] = [
  {
    title: "Understanding Time Complexity",
    description: "Learn how to analyze algorithm efficiency using Big O notation",
    domain: "tech",
    duration: "15 min",
    completed: false,
  },
  {
    title: "Emergency Fund Basics",
    description: "Why you need 3-6 months of expenses saved before investing",
    domain: "finance",
    duration: "10 min",
    completed: true,
  },
  {
    title: "Reading Candlestick Patterns",
    description: "Identify bullish and bearish reversal patterns",
    domain: "trading",
    duration: "12 min",
    completed: false,
  },
  {
    title: "Chord Transition Techniques",
    description: "Practice switching between G, C, and D smoothly",
    domain: "music",
    duration: "20 min",
    completed: false,
  },
];
