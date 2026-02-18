import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sun, Moon, Check, X, PenLine } from "lucide-react";
import { useDailyFocus, useSetDailyFocus, useCompleteDailyFocus } from "@/hooks/useDailyFocus";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export const DailyFocusCard = () => {
    const { data: focus, isLoading } = useDailyFocus();
    const setFocus = useSetDailyFocus();
    const completeFocus = useCompleteDailyFocus();

    const [reference, setReference] = useState("");
    const [content, setContent] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    // Determine time of day visually
    const hour = new Date().getHours();
    const isEvening = hour >= 18;

    const handleLockFocus = () => {
        if (!reference || !content) {
            toast({ title: "Missing details", description: "Please enter both reference and scripture text.", variant: "destructive" });
            return;
        }
        setFocus.mutate({ reference, content }, {
            onSuccess: () => {
                toast({ title: "Focus Locked 🔒", description: "This scripture is your meditation for the day." });
                setIsEditing(false);
            }
        });
    };

    const handleComplete = (completed: boolean) => {
        if (!focus) return;
        completeFocus.mutate({ id: focus.id, completed }, {
            onSuccess: () => {
                if (completed) {
                    toast({ title: "Mastered! 🏆", description: "Great job hiding this word in your heart." });
                } else {
                    toast({ title: "Keep going", description: "Review it one more time before bed!" });
                }
            }
        });
    };

    if (isLoading) return <div className="h-40 rounded-xl bg-muted/20 animate-pulse" />;

    // 1. INPUT STATE (No focus set yet, or editing)
    if (!focus || isEditing) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-card to-muted/30 border border-border/60 p-6 shadow-sm"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {isEvening ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </div>
                    <div>
                        <h3 className="font-medium font-serif text-lg">Daily Focus</h3>
                        <p className="text-muted-foreground text-sm">Choose one scripture to master today.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-medium text-muted-foreground ml-1">Reference</label>
                        <Input
                            placeholder="e.g. Romans 12:2"
                            value={reference}
                            onChange={e => setReference(e.target.value)}
                            className="mt-1 font-serif"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-muted-foreground ml-1">Scripture Text</label>
                        <Textarea
                            placeholder="Type out the verse to start the process..."
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            className="mt-1 min-h-[80px]"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        {isEditing && <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>}
                        <Button onClick={handleLockFocus} className="gap-2 bg-primary text-primary-foreground">
                            <Lock className="w-4 h-4" />
                            Lock Focus
                        </Button>
                    </div>
                </div>
            </motion.div>
        );
    }

    // 2. ACTIVE / REVIEW STATE
    return (
        <motion.div
            layoutId="daily-focus-card"
            className="relative overflow-hidden rounded-xl bg-card border border-border/50 shadow-sm"
        >
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-spiritual/5 pointer-events-none" />
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-spiritual/10 rounded-full blur-3xl animate-pulse" />

            <div className="relative p-6 px-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">

                {/* Main Content */}
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                            Today's Focus
                        </span>
                        {focus.completed && (
                            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <Check className="w-3 h-3" /> Mastered
                            </span>
                        )}
                    </div>

                    <h2 className="text-2xl md:text-3xl font-serif text-foreground font-medium italic leading-relaxed mb-2">
                        "{focus.content}"
                    </h2>
                    <p className="text-muted-foreground font-medium">— {focus.reference}</p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center gap-3 min-w-[120px]">
                    {!focus.completed ? (
                        <div className="flex flex-col gap-2 w-full">
                            <p className="text-xs text-muted-foreground text-center mb-1">Memorized it?</p>
                            <Button
                                size="sm"
                                className="w-full gap-2 bg-spiritual hover:bg-spiritual/90 text-white shadow-md shadow-spiritual/20"
                                onClick={() => handleComplete(true)}
                            >
                                <Check className="w-4 h-4" />
                                Yes, Got It
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-full text-muted-foreground"
                                onClick={() => setIsEditing(true)}
                            >
                                <PenLine className="w-3 h-3 mr-2" />
                                Edit
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center animate-in fade-in zoom-in duration-500">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center mx-auto mb-2">
                                <Check className="w-6 h-6" />
                            </div>
                            <p className="text-xs font-medium text-foreground">Well Done!</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
