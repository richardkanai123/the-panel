"use client";

import { PersonaCharacter } from "@/components/characters/persona-character";
import { SpeechBubble } from "@/components/speech-bubble";
import { Spinner } from "@/components/ui/spinner";
import type { CharacterState, Persona } from "@/lib/personas";
import { cn } from "@/lib/utils";

type PersonaBoothProps = {
  persona: Persona;
  critique: string | null;
  error: string | null;
  isActive: boolean;
  streamingText: string;
  isStreaming: boolean;
  onConsult: () => void;
  consultDisabled: boolean;
  ideaSubmitted: boolean;
};

function resolveCharacterState(
  props: Pick<
    PersonaBoothProps,
    "critique" | "error" | "isActive" | "isStreaming" | "streamingText"
  >,
): CharacterState {
  if (props.critique?.trim()) {
    return "heard";
  }
  if (props.error && props.isActive) {
    return "error";
  }
  if (props.isActive && props.isStreaming && props.streamingText.length === 0) {
    return "thinking";
  }
  if (props.isActive && props.isStreaming) {
    return "speaking";
  }
  if (props.isActive) {
    return "thinking";
  }
  return "idle";
}

export function PersonaBooth({
  persona,
  critique,
  error,
  isActive,
  streamingText,
  isStreaming,
  onConsult,
  consultDisabled,
  ideaSubmitted,
}: PersonaBoothProps) {
  const hasResponse = Boolean(critique?.trim());
  const characterState = resolveCharacterState({
    critique,
    error,
    isActive,
    isStreaming,
    streamingText,
  });
  const displayText = isActive ? streamingText : critique;
  const showSpinner = isActive && isStreaming && streamingText.length === 0;
  const showCursor = isActive && isStreaming && streamingText.length > 0;
  const showBubble =
    ideaSubmitted &&
    (showSpinner || Boolean(displayText) || (error && !hasResponse));

  return (
    <article
      className={cn(
        "flex flex-col items-center gap-4 rounded-3xl border-4 p-4 transition-all duration-300 ease-out",
        persona.theme.bg,
        persona.theme.border,
        isActive
          ? cn(
              "z-10 scale-[1.03] ring-4",
              persona.theme.ring,
              persona.theme.spotlight,
            )
          : hasResponse
            ? "opacity-90"
            : "opacity-100 hover:scale-[1.01]",
        !isActive && consultDisabled && !hasResponse && "opacity-60",
      )}
    >
      <div className="text-center">
        <h3 className="font-(family-name:--font-display) text-lg font-bold uppercase tracking-wide text-slate-900">
          {persona.name}
        </h3>
        <p className="text-xs font-medium text-slate-600">{persona.tagline}</p>
      </div>

      <PersonaCharacter personaId={persona.id} state={characterState} />

      {showBubble ? (
        <SpeechBubble
          persona={persona}
          showCursor={showCursor}
          className="w-full"
        >
          {showSpinner ? (
            <div className="flex items-center gap-2">
              <Spinner />
              <span>Deliberating…</span>
            </div>
          ) : error && !hasResponse && !displayText ? (
            <span className="text-red-600">{error}</span>
          ) : (
            displayText
          )}
        </SpeechBubble>
      ) : ideaSubmitted ? (
        <p className="min-h-16 text-center text-sm text-slate-600">
          Tap the button when you want their take.
        </p>
      ) : null}

      {ideaSubmitted && !hasResponse && !(isActive && isStreaming) ? (
        <button
          type="button"
          disabled={consultDisabled}
          onClick={onConsult}
          className={cn(
            "w-full rounded-full border-4 border-slate-900 px-4 py-2.5 text-sm font-bold uppercase tracking-wide shadow-[3px_3px_0_0_#0f172a] transition-transform active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50",
            persona.theme.button,
          )}
        >
          {error ? `Retry ${persona.shortName}` : `Ask ${persona.shortName}`}
        </button>
      ) : null}

      {hasResponse ? (
        <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
          Heard
        </span>
      ) : null}
    </article>
  );
}
