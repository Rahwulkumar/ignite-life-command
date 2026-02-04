import { useState } from "react";
import { Code2, Sparkles, Award, Lightbulb, BookOpen } from "lucide-react";
import { DomainPageTemplate } from "@/components/shared/DomainPageTemplate";
import { TechOverview } from "@/components/tech/TechOverview";
import { SkillsTracker } from "@/components/tech/SkillsTracker";
import { CertificationsHub } from "@/components/tech/CertificationsHub";
import { ResearchJournal } from "@/components/tech/ResearchJournal";
import { TechLibrary } from "@/components/tech/TechLibrary";
import { AtlasChat } from "@/components/tech/AtlasChat";
import { techMockData } from "@/lib/mockData";

const TechPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Use centralized mock data
  const { skills: skillData, certifications: mockCertifications, research: mockResearch } = techMockData;

  const earnedCount = mockCertifications.filter(c => c.status === "earned").length;
  const preparingCount = mockCertifications.filter(c => c.status === "preparing").length;

  const stats = [
    { icon: Sparkles, label: "Skills", value: skillData.length, suffix: "tracked", color: "text-tech" },
    { icon: Award, label: "Certified", value: earnedCount, suffix: `+${preparingCount} prep`, color: "text-finance" },
    { icon: Lightbulb, label: "Research", value: mockResearch.length, suffix: "topics", color: "text-purple-400" },
    { icon: BookOpen, label: "Library", value: 7, suffix: "resources", color: "text-trading" },
  ];

  return (
    <DomainPageTemplate
      domain={{
        icon: Code2,
        title: "Tech Mastery Hub",
        subtitle: "Skills, certifications & research",
        color: "tech",
      }}
      stats={stats}
      tabs={[
        {
          value: "overview",
          label: "Overview",
          component: (
            <TechOverview
              skillData={skillData}
              certifications={mockCertifications}
              research={mockResearch}
            />
          ),
        },
        {
          value: "skills",
          label: "Skills",
          component: <SkillsTracker />,
        },
        {
          value: "certifications",
          label: "Certifications",
          component: <CertificationsHub />,
        },
        {
          value: "research",
          label: "Research",
          component: <ResearchJournal />,
        },
        {
          value: "library",
          label: "Library",
          component: <TechLibrary />,
        },
      ]}
      aiCoach={{
        name: "Atlas",
        role: "Tech Mentor",
        component: <AtlasChat />,
      }}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
};

export default TechPage;
