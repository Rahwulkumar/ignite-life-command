import { useState, useEffect, useRef } from "react";
import { 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  CheckSquare, 
  Quote, 
  Code, 
  Minus,
  Type
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SlashCommandMenuProps {
  position: { top: number; left: number };
  onSelect: (command: string) => void;
  onClose: () => void;
}

const commands = [
  { id: "heading1", label: "Heading 1", icon: Heading1, description: "Large section heading" },
  { id: "heading2", label: "Heading 2", icon: Heading2, description: "Medium section heading" },
  { id: "heading3", label: "Heading 3", icon: Heading3, description: "Small section heading" },
  { id: "bulletList", label: "Bullet List", icon: List, description: "Create a bullet list" },
  { id: "orderedList", label: "Numbered List", icon: ListOrdered, description: "Create a numbered list" },
  { id: "taskList", label: "To-do List", icon: CheckSquare, description: "Track tasks with checkboxes" },
  { id: "blockquote", label: "Quote", icon: Quote, description: "Capture a quote" },
  { id: "codeBlock", label: "Code Block", icon: Code, description: "Capture a code snippet" },
  { id: "divider", label: "Divider", icon: Minus, description: "Separate sections visually" },
];

export function SlashCommandMenu({ position, onSelect, onClose }: SlashCommandMenuProps) {
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % filteredCommands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          onSelect(filteredCommands[selectedIndex].id);
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filteredCommands, selectedIndex, onSelect, onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-popover border border-border rounded-lg shadow-xl z-50 w-72 overflow-hidden"
      style={{ top: position.top, left: position.left }}
    >
      <div className="p-2 border-b border-border">
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value.replace("/", ""))}
          placeholder="Filter commands..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <div className="max-h-64 overflow-y-auto py-1">
        {filteredCommands.length > 0 ? (
          filteredCommands.map((cmd, index) => (
            <button
              key={cmd.id}
              onClick={() => onSelect(cmd.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-muted transition-colors",
                selectedIndex === index && "bg-muted"
              )}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                <cmd.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{cmd.label}</p>
                <p className="text-xs text-muted-foreground truncate">{cmd.description}</p>
              </div>
            </button>
          ))
        ) : (
          <div className="px-3 py-4 text-center text-sm text-muted-foreground">
            No commands found
          </div>
        )}
      </div>
    </div>
  );
}
