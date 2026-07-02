"use client";

import { useCompletion } from "@ai-sdk/react";
import { useCallback, useRef, useState } from "react";

import { MeetTheJudges } from "@/components/meet-the-judges";
import { PanelForm } from "@/components/panel-form";
import { PanelProgress } from "@/components/panel-progress";
import { PersonaBooth } from "@/components/persona-booth";
import { PitchCard } from "@/components/pitch-card";
import { VerdictCard } from "@/components/verdict-card";
import { PanelButton } from "@/components/ui/panel-button";
import { PERSONAS } from "@/lib/personas";
import type { PartialCritiques, PersonaId } from "@/lib/schemas";
import { ideaSchema } from "@/lib/schemas";

type Phase = "idle" | "choosing" | "verdict" | "done";

const PERSONA_IDS: PersonaId[] = ["vc", "engineer", "skeptic"];

function toVerdictCritiques(
  critiques: Partial<Record<PersonaId, string>>,
): PartialCritiques | null {
  const entries = PERSONA_IDS.filter((id) => critiques[id]?.trim()).map(
    (id) => [id, critiques[id] as string] as const,
  );

  if (entries.length < 2) {
    return null;
  }

  return Object.fromEntries(entries) as PartialCritiques;
}

export function ThePanel() {
  const [idea, setIdea] = useState("");
  const [submittedIdea, setSubmittedIdea] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [critiques, setCritiques] = useState<
    Partial<Record<PersonaId, string>>
  >({});
  const [errors, setErrors] = useState<Partial<Record<PersonaId, string>>>({});
  const [activePersonaId, setActivePersonaId] = useState<PersonaId | null>(
    null,
  );
  const activePersonaRef = useRef<PersonaId | null>(null);
  const [verdictTriggerCount, setVerdictTriggerCount] = useState(0);
  const [verdictCritiques, setVerdictCritiques] =
    useState<PartialCritiques | null>(null);
  const [verdictError, setVerdictError] = useState<string | null>(null);

  const { completion, complete, isLoading, error, setCompletion } =
    useCompletion({
      api: "/api/critique",
      streamProtocol: "text",
      onFinish: (_prompt, text) => {
        const personaId = activePersonaRef.current;
        if (!personaId) {
          return;
        }

        setCritiques((current) => ({
          ...current,
          [personaId]: text,
        }));
        setErrors((current) => {
          const next = { ...current };
          delete next[personaId];
          return next;
        });
        activePersonaRef.current = null;
        setActivePersonaId(null);
        setPhase("choosing");
      },
      onError: (err) => {
        const personaId = activePersonaRef.current;
        if (!personaId) {
          return;
        }

        setErrors((current) => ({
          ...current,
          [personaId]: err.message,
        }));
        activePersonaRef.current = null;
        setActivePersonaId(null);
        setPhase("choosing");
      },
    });

  const isStreaming = isLoading;
  const isBusy = isStreaming || phase === "verdict";
  const ideaSubmitted = phase !== "idle";
  const heardCount = PERSONA_IDS.filter((id) => critiques[id]?.trim()).length;
  const canRequestVerdict =
    heardCount >= 2 && !isStreaming && phase !== "verdict";
  const judgesRemaining = Math.max(0, 2 - heardCount);

  const handleConsultPersona = useCallback(
    (personaId: PersonaId) => {
      if (isStreaming || critiques[personaId]?.trim()) {
        return;
      }

      activePersonaRef.current = personaId;
      setActivePersonaId(personaId);
      setCompletion("");
      setPhase("choosing");
      void complete(submittedIdea, { body: { personaId } });
    },
    [isStreaming, critiques, submittedIdea, complete, setCompletion],
  );

  const handleSubmit = () => {
    const parsed = ideaSchema.safeParse(idea);

    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? "Invalid idea");
      return;
    }

    const trimmed = parsed.data;
    setValidationError(null);
    setSubmittedIdea(trimmed);
    setCritiques({});
    setErrors({});
    activePersonaRef.current = null;
    setActivePersonaId(null);
    setVerdictCritiques(null);
    setVerdictError(null);
    setVerdictTriggerCount(0);
    setCompletion("");
    setPhase("choosing");
  };

  const handleReset = () => {
    setIdea("");
    setSubmittedIdea("");
    setPhase("idle");
    setValidationError(null);
    setCritiques({});
    setErrors({});
    activePersonaRef.current = null;
    setActivePersonaId(null);
    setVerdictCritiques(null);
    setVerdictError(null);
    setVerdictTriggerCount(0);
    setCompletion("");
  };

  const handleRequestVerdict = () => {
    const available = toVerdictCritiques(critiques);

    if (!available) {
      setVerdictError(
        "Hear from at least two judges before requesting the verdict.",
      );
      return;
    }

    setVerdictError(null);
    setVerdictCritiques(available);
    setPhase("verdict");
    setVerdictTriggerCount((count) => count + 1);
  };

  const handleVerdictFinish = () => {
    setPhase("done");
  };

  const handleVerdictError = (message: string) => {
    setVerdictError(message);
    setPhase("done");
  };

  const showReset = phase === "done";
  const showVerdictCta =
    heardCount >= 1 && verdictTriggerCount === 0 && phase !== "verdict";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="space-y-3 text-center">
        <h1 className="font-(family-name:--font-display) text-5xl font-extrabold uppercase tracking-tight text-slate-900 sm:text-6xl">
          The Panel
        </h1>
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-700">
          Pitch your startup idea to three AI judges — one at a time. When
          you&apos;ve heard enough, get the final verdict. No appeals. No BS.
          Just the truth.
        </p>
      </header>

      {!ideaSubmitted ? <MeetTheJudges /> : null}

      <PanelForm
        idea={idea}
        onIdeaChange={setIdea}
        onSubmit={handleSubmit}
        onReset={handleReset}
        disabled={isBusy || ideaSubmitted}
        showReset={showReset}
        validationError={validationError}
      />

      {ideaSubmitted ? (
        <section className="panel-stage panel-stage-enter space-y-6 rounded-[2rem] border-4 border-slate-900 p-5 shadow-[8px_8px_0_0_#0f172a] sm:p-8">
          <PitchCard idea={submittedIdea} />

          <div className="space-y-4 text-center">
            <h2 className="font-(family-name:--font-display) text-2xl font-bold uppercase tracking-wide text-slate-900">
              {isStreaming ? "Spotlight on…" : "Choose your judge"}
            </h2>
            <PanelProgress
              critiques={critiques}
              activePersonaId={activePersonaId}
            />
            <p className="text-sm text-slate-700">
              {isStreaming
                ? "Hang tight — your chosen judge is speaking."
                : heardCount === PERSONA_IDS.length
                  ? "You've heard from everyone. Ready for the verdict?"
                  : `Heard from ${heardCount} of ${PERSONA_IDS.length}. Pick who's next.`}
            </p>
          </div>

          <div className="grid items-start gap-5 md:grid-cols-3">
            {PERSONAS.map((persona, index) => (
              <PersonaBooth
                key={persona.id}
                persona={persona}
                critique={critiques[persona.id] ?? null}
                error={
                  errors[persona.id] ??
                  (activePersonaId === persona.id && error
                    ? error.message
                    : null)
                }
                isActive={activePersonaId === persona.id}
                streamingText={activePersonaId === persona.id ? completion : ""}
                isStreaming={isStreaming && activePersonaId === persona.id}
                onConsult={() => handleConsultPersona(persona.id)}
                consultDisabled={
                  isStreaming ||
                  Boolean(critiques[persona.id]?.trim()) ||
                  phase === "verdict"
                }
                ideaSubmitted={ideaSubmitted}
                staggerIndex={index}
              />
            ))}
          </div>

          {showVerdictCta ? (
            <div className="flex flex-col items-center gap-2 pt-2">
              <PanelButton
                variant="accent"
                size="lg"
                onClick={handleRequestVerdict}
                disabled={!canRequestVerdict}
              >
                Get the Verdict
              </PanelButton>
              {!canRequestVerdict && judgesRemaining > 0 ? (
                <p className="text-xs text-slate-600">
                  Hear from {judgesRemaining} more judge
                  {judgesRemaining === 1 ? "" : "s"} first
                </p>
              ) : null}
            </div>
          ) : null}

          {verdictCritiques && verdictTriggerCount > 0 ? (
            <VerdictCard
              idea={submittedIdea}
              critiques={verdictCritiques}
              triggerCount={verdictTriggerCount}
              onFinish={handleVerdictFinish}
              onError={handleVerdictError}
            />
          ) : null}

          {verdictError && verdictTriggerCount === 0 ? (
            <p className="rounded-2xl border-4 border-red-500 bg-red-50 px-4 py-3 text-sm text-red-700">
              {verdictError}
            </p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
