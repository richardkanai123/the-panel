"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  EXAMPLE_IDEAS,
  IDEA_MAX_LENGTH,
  IDEA_MIN_LENGTH,
} from "@/lib/personas";
import { cn } from "@/lib/utils";

type PanelFormProps = {
  idea: string;
  onIdeaChange: (value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  disabled: boolean;
  showReset: boolean;
  validationError: string | null;
};

export function PanelForm({
  idea,
  onIdeaChange,
  onSubmit,
  onReset,
  disabled,
  showReset,
  validationError,
}: PanelFormProps) {
  const charCount = idea.length;

  return (
    <section className="space-y-4 rounded-3xl border-4 border-slate-900 bg-white p-5 shadow-[6px_6px_0_0_#0f172a] sm:p-6">
      <div className="space-y-2">
        <Label
          htmlFor="idea"
          className="font-(family-name:--font-display) text-base font-bold uppercase tracking-wide text-slate-900"
        >
          Your startup idea
        </Label>
        <Textarea
          id="idea"
          value={idea}
          onChange={(event) => onIdeaChange(event.target.value)}
          placeholder="Describe your startup or project idea in a sentence or two…"
          rows={4}
          disabled={disabled}
          aria-invalid={Boolean(validationError)}
          className="min-h-28 rounded-xl border-4 border-slate-300 bg-slate-50 px-3 text-base focus-visible:border-sky-500 focus-visible:ring-sky-200"
        />
        <div className="flex items-center justify-between gap-4 text-xs text-slate-600">
          <span>
            {IDEA_MIN_LENGTH}–{IDEA_MAX_LENGTH} characters
          </span>
          <span className={cn(charCount > IDEA_MAX_LENGTH && "text-red-600")}>
            {charCount}/{IDEA_MAX_LENGTH}
          </span>
        </div>
        {validationError ? (
          <p className="text-sm font-medium text-red-600">{validationError}</p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {EXAMPLE_IDEAS.map((example) => (
          <button
            key={example}
            type="button"
            disabled={disabled}
            onClick={() => onIdeaChange(example)}
            className="rounded-full border-2 border-slate-900 bg-yellow-100 px-3 py-1.5 text-xs font-semibold text-slate-900 transition-colors hover:bg-yellow-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {example}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled}
          className="rounded-full border-4 border-slate-900 bg-emerald-400 px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-slate-900 shadow-[3px_3px_0_0_#0f172a] transition-transform hover:bg-emerald-300 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit to the Panel
        </button>
        {showReset ? (
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border-4 border-slate-900 bg-white px-6 py-2.5 text-sm font-bold uppercase tracking-wide text-slate-900 shadow-[3px_3px_0_0_#0f172a] transition-transform hover:bg-slate-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            Try another idea
          </button>
        ) : null}
      </div>
    </section>
  );
}
