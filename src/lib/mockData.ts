// Centralized mock data for all domains
// This file contains all mock/placeholder data used throughout the application
// TODO: Replace with real data from Supabase as features are implemented

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
} as const;

// Type exports for convenience
export type TechMockData = typeof techMockData;
export type SpiritualMockData = typeof spiritualMockData;
export type FinanceMockData = typeof financeMockData;
export type TradingMockData = typeof tradingMockData;
export type MusicMockData = typeof musicMockData;
export type ContentMockData = typeof contentMockData;
export type ProjectsMockData = typeof projectsMockData;
