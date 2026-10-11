import type { Workflow } from "../data/workflows";
import { DifficultyBadge } from "./DifficultyBadge";

export function WorkflowCard({ workflow }: { workflow: Workflow }) {
  return (
    <article
      aria-label={workflow.title}
      className="print-card flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{workflow.title}</h3>
        <DifficultyBadge level={workflow.difficulty} />
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">{workflow.description}</p>
      <ol className="flex list-none flex-col gap-3">
        {workflow.steps.map((step, i) => (
          <li key={`${workflow.id}-step-${i}`} className="flex gap-3">
            <span
              aria-hidden="true"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white"
            >
              {i + 1}
            </span>
            <div className="flex min-w-0 flex-col gap-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{step.title}</p>
              {step.command && (
                <code className="block overflow-x-auto rounded-md bg-slate-950 px-3 py-2 font-mono text-[12px] text-green-300 dark:bg-black">
                  {step.command}
                </code>
              )}
              <p className="text-xs text-slate-500 dark:text-slate-400">{step.explanation}</p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
