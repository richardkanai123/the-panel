"use client";

import type { Persona } from "@/lib/personas";
import { cn } from "@/lib/utils";

type SpeechBubbleProps = {
  persona: Persona;
  children: React.ReactNode;
  showCursor?: boolean;
  tail?: "top" | "bottom" | "none";
  className?: string;
};

export function SpeechBubble({
  persona,
  children,
  showCursor = false,
  tail = "bottom",
  className,
}: SpeechBubbleProps) {
  const bubbleBg = persona.theme.bubble.split(" ")[0] ?? "bg-white";

  return (
    <div
      className={cn(
        "relative rounded-2xl border-4 px-4 py-3 shadow-[4px_4px_0_0_rgba(0,0,0,0.15)]",
        persona.theme.bubble,
        persona.theme.bubbleText,
        className,
      )}
    >
      {tail === "bottom" ? (
        <div
          className={cn(
            "absolute -bottom-2.5 left-10 size-4 rotate-45 border-r-4 border-b-4",
            bubbleBg,
            persona.theme.border,
          )}
          aria-hidden
        />
      ) : tail === "top" ? (
        <div
          className={cn(
            "absolute -top-2.5 left-10 size-4 rotate-45 border-t-4 border-l-4",
            bubbleBg,
            persona.theme.border,
          )}
          aria-hidden
        />
      ) : null}
      <div className="font-(family-name:--font-hand) text-base leading-relaxed wrap-break-word whitespace-pre-wrap max-h-48 overflow-y-auto sm:max-h-56">
        {children}
        {showCursor ? (
          <span className="ml-0.5 inline-block animate-pulse">▍</span>
        ) : null}
      </div>
    </div>
  );
}
