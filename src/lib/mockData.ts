// Centralized mock data for all domains
// This file contains all mock/placeholder data used throughout the application
// TODO: Replace with API-backed domain data as features are implemented

// ============================================================================
// TECH DOMAIN
// ============================================================================

export const techMockData = {
    skills: [
        { domain: "Frontend", value: 75 },
        { domain: "Backend", value: 55 },
        { domain: "Cloud", value: 40 },
        { domain: "AI/ML", value: 30 },
        { domain: "Security", value: 25 },
        { domain: "DevOps", value: 45 },
    ],

    certifications: [
        {
            id: "1",
            name: "Solutions Architect Associate",
            provider: "AWS",
            status: "preparing" as const,
            targetDate: "2025-03-15",
            progress: 45,
        },
        {
            id: "2",
            name: "Professional Cloud Architect",
            provider: "Google",
            status: "preparing" as const,
            targetDate: "2025-06-01",
            progress: 20,
        },
        {
            id: "3",
            name: "Developer Associate",
            provider: "AWS",
            status: "earned" as const,
            earnedDate: "2024-08-20",
        },
    ],

    research: [
        {
            id: "1",
            title: "LLM Fine-tuning Techniques",
            domain: "AI/ML",
            date: "2025-01-12",
            insights: "Explored LoRA and QLoRA for efficient fine-tuning of large language models.",
            tags: ["llm", "fine-tuning"],
        },
        {
            id: "2",
            title: "Kubernetes Multi-tenancy",
            domain: "Cloud",
            date: "2025-01-10",
            insights: "Researched different approaches for multi-tenant Kubernetes clusters.",
            tags: ["kubernetes", "multi-tenancy"],
        },
    ],
};

// ============================================================================
// SPIRITUAL DOMAIN
// ============================================================================

export const spiritualMockData = {
    verses: [
        {
            id: "1",
            reference: "Romans 8:28",
            verseText: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
            masteryLevel: 3,
        },
        {
            id: "2",
            reference: "Philippians 4:13",
            verseText: "I can do all this through him who gives me strength.",
            masteryLevel: 4,
        },
        {
            id: "3",
            reference: "Jeremiah 29:11",
            verseText: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.",
            masteryLevel: 2,
        },
    ],

    goals: [
        {
            id: "1",
            title: "Read through Psalms",
            progress: 65,
            isCompleted: false,
            category: "reading",
        },
        {
            id: "2",
            title: "Memorize Romans 8",
            progress: 40,
            isCompleted: false,
            category: "memory",
        },
        {
            id: "3",
            title: "Daily morning prayer",
            progress: 80,
            isCompleted: false,
            category: "prayer",
        },
    ],

    bibleReading: {
        currentBook: "Romans",
        currentChapter: 8,
        completedChapters: 245,
        totalChapters: 1189,
    },
};

// ============================================================================
// FINANCE DOMAIN
// ============================================================================

export const financeMockData = {
    stats: {
        balance: "₦1.25M",
        spending: "₦450K",
        savings: "₦120K",
        transactions: 48,
    },

    expenses: [
        {
            id: "1",
            category: "Food",
            amount: 15000,
            date: "2025-02-01",
            description: "Groceries",
        },
        {
            id: "2",
            category: "Transport",
            amount: 8000,
            date: "2025-02-02",
            description: "Fuel",
        },
    ],

    budgets: [
        {
            id: "1",
            category: "Food",
            allocated: 50000,
            spent: 35000,
            remaining: 15000,
        },
        {
            id: "2",
            category: "Transport",
            allocated: 30000,
            spent: 28000,
            remaining: 2000,
        },
    ],
};

// ============================================================================
// TRADING DOMAIN
// ============================================================================

export const tradingMockData = {
    stats: {
        portfolio: "$24,850",
        invested: "$20,325",
        returns: "+$4,525",
        roi: "+22.3%",
    },

    holdings: [
        {
            id: "1",
            name: "Apple Inc.",
            symbol: "AAPL",
            type: "stock" as const,
            units: 50,
            avgCost: 150,
            currentPrice: 175,
            returns: 1250,
            returnsPercent: 16.67,
        },
        {
            id: "2",
            name: "Vanguard S&P 500 ETF",
            symbol: "VOO",
            type: "etf" as const,
            units: 25,
            avgCost: 400,
            currentPrice: 450,
            returns: 1250,
            returnsPercent: 12.5,
        },
    ],

    watchlist: [
        { symbol: "TSLA", name: "Tesla Inc.", price: 245.5, change: 2.3 },
        { symbol: "MSFT", name: "Microsoft", price: 420.8, change: -1.2 },
    ],
};

// ============================================================================
// MUSIC DOMAIN
// ============================================================================

export const musicMockData = {
    stats: {
        weeklyHours: "3.5",
        focus: "Guitar",
        sessions: 5,
        pieces: 12,
    },

    practices: [
        {
            id: "1",
            date: "2025-02-03",
            duration: 45,
            focus: "Scales",
            notes: "Worked on major scales",
        },
        {
            id: "2",
            date: "2025-02-02",
            duration: 60,
            focus: "Song practice",
            notes: "Practiced new song",
        },
    ],

    repertoire: [
        {
            id: "1",
            title: "Moonlight Sonata",
            composer: "Beethoven",
            status: "learning" as const,
            progress: 60,
        },
        {
            id: "2",
            title: "Clair de Lune",
            composer: "Debussy",
            status: "mastered" as const,
            progress: 100,
        },
    ],
};

// ============================================================================
// CONTENT DOMAIN
// ============================================================================

export const contentMockData = {
    stats: {
        saved: 128,
        folders: 8,
        thisWeek: 8,
        readingHours: "2.5",
    },

    folders: [
        { id: "1", name: "Tech Articles", count: 45, color: "tech" },
        { id: "2", name: "Finance News", count: 32, color: "finance" },
        { id: "3", name: "Spiritual Content", count: 28, color: "spiritual" },
    ],

    savedItems: [
        {
            id: "1",
            title: "Understanding React Server Components",
            type: "article" as const,
            url: "https://example.com",
            savedDate: "2025-02-01",
            folder: "Tech Articles",
        },
        {
            id: "2",
            title: "Investment Strategies for 2025",
            type: "video" as const,
            url: "https://example.com",
            savedDate: "2025-01-30",
            folder: "Finance News",
        },
    ],
};

// ============================================================================
// PROJECTS DOMAIN
// ============================================================================

export const projectsMockData = {
    stats: {
        active: 3,
        completed: 12,
        tasks: 32,
        dueSoon: 5,
    },

    projects: [
        {
            id: "1",
            name: "Portfolio Website",
            status: "in-progress" as const,
            progress: 75,
            tasks: 12,
            completedTasks: 9,
            dueDate: "2025-02-15",
        },
        {
            id: "2",
            name: "Mobile App",
            status: "in-progress" as const,
            progress: 40,
            tasks: 20,
            completedTasks: 8,
            dueDate: "2025-03-01",
        },
    ],

    tasks: [
        {
            id: "1",
            title: "Design homepage",
            project: "Portfolio Website",
            status: "completed" as const,
            priority: "high" as const,
            dueDate: "2025-02-05",
        },
        {
            id: "2",
            title: "Implement authentication",
            project: "Mobile App",
            status: "in-progress" as const,
            priority: "high" as const,
            dueDate: "2025-02-10",
        },
    ],
};

// ============================================================================
// DASHBOARD DOMAIN
// ============================================================================

export const dashboardMockData = {
    weeklyActivity: [
        { day: "Mon", tasks: 6, total: 8, hours: 4.5, points: 25, completed: true, completionRate: 75, isToday: false, domainBreakdown: { tech: 3, finance: 2, spiritual: 1 } },
        { day: "Tue", tasks: 8, total: 8, hours: 6.2, points: 40, completed: true, completionRate: 100, isToday: false, domainBreakdown: { tech: 4, trading: 2, other: 2 } },
        { day: "Wed", tasks: 4, total: 8, hours: 3.1, points: 15, completed: false, completionRate: 50, isToday: false, domainBreakdown: { music: 2, work: 2 } },
        { day: "Thu", tasks: 7, total: 9, hours: 5.5, points: 35, completed: true, completionRate: 77, isToday: false, domainBreakdown: { finance: 3, spiritual: 2, tech: 2 } },
        { day: "Fri", tasks: 5, total: 8, hours: 4.0, points: 20, completed: false, completionRate: 62, isToday: true, domainBreakdown: { content: 2, tech: 1, trading: 2 } },
        { day: "Sat", tasks: 3, total: 6, hours: 2.5, points: 10, completed: false, completionRate: 50, isToday: false, domainBreakdown: { music: 3 } },
        { day: "Sun", tasks: 2, total: 5, hours: 1.5, points: 5, completed: false, completionRate: 40, isToday: false, domainBreakdown: { spiritual: 2 } },
    ],
    domainFocus: [
        { domain: "Tech", tasks: 12, fullMark: 15 },
        { domain: "Finance", tasks: 9, fullMark: 15 },
        { domain: "Trading", tasks: 8, fullMark: 15 },
        { domain: "Spiritual", tasks: 7, fullMark: 15 },
        { domain: "Music", tasks: 5, fullMark: 15 },
        { domain: "Content", tasks: 4, fullMark: 15 },
    ],
    completionChart: [
        { id: "1", task_id: "spiritual_prayer", entry_date: "2026-02-03", is_completed: true },
        { id: "2", task_id: "spiritual_bible", entry_date: "2026-02-03", is_completed: true },
        { id: "3", task_id: "finance_budget", entry_date: "2026-02-03", is_completed: true },
        { id: "4", task_id: "tech_dsa", entry_date: "2026-02-03", is_completed: true },

        { id: "5", task_id: "spiritual_prayer", entry_date: "2026-02-04", is_completed: true },
        { id: "6", task_id: "spiritual_bible", entry_date: "2026-02-04", is_completed: true },
        { id: "7", task_id: "finance_budget", entry_date: "2026-02-04", is_completed: true },
        { id: "8", task_id: "tech_dsa", entry_date: "2026-02-04", is_completed: true },
        { id: "9", task_id: "trading_research", entry_date: "2026-02-04", is_completed: true },

        { id: "10", task_id: "spiritual_prayer", entry_date: "2026-02-05", is_completed: true },
        { id: "11", task_id: "finance_budget", entry_date: "2026-02-05", is_completed: true },

        { id: "12", task_id: "spiritual_prayer", entry_date: "2026-02-06", is_completed: true },
        { id: "13", task_id: "spiritual_bible", entry_date: "2026-02-06", is_completed: true },
        { id: "14", task_id: "finance_budget", entry_date: "2026-02-06", is_completed: true },
        { id: "15", task_id: "tech_dsa", entry_date: "2026-02-06", is_completed: true },

        { id: "16", task_id: "spiritual_prayer", entry_date: "2026-02-07", is_completed: true },
        { id: "17", task_id: "finance_budget", entry_date: "2026-02-07", is_completed: true },
        { id: "18", task_id: "tech_dsa", entry_date: "2026-02-07", is_completed: true },

        { id: "19", task_id: "spiritual_prayer", entry_date: "2026-02-08", is_completed: true },
        { id: "20", task_id: "spiritual_bible", entry_date: "2026-02-08", is_completed: true },

        { id: "21", task_id: "spiritual_prayer", entry_date: "2026-02-09", is_completed: true },
    ]
};

// ============================================================================
// EXPORT ALL MOCK DATA
// ============================================================================

export const mockData = {
    tech: techMockData,
    spiritual: spiritualMockData,
    finance: financeMockData,
    trading: tradingMockData,
    music: musicMockData,
    content: contentMockData,
    projects: projectsMockData,
    dashboard: dashboardMockData,
} as const;

// Type exports for convenience
export type TechMockData = typeof techMockData;
export type SpiritualMockData = typeof spiritualMockData;
export type FinanceMockData = typeof financeMockData;
export type TradingMockData = typeof tradingMockData;
export type MusicMockData = typeof musicMockData;
export type ContentMockData = typeof contentMockData;
export type ProjectsMockData = typeof projectsMockData;
export type DashboardMockData = typeof dashboardMockData;
