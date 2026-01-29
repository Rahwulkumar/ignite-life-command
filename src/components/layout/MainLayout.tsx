import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { TopNavigation } from "@/components/shared/TopNavigation";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-background">
      {!isHomePage && <TopNavigation />}
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
}
