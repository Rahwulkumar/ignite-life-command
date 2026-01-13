import { useMemo } from "react";
import { motion } from "framer-motion";

interface SkillData {
  domain: string;
  value: number; // 0-100
}

interface SkillRadarChartProps {
  data: SkillData[];
  size?: number;
}

export function SkillRadarChart({ data, size = 280 }: SkillRadarChartProps) {
  const center = size / 2;
  const maxRadius = (size / 2) - 40;
  const levels = 4;

  const points = useMemo(() => {
    const angleStep = (2 * Math.PI) / data.length;
    return data.map((item, i) => {
      const angle = angleStep * i - Math.PI / 2; // Start from top
      const radius = (item.value / 100) * maxRadius;
      return {
        x: center + radius * Math.cos(angle),
        y: center + radius * Math.sin(angle),
        labelX: center + (maxRadius + 24) * Math.cos(angle),
        labelY: center + (maxRadius + 24) * Math.sin(angle),
        domain: item.domain,
        value: item.value,
      };
    });
  }, [data, center, maxRadius]);

  const polygonPath = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ' Z';

  const gridPolygons = useMemo(() => {
    return Array.from({ length: levels }, (_, level) => {
      const radius = ((level + 1) / levels) * maxRadius;
      const angleStep = (2 * Math.PI) / data.length;
      const path = data.map((_, i) => {
        const angle = angleStep * i - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
      }).join(' ') + ' Z';
      return path;
    });
  }, [data.length, center, maxRadius, levels]);

  const axisLines = useMemo(() => {
    const angleStep = (2 * Math.PI) / data.length;
    return data.map((_, i) => {
      const angle = angleStep * i - Math.PI / 2;
      return {
        x2: center + maxRadius * Math.cos(angle),
        y2: center + maxRadius * Math.sin(angle),
      };
    });
  }, [data.length, center, maxRadius]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid polygons */}
        {gridPolygons.map((path, i) => (
          <path
            key={`grid-${i}`}
            d={path}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            opacity={0.4 + (i * 0.15)}
          />
        ))}

        {/* Axis lines */}
        {axisLines.map((line, i) => (
          <line
            key={`axis-${i}`}
            x1={center}
            y1={center}
            x2={line.x2}
            y2={line.y2}
            stroke="hsl(var(--border))"
            strokeWidth="1"
            opacity="0.3"
          />
        ))}

        {/* Data polygon with gradient fill */}
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--tech))" stopOpacity="0.3" />
            <stop offset="100%" stopColor="hsl(var(--finance))" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--tech))" />
            <stop offset="100%" stopColor="hsl(var(--finance))" />
          </linearGradient>
        </defs>

        <motion.path
          d={polygonPath}
          fill="url(#radarGradient)"
          stroke="url(#radarStroke)"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* Data points */}
        {points.map((point, i) => (
          <motion.circle
            key={`point-${i}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="hsl(var(--tech))"
            stroke="hsl(var(--background))"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
          />
        ))}
      </svg>

      {/* Labels */}
      {points.map((point, i) => (
        <motion.div
          key={`label-${i}`}
          className="absolute text-xs font-medium text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 + i * 0.05 }}
          style={{
            left: point.labelX,
            top: point.labelY,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="text-center">
            <span className="block text-foreground">{point.domain}</span>
            <span className="text-[10px] tabular-nums">{point.value}%</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
