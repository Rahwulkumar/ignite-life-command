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
        <div className="min-h-screen">
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

          <div className="max-w-5xl mx-auto px-8 pb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-auto p-0 mb-6">
                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-tech data-[state=active]:bg-transparent px-4 py-3">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="skills" className="rounded-none border-b-2 border-transparent data-[state=active]:border-tech data-[state=active]:bg-transparent px-4 py-3">
                  Skills
                </TabsTrigger>
                <TabsTrigger value="certifications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-tech data-[state=active]:bg-transparent px-4 py-3">
                  Certifications
                </TabsTrigger>
                <TabsTrigger value="research" className="rounded-none border-b-2 border-transparent data-[state=active]:border-tech data-[state=active]:bg-transparent px-4 py-3">
                  Research
                </TabsTrigger>
                <TabsTrigger value="library" className="rounded-none border-b-2 border-transparent data-[state=active]:border-tech data-[state=active]:bg-transparent px-4 py-3">
                  Library
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-0">
                <TechOverview 
                  skillData={skillData}
                  activeCertifications={mockCertifications}
                  recentResearch={mockResearch}
                  onNavigate={setActiveTab}
                />
              </TabsContent>

              <TabsContent value="skills" className="mt-0">
                <SkillsTracker />
              </TabsContent>

              <TabsContent value="certifications" className="mt-0">
                <CertificationsHub />
              </TabsContent>

              <TabsContent value="research" className="mt-0">
                <ResearchJournal />
              </TabsContent>

              <TabsContent value="library" className="mt-0">
                <TechLibrary />
              </TabsContent>
            </Tabs>
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
