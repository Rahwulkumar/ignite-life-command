import { useEffect, useCallback, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  Code, 
  Highlighter,
  Link as LinkIcon,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  FileCode
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { SlashCommandMenu } from "./editor/SlashCommandMenu";

const lowlight = createLowlight(common);

interface Note {
  id: string;
  title: string;
  content: any;
  icon: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

interface NotionEditorProps {
  note: Note;
  onUpdate: (updates: Partial<Note>) => void;
}

export function NotionEditor({ note, onUpdate }: NotionEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [icon, setIcon] = useState(note.icon);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [slashMenuOpen, setSlashMenuOpen] = useState(false);
  const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 });
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: 'Type "/" for commands, or start writing...',
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        openOnClick: true,
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Underline,
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: note.content?.type ? note.content : { type: "doc", content: [{ type: "paragraph" }] },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      debouncedSave({ content: json });
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert prose-sm max-w-none focus:outline-none min-h-[300px] px-16 py-8",
      },
      handleKeyDown: (view, event) => {
        if (event.key === "/" && !slashMenuOpen) {
          const { from } = view.state.selection;
          const coords = view.coordsAtPos(from);
          setSlashMenuPos({ top: coords.bottom + 10, left: coords.left });
          setSlashMenuOpen(true);
          return false;
        }
        if (event.key === "Escape" && slashMenuOpen) {
          setSlashMenuOpen(false);
          return true;
        }
        return false;
      },
    },
  });

  useEffect(() => {
    if (editor && note.content?.type) {
      const currentContent = JSON.stringify(editor.getJSON());
      const newContent = JSON.stringify(note.content);
      if (currentContent !== newContent) {
        editor.commands.setContent(note.content);
      }
    }
    setTitle(note.title);
    setIcon(note.icon);
  }, [note.id]);

  const debouncedSave = useCallback((updates: Partial<Note>) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      onUpdate(updates);
    }, 500);
  }, [onUpdate]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    debouncedSave({ title: newTitle });
  };

  const handleIconChange = (newIcon: string) => {
    setIcon(newIcon);
    setShowIconPicker(false);
    onUpdate({ icon: newIcon });
  };

  const handleSlashCommand = (command: string) => {
    if (!editor) return;
    
    // Delete the "/" character
    editor.commands.deleteRange({
      from: editor.state.selection.from - 1,
      to: editor.state.selection.from,
    });

    switch (command) {
      case "heading1":
        editor.chain().focus().toggleHeading({ level: 1 }).run();
        break;
      case "heading2":
        editor.chain().focus().toggleHeading({ level: 2 }).run();
        break;
      case "heading3":
        editor.chain().focus().toggleHeading({ level: 3 }).run();
        break;
      case "bulletList":
        editor.chain().focus().toggleBulletList().run();
        break;
      case "orderedList":
        editor.chain().focus().toggleOrderedList().run();
        break;
      case "taskList":
        editor.chain().focus().toggleTaskList().run();
        break;
      case "blockquote":
        editor.chain().focus().toggleBlockquote().run();
        break;
      case "codeBlock":
        editor.chain().focus().toggleCodeBlock().run();
        break;
      case "divider":
        editor.chain().focus().setHorizontalRule().run();
        break;
    }
    
    setSlashMenuOpen(false);
  };

  const commonIcons = ["📝", "📌", "💡", "🎯", "📊", "🗂️", "📅", "🚀", "⭐", "📧", "💼", "🔖"];

  if (!editor) return null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {/* Header with Icon and Title */}
      <div className="px-16 pt-8 pb-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <button
              onClick={() => setShowIconPicker(!showIconPicker)}
              className="text-4xl hover:bg-muted rounded p-1 transition-colors"
            >
              {icon}
            </button>
            {showIconPicker && (
              <div className="absolute top-full left-0 mt-2 bg-popover border border-border rounded-lg p-3 shadow-lg z-50">
                <div className="grid grid-cols-6 gap-1">
                  {commonIcons.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleIconChange(emoji)}
                      className="text-xl p-1.5 hover:bg-muted rounded transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="text-3xl font-bold border-none bg-transparent px-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50"
            placeholder="Untitled"
          />
        </div>
      </div>

      {/* Formatting Toolbar */}
      <div className="px-16 pb-2 flex items-center gap-1 border-b border-border">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive("code")}
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive("highlight")}
        >
          <Highlighter className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Slash Command Menu */}
      {slashMenuOpen && (
        <SlashCommandMenu
          position={slashMenuPos}
          onSelect={handleSlashCommand}
          onClose={() => setSlashMenuOpen(false)}
        />
      )}

      {/* Editor Content */}
      <ScrollArea className="flex-1">
        <EditorContent editor={editor} />
      </ScrollArea>
    </div>
  );
}

function ToolbarButton({ 
  children, 
  onClick, 
  isActive 
}: { 
  children: React.ReactNode; 
  onClick: () => void; 
  isActive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-1.5 rounded hover:bg-muted transition-colors",
        isActive && "bg-muted text-foreground"
      )}
    >
      {children}
    </button>
  );
}
