"use client";

import { PersonaCharacter } from "@/components/characters/persona-character";
import { SpeechBubble } from "@/components/speech-bubble";
import { PanelButton } from "@/components/ui/panel-button";
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
  staggerIndex?: number;
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
  staggerIndex,
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
        "panel-booth-stagger relative flex origin-bottom flex-col items-center gap-4 rounded-3xl border-4 p-4",
        "transition-[transform,opacity,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
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
            : "panel-hover-lift opacity-100",
        !isActive && consultDisabled && !hasResponse && "opacity-60",
      )}
      style={
        staggerIndex !== undefined
          ? { animationDelay: `${80 + staggerIndex * 40}ms` }
          : undefined
      }
    >
      {isActive ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 top-1/3 bg-[radial-gradient(ellipse_at_center_bottom,rgba(255,255,255,0.55)_0%,transparent_72%)]"
          aria-hidden
        />
      ) : null}

      <div className="relative text-center">
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
          className="relative w-full"
        >
          {showSpinner ? (
            <div className="flex items-center gap-2 font-sans text-sm">
              <Spinner />
              <span>Deliberating…</span>
            </div>
          ) : error && !hasResponse && !displayText ? (
            <span className="font-sans text-sm text-red-600">{error}</span>
          ) : (
            displayText
          )}
        </SpeechBubble>
      ) : ideaSubmitted ? (
        <p className="relative min-h-16 text-center text-sm text-slate-600">
          Tap the button when you want their take.
        </p>
      ) : null}

      {ideaSubmitted && !hasResponse && !(isActive && isStreaming) ? (
        <PanelButton
          variant="persona"
          size="full"
          personaClassName={persona.theme.button}
          disabled={consultDisabled}
          onClick={onConsult}
          className="relative"
        >
          {error ? `Retry ${persona.shortName}` : `Ask ${persona.shortName}`}
        </PanelButton>
      ) : null}

      {hasResponse ? (
        <span className="relative rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
          Heard
        </span>
      ) : null}
    </article>
  );
}
