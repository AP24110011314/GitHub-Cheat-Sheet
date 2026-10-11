import type { Difficulty } from "../data/commands";

const STYLES: Record<Difficulty, string> = {
  Beginner:
    "bg-emerald-100 text-emerald-800 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-400/20",
  Intermediate:
    "bg-amber-100 text-amber-800 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-300 dark:ring-amber-400/20",
  Advanced: "bg-rose-100 text-rose-800 ring-rose-600/20 dark:bg-rose-500/10 dark:text-rose-300 dark:ring-rose-400/20",
};

const DOTS: Record<Difficulty, string> = {
  Beginner: "bg-emerald-500",
  Intermediate: "bg-amber-500",
  Advanced: "bg-rose-500",
};

export function DifficultyBadge({ level }: { level: Difficulty }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${STYLES[level]}`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${DOTS[level]}`} />
      {level}
    </span>
  );
}
