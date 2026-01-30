import { useState } from "react";
import { Plus, FileText, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JournalList } from "./JournalList";
import { JournalEntryForm } from "./JournalEntryForm";
import { cn } from "@/lib/utils";
import { DOMAINS, type DomainId } from "@/lib/domains";
import type { Note } from "@/hooks/useNotes";

type NoteWithChildren = Note & { children: NoteWithChildren[] };

interface HubViewProps {
  domain: DomainId;
  pages: NoteWithChildren[];
  journalEntries: Note[];
  onSelectNote: (id: string) => void;
  onCreatePage: () => void;
  selectedNoteId?: string | null;
}

export function HubView({
  domain,
  pages,
  journalEntries,
  onSelectNote,
  onCreatePage,
  selectedNoteId,
}: HubViewProps) {
  const [activeTab, setActiveTab] = useState<'pages' | 'journal'>('pages');
  const domainConfig = DOMAINS.find(d => d.id === domain);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-8 border-b border-border/50 bg-gradient-to-b from-muted/30 to-transparent">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl"
        >
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="text-4xl">{domainConfig?.icon}</span>
            {domainConfig?.label}
          </h1>
          <p className="text-muted-foreground mt-2">{domainConfig?.description}</p>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-6">
          <Button onClick={onCreatePage} size="sm" className="gap-1.5">
            <Plus className="w-4 h-4" />
            New Page
          </Button>
          <JournalEntryForm 
            defaultDomain={domain} 
            onSuccess={onSelectNote}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 px-6 py-2 border-b border-border/30">
        <button
          onClick={() => setActiveTab('pages')}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            activeTab === 'pages' 
              ? "bg-muted text-foreground" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <FileText className="w-4 h-4" />
          Pages ({pages.length})
        </button>
        <button
          onClick={() => setActiveTab('journal')}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
            activeTab === 'journal' 
              ? "bg-muted text-foreground" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <BookOpen className="w-4 h-4" />
          Journal ({journalEntries.length})
        </button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-6">
        {activeTab === 'pages' ? (
          <div>
            {pages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm mb-4">No pages yet</p>
                <Button onClick={onCreatePage} variant="outline" size="sm" className="gap-1.5">
                  <Plus className="w-4 h-4" />
                  Create your first page
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {pages.map((page) => (
                  <motion.button
                    key={page.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => onSelectNote(page.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-lg border transition-all text-center",
                      page.id === selectedNoteId
                        ? "bg-primary/10 border-primary/30"
                        : "bg-card/50 border-border/50 hover:bg-muted/50 hover:border-border"
                    )}
                  >
                    <span className="text-3xl mb-2">{page.icon || "📝"}</span>
                    <span className="text-sm font-medium truncate w-full">
                      {page.title}
                    </span>
                    {page.children.length > 0 && (
                      <span className="text-xs text-muted-foreground mt-1">
                        {page.children.length} sub-page{page.children.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Quick entry form */}
            <div className="mb-4">
              <JournalEntryForm 
                defaultDomain={domain} 
                compact 
                onSuccess={onSelectNote}
              />
            </div>
            
            <JournalList
              entries={journalEntries}
              onSelectEntry={onSelectNote}
              selectedId={selectedNoteId}
            />
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
