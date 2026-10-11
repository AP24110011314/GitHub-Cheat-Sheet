import { GitBranch } from "lucide-react";
import type { Workflow } from "../data/workflows";
import { ICON_STROKE } from "./categoryIcons";
import { DifficultyBadge } from "./DifficultyBadge";

export function WorkflowCard({ workflow }: { workflow: Workflow }) {
  return (
    <article
      aria-label={workflow.title}
      className="card-enter print-card group relative flex flex-col gap-3.5 overflow-hidden rounded-2xl border bg-[var(--card)] p-5 transition-all duration-200 hover:-translate-y-0.5"
      style={{
        borderColor: "var(--border)",
        boxShadow: "0 2px 8px -2px var(--shadow-color)",
      }}
    >
      {/* Top subtle earthy gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--accent)] via-[var(--secondary)] to-transparent opacity-85"
      />

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2 pt-1">
        <h3 className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-[var(--text)]">
          <span
            aria-hidden="true"
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg"
            style={{
              color: "var(--accent-text)",
              backgroundColor: "var(--badge-intermediate-bg)",
              border: "1px solid var(--badge-intermediate-border)",
            }}
          >
            <GitBranch size={15} strokeWidth={ICON_STROKE} />
          </span>
          {workflow.title}
        </h3>
        <DifficultyBadge level={workflow.difficulty} />
      </div>

      <p className="text-sm leading-relaxed text-[var(--muted)]">{workflow.description}</p>

      {/* Numbered step timeline */}
      <ol
        className="relative mt-2 flex list-none flex-col gap-5 border-l-2 pl-0 ml-3"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        {workflow.steps.map((step, i) => (
          <li key={`${workflow.id}-step-${i}`} className="relative flex gap-3 pl-6">
            {/* Step number badge */}
            <span
              aria-hidden="true"
              className="absolute top-0 -left-[14px] flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white shadow-sm"
              style={{
                background: "linear-gradient(135deg, var(--accent), var(--secondary))",
                boxShadow: "0 0 0 3px var(--card)",
              }}
            >
              {i + 1}
            </span>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <p className="text-sm font-semibold text-[var(--text)]">{step.title}</p>
              {step.command && (
                <code
                  className="term-scroll block overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[12px] whitespace-pre"
                  style={{
                    backgroundColor: "var(--code-bg)",
                    borderColor: "var(--code-border)",
                    color: "var(--code-text)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="mr-2 font-bold select-none text-[var(--code-prompt)]"
                  >
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
