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
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {!isHomePage && <TopNavigation />}
      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
