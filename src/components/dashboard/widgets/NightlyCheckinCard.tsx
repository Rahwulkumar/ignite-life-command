import { useState } from "react";
import { MessageSquareText, MoonStar } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  useDailyCheckin,
  useSubmitDailyCheckin,
} from "@/hooks/useDailyCheckin";

export function NightlyCheckinCard() {
  const [responseText, setResponseText] = useState("");
  const { data, isLoading } = useDailyCheckin();
  const submitCheckin = useSubmitDailyCheckin();

  if (isLoading || !data?.due || data.answeredAt || !data.promptText) {
    return null;
  }

  const handleSubmit = async () => {
    const trimmed = responseText.trim();
    if (!trimmed) {
      toast.error("Write your check-in before submitting.");
      return;
    }

    try {
      const result = await submitCheckin.mutateAsync(trimmed);
      setResponseText("");
      toast.success(result.capture.replyText);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save your check-in.");
    }
  };

  return (
    <Card className="mb-4 overflow-hidden border-border/60 bg-gradient-to-br from-card via-card to-muted/20 shadow-sm">
      <CardHeader className="gap-3 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <MoonStar className="h-3.5 w-3.5" />
              Nightly Check-In
            </div>
            <CardTitle className="mt-2 text-lg">9 PM reflection and task log</CardTitle>
          </div>
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <MessageSquareText className="h-4 w-4" />
          </div>
        </div>

        {data.pendingTasks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.pendingTasks.map((task) => (
              <Badge
                key={`${task.taskId}-${task.state}`}
                variant="outline"
                className={
                  task.state === "pending"
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-700"
                    : "border-sky-500/40 bg-sky-500/10 text-sky-700"
                }
              >
                {task.label}
                {task.state === "pending" ? " pending" : " needs detail"}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm leading-6 text-muted-foreground">{data.promptText}</p>

        <Textarea
          value={responseText}
          onChange={(event) => setResponseText(event.target.value)}
          placeholder="Gym from 6:15 to 7:25, chest day, felt stronger. Missed prayer because I got home late. Also finished a system design video and want that logged."
          className="min-h-[144px] resize-y border-border/60 bg-background/70"
          onKeyDown={(event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
              event.preventDefault();
              void handleSubmit();
            }
          }}
        />

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Include what you completed, how long it took, what you missed, and anything else you want journaled.
          </p>

          <Button
            onClick={() => void handleSubmit()}
            disabled={submitCheckin.isPending}
          >
            {submitCheckin.isPending ? "Saving..." : "Save Check-In"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
