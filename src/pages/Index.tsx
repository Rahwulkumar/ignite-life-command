import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Link } from "react-router-dom";
import {
  Wallet,
  TrendingUp,
  Code2,
  BookOpen,
  Music,
  Bookmark,
  Briefcase,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const domains = [
  { icon: Wallet, title: "Finance", path: "/finance", value: "₦450K", label: "This month" },
  { icon: TrendingUp, title: "Trading", path: "/trading", value: "4", label: "Open positions" },
  { icon: Code2, title: "Tech", path: "/tech", value: "47", label: "Problems solved" },
  { icon: BookOpen, title: "Spiritual", path: "/spiritual", value: "45", label: "Day streak" },
  { icon: Music, title: "Music", path: "/music", value: "3.5h", label: "Weekly practice" },
  { icon: Bookmark, title: "Content", path: "/content", value: "128", label: "Saved items" },
  { icon: Briefcase, title: "Projects", path: "/projects", value: "3", label: "Active" },
];

const Index = () => {
  return (
    <MainLayout>
      <PageTransition>
        <div className="p-10 max-w-4xl mx-auto">
          <header className="mb-16">
            <h1 className="text-4xl font-medium tracking-tight mb-2">Overview</h1>
            <p className="text-muted-foreground">Your personal command center</p>
          </header>

          <div className="space-y-1">
            {domains.map((domain) => (
              <Link
                key={domain.path}
                to={domain.path}
                className={cn(
                  "group flex items-center justify-between py-5 px-1",
                  "border-b border-border/50 hover:border-foreground/20",
                  "transition-colors duration-200"
                )}
              >
                <div className="flex items-center gap-5">
                  <domain.icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="text-lg font-medium group-hover:text-foreground/90 transition-colors">
                    {domain.title}
                  </span>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-lg tabular-nums">{domain.value}</span>
                    <span className="text-muted-foreground ml-2 text-sm">{domain.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default Index;
