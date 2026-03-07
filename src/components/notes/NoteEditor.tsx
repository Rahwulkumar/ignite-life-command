import { useEffect } from "react";
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
import { Loader2, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EditorToolbar } from "./EditorToolbar";
import type { Note } from "@/hooks/useNotes";
import type { Json } from "@/lib/types";

const lowlight = createLowlight(common);

interface NoteEditorProps {
  note: Note;
  onContentChange: (content: Json) => void;
  onTitleChange: (title: string) => void;
  onIconChange: (icon: string) => void;
  isSaving: boolean;
}

export function NoteEditor({
  note,
  onContentChange,
  onTitleChange,
  isSaving,
}: NoteEditorProps) {
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
        class:
          "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[250px] sm:min-h-[300px] px-4 sm:px-8 lg:px-12 py-6 sm:py-8",
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
      <div className="px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8 pb-3 sm:pb-4">
        {/* Icon */}
        <div className="mb-2">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-muted/50 flex items-center justify-center">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
          </div>
        </div>

        {/* Title */}
        <Input
          value={note.title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="text-xl sm:text-2xl lg:text-3xl font-bold border-none bg-transparent px-0 h-auto focus-visible:ring-0"
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
