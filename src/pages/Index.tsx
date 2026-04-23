import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { DomainNavigation } from "@/components/dashboard/DomainNavigation";
import { ZenLayout } from "@/components/dashboard/layouts/ZenLayout";
import { HeroHeader } from "@/components/dashboard/widgets/HeroHeader";
import { CreateDomainDialog } from "@/components/custom-domains/CreateDomainDialog";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";

const Index = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isCreateDomainOpen, setIsCreateDomainOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const hour = currentTime.getHours();
  const timeOfDay: "morning" | "evening" = hour < 12 ? "morning" : "evening";

  return (
    <MainLayout>
      <PageTransition>
        <div className="h-full w-full px-4 pb-4 pt-2 sm:px-6 sm:pt-4 lg:px-8 xl:px-12">
          <HeroHeader currentTime={currentTime} />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="relative z-10 -mt-16 sm:-mt-20 lg:-mt-24"
          >
            <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:items-end">
              <div className="flex justify-end">
                <Link
                  to="/settings"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card/80 px-3 py-2 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-muted/70"
                >
                  <Settings className="h-3.5 w-3.5" />
                  <span>Open Settings</span>
                </Link>
              </div>
              <DomainNavigation onCreateDomain={() => setIsCreateDomainOpen(true)} />
            </div>

            <ZenLayout timeOfDay={timeOfDay} />
          </motion.div>
        </div>

        <CreateDomainDialog
          open={isCreateDomainOpen}
          onOpenChange={setIsCreateDomainOpen}
          onCreated={(slug) => {
            toast.success("Domain created");
            navigate(`/domains/${slug}`);
          }}
        />
      </PageTransition>
    </MainLayout>
  );
};

export default Index;
