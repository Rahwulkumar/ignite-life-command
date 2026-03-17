import { DOMAIN_ICONS, type DomainId } from "@/lib/domains";

interface DomainIconProps {
  domainId: DomainId | string | null;
  className?: string;
}

export function DomainIcon({ domainId, className }: DomainIconProps) {
  if (!domainId) {
    return null;
  }

  const IconComponent = DOMAIN_ICONS[domainId as DomainId];
  return IconComponent ? <IconComponent className={className} /> : null;
}
