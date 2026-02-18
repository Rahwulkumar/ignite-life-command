import { useState, useMemo } from "react";
import { Plus, Folder } from "lucide-react";
import { SidebarFileTree } from "@/components/notes/SidebarFileTree";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    useNotes,
    useCreateNote,
    buildNoteTree,
    type Note
} from "@/hooks/useNotes";
import type { SpiritualCharacter } from "@/hooks/useSpiritualCharacters";

interface CharacterSidebarProps {
    character: SpiritualCharacter;
    rootFolderId: string;
    selectedNoteId: string | null;
    onSelectNote: (noteId: string) => void;
}

type NoteWithChildren = Note & { children: NoteWithChildren[] };

export function CharacterSidebar({
    character,
    rootFolderId,
    selectedNoteId,
    onSelectNote
}: CharacterSidebarProps) {
    const { data: notes = [] } = useNotes();
    const createNote = useCreateNote();
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set([rootFolderId]));

    // Build the tree and find our root node
    const rootNode = useMemo(() => {
        if (!notes.length) return null;
        const tree = buildNoteTree(notes) as NoteWithChildren[];

        // Helper to find node by id in tree
        const findNode = (nodes: NoteWithChildren[], id: string): NoteWithChildren | null => {
            for (const node of nodes) {
                if (node.id === id) return node;
                const found = findNode(node.children, id);
                if (found) return found;
            }
            return null;
        };

        return findNode(tree, rootFolderId);
    }, [notes, rootFolderId]);

    const toggleFolder = (folderId: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const newExpanded = new Set(expandedFolders);
        if (newExpanded.has(folderId)) {
            newExpanded.delete(folderId);
        } else {
            newExpanded.add(folderId);
        }
        setExpandedFolders(newExpanded);
    };

    const handleCreateNote = async (parentId: string, type: 'page' | 'folder' = 'page') => {
        await createNote.mutateAsync({
            title: `New ${type === 'folder' ? 'Folder' : 'Note'}`,
            domain: "spiritual",
            parent_id: parentId,
            note_type: type,
        });
    };

    // Wrapper for generic create used in footer buttons
    const handleFooterCreate = (type: 'page' | 'folder') => (e: React.MouseEvent) => {
        e.stopPropagation();
        handleCreateNote(rootFolderId, type);
    };

    return (
        <div className="w-64 border-r border-border/50 bg-card/30 flex flex-col h-full">
            <div className="p-4 border-b border-border/50">
                <h2 className="font-serif font-medium text-lg mb-1">{character.name}</h2>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                    Workspace
                </p>
            </div>

            <ScrollArea className="flex-1 py-2">
                <div className="pr-2">
                    {rootNode?.children && (
                        <SidebarFileTree
                            data={rootNode.children}
                            expandedFolders={expandedFolders}
                            toggleFolder={toggleFolder}
                            selectedNoteId={selectedNoteId}
                            onSelectNote={onSelectNote}
                            onCreateItem={(parentId, type) => handleCreateNote(parentId, type)}
                        />
                    )}

                    {(!rootNode?.children || rootNode.children.length === 0) && (
                        <div className="text-center py-8 px-4">
                            <p className="text-xs text-muted-foreground mb-4">No notes yet.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <div className="p-3 border-t border-border/50 grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={handleFooterCreate('page')}>
                    <Plus className="w-3 h-3 mr-2" />
                    Note
                </Button>
                <Button variant="ghost" size="sm" onClick={handleFooterCreate('folder')}>
                    <Folder className="w-3 h-3 mr-2" />
                    Folder
                </Button>
            </div>
        </div>
    );

}
