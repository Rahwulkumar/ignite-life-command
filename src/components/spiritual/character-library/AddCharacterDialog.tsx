import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateCharacter,
  type CreateCharacterInput,
} from "@/hooks/useSpiritualCharacters";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface AddCharacterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCharacterDialog({
  open,
  onOpenChange,
}: AddCharacterDialogProps) {
  const createCharacter = useCreateCharacter();
  const [formData, setFormData] = useState<CreateCharacterInput>({
    name: "",
    role: "",
    testament: "Old", // Default
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }

    try {
      await createCharacter.mutateAsync(formData);
      toast({
        title: "Character created",
        description: `${formData.name} has been added to the library.`,
      });
      onOpenChange(false);
      // Reset form
      setFormData({
        name: "",
        role: "",
        testament: "Old",
        description: "",
      });
    } catch (err: unknown) {
      // API errors are not guaranteed to share one shape, so narrow carefully.
      const error = err as { code?: string; message: string };
      console.error("Error creating character:", error);
      toast({
        title: "Error creating character",
        description: `Code: ${error.code || "N/A"} - ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Spiritual Character</DialogTitle>
          <DialogDescription>
            Add a new biblical figure to your study library.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. David"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role || ""}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                placeholder="e.g. King"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="testament">Testament</Label>
              <Select
                value={formData.testament || "Old"}
                onValueChange={(val: "Old" | "New") =>
                  setFormData({ ...formData, testament: val })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Old">Old Testament</SelectItem>
                  <SelectItem value="New">New Testament</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description..."
              className="resize-none"
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={createCharacter.isPending}>
              {createCharacter.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Character
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
