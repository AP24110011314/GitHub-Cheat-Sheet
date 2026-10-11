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
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 8px 24px -8px var(--shadow-hover-amber), 0 2px 8px -2px var(--shadow-color)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 2px 8px -2px var(--shadow-color)";
      }}
    >
      {/* Sage → amber decorative top line */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{
          background:
            "linear-gradient(90deg, var(--secondary), var(--accent) 80%, transparent)",
        }}
      />

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-2 pt-1">
        <h3 className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-[var(--text)]">
          <span
            aria-hidden="true"
            className="inline-flex h-7 w-7 items-center justify-center rounded-lg"
            style={{
              /* Sage icon on a subtle sage-tinted background */
              color: "var(--secondary)",
              backgroundColor:
                "color-mix(in srgb, var(--secondary) 14%, transparent)",
              border: "1px solid color-mix(in srgb, var(--secondary) 30%, var(--border))",
            }}
          >
            <GitBranch size={15} strokeWidth={ICON_STROKE} />
          </span>
          {workflow.title}
        </h3>
        <DifficultyBadge level={workflow.difficulty} />
      </div>

      <p className="text-sm leading-relaxed text-[var(--muted)]">
        {workflow.description}
      </p>

      {/* Numbered timeline */}
      <ol
        className="relative mt-1 flex list-none flex-col gap-5 border-l-2 pl-0 ml-3"
        style={{
          /* Connecting line: sage at ~30% opacity */
          borderColor: "color-mix(in srgb, var(--secondary) 30%, transparent)",
        }}
      >
        {workflow.steps.map((step, i) => (
          <li
            key={`${workflow.id}-step-${i}`}
            className="relative flex gap-3 pl-6"
          >
            {/* Step number badge: amber → sage gradient */}
            <span
              aria-hidden="true"
              className="absolute top-0 -left-[14px] flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold shadow-sm"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--secondary))",
                /* Cream text on amber/sage is legible at this size */
                color: "var(--page)",
                boxShadow:
                  "0 0 0 3px var(--card), 0 0 6px color-mix(in srgb, var(--accent) 25%, transparent)",
              }}
            >
              {i + 1}
            </span>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              {/* Step title in cream */}
              <p className="text-sm font-semibold text-[var(--text)]">
                {step.title}
              </p>

              {/* Command snippet styled like CommandCard code block */}
              {step.command && (
                <code
                  className="term-scroll block overflow-x-auto rounded-lg border px-3 py-2 font-mono text-[12px] whitespace-pre"
                  style={{
                    backgroundColor: "var(--code-bg)",
                    borderColor: "var(--code-border)",
                    color: "var(--code-text)",
                  }}
                >
                  {/* Sage prompt */}
                  <span
                    aria-hidden="true"
                    className="mr-2 font-bold select-none"
                    style={{ color: "var(--code-prompt)" }}
                  >
                    $
                  </span>
                  {step.command}
                </code>
              )}

              <p className="text-xs leading-relaxed text-[var(--muted)]">
                {step.explanation}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </article>
  );
}
