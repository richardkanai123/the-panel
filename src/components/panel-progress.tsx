"use client";

import { PERSONAS } from "@/lib/personas";
import type { PersonaId } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type PanelProgressProps = {
  critiques: Partial<Record<PersonaId, string>>;
  activePersonaId: PersonaId | null;
};

export function PanelProgress({
  critiques,
  activePersonaId,
}: PanelProgressProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      {PERSONAS.map((persona) => {
        const heard = Boolean(critiques[persona.id]?.trim());
        const active = activePersonaId === persona.id;

        return (
          <div key={persona.id} className="flex flex-col items-center gap-1">
            <span
              className={cn(
                "size-4 rounded-full border-2 border-slate-900 transition-all",
                heard && "bg-emerald-400",
                active && !heard && "animate-panel-pulse bg-white",
                !heard && !active && "bg-white/60",
              )}
              aria-hidden
            />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
              {persona.shortName}
            </span>
          </div>
        );
      })}
    </div>
  );
}
