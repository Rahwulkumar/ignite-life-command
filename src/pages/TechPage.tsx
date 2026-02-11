import { useState } from "react";
import { Code2, Sparkles, Award, Lightbulb, BookOpen, Code, Server, Cloud, Brain, Smartphone, Shield } from "lucide-react";
import { DomainPageTemplate } from "@/components/shared/DomainPageTemplate";
import { TechOverview } from "@/components/tech/TechOverview";
import { SkillsTracker, SkillDomain } from "@/components/tech/SkillsTracker";
import { CertificationsHub } from "@/components/tech/CertificationsHub";
import { ResearchJournal } from "@/components/tech/ResearchJournal";
import { TechLibrary, TechResource } from "@/components/tech/TechLibrary";
import { AtlasChat } from "@/components/tech/AtlasChat";
import { techMockData } from "@/lib/mockData";
import { Certification } from "@/components/tech/CertificationCard";
import { ResearchEntry } from "@/components/tech/ResearchEntryCard";

// Mock data for SkillsTracker - includes React icons
const mockSkillDomains: SkillDomain[] = [
  {
    id: "frontend", name: "Frontend", icon: <Code className="w-5 h-5" />, color: "tech", skills: [
      { id: "1", name: "React", proficiency: "advanced", lastUpdated: "2025-01-10" },
      { id: "2", name: "TypeScript", proficiency: "advanced", lastUpdated: "2025-01-08" },
      { id: "3", name: "Next.js", proficiency: "intermediate", lastUpdated: "2025-01-05" },
    ]
  },
  {
    id: "backend", name: "Backend", icon: <Server className="w-5 h-5" />, color: "finance", skills: [
      { id: "4", name: "Node.js", proficiency: "intermediate", lastUpdated: "2025-01-07" },
      { id: "5", name: "Python", proficiency: "intermediate", lastUpdated: "2025-01-03" },
    ]
  },
  {
    id: "cloud", name: "Cloud & DevOps", icon: <Cloud className="w-5 h-5" />, color: "trading", skills: [
      { id: "6", name: "AWS", proficiency: "beginner", lastUpdated: "2025-01-01" },
      { id: "7", name: "Docker", proficiency: "intermediate", lastUpdated: "2024-12-28" },
    ]
  },
  {
    id: "ai", name: "AI & Machine Learning", icon: <Brain className="w-5 h-5" />, color: "spiritual", skills: [
      { id: "8", name: "LangChain", proficiency: "beginner", lastUpdated: "2025-01-09" },
    ]
  },
  { id: "mobile", name: "Mobile Development", icon: <Smartphone className="w-5 h-5" />, color: "music", skills: [] },
  { id: "security", name: "Security", icon: <Shield className="w-5 h-5" />, color: "content", skills: [] },
];

// Mock data for TechLibrary
const mockLibraryResources: TechResource[] = [
  { id: "1", title: "Designing Data-Intensive Applications", type: "book", source: "O'Reilly", url: "#", category: "System Design", pinned: true, rating: 5 },
  { id: "2", title: "React 19 Deep Dive", type: "article", source: "React Blog", url: "#", category: "Frontend", pinned: true, rating: 4 },
  { id: "3", title: "Building LLM Apps with LangChain", type: "video", source: "YouTube", url: "#", category: "AI/ML", pinned: false, rating: 5 },
  { id: "4", title: "AWS Solutions Architect Course", type: "course", source: "Udemy", url: "#", category: "Cloud", pinned: false, rating: 4 },
  { id: "5", title: "Clean Code", type: "book", source: "Robert Martin", url: "#", category: "Backend", pinned: false, rating: 5 },
  { id: "6", title: "Docker for Beginners", type: "video", source: "freeCodeCamp", url: "#", category: "DevOps", pinned: false, rating: 3 },
  { id: "7", title: "Kubernetes Patterns", type: "book", source: "O'Reilly", url: "#", category: "DevOps", pinned: false, rating: 4 },
];

// Mock data for ResearchJournal
const mockResearchEntries: ResearchEntry[] = [
  {
    id: "1",
    title: "LLM Fine-tuning Techniques",
    domain: "AI/ML",
    date: "2025-01-12",
    insights: "Explored LoRA and QLoRA for efficient fine-tuning of large language models. Key finding: QLoRA can reduce memory usage by 65% while maintaining similar performance.",
    tags: ["llm", "fine-tuning", "qlora"],
    links: [
      { title: "QLoRA Paper", url: "https://arxiv.org/abs/2305.14314" },
      { title: "HuggingFace Guide", url: "https://huggingface.co/docs" },
    ],
  },
  {
    id: "2",
    title: "Kubernetes Multi-tenancy Patterns",
    domain: "Cloud",
    date: "2025-01-10",
    insights: "Researched different approaches for multi-tenant Kubernetes clusters. Namespace isolation with network policies provides good security for most use cases.",
    tags: ["kubernetes", "multi-tenancy", "security"],
  },
  {
    id: "3",
    title: "Zero-Knowledge Proofs in Identity",
    domain: "Blockchain",
    date: "2025-01-05",
    insights: "Investigated zk-SNARKs and their application in privacy-preserving identity verification.",
    tags: ["zkp", "identity", "privacy"],
    links: [{ title: "zkSNARK Explainer", url: "https://example.com" }],
  },
];

// Mock data for CertificationsHub
const mockCertifications: Certification[] = [
  { id: "1", name: "Solutions Architect Associate", provider: "AWS", status: "preparing", targetDate: "2025-03-15", progress: 45 },
  { id: "2", name: "Professional Cloud Architect", provider: "Google", status: "preparing", targetDate: "2025-06-01", progress: 20 },
  { id: "3", name: "Developer Associate", provider: "AWS", status: "earned", earnedDate: "2024-08-20", credentialUrl: "https://aws.amazon.com/verification" },
  { id: "4", name: "React Developer Certificate", provider: "Meta", status: "earned", earnedDate: "2024-05-10" },
];

const TechPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Use centralized mock data for overview
  const { skills: skillData, certifications: overviewCerts, research: mockResearch } = techMockData;

  const earnedCount = mockCertifications.filter(c => c.status === "earned").length;
  const preparingCount = mockCertifications.filter(c => c.status === "preparing").length;

  const stats = [
    { icon: Sparkles, label: "Skills", value: skillData.length, suffix: "tracked", color: "text-tech" },
    { icon: Award, label: "Certified", value: earnedCount, suffix: `+${preparingCount} prep`, color: "text-finance" },
    { icon: Lightbulb, label: "Research", value: mockResearchEntries.length, suffix: "topics", color: "text-purple-400" },
    { icon: BookOpen, label: "Library", value: mockLibraryResources.length, suffix: "resources", color: "text-trading" },
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
              activeCertifications={overviewCerts}
              recentResearch={mockResearch}
              onNavigate={setActiveTab}
            />
          ),
        },
        {
          value: "skills",
          label: "Skills",
          component: <SkillsTracker initialDomains={mockSkillDomains} />,
        },
        {
          value: "certifications",
          label: "Certifications",
          component: <CertificationsHub initialCertifications={mockCertifications} />,
        },
        {
          value: "research",
          label: "Research",
          component: <ResearchJournal initialEntries={mockResearchEntries} />,
        },
        {
          value: "library",
          label: "Library",
          component: <TechLibrary initialResources={mockLibraryResources} />,
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
