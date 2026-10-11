import { Flame, Sprout, Zap, type LucideIcon } from "lucide-react";
import type { Difficulty } from "../data/commands";

const CONFIG: Record<Difficulty, { Icon: LucideIcon; token: string }> = {
  Beginner: { Icon: Sprout, token: "var(--success)" },
  Intermediate: { Icon: Zap, token: "var(--accent)" },
  Advanced: { Icon: Flame, token: "var(--purple)" },
};

export function DifficultyBadge({ level }: { level: Difficulty }) {
  const { Icon, token } = CONFIG[level];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
      style={{
        color: token,
        borderColor: `color-mix(in srgb, ${token} 35%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${token} 12%, transparent)`,
      }}
    >
      <Icon size={12} strokeWidth={2} aria-hidden="true" />
      {level}
    </span>
  );
}
