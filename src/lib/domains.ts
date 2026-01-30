// Centralized domain configuration for the notes system

export type DomainId = 'spiritual' | 'trading' | 'tech' | 'finance' | 'music' | 'projects' | 'content';

export interface Domain {
  id: DomainId;
  label: string;
  icon: string;
  path: string;
  description: string;
}

export const DOMAINS: Domain[] = [
  { id: 'spiritual', label: 'Spiritual', icon: '🙏', path: '/spiritual', description: 'Your spiritual growth workspace' },
  { id: 'trading', label: 'Trading', icon: '📈', path: '/investments', description: 'Trading insights and analysis' },
  { id: 'tech', label: 'Tech', icon: '💻', path: '/tech', description: 'Technical learning and notes' },
  { id: 'finance', label: 'Finance', icon: '💰', path: '/finance', description: 'Financial planning and tracking' },
  { id: 'music', label: 'Music', icon: '🎵', path: '/music', description: 'Music practice and study' },
  { id: 'projects', label: 'Projects', icon: '📁', path: '/projects', description: 'Project documentation' },
  { id: 'content', label: 'Content', icon: '📚', path: '/content', description: 'Content consumption log' },
];

export const getDomainById = (id: DomainId | string | null): Domain | undefined => {
  return DOMAINS.find(d => d.id === id);
};

export const getDomainIcon = (domainId: DomainId | string | null): string => {
  const domain = getDomainById(domainId);
  return domain?.icon || '📝';
};
