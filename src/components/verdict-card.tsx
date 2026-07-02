"use client";

import { useCompletion } from "@ai-sdk/react";
import { useEffect, useRef } from "react";

import { SpeechBubble } from "@/components/speech-bubble";
import { Spinner } from "@/components/ui/spinner";
import type { PartialCritiques } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type VerdictCardProps = {
  idea: string;
  critiques: PartialCritiques | null;
  triggerCount: number;
  onFinish: () => void;
  onError: (message: string) => void;
};

const VERDICT_THEME = {
  bg: "bg-violet-100",
  border: "border-violet-600",
  ring: "ring-violet-400",
  bubble: "bg-violet-50 border-violet-600",
  bubbleText: "text-violet-950",
  button: "",
  spotlight: "shadow-[0_0_40px_rgba(139,92,246,0.4)]",
};

export function VerdictCard({
  idea,
  critiques,
  triggerCount,
  onFinish,
  onError,
}: VerdictCardProps) {
  const lastTriggerRef = useRef(0);
  const gavelKeyRef = useRef(0);

  const { completion, complete, isLoading, error, setCompletion } =
    useCompletion({
      api: "/api/verdict",
      streamProtocol: "text",
      onFinish: () => {
        onFinish();
      },
      onError: (err) => {
        onError(err.message);
      },
    });

  useEffect(() => {
    if (
      triggerCount === 0 ||
      triggerCount === lastTriggerRef.current ||
      !critiques
    ) {
      return;
    }

    lastTriggerRef.current = triggerCount;
    gavelKeyRef.current += 1;
    setCompletion("");

    void complete("", {
      body: {
        idea,
        critiques,
      },
    });
  }, [triggerCount, idea, critiques, complete, setCompletion]);

  if (triggerCount === 0) {
    return null;
  }

  const showSpinner = isLoading && completion.length === 0;
  const showCursor = isLoading && completion.length > 0;

  return (
    <article
      className={cn(
        "panel-verdict-enter flex flex-col items-center gap-4 rounded-3xl border-4 p-6",
        VERDICT_THEME.bg,
        VERDICT_THEME.border,
        VERDICT_THEME.spotlight,
      )}
    >
      <GavelIcon
        key={gavelKeyRef.current}
        className="animate-panel-gavel-once"
      />
      <div className="text-center">
        <h3 className="font-(family-name:--font-display) text-2xl font-bold uppercase tracking-wide text-violet-950">
          The Verdict
        </h3>
        <p className="text-sm text-violet-800">Two sentences. No appeals.</p>
      </div>

      <SpeechBubble
        persona={{
          id: "vc",
          name: "The Verdict",
          shortName: "Verdict",
          tagline: "",
          intro: "",
          looksFor: [],
          traits: [],
          theme: VERDICT_THEME,
          systemPrompt: "",
        }}
        showCursor={showCursor}
        className="w-full max-w-xl"
      >
        {showSpinner ? (
          <div className="flex items-center gap-2 font-sans text-sm">
            <Spinner />
            <span>Summoning the chair…</span>
          </div>
        ) : error ? (
          <span className="font-sans text-sm text-red-600">
            {error.message || "The Panel couldn't reach a verdict."}
          </span>
        ) : (
          completion
        )}
      </SpeechBubble>
    </article>
  );
}

function GavelIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 80"
      className={cn("h-16 w-16", className)}
      role="img"
      aria-label="Gavel"
    >
      <rect x="8" y="52" width="64" height="8" rx="2" fill="#5B21B6" />
      <rect x="34" y="28" width="12" height="28" rx="2" fill="#7C3AED" />
      <rect
        x="12"
        y="8"
        width="28"
        height="22"
        rx="4"
        fill="#A78BFA"
        stroke="#5B21B6"
        strokeWidth="2"
      />
      <rect
        x="40"
        y="12"
        width="28"
        height="18"
        rx="4"
        fill="#C4B5FD"
        stroke="#5B21B6"
        strokeWidth="2"
      />
    </svg>
  );
}
