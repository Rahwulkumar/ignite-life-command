// Centralized domain configuration for the notes system
import { Heart, TrendingUp, Code, Wallet, Music, FolderKanban, BookOpen, type LucideIcon } from "lucide-react";

export type DomainId = 'spiritual' | 'trading' | 'tech' | 'finance' | 'music' | 'projects' | 'content';

export interface Domain {
  id: DomainId;
  label: string;
  iconName: string;
  path: string;
  description: string;
}

export const DOMAINS: Domain[] = [
  { id: 'spiritual', label: 'Spiritual', iconName: 'heart', path: '/spiritual', description: 'Your spiritual growth workspace' },
  { id: 'trading', label: 'Trading', iconName: 'trending-up', path: '/investments', description: 'Trading insights and analysis' },
  { id: 'tech', label: 'Tech', iconName: 'code', path: '/tech', description: 'Technical learning and notes' },
  { id: 'finance', label: 'Finance', iconName: 'wallet', path: '/finance', description: 'Financial planning and tracking' },
  { id: 'music', label: 'Music', iconName: 'music', path: '/music', description: 'Music practice and study' },
  { id: 'projects', label: 'Projects', iconName: 'folder-kanban', path: '/projects', description: 'Project documentation' },
  { id: 'content', label: 'Content', iconName: 'book-open', path: '/content', description: 'Content consumption log' },
];

// Lucide icon mapping for each domain
export const DOMAIN_ICONS: Record<DomainId, LucideIcon> = {
  spiritual: Heart,
  trading: TrendingUp,
  tech: Code,
  finance: Wallet,
  music: Music,
  projects: FolderKanban,
  content: BookOpen,
};

export const getDomainById = (id: DomainId | string | null): Domain | undefined => {
  return DOMAINS.find(d => d.id === id);
};

// DomainIcon component for rendering domain icons
export function DomainIcon({ 
  domainId, 
  className 
}: { 
  domainId: DomainId | string | null; 
  className?: string;
}) {
  if (!domainId) return null;
  const IconComponent = DOMAIN_ICONS[domainId as DomainId];
  return IconComponent ? <IconComponent className={className} /> : null;
}
