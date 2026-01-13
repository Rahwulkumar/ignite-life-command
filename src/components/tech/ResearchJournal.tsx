import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Lightbulb, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ResearchEntryCard, ResearchEntry } from "./ResearchEntryCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const domains = ["All", "AI/ML", "Blockchain", "Cloud", "Security", "IoT", "DevOps", "Mobile", "Web3"];

const defaultEntries: ResearchEntry[] = [
  {
    id: "1",
    title: "LLM Fine-tuning Techniques",
    domain: "AI/ML",
    date: "2025-01-12",
    insights: "Explored LoRA and QLoRA for efficient fine-tuning of large language models. Key finding: QLoRA can reduce memory usage by 65% while maintaining similar performance. Also investigated the impact of different rank values on model quality.",
    tags: ["llm", "fine-tuning", "qlora"],
    links: [
      { title: "QLoRA Paper", url: "https://arxiv.org/abs/2305.14314" },
      { title: "HuggingFace Guide", url: "https://huggingface.co/docs" },
    ],
  },
  {
    id: "2",
    title: "Kubernetes Multi-tenancy Patterns",
    domain: "Cloud",
    date: "2025-01-10",
    insights: "Researched different approaches for multi-tenant Kubernetes clusters. Namespace isolation with network policies provides good security for most use cases. Virtual clusters (vCluster) offer stronger isolation but add operational complexity.",
    tags: ["kubernetes", "multi-tenancy", "security"],
  },
  {
    id: "3",
    title: "Zero-Knowledge Proofs in Identity",
    domain: "Blockchain",
    date: "2025-01-05",
    insights: "Investigated zk-SNARKs and their application in privacy-preserving identity verification. The key insight is that these proofs allow verification of attributes without revealing the actual data.",
    tags: ["zkp", "identity", "privacy"],
    links: [
      { title: "zkSNARK Explainer", url: "https://example.com" },
    ],
  },
];

export function ResearchJournal() {
  const [entries, setEntries] = useState<ResearchEntry[]>(defaultEntries);
  const [selectedDomain, setSelectedDomain] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<ResearchEntry | null>(null);
  
  const [newEntry, setNewEntry] = useState({
    title: "",
    domain: "AI/ML",
    insights: "",
    tags: "",
    links: [{ title: "", url: "" }],
  });

  const filteredEntries = entries
    .filter(e => selectedDomain === "All" || e.domain === selectedDomain)
    .filter(e => 
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.insights.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  const handleAdd = () => {
    if (!newEntry.title.trim() || !newEntry.insights.trim()) return;
    
    const entry: ResearchEntry = {
      id: Date.now().toString(),
      title: newEntry.title.trim(),
      domain: newEntry.domain,
      date: new Date().toISOString().split('T')[0],
      insights: newEntry.insights.trim(),
      tags: newEntry.tags.split(',').map(t => t.trim()).filter(Boolean),
      links: newEntry.links.filter(l => l.title && l.url),
    };

    setEntries([entry, ...entries]);
    setNewEntry({
      title: "",
      domain: "AI/ML",
      insights: "",
      tags: "",
      links: [{ title: "", url: "" }],
    });
    setIsAddOpen(false);
  };

  const handleEdit = (entry: ResearchEntry) => {
    setEditingEntry(entry);
  };

  const handleUpdate = () => {
    if (!editingEntry) return;
    
    setEntries(entries.map(e => 
      e.id === editingEntry.id ? editingEntry : e
    ));
    setEditingEntry(null);
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const addLinkField = () => {
    setNewEntry({
      ...newEntry,
      links: [...newEntry.links, { title: "", url: "" }],
    });
  };

  const updateLink = (index: number, field: "title" | "url", value: string) => {
    const updatedLinks = [...newEntry.links];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setNewEntry({ ...newEntry, links: updatedLinks });
  };

  const removeLink = (index: number) => {
    setNewEntry({
      ...newEntry,
      links: newEntry.links.filter((_, i) => i !== index),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search research entries..."
            className="pl-9"
          />
        </div>

        <Button onClick={() => setIsAddOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          New Entry
        </Button>
      </div>

      {/* Domain filter pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {domains.map((domain) => (
          <button
            key={domain}
            onClick={() => setSelectedDomain(domain)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
              selectedDomain === domain
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {domain}
          </button>
        ))}
      </div>

      {/* Entries */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: index * 0.05 }}
            >
              <ResearchEntryCard 
                entry={entry}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filteredEntries.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 border border-dashed border-border rounded-xl"
        >
          <Lightbulb className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No research entries found</h3>
          <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
            {searchQuery 
              ? "Try adjusting your search or filter"
              : "Document your tech explorations and discoveries"
            }
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsAddOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Your First Entry
            </Button>
          )}
        </motion.div>
      )}

      {/* Add Entry Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Research Entry</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                placeholder="e.g., LLM Fine-tuning Techniques"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Domain</label>
              <Select 
                value={newEntry.domain}
                onValueChange={(v) => setNewEntry({ ...newEntry, domain: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {domains.filter(d => d !== "All").map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Key Insights</label>
              <Textarea
                value={newEntry.insights}
                onChange={(e) => setNewEntry({ ...newEntry, insights: e.target.value })}
                placeholder="Document your findings, observations, and key takeaways..."
                rows={5}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Tags (comma-separated)</label>
              <Input
                value={newEntry.tags}
                onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value })}
                placeholder="e.g., llm, fine-tuning, qlora"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Links (optional)</label>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="sm" 
                  onClick={addLinkField}
                  className="text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Link
                </Button>
              </div>
              <div className="space-y-3">
                {newEntry.links.map((link, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      value={link.title}
                      onChange={(e) => updateLink(i, "title", e.target.value)}
                      placeholder="Link title"
                      className="flex-1"
                    />
                    <Input
                      value={link.url}
                      onChange={(e) => updateLink(i, "url", e.target.value)}
                      placeholder="https://..."
                      className="flex-1"
                    />
                    {newEntry.links.length > 1 && (
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeLink(i)}
                        className="shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button 
                onClick={handleAdd} 
                disabled={!newEntry.title.trim() || !newEntry.insights.trim()}
              >
                Add Entry
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Entry Dialog */}
      <Dialog open={!!editingEntry} onOpenChange={() => setEditingEntry(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Research Entry</DialogTitle>
          </DialogHeader>
          {editingEntry && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Title</label>
                <Input
                  value={editingEntry.title}
                  onChange={(e) => setEditingEntry({ ...editingEntry, title: e.target.value })}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Domain</label>
                <Select 
                  value={editingEntry.domain}
                  onValueChange={(v) => setEditingEntry({ ...editingEntry, domain: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.filter(d => d !== "All").map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Key Insights</label>
                <Textarea
                  value={editingEntry.insights}
                  onChange={(e) => setEditingEntry({ ...editingEntry, insights: e.target.value })}
                  rows={5}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button variant="ghost" onClick={() => setEditingEntry(null)}>Cancel</Button>
                <Button onClick={handleUpdate}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
