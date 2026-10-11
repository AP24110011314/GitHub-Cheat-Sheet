import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { ICON_STROKE } from "./categoryIcons";

const SHOW_AFTER_PX = 600;

/** Floating "Back to top" — appears after scrolling, clears the home indicator. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setVisible(window.scrollY > SHOW_AFTER_PX);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const goTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className="print-hidden fixed right-4 bottom-4 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full border shadow-lg transition-all duration-200 active:scale-95"
      style={{
        marginBottom: "env(safe-area-inset-bottom)",
        marginRight: "env(safe-area-inset-right)",
        backgroundColor: "var(--accent)",
        borderColor: "transparent",
        color: "var(--page)",
        boxShadow:
          "0 8px 24px -8px color-mix(in srgb, var(--accent) 55%, transparent)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <ArrowUp size={20} strokeWidth={ICON_STROKE} aria-hidden="true" />
    </button>
  );
}
