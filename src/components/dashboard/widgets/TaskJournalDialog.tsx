import { useState } from "react";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles } from "lucide-react";

interface TaskJournalDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    taskLabel: string;
    date: Date;
    onComplete: () => void;
    onCompleteWithJournal: (reflection: string) => void;
}

export function TaskJournalDialog({
    open,
    onOpenChange,
    taskLabel,
    date,
    onComplete,
    onCompleteWithJournal,
}: TaskJournalDialogProps) {
    const [reflection, setReflection] = useState("");

    const handleComplete = () => {
        onComplete();
        setReflection("");
        onOpenChange(false);
    };

    const handleCompleteWithJournal = () => {
        onCompleteWithJournal(reflection);
        setReflection("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-emerald-500" />
                        <DialogTitle>Task Completed!</DialogTitle>
                    </div>
                    <DialogDescription>
                        {taskLabel} - {format(date, "EEEE, MMM d")}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    <p className="text-sm text-muted-foreground">
                        Would you like to add a quick reflection on this task?
                    </p>

                    <Textarea
                        value={reflection}
                        onChange={(e) => setReflection(e.target.value)}
                        placeholder="What did you learn? How did it go? Any insights?"
                        rows={4}
                        className="resize-none"
                    />

                    <div className="flex justify-end gap-3 pt-2">
                        <Button variant="ghost" onClick={handleComplete}>
                            Just Complete
                        </Button>
                        <Button
                            onClick={handleCompleteWithJournal}
                            disabled={!reflection.trim()}
                        >
                            Save & Journal
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
