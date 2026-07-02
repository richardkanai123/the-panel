"use client";

import { PersonaCharacter } from "@/components/characters/persona-character";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { Persona } from "@/lib/personas";
import { PERSONAS } from "@/lib/personas";
import { cn } from "@/lib/utils";

function JudgeCard({ persona }: { persona: Persona }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full cursor-pointer flex-col items-center gap-3 rounded-2xl border-4 p-4 text-left transition-all duration-200 sm:p-5",
            "border-slate-900/25 bg-white/80 hover:border-slate-900/50 hover:shadow-lg",
            "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/30",
            "active:scale-[0.98]",
          )}
        >
          <div className="flex h-40 w-full max-w-[180px] items-center justify-center">
            <PersonaCharacter personaId={persona.id} state="idle" />
          </div>

          <div className="space-y-1 text-center">
            <p className="font-(family-name:--font-display) text-sm font-bold uppercase tracking-wide text-slate-900 sm:text-base">
              {persona.name}
            </p>
            <p className="text-xs text-slate-600">{persona.tagline}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-1.5">
            {persona.traits.map((trait) => (
              <span
                key={trait}
                className="rounded-full border-2 border-slate-900/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-700"
              >
                {trait}
              </span>
            ))}
          </div>

          <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500 sm:text-xs">
            Tap to meet me
          </p>
        </button>
      </DrawerTrigger>

      <DrawerContent
        className={cn(
          "max-h-[85vh] rounded-t-3xl border-t-4",
          persona.theme.bg,
          persona.theme.border,
        )}
      >
        <div className="mx-auto w-full max-w-lg overflow-y-auto px-4 pb-6">
          <DrawerHeader className="items-center gap-4 pb-2 text-center">
            <PersonaCharacter
              personaId={persona.id}
              state="speaking"
              className="mx-auto"
            />
            <div className="space-y-1">
              <DrawerTitle
                className={cn(
                  "font-(family-name:--font-display) text-2xl uppercase",
                  persona.theme.bubbleText,
                )}
              >
                {persona.name}
              </DrawerTitle>
              <DrawerDescription className="text-slate-700">
                {persona.tagline}
              </DrawerDescription>
            </div>
          </DrawerHeader>

          <div
            className={cn(
              "space-y-4 rounded-2xl border-4 p-4",
              persona.theme.bubble,
              persona.theme.bubbleText,
            )}
          >
            <p className="text-sm leading-relaxed">{persona.intro}</p>

            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider opacity-80">
                What I&apos;ll grill you on
              </p>
              <ul className="space-y-2">
                {persona.looksFor.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm leading-snug"
                  >
                    <span className="mt-0.5 shrink-0 font-bold" aria-hidden>
                      →
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {persona.traits.map((trait) => (
                <span
                  key={trait}
                  className="rounded-full border-2 border-slate-900/25 bg-white/50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          <DrawerFooter className="px-0 pt-4">
            <DrawerClose asChild>
              <Button
                className={cn(
                  "w-full rounded-full border-4 border-slate-900 font-bold uppercase tracking-wide shadow-[3px_3px_0_0_#0f172a]",
                  persona.theme.button,
                )}
              >
                Got it
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export function MeetTheJudges() {
  return (
    <section
      aria-labelledby="meet-judges-heading"
      className="space-y-4 overflow-visible"
    >
      <div className="text-center">
        <h2
          id="meet-judges-heading"
          className="font-(family-name:--font-display) text-xl font-bold uppercase tracking-wide text-slate-900 sm:text-2xl"
        >
          Meet the judges
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Tap a judge to learn who they are and what they&apos;ll look for.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
        {PERSONAS.map((persona) => (
          <JudgeCard key={persona.id} persona={persona} />
        ))}
      </div>
    </section>
  );
}
