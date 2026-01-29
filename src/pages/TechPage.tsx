import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { Code2, MessageSquare, Sparkles, Award, Lightbulb, BookOpen } from "lucide-react";
import { AtlasChat } from "@/components/tech/AtlasChat";
import { DomainPageHeader } from "@/components/shared/DomainPageHeader";
import { DomainStatsBar } from "@/components/shared/DomainStatsBar";
import { AIChatSidebar } from "@/components/shared/AIChatSidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TechOverview } from "@/components/tech/TechOverview";
import { SkillsTracker } from "@/components/tech/SkillsTracker";
import { CertificationsHub } from "@/components/tech/CertificationsHub";
import { ResearchJournal } from "@/components/tech/ResearchJournal";
import { TechLibrary } from "@/components/tech/TechLibrary";

// Mock data for overview
const skillData = [
  { domain: "Frontend", value: 75 },
  { domain: "Backend", value: 55 },
  { domain: "Cloud", value: 40 },
  { domain: "AI/ML", value: 30 },
  { domain: "Security", value: 25 },
  { domain: "DevOps", value: 45 },
];

const mockCertifications = [
  { id: "1", name: "Solutions Architect Associate", provider: "AWS", status: "preparing" as const, targetDate: "2025-03-15", progress: 45 },
  { id: "2", name: "Professional Cloud Architect", provider: "Google", status: "preparing" as const, targetDate: "2025-06-01", progress: 20 },
  { id: "3", name: "Developer Associate", provider: "AWS", status: "earned" as const, earnedDate: "2024-08-20" },
];

const mockResearch = [
  { id: "1", title: "LLM Fine-tuning Techniques", domain: "AI/ML", date: "2025-01-12", insights: "Explored LoRA and QLoRA for efficient fine-tuning of large language models.", tags: ["llm", "fine-tuning"] },
  { id: "2", title: "Kubernetes Multi-tenancy", domain: "Cloud", date: "2025-01-10", insights: "Researched different approaches for multi-tenant Kubernetes clusters.", tags: ["kubernetes", "multi-tenancy"] },
];

const TechPage = () => {
  const [showAtlas, setShowAtlas] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const earnedCount = mockCertifications.filter(c => c.status === "earned").length;
  const preparingCount = mockCertifications.filter(c => c.status === "preparing").length;

  const stats = [
    { icon: Sparkles, label: "Skills", value: skillData.length, suffix: "tracked", color: "text-tech" },
    { icon: Award, label: "Certified", value: earnedCount, suffix: `+${preparingCount} prep`, color: "text-finance" },
    { icon: Lightbulb, label: "Research", value: mockResearch.length, suffix: "topics", color: "text-purple-400" },
    { icon: BookOpen, label: "Library", value: 7, suffix: "resources", color: "text-trading" },
  ];

  return (
    <MainLayout>
      <PageTransition>
        <div className="min-h-screen flex">
          <div className="flex-1">
            <DomainPageHeader
            icon={Code2}
            title="Tech Mastery Hub"
            subtitle="Skills, certifications & research"
            domainColor="tech"
            action={{
              icon: MessageSquare,
              label: "Ask Atlas",
              onClick: () => setShowAtlas(true),
            }}
          />

          <DomainStatsBar stats={stats} />

          <div className="px-8 pb-8">
            <div className="max-w-5xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="certifications">Certifications</TabsTrigger>
                  <TabsTrigger value="research">Research</TabsTrigger>
                  <TabsTrigger value="library">Library</TabsTrigger>
                </TabsList>

              <TabsContent value="overview">
                <TechOverview
                  skillData={skillData}
                  activeCertifications={mockCertifications}
                  recentResearch={mockResearch}
                  onNavigate={setActiveTab}
                />
              </TabsContent>

              <TabsContent value="skills">
                <SkillsTracker />
              </TabsContent>

              <TabsContent value="certifications">
                <CertificationsHub />
              </TabsContent>

              <TabsContent value="research">
                <ResearchJournal />
              </TabsContent>

              <TabsContent value="library">
                <TechLibrary />
              </TabsContent>
            </Tabs>
            </div>
          </div>
          </div>

          <Sheet open={showAtlas} onOpenChange={setShowAtlas}>
            <SheetContent className="w-full sm:max-w-lg p-0">
              <AIChatSidebar name="Atlas" role="Tech Mentor" domainColor="tech">
                <AtlasChat />
              </AIChatSidebar>
            </SheetContent>
          </Sheet>
        </div>
      </PageTransition>
    </MainLayout>
  );
};

export default TechPage;
