import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const panelButtonVariants = cva(
  [
    "inline-flex items-center justify-center rounded-full border-4 border-slate-900",
    "text-sm font-bold uppercase tracking-wide text-slate-900",
    "shadow-[3px_3px_0_0_#0f172a]",
    "transition-[transform,box-shadow,background-color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)]",
    "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900/30",
    "active:scale-[0.97] active:shadow-none",
    "disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 disabled:active:shadow-[3px_3px_0_0_#0f172a]",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      variant: {
        primary: "bg-emerald-400 hover:bg-emerald-300",
        secondary: "bg-white hover:bg-slate-50",
        accent: "bg-violet-500 text-white hover:bg-violet-600",
        chip: "border-2 bg-yellow-100 px-3 py-1.5 text-xs font-semibold normal-case tracking-normal shadow-none hover:bg-yellow-200 active:scale-[0.98] active:shadow-none disabled:active:shadow-none",
        persona: "",
      },
      size: {
        default: "px-6 py-2.5",
        lg: "px-8 py-3 shadow-[4px_4px_0_0_#0f172a] disabled:active:shadow-[4px_4px_0_0_#0f172a]",
        full: "w-full px-4 py-2.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type PanelButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof panelButtonVariants> & {
    personaClassName?: string;
  };

function PanelButton({
  className,
  variant,
  size,
  personaClassName,
  ...props
}: PanelButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        panelButtonVariants({ variant, size }),
        variant === "persona" && personaClassName,
        className,
      )}
      {...props}
    />
  );
}

export { PanelButton, panelButtonVariants };
