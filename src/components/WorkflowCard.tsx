import { Route } from "lucide-react";
import type { Workflow } from "../data/workflows";
import { ICON_STROKE } from "./categoryIcons";
import { DifficultyBadge } from "./DifficultyBadge";

export function WorkflowCard({ workflow }: { workflow: Workflow }) {
  return (
    <article
      aria-label={workflow.title}
      className="card-enter print-card group relative flex flex-col gap-3 overflow-hidden rounded-2xl border bg-[var(--card)] p-5 shadow-[0_1px_2px_rgba(31,35,40,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-16px_rgba(31,35,40,0.35)]"
      style={{ borderColor: "var(--border)" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--accent)] via-[var(--purple)] to-[var(--danger)] opacity-70"
      />
      <div className="flex flex-wrap items-start justify-between gap-2 pt-1">
        <h3 className="flex items-center gap-2 text-base font-semibold tracking-tight text-[var(--text)]">
          <span
            aria-hidden="true"
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg"
            style={{
              color: "var(--purple)",
              backgroundColor: "color-mix(in srgb, var(--purple) 12%, transparent)",
            }}
          >
            <Route size={15} strokeWidth={ICON_STROKE} />
          </span>
          {workflow.title}
        </h3>
        <DifficultyBadge level={workflow.difficulty} />
      </div>
      <p className="text-sm text-[var(--muted)]">{workflow.description}</p>
      <ol
        className="relative flex list-none flex-col gap-4 border-l-2 pl-0"
        style={{ borderColor: "var(--border)" }}
      >
        {workflow.steps.map((step, i) => (
          <li key={`${workflow.id}-step-${i}`} className="relative flex gap-3 pl-5">
            <span
              aria-hidden="true"
              className="absolute top-0 -left-[13px] flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--purple))",
                boxShadow: "0 0 0 4px var(--card), 0 2px 8px color-mix(in srgb, var(--accent) 50%, transparent)",
              }}
            >
              {i + 1}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <p className="text-sm font-medium text-[var(--text)]">{step.title}</p>
              {step.command && (
                <code
                  className="term-scroll block overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[12px] whitespace-pre text-[#e6edf3]"
                  style={{ backgroundColor: "var(--code-bg)", borderColor: "var(--code-border)" }}
                >
                  <span aria-hidden="true" className="mr-1.5 text-[#3fb950] select-none">
                    $
                  </span>
                  {step.command}
                </code>
              )}
              <p className="text-xs leading-relaxed text-[var(--muted)]">{step.explanation}</p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
