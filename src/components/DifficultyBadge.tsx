import type { Difficulty } from "../data/commands";

const STYLES: Record<Difficulty, string> = {
  Beginner:
    "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  Intermediate:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
  Advanced: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

export function DifficultyBadge({ level }: { level: Difficulty }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${STYLES[level]}`}
    >
      {level}
    </span>
  );
}
