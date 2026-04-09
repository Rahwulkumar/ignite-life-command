import {
  Brain,
  Cloud,
  Code,
  Cpu,
  Database,
  Globe,
  Server,
  Shield,
  Smartphone,
  Terminal,
  type LucideIcon,
} from "lucide-react";

export type TechIconKey =
  | "Code"
  | "Server"
  | "Cloud"
  | "Shield"
  | "Brain"
  | "Smartphone"
  | "Globe"
  | "Database"
  | "Terminal"
  | "Cpu";

export const TECH_ICON_COMPONENTS: Record<TechIconKey, LucideIcon> = {
  Code,
  Server,
  Cloud,
  Shield,
  Brain,
  Smartphone,
  Globe,
  Database,
  Terminal,
  Cpu,
};

export function TechIcon({
  iconKey,
  className = "w-5 h-5",
}: {
  iconKey: TechIconKey;
  className?: string;
}) {
  const Icon = TECH_ICON_COMPONENTS[iconKey];
  return <Icon className={className} />;
}
