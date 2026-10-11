import { Flame, Sprout, Zap, type LucideIcon } from "lucide-react";
import type { Difficulty } from "../data/commands";

interface BadgeConfig {
  Icon: LucideIcon;
  textToken: string;
  bgToken: string;
  borderToken: string;
}

const CONFIG: Record<Difficulty, BadgeConfig> = {
  /** Beginner → sage */
  Beginner: {
    Icon: Sprout,
    textToken: "var(--badge-beginner)",
    bgToken: "var(--badge-beginner-bg)",
    borderToken: "var(--badge-beginner-border)",
  },
  /** Intermediate → amber */
  Intermediate: {
    Icon: Zap,
    textToken: "var(--badge-intermediate)",
    bgToken: "var(--badge-intermediate-bg)",
    borderToken: "var(--badge-intermediate-border)",
  },
  /** Advanced → amber-brown (#B8743A in dark mode) */
  Advanced: {
    Icon: Flame,
    textToken: "var(--badge-advanced)",
    bgToken: "var(--badge-advanced-bg)",
    borderToken: "var(--badge-advanced-border)",
  },
};

export function DifficultyBadge({ level }: { level: Difficulty }) {
  const { Icon, textToken, bgToken, borderToken } = CONFIG[level];

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide transition-colors"
      style={{
        color: textToken,
        backgroundColor: bgToken,
        borderColor: borderToken,
      }}
    >
      <Icon size={12} strokeWidth={2} aria-hidden="true" className="shrink-0" />
      {level}
    </span>
  );
}
