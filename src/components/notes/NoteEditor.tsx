import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import LinkExtension from "@tiptap/extension-link";
import UnderlineExtension from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EditorToolbar } from "./EditorToolbar";
import type { Note } from "@/hooks/useNotes";
import type { Json } from "@/integrations/supabase/types";

const lowlight = createLowlight(common);

interface NoteEditorProps {
  note: Note;
  onContentChange: (content: Json) => void;
  onTitleChange: (title: string) => void;
  onIconChange: (icon: string) => void;
  isSaving: boolean;
}

const EMOJI_OPTIONS = ["📝", "📓", "📔", "📕", "📗", "📘", "📙", "💡", "⭐", "🎯", "🚀", "💼", "📌", "🔖", "✨", "💭"];

export function NoteEditor({
  note,
  onContentChange,
  onTitleChange,
  onIconChange,
  isSaving,
}: NoteEditorProps) {
  const [showIconPicker, setShowIconPicker] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
      LinkExtension.configure({
        openOnClick: false,
      }),
      UnderlineExtension,
      Highlight.configure({
        multicolor: false,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
    ],
    content: (note.content as object) || "",
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      onContentChange(json as Json);
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-12 py-8",
      },
    },
  });

  // Update editor content when note changes
  useEffect(() => {
    if (editor && note.content) {
      const currentContent = JSON.stringify(editor.getJSON());
      const newContent = JSON.stringify(note.content);
      if (currentContent !== newContent) {
        editor.commands.setContent(note.content as object);
      }
    }
  }, [note.id]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-12 pt-8 pb-4">
        {/* Icon Picker */}
        <div className="relative inline-block mb-2">
          <button
            onClick={() => setShowIconPicker(!showIconPicker)}
            className="text-4xl hover:bg-muted rounded-lg p-2 transition-colors"
          >
            {note.icon || "📝"}
          </button>
          <AnimatePresence>
            {showIconPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-1 p-2 bg-card border border-border rounded-lg shadow-lg z-10 grid grid-cols-8 gap-1"
              >
                {EMOJI_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onIconChange(emoji);
                      setShowIconPicker(false);
                    }}
                    className="text-xl p-1.5 hover:bg-muted rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Title */}
        <Input
          value={note.title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-3xl font-bold border-none bg-transparent px-0 h-auto focus-visible:ring-0"
          placeholder="Untitled"
        />

        {/* Save indicator */}
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          {isSaving ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Saving...
            </>
          ) : (
            <>Saved</>
          )}
        </div>
      </div>

      {/* Toolbar */}
      {editor && <EditorToolbar editor={editor} />}

      {/* Editor Content */}
      <div className="flex-1 overflow-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
