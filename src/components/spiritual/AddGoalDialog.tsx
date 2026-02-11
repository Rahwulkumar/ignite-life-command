import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddGoalDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (goal: { title: string; category: string; targetDate?: Date }) => void;
}

export function AddGoalDialog({ open, onOpenChange, onSave }: AddGoalDialogProps) {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("growth");
    const [targetDate, setTargetDate] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            title,
            category,
            targetDate: targetDate ? new Date(targetDate) : undefined,
        });
        // Reset form
        setTitle("");
        setCategory("growth");
        setTargetDate("");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Set New Goal</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Goal Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g., Read entire Bible"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="growth">Spiritual Growth</SelectItem>
                                <SelectItem value="service">Service</SelectItem>
                                <SelectItem value="community">Community</SelectItem>
                                <SelectItem value="study">Study</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="date">Target Date (Optional)</Label>
                        <Input
                            id="date"
                            type="date"
                            value={targetDate}
                            onChange={(e) => setTargetDate(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Save Goal</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
