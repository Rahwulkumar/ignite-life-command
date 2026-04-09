import type { Transaction } from "@/components/finance/ExpenseTracker";
import type { Budget } from "@/components/finance/BudgetOverview";
import type { Investment } from "@/components/finance/InvestmentTracker";
import type { ContentFolder } from "@/components/content/ContentFolders";
import type { SavedItem } from "@/components/content/SavedItems";
import type { PracticeSession } from "@/components/music/PracticeTracker";
import type { Song } from "@/components/music/RepertoireCard";
import type { Certification } from "@/components/tech/CertificationCard";
import type { ResearchEntry } from "@/components/tech/ResearchEntryCard";
import type { SkillDomain } from "@/components/tech/SkillsTracker";
import type { TechResource } from "@/components/tech/TechLibrary";
import type { Holding, PortfolioDataPoint, Trade, WatchlistItem } from "@/types/domain";

export const financeSeedTransactions: Transaction[] = [
  { id: 1, description: "Grocery Shopping", amount: -15000, date: "Today", category: "Food" },
  { id: 2, description: "Freelance Payment", amount: 150000, date: "Yesterday", category: "Income" },
  { id: 3, description: "Netflix Subscription", amount: -4500, date: "Dec 27", category: "Entertainment" },
  { id: 4, description: "Electricity Bill", amount: -8200, date: "Dec 26", category: "Utilities" },
  { id: 5, description: "Side Project Payment", amount: 75000, date: "Dec 25", category: "Income" },
  { id: 6, description: "Restaurant Dinner", amount: -12000, date: "Dec 24", category: "Food" },
  { id: 7, description: "Uber Rides", amount: -5500, date: "Dec 23", category: "Transport" },
];

export const financeSeedBudgets: Budget[] = [
  { id: 1, category: "Food & Groceries", allocated: 100000, spent: 67000, color: "bg-finance" },
  { id: 2, category: "Transportation", allocated: 50000, spent: 32000, color: "bg-trading" },
  { id: 3, category: "Entertainment", allocated: 30000, spent: 28500, color: "bg-tech" },
  { id: 4, category: "Utilities", allocated: 40000, spent: 38200, color: "bg-spiritual" },
  { id: 5, category: "Shopping", allocated: 60000, spent: 15000, color: "bg-music" },
];

export const financeSeedInvestments: Investment[] = [
  { id: 1, name: "Emergency Fund", type: "Savings", invested: 500000, current: 520000, change: 4.0 },
  { id: 2, name: "Stock Portfolio", type: "Equity", invested: 300000, current: 342000, change: 14.0 },
  { id: 3, name: "Mutual Fund", type: "Fund", invested: 200000, current: 218000, change: 9.0 },
  { id: 4, name: "Treasury Bills", type: "Fixed Income", invested: 150000, current: 157500, change: 5.0 },
];

export const musicSeedSessions: PracticeSession[] = [
  { id: 1, focus: "Chord progressions", instrument: "Guitar", duration: 45, date: "Today", notes: "Working on I-IV-V-I transitions", rating: 4 },
  { id: 2, focus: "Scales practice", instrument: "Guitar", duration: 30, date: "Yesterday", notes: "Pentatonic minor in all positions", rating: 3 },
  { id: 3, focus: "Hotel California", instrument: "Guitar", duration: 60, date: "Dec 27", notes: "Intro solo almost down", rating: 5 },
  { id: 4, focus: "Fingerpicking patterns", instrument: "Guitar", duration: 20, date: "Dec 26", notes: "Travis picking exercises", rating: 3 },
  { id: 5, focus: "Music theory", instrument: "General", duration: 45, date: "Dec 25", notes: "Circle of fifths review", rating: 4 },
];

export const musicSeedRepertoire: Song[] = [
  { id: 1, title: "Wonderwall", artist: "Oasis", difficulty: "Beginner", status: "mastered", progress: 100 },
  { id: 2, title: "Hotel California", artist: "Eagles", difficulty: "Intermediate", status: "learning", progress: 75 },
  { id: 3, title: "Stairway to Heaven", artist: "Led Zeppelin", difficulty: "Intermediate", status: "learning", progress: 40 },
  { id: 4, title: "Blackbird", artist: "The Beatles", difficulty: "Intermediate", status: "queued", progress: 0 },
  { id: 5, title: "Classical Gas", artist: "Mason Williams", difficulty: "Advanced", status: "queued", progress: 0 },
];

export const contentSeedFolders: ContentFolder[] = [
  { id: 1, name: "Learning", count: 34, color: "bg-tech" },
  { id: 2, name: "Entertainment", count: 45, color: "bg-music" },
  { id: 3, name: "Inspiration", count: 28, color: "bg-spiritual" },
  { id: 4, name: "Tech Tutorials", count: 21, color: "bg-trading" },
  { id: 5, name: "Music Theory", count: 15, color: "bg-music" },
  { id: 6, name: "Design Inspo", count: 32, color: "bg-content" },
  { id: 7, name: "Productivity", count: 18, color: "bg-finance" },
  { id: 8, name: "Watch Later", count: 67, color: "bg-muted-foreground" },
];

export const contentSeedItems: SavedItem[] = [
  { id: 1, title: "React Server Components Deep Dive", source: "YouTube", type: "video", date: "Today", url: "#" },
  { id: 2, title: "Minimalist Desk Setup Inspo", source: "Instagram", type: "reel", date: "Yesterday", url: "#" },
  { id: 3, title: "System Design Interview Prep", source: "YouTube", type: "video", date: "Dec 27", url: "#" },
  { id: 4, title: "Morning Routine for Productivity", source: "Instagram", type: "reel", date: "Dec 26", url: "#" },
  { id: 5, title: "Advanced TypeScript Patterns", source: "Medium", type: "article", date: "Dec 25", url: "#" },
];

export const tradingSeedWatchlist: WatchlistItem[] = [
  { id: 1, symbol: "AMZN", name: "Amazon", price: 153.42, change: 2.1, notes: "Watching for breakout" },
  { id: 2, symbol: "AMD", name: "AMD Inc.", price: 147.8, change: -1.5, notes: "Support at $145" },
  { id: 3, symbol: "COIN", name: "Coinbase", price: 178.3, change: 5.8, notes: "Crypto momentum" },
  { id: 4, symbol: "PLTR", name: "Palantir", price: 18.45, change: -0.8, notes: "AI government plays" },
];

export const tradingSeedTrades: Trade[] = [
  { id: 1, symbol: "AAPL", type: "buy", quantity: 10, price: 185.5, date: "Dec 28", notes: "Support level bounce", pnl: 68 },
  { id: 2, symbol: "NVDA", type: "buy", quantity: 3, price: 480, date: "Dec 26", notes: "AI momentum play", pnl: 45 },
  { id: 3, symbol: "TSLA", type: "sell", quantity: 5, price: 252.3, date: "Dec 24", notes: "Taking profits at resistance", pnl: 120 },
  { id: 4, symbol: "MSFT", type: "buy", quantity: 8, price: 375, date: "Dec 22", notes: "Cloud growth thesis", pnl: -52 },
  { id: 5, symbol: "META", type: "sell", quantity: 4, price: 345.8, date: "Dec 20", notes: "Rebalancing portfolio", pnl: 85 },
];

export const tradingSeedHoldings: Holding[] = [
  { id: "1", name: "Apple Inc.", symbol: "AAPL", type: "stock", units: 15, avgCost: 145.5, currentPrice: 193.42, returns: 718.8, returnsPercent: 32.9 },
  { id: "2", name: "Microsoft Corp.", symbol: "MSFT", type: "stock", units: 8, avgCost: 310.25, currentPrice: 378.91, returns: 549.28, returnsPercent: 22.1 },
  { id: "3", name: "NVIDIA Corp.", symbol: "NVDA", type: "stock", units: 5, avgCost: 420, currentPrice: 495.22, returns: 376.1, returnsPercent: 17.9 },
  { id: "4", name: "Vanguard 500 Index", symbol: "VFIAX", type: "mutual_fund", units: 25, avgCost: 410.5, currentPrice: 458.3, returns: 1195, returnsPercent: 11.6 },
  { id: "5", name: "Fidelity Growth Fund", symbol: "FDGRX", type: "mutual_fund", units: 40, avgCost: 145.2, currentPrice: 168.45, returns: 930, returnsPercent: 16 },
  { id: "6", name: "T. Rowe Price Blue Chip", symbol: "TRBCX", type: "mutual_fund", units: 30, avgCost: 138, currentPrice: 151.2, returns: 396, returnsPercent: 9.6 },
  { id: "7", name: "SPDR S&P 500 ETF", symbol: "SPY", type: "etf", units: 10, avgCost: 420, currentPrice: 475.5, returns: 555, returnsPercent: 13.2 },
  { id: "8", name: "Invesco QQQ Trust", symbol: "QQQ", type: "etf", units: 8, avgCost: 350, currentPrice: 405.8, returns: 446.4, returnsPercent: 15.9 },
  { id: "9", name: "Vanguard Total Bond", symbol: "BND", type: "etf", units: 50, avgCost: 72.5, currentPrice: 71.2, returns: -65, returnsPercent: -1.8 },
  { id: "10", name: "US Treasury 10Y", symbol: "T-10Y", type: "bond", units: 20, avgCost: 950, currentPrice: 942.5, returns: -150, returnsPercent: -0.8 },
  { id: "11", name: "Bitcoin", symbol: "BTC", type: "crypto", units: 0.15, avgCost: 42000, currentPrice: 43250, returns: 187.5, returnsPercent: 3 },
  { id: "12", name: "Ethereum", symbol: "ETH", type: "crypto", units: 2.5, avgCost: 2200, currentPrice: 2350, returns: 375, returnsPercent: 6.8 },
];

export const tradingSeedPortfolio: PortfolioDataPoint[] = [
  { date: "Dec 1", value: 10000 },
  { date: "Dec 5", value: 10250 },
  { date: "Dec 10", value: 10100 },
  { date: "Dec 15", value: 10800 },
  { date: "Dec 20", value: 11200 },
  { date: "Dec 25", value: 11050 },
  { date: "Dec 30", value: 12450 },
];

export const techSeedDomains: SkillDomain[] = [
  {
    id: "frontend",
    name: "Frontend",
    iconKey: "Code",
    color: "tech",
    skills: [
      { id: "1", name: "React", proficiency: "advanced", lastUpdated: "2025-01-10" },
      { id: "2", name: "TypeScript", proficiency: "advanced", lastUpdated: "2025-01-08" },
      { id: "3", name: "Next.js", proficiency: "intermediate", lastUpdated: "2025-01-05" },
    ],
  },
  {
    id: "backend",
    name: "Backend",
    iconKey: "Server",
    color: "finance",
    skills: [
      { id: "4", name: "Node.js", proficiency: "intermediate", lastUpdated: "2025-01-07" },
      { id: "5", name: "Python", proficiency: "intermediate", lastUpdated: "2025-01-03" },
    ],
  },
  {
    id: "cloud",
    name: "Cloud & DevOps",
    iconKey: "Cloud",
    color: "trading",
    skills: [
      { id: "6", name: "AWS", proficiency: "beginner", lastUpdated: "2025-01-01" },
      { id: "7", name: "Docker", proficiency: "intermediate", lastUpdated: "2024-12-28" },
    ],
  },
  {
    id: "ai",
    name: "AI & Machine Learning",
    iconKey: "Brain",
    color: "spiritual",
    skills: [{ id: "8", name: "LangChain", proficiency: "beginner", lastUpdated: "2025-01-09" }],
  },
  { id: "mobile", name: "Mobile Development", iconKey: "Smartphone", color: "music", skills: [] },
  { id: "security", name: "Security", iconKey: "Shield", color: "content", skills: [] },
];

export const techSeedResources: TechResource[] = [
  { id: "1", title: "Designing Data-Intensive Applications", type: "book", source: "O'Reilly", url: "#", category: "System Design", pinned: true, rating: 5 },
  { id: "2", title: "React 19 Deep Dive", type: "article", source: "React Blog", url: "#", category: "Frontend", pinned: true, rating: 4 },
  { id: "3", title: "Building LLM Apps with LangChain", type: "video", source: "YouTube", url: "#", category: "AI/ML", pinned: false, rating: 5 },
  { id: "4", title: "AWS Solutions Architect Course", type: "course", source: "Udemy", url: "#", category: "Cloud", pinned: false, rating: 4 },
  { id: "5", title: "Clean Code", type: "book", source: "Robert Martin", url: "#", category: "Backend", pinned: false, rating: 5 },
  { id: "6", title: "Docker for Beginners", type: "video", source: "freeCodeCamp", url: "#", category: "DevOps", pinned: false, rating: 3 },
  { id: "7", title: "Kubernetes Patterns", type: "book", source: "O'Reilly", url: "#", category: "DevOps", pinned: false, rating: 4 },
];

export const techSeedResearchEntries: ResearchEntry[] = [
  {
    id: "1",
    title: "LLM Fine-tuning Techniques",
    domain: "AI/ML",
    date: "2025-01-12",
    insights:
      "Explored LoRA and QLoRA for efficient fine-tuning of large language models. Key finding: QLoRA can reduce memory usage by 65% while maintaining similar performance.",
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
    insights:
      "Researched different approaches for multi-tenant Kubernetes clusters. Namespace isolation with network policies provides good security for most use cases.",
    tags: ["kubernetes", "multi-tenancy", "security"],
  },
  {
    id: "3",
    title: "Zero-Knowledge Proofs in Identity",
    domain: "Blockchain",
    date: "2025-01-05",
    insights:
      "Investigated zk-SNARKs and their application in privacy-preserving identity verification.",
    tags: ["zkp", "identity", "privacy"],
    links: [{ title: "zkSNARK Explainer", url: "https://example.com" }],
  },
];

export const techSeedCertifications: Certification[] = [
  { id: "1", name: "Solutions Architect Associate", provider: "AWS", status: "preparing", targetDate: "2025-03-15", progress: 45 },
  { id: "2", name: "Professional Cloud Architect", provider: "Google", status: "preparing", targetDate: "2025-06-01", progress: 20 },
  { id: "3", name: "Developer Associate", provider: "AWS", status: "earned", earnedDate: "2024-08-20", credentialUrl: "https://aws.amazon.com/verification" },
  { id: "4", name: "React Developer Certificate", provider: "Meta", status: "earned", earnedDate: "2024-05-10" },
];
