import type { Workflow } from "../data/workflows";
import { DifficultyBadge } from "./DifficultyBadge";

export function WorkflowCard({ workflow }: { workflow: Workflow }) {
  return (
    <article
      aria-label={workflow.title}
      className="card-enter print-card group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-16px_rgba(99,102,241,0.35)] dark:border-white/10 dark:bg-slate-900/80 dark:hover:border-indigo-500/30"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 opacity-70"
      />
      <div className="flex flex-wrap items-start justify-between gap-2 pt-1">
        <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-white">
          {workflow.title}
        </h3>
        <DifficultyBadge level={workflow.difficulty} />
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-300">{workflow.description}</p>
      <ol className="relative flex list-none flex-col gap-4 border-l-2 border-slate-100 pl-0 dark:border-white/10">
        {workflow.steps.map((step, i) => (
          <li key={`${workflow.id}-step-${i}`} className="relative flex gap-3 pl-5">
            <span
              aria-hidden="true"
              className="absolute top-0 -left-[13px] flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-[11px] font-bold text-white shadow-[0_2px_8px_rgba(99,102,241,0.5)] ring-4 ring-white dark:ring-slate-900"
            >
              {i + 1}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{step.title}</p>
              {step.command && (
                <code className="term-scroll block overflow-x-auto rounded-lg bg-[#0d1117] px-3 py-2 font-mono text-[12px] whitespace-pre text-slate-100 ring-1 ring-black/20 dark:ring-white/10">
                  <span aria-hidden="true" className="mr-1.5 text-emerald-400 select-none">$</span>
                  {step.command}
                </code>
              )}
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{step.explanation}</p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
