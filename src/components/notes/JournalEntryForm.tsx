import { useState } from "react";
import { Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DOMAINS, DomainIcon, type DomainId } from "@/lib/domains";
import { useCreateNote } from "@/hooks/useNotes";
import { toast } from "sonner";

interface JournalEntryFormProps {
  defaultDomain?: DomainId;
  onSuccess?: (noteId: string) => void;
  trigger?: React.ReactNode;
  compact?: boolean;
}

export function JournalEntryForm({
  defaultDomain,
  onSuccess,
  trigger,
  compact = false,
}: JournalEntryFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [domain, setDomain] = useState<DomainId | undefined>(defaultDomain);
  const createNote = useCreateNote();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    if (!domain) {
      toast.error("Please select a domain");
      return;
    }

    try {
      const note = await createNote.mutateAsync({
        title: title.trim(),
        content: content.trim() ? {
          type: "doc",
          content: [{ type: "paragraph", content: [{ type: "text", text: content.trim() }] }]
        } : null,
        domain,
        note_type: 'journal',
        icon: null,
      });

      toast.success("Journal entry created");
      setTitle("");
      setContent("");
      setOpen(false);
      onSuccess?.(note.id);
    } catch (error) {
      toast.error("Failed to create entry");
    }
  };

  // Compact inline form for hub pages
  if (compact && defaultDomain) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Quick journal entry..."
          className="flex-1 h-8 text-sm"
        />
        <Button 
          type="submit" 
          size="sm" 
          disabled={!title.trim() || createNote.isPending}
          className="h-8"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </form>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" />
            Quick journal
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Journal Entry</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Select
              value={domain}
              onValueChange={(v) => setDomain(v as DomainId)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select domain" />
              </SelectTrigger>
              <SelectContent>
                {DOMAINS.map((d) => (
                  <SelectItem key={d.id} value={d.id}>
                    <span className="flex items-center gap-2">
                      <DomainIcon domainId={d.id} className="w-4 h-4" />
                      <span>{d.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry title..."
            autoFocus
          />

          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Quick reflection... (optional)"
            rows={3}
          />

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim() || !domain || createNote.isPending}>
              {createNote.isPending ? "Saving..." : "Save Entry"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
