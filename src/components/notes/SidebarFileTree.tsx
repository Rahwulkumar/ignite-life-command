import { ChevronRight, ChevronDown, FileText, Folder, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Note } from "@/hooks/useNotes";

export type NoteWithChildren = Note & { children: NoteWithChildren[] };

interface SidebarFileTreeProps {
    data: NoteWithChildren[];
    expandedFolders: Set<string>;
    toggleFolder: (folderId: string, e: React.MouseEvent) => void;
    selectedNoteId: string | null;
    onSelectNote: (noteId: string) => void;
    onCreateItem?: (parentId: string, type: 'page' | 'folder') => void;
    onDeleteNote?: (noteId: string) => void;
    tone: {
        text: string;
        bg: string;
        border: string;
        hover: string;
    };
    level?: number;
}

export function SidebarFileTree({
    data,
    expandedFolders,
    toggleFolder,
    selectedNoteId,
    onSelectNote,
    onCreateItem,
    onDeleteNote,
    tone,
    level = 0
}: SidebarFileTreeProps) {
    if (!data || data.length === 0) return null;

    return (
        <div className={cn(level > 0 && "ml-3 border-l border-border/40")}>
            {data.map((node) => {
                const isFolder = node.note_type === 'folder' || node.note_type === 'hub';
                const isExpanded = expandedFolders.has(node.id);
                const isSelected = selectedNoteId === node.id;
                const hasChildren = node.children && node.children.length > 0;

                return (
                    <div key={node.id} className="pl-2">
                        <div
                            className={cn(
                                "group relative flex cursor-pointer items-center gap-2.5 rounded-lg border border-transparent px-2.5 py-2 transition-colors",
                                isSelected
                                    ? [tone.bg, tone.border, tone.text, "font-medium"]
                                    : ["text-muted-foreground hover:bg-card/70 hover:text-foreground", tone.hover]
                            )}
                            onClick={(e) => isFolder ? toggleFolder(node.id, e) : onSelectNote(node.id)}
                        >
                            {/* Toggle Chevron for Folders */}
                            {isFolder ? (
                                <button
                                    onClick={(e) => toggleFolder(node.id, e)}
                                    className="rounded-sm p-0.5 text-muted-foreground/70 hover:bg-background hover:text-foreground"
                                >
                                    {isExpanded ? (
                                        <ChevronDown className="w-3 h-3" />
                                    ) : (
                                        <ChevronRight className="w-3 h-3" />
                                    )}
                                </button>
                            ) : (
                                /* Spacer for alignment */
                                <div className="w-4" />
                            )}

                            {/* Icon */}
                            {isFolder ? (
                                <Folder className={cn("h-4 w-4 shrink-0", isSelected ? tone.text : "text-muted-foreground")} />
                            ) : (
                                <FileText className={cn("h-4 w-4 shrink-0", isSelected ? tone.text : "text-muted-foreground")} />
                            )}

                            {/* Title */}
                            <span className="text-sm truncate flex-1 select-none">{node.title}</span>

                            {/* Quick Actions on Hover */}
                            <div className="absolute right-2 flex gap-1 rounded-sm bg-background/70 opacity-0 backdrop-blur-sm group-hover:opacity-100">
                                {/* Add Page Button - Only for Folders */}
                                {isFolder && onCreateItem && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 hover:bg-background"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onCreateItem(node.id, 'page');
                                        }}
                                        title="Create Note"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </Button>
                                )}
                                {/* Delete Button - For all notes */}
                                {onDeleteNote && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-5 w-5 hover:bg-destructive/10 hover:text-destructive"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm(`Delete "${node.title}"? This action cannot be undone.`)) {
                                                onDeleteNote(node.id);
                                            }
                                        }}
                                        title="Delete"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Recursive Children */}
                        {isFolder && isExpanded && hasChildren && (
                            <SidebarFileTree
                                data={node.children}
                                expandedFolders={expandedFolders}
                                toggleFolder={toggleFolder}
                                selectedNoteId={selectedNoteId}
                                onSelectNote={onSelectNote}
                                onCreateItem={onCreateItem}
                                onDeleteNote={onDeleteNote}
                                tone={tone}
                                level={level + 1}
                            />
                        )}

                        {/* Empty Folder State */}
                        {isFolder && isExpanded && !hasChildren && (
                            <div className="pl-6 py-1">
                                <span className="text-xs text-muted-foreground/50 italic">Empty</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
