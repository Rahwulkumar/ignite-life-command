import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { NotesPanel } from "./NotesPanel";

interface NotesDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotesDrawer = ({ open, onOpenChange }: NotesDrawerProps) => {
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[500px] sm:max-w-[500px] p-0 flex flex-col">
        <SheetHeader className="px-4 py-3 border-b border-border/50">
          <SheetTitle className="text-base font-medium">Notes</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-hidden">
          <NotesPanel 
            initialNoteId={selectedNoteId} 
            onNoteChange={setSelectedNoteId}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotesDrawer;
