import { ReactNode } from "react";
import { TopNavigation } from "@/components/shared/TopNavigation";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
}
