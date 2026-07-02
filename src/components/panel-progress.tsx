"use client";

import { PERSONAS } from "@/lib/personas";
import type { PersonaId } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type PanelProgressProps = {
  critiques: Partial<Record<PersonaId, string>>;
  activePersonaId: PersonaId | null;
};

function progressLabel(
  shortName: string,
  heard: boolean,
  active: boolean,
): string {
  if (heard) {
    return `${shortName}: heard`;
  }
  if (active) {
    return `${shortName}: speaking`;
  }
  return `${shortName}: waiting`;
}

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
                "size-4 rounded-full border-2 border-slate-900 transition-[transform,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none",
                heard && "bg-emerald-400",
                active && !heard && "animate-panel-pulse bg-white",
                !heard && !active && "bg-white/60",
              )}
              aria-hidden
            />
            <span className="sr-only">
              {progressLabel(persona.shortName, heard, active)}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700">
              {persona.shortName}
            </span>
          </div>
        );
      })}
    </div>
  );
}
