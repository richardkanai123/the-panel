import { cn } from "@/lib/utils";

type PitchCardProps = {
  idea: string;
  className?: string;
};

export function PitchCard({ idea, className }: PitchCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border-4 border-slate-900 bg-white px-5 py-4 shadow-[4px_4px_0_0_#0f172a]",
        className,
      )}
    >
      <p className="font-(family-name:--font-display) text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
        Your pitch
      </p>
      <blockquote className="mt-1.5 font-(family-name:--font-hand) text-lg leading-snug text-slate-900 sm:text-xl">
        &ldquo;{idea}&rdquo;
      </blockquote>
    </div>
  );
}
