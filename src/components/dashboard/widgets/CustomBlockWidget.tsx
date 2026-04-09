import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type CustomBlockTone = "neutral" | "focus" | "growth" | "warm";

interface CustomBlockWidgetProps {
  eyebrow?: string;
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  tone?: CustomBlockTone;
  emphasize?: boolean;
}

const TONE_STYLES: Record<
  CustomBlockTone,
  { shell: string; badge: string; icon: string; button: string }
> = {
  neutral: {
    shell:
      "border-border/70 bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]",
    badge: "bg-muted text-muted-foreground",
    icon: "text-foreground/70",
    button: "bg-foreground text-background hover:bg-foreground/90",
  },
  focus: {
    shell:
      "border-tech/25 bg-[linear-gradient(145deg,rgba(111,177,255,0.18),rgba(255,255,255,0.02))]",
    badge: "bg-tech/15 text-tech",
    icon: "text-tech",
    button: "bg-tech text-tech-foreground hover:bg-tech/90",
  },
  growth: {
    shell:
      "border-finance/25 bg-[linear-gradient(145deg,rgba(108,208,154,0.18),rgba(255,255,255,0.02))]",
    badge: "bg-finance/15 text-finance",
    icon: "text-finance",
    button: "bg-finance text-finance-foreground hover:bg-finance/90",
  },
  warm: {
    shell:
      "border-content/25 bg-[linear-gradient(145deg,rgba(255,184,108,0.18),rgba(255,255,255,0.02))]",
    badge: "bg-content/15 text-content",
    icon: "text-content",
    button: "bg-content text-content-foreground hover:bg-content/90",
  },
};

function isInternalPath(url?: string) {
  return Boolean(url?.startsWith("/"));
}

export function CustomBlockWidget({
  eyebrow = "Custom Block",
  title = "Make this dashboard yours",
  body = "Add your own prompts, reminders, and callouts so the dashboard reflects how you actually work.",
  ctaLabel = "Open",
  ctaUrl,
  tone = "neutral",
  emphasize = false,
}: CustomBlockWidgetProps) {
  const styles = TONE_STYLES[tone];
  const showCta = Boolean(ctaLabel?.trim() && ctaUrl?.trim());

  const blockBody = (
    <div
      className={cn(
        "group relative overflow-hidden rounded-[28px] border p-5 sm:p-6",
        styles.shell,
        emphasize &&
          "shadow-[0_28px_72px_-52px_rgba(0,0,0,0.9)] ring-1 ring-white/6",
      )}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_34%)]" />
      <div className="relative z-10 flex h-full flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
              styles.badge,
            )}
          >
            <Sparkles className={cn("h-3.5 w-3.5", styles.icon)} />
            {eyebrow}
          </span>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            {title}
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            {body}
          </p>
        </div>

        {showCta && (
          <div className="pt-2">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                styles.button,
              )}
            >
              {ctaLabel}
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        )}
      </div>
    </div>
  );

  if (showCta && isInternalPath(ctaUrl)) {
    return <Link to={ctaUrl!}>{blockBody}</Link>;
  }

  if (showCta && ctaUrl) {
    return (
      <a href={ctaUrl} target="_blank" rel="noreferrer noopener">
        {blockBody}
      </a>
    );
  }

  return blockBody;
}
