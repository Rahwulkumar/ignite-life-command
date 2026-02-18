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
    level = 0
}: SidebarFileTreeProps) {
    if (!data || data.length === 0) return null;

    return (
        <div className={cn(level > 0 && "ml-2 border-l border-border/40")}>
            {data.map((node) => {
                const isFolder = node.note_type === 'folder' || node.note_type === 'hub';
                const isExpanded = expandedFolders.has(node.id);
                const isSelected = selectedNoteId === node.id;
                const hasChildren = node.children && node.children.length > 0;

                return (
                    <div key={node.id} className="pl-2">
                        <div
                            className={cn(
                                "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors group relative",
                                isSelected ? "bg-spiritual/10 text-spiritual font-medium" : "hover:bg-muted text-muted-foreground"
                            )}
                            onClick={(e) => isFolder ? toggleFolder(node.id, e) : onSelectNote(node.id)}
                        >
                            {/* Toggle Chevron for Folders */}
                            {isFolder ? (
                                <button
                                    onClick={(e) => toggleFolder(node.id, e)}
                                    className="p-0.5 hover:bg-background rounded-sm text-muted-foreground/70 hover:text-foreground"
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
                                <Folder className={cn("w-4 h-4", isSelected ? "text-spiritual" : "text-muted-foreground")} />
                            ) : (
                                <FileText className={cn("w-4 h-4", isSelected ? "text-spiritual" : "text-muted-foreground")} />
                            )}

                            {/* Title */}
                            <span className="text-sm truncate flex-1 select-none">{node.title}</span>

                            {/* Quick Actions on Hover */}
                            <div className="opacity-0 group-hover:opacity-100 flex gap-1 absolute right-2 bg-background/50 backdrop-blur-sm rounded-sm">
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
