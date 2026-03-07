import { useNavigate } from "react-router-dom";
import { Library, ArrowRight } from "lucide-react";
import { BaseDomainCard } from "@/components/shared/BaseDomainCard";
import { Button } from "@/components/ui/button";
import { useSpiritualCharacters } from "@/hooks/useSpiritualCharacters";

export const CharacterStudyCard = () => {
  const navigate = useNavigate();
  const { data: characters = [] } = useSpiritualCharacters();
  const activeCount = characters.length;

  return (
    <BaseDomainCard
      domainColor="spiritual"
      icon={<Library className="w-5 h-5 text-spiritual" />}
      title="Character Studies"
      subtitle="Explore the lives of biblical figures"
      className="h-full"
      headerAction={
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 -mr-2 text-muted-foreground hover:text-spiritual"
          onClick={() => navigate("/spiritual/library")}
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      }
      footer={
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {/* FIX BUG 5: use real count from hook */}
          <span>
            {activeCount} Active {activeCount === 1 ? "Study" : "Studies"}
          </span>
          <span className="group-hover:text-spiritual transition-colors">
            View Library →
          </span>
        </div>
      }
    >
      <div
        className="flex flex-col gap-4 cursor-pointer group"
        onClick={() => navigate("/spiritual/library")}
      >
        <div className="p-4 rounded-lg bg-muted/30 border border-border/50 group-hover:bg-spiritual/5 group-hover:border-spiritual/20 transition-all duration-300">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px] font-medium text-muted-foreground"
                >
                  ?
                </div>
              ))}
            </div>
            <p className="text-sm font-medium">
              {activeCount > 0
                ? `${activeCount} character${activeCount !== 1 ? "s" : ""} studied`
                : "Start a new study"}
            </p>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Dive deep into the context, history, and spiritual lessons of
            characters like David, Moses, and Paul.
          </p>
        </div>
      </div>
    </BaseDomainCard>
  );
};
