import { useState, ReactNode } from "react";
import { Link } from "react-router-dom";
import { LucideIcon, MessageSquare, StickyNote } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageTransition } from "@/components/layout/PageTransition";
import { DomainPageHeader } from "@/components/shared/DomainPageHeader";
import { DomainStatsBar } from "@/components/shared/DomainStatsBar";
import { AIChatSidebar } from "@/components/shared/AIChatSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { DomainId } from "@/lib/domains";

export interface StatItem {
    icon: LucideIcon;
    label: string;
    value: string | number;
    suffix?: string;
    color?: string;
}

export interface TabConfig {
    value: string;
    label: string;
    component: ReactNode;
}

export interface AICoachConfig {
    name: string;
    role: string;
    component: ReactNode;
}

export interface DomainConfig {
    icon: LucideIcon;
    title: string;
    subtitle: string;
    color: "finance" | "trading" | "tech" | "spiritual" | "music" | "content" | "work";
    notesDomain: DomainId;
}

export interface DomainPageTemplateProps {
    domain: DomainConfig;
    stats: StatItem[];
    tabs: TabConfig[];
    aiCoach?: AICoachConfig;
    headerAction?: {
        icon: LucideIcon;
        label: string;
        onClick: () => void;
    };
    defaultTab?: string;
    activeTab?: string;
    onTabChange?: (value: string) => void;
    children?: ReactNode; // For additional content before tabs
}

export function DomainPageTemplate({
    domain,
    stats,
    tabs,
    aiCoach,
    headerAction,
    defaultTab,
    activeTab,
    onTabChange,
    children,
}: DomainPageTemplateProps) {
    const [showAI, setShowAI] = useState(false);

    // Determine which tab prop to use
    const tabValue = activeTab !== undefined ? activeTab : undefined;
    const tabDefaultValue = defaultTab || tabs[0]?.value;

    return (
        <MainLayout>
            <PageTransition>
                <div className="min-h-screen flex">
                    <div className="flex-1">
                        <DomainPageHeader
                            icon={domain.icon}
                            title={domain.title}
                            subtitle={domain.subtitle}
                            domainColor={domain.color}
                            action={
                                headerAction ||
                                (aiCoach
                                    ? {
                                        icon: MessageSquare,
                                        label: `Ask ${aiCoach.name}`,
                                        onClick: () => setShowAI(true),
                                    }
                                    : undefined)
                            }
                        />

                        <DomainStatsBar stats={stats} />

                        <div className="px-4 sm:px-6 lg:px-8 pb-8">
                            <div className="max-w-5xl mx-auto">
                                <div className="rounded-2xl border border-border/45 bg-card/35 p-3 backdrop-blur-sm sm:p-4">
                                    {/* Additional content before tabs */}
                                    {children}

                                    <Tabs
                                        value={tabValue}
                                        defaultValue={tabDefaultValue}
                                        onValueChange={onTabChange}
                                        className="space-y-4"
                                    >
                                        <TabsList className="flex-wrap border border-border/40 bg-background/60">
                                            {tabs.map((tab) => (
                                                <TabsTrigger key={tab.value} value={tab.value}>
                                                    {tab.label}
                                                </TabsTrigger>
                                            ))}
                                            {/* Notes tab - automatically included */}
                                            <TabsTrigger value="notes" asChild>
                                                <Link
                                                    to="/notes"
                                                    state={{ domain: domain.notesDomain }}
                                                    className="flex items-center gap-1.5"
                                                >
                                                    <StickyNote className="w-3.5 h-3.5" />
                                                    Notes
                                                </Link>
                                            </TabsTrigger>
                                        </TabsList>

                                        {tabs.map((tab) => (
                                            <TabsContent
                                                key={tab.value}
                                                value={tab.value}
                                                className="rounded-xl border border-border/40 bg-background/45 p-3 outline-none sm:p-4"
                                            >
                                                {tab.component}
                                            </TabsContent>
                                        ))}
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Coach Sidebar */}
                    {aiCoach && (
                        <Sheet open={showAI} onOpenChange={setShowAI}>
                            <SheetContent className="w-full sm:max-w-lg p-0">
                                <AIChatSidebar
                                    name={aiCoach.name}
                                    role={aiCoach.role}
                                    domainColor={domain.color}
                                >
                                    {aiCoach.component}
                                </AIChatSidebar>
                            </SheetContent>
                        </Sheet>
                    )}
                </div>
            </PageTransition>
        </MainLayout>
    );
}
