import { Button } from "@/components/ui/button";
import { FileText, BarChart3 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FloatingActionsProps {
  onNotesClick: () => void;
  onDailyLogClick: () => void;
}

const FloatingActions = ({ onNotesClick, onDailyLogClick }: FloatingActionsProps) => {
  return (
    <TooltipProvider>
      <div className="fixed bottom-6 right-24 flex items-center gap-2 z-40">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onDailyLogClick}
              size="icon"
              variant="outline"
              className="h-12 w-12 rounded-full shadow-lg bg-background/80 backdrop-blur-sm border-border/50 hover:bg-muted"
            >
              <BarChart3 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Daily Log</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onNotesClick}
              size="icon"
              variant="outline"
              className="h-12 w-12 rounded-full shadow-lg bg-background/80 backdrop-blur-sm border-border/50 hover:bg-muted"
            >
              <FileText className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Notes</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default FloatingActions;
