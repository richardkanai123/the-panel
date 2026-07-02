"use client";

import type { CharacterState } from "@/lib/personas";
import type { PersonaId } from "@/lib/schemas";
import { cn } from "@/lib/utils";

type PersonaCharacterProps = {
  personaId: PersonaId;
  state: CharacterState;
  className?: string;
};

export function PersonaCharacter({
  personaId,
  state,
  className,
}: PersonaCharacterProps) {
  const isActive =
    state === "thinking" || state === "speaking" || state === "heard";

  return (
    <div
      className={cn(
        "relative transition-transform duration-300 ease-out",
        isActive && state !== "heard" && "scale-105",
        state === "heard" && "scale-100",
        className,
      )}
      aria-hidden
    >
      {personaId === "vc" ? (
        <VcCharacter state={state} />
      ) : personaId === "engineer" ? (
        <EngineerCharacter state={state} />
      ) : (
        <SkepticCharacter state={state} />
      )}
    </div>
  );
}

function VcCharacter({ state }: { state: CharacterState }) {
  const talking = state === "speaking";
  const thinking = state === "thinking";

  return (
    <svg
      viewBox="0 0 160 180"
      className="h-auto w-full max-w-[140px]"
      role="img"
      aria-label="The VC character"
    >
      {/* Shadow */}
      <ellipse cx="80" cy="170" rx="52" ry="8" fill="#000" opacity="0.12" />

      {/* Body / Shirt */}
      <path
        d="M35 170 L35 110 Q35 85 80 85 Q125 85 125 110 L125 170 Z"
        fill="#E0F2FE"
      />

      {/* Vest */}
      <path
        d="M42 170 L42 112 Q42 92 80 92 Q118 92 118 112 L118 170 Z"
        fill="#0F172A"
      />
      <path d="M80 92 L80 170" stroke="#1E293B" strokeWidth="3" />

      {/* Collar */}
      <path d="M60 85 L80 105 L100 85 Z" fill="#BAE6FD" />

      {/* Neck */}
      <path d="M68 60 L68 90 L92 90 L92 60 Z" fill="#E5B787" />

      {/* Head */}
      <ellipse cx="80" cy="55" rx="32" ry="38" fill="#FFDBAC" />

      {/* Hair */}
      <path
        d="M46 55 Q45 15 80 15 Q115 15 114 55 Q110 30 80 28 Q50 30 46 55 Z"
        fill="#334155"
      />
      <path d="M46 55 Q40 65 45 75 Q48 65 50 55 Z" fill="#334155" />
      <path d="M114 55 Q120 65 115 75 Q112 65 110 55 Z" fill="#334155" />

      {/* Eyes */}
      <circle cx="66" cy="52" r="4" fill="#0F172A" />
      <circle cx="94" cy="52" r="4" fill="#0F172A" />

      {/* Eyebrows */}
      <path
        d="M58 42 Q66 38 74 42"
        stroke="#334155"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M86 42 Q94 38 102 42"
        stroke="#334155"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Mouth */}
      <path
        d={talking ? "M70 72 Q80 84 90 72" : "M72 74 Q80 78 88 74"}
        stroke="#0F172A"
        strokeWidth="2.5"
        fill={talking ? "#EF4444" : "none"}
        strokeLinecap="round"
        className={cn(talking && "animate-panel-talk")}
      />

      {/* Phone / Chart */}
      <g transform="translate(10, 10) rotate(-5 110 120)">
        <rect
          x="95"
          y="95"
          width="36"
          height="50"
          rx="6"
          fill="#1E293B"
          stroke="#475569"
          strokeWidth="2"
        />
        <rect x="99" y="99" width="28" height="42" rx="3" fill="#020617" />
        <polyline
          points="102,130 110,115 116,120 124,105"
          fill="none"
          stroke="#22C55E"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="124" cy="105" r="2" fill="#22C55E" />
        <text
          x="102"
          y="112"
          fontSize="7"
          fill="#22C55E"
          fontFamily="monospace"
          fontWeight="bold"
        >
          TAM
        </text>
      </g>

      {/* Thinking animation: Hand tapping chin */}
      <g
        className={cn(
          "transition-opacity duration-300",
          thinking ? "opacity-100" : "opacity-0",
        )}
      >
        <g className="animate-panel-tap">
          <path
            d="M60 120 Q50 90 65 78 L72 85 Q60 100 70 120 Z"
            fill="#FFDBAC"
          />
          <circle cx="68" cy="78" r="4" fill="#FFDBAC" />
        </g>
      </g>

      {/* Heard status */}
      {state === "heard" && (
        <>
          <circle
            cx="130"
            cy="35"
            r="14"
            fill="#22C55E"
            stroke="#fff"
            strokeWidth="2"
          />
          <path
            d="M124 35 L128 40 L136 30"
            stroke="#fff"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}

function EngineerCharacter({ state }: { state: CharacterState }) {
  const talking = state === "speaking";
  const thinking = state === "thinking";

  return (
    <svg
      viewBox="0 0 160 180"
      className="h-auto w-full max-w-[140px]"
      role="img"
      aria-label="The Engineer character"
    >
      {/* Shadow */}
      <ellipse cx="80" cy="170" rx="52" ry="8" fill="#000" opacity="0.12" />

      {/* Body / Hoodie */}
      <path
        d="M30 170 L30 115 Q30 90 80 90 Q130 90 130 115 L130 170 Z"
        fill="#334155"
      />

      {/* Hoodie strings */}
      <path
        d="M70 105 L70 130 M90 105 L90 125"
        stroke="#475569"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Neck */}
      <path d="M68 60 L68 95 L92 95 L92 60 Z" fill="#C4A082" />

      {/* Head */}
      <ellipse cx="80" cy="55" rx="32" ry="38" fill="#E6C2A5" />

      {/* Messy Hair */}
      <path
        d="M44 55 Q40 20 80 15 Q120 20 116 55 Q125 35 80 25 Q35 35 44 55 Z"
        fill="#0F172A"
      />
      <path
        d="M70 15 Q75 5 85 15 Q95 5 100 20"
        stroke="#0F172A"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M42 45 Q35 55 40 65"
        stroke="#0F172A"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M118 45 Q125 55 120 65"
        stroke="#0F172A"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Glasses */}
      <rect
        x="48"
        y="42"
        width="28"
        height="20"
        rx="4"
        fill="#E2E8F0"
        fillOpacity="0.4"
        stroke="#0F172A"
        strokeWidth="3"
      />
      <rect
        x="84"
        y="42"
        width="28"
        height="20"
        rx="4"
        fill="#E2E8F0"
        fillOpacity="0.4"
        stroke="#0F172A"
        strokeWidth="3"
      />
      <line x1="76" y1="52" x2="84" y2="52" stroke="#0F172A" strokeWidth="3" />

      {/* Eyes (Blinking) */}
      <g className="animate-panel-blink">
        <circle cx="62" cy="52" r="3" fill="#0F172A" />
        <circle cx="98" cy="52" r="3" fill="#0F172A" />
      </g>

      {/* Mouth */}
      <path
        d={talking ? "M70 74 Q80 86 90 74" : "M72 76 Q80 78 88 76"}
        stroke="#0F172A"
        strokeWidth="2.5"
        fill={talking ? "#EF4444" : "none"}
        strokeLinecap="round"
        className={cn(talking && "animate-panel-talk")}
      />

      {/* Laptop */}
      <rect
        x="40"
        y="125"
        width="80"
        height="45"
        rx="6"
        fill="#0F172A"
        stroke="#475569"
        strokeWidth="2"
      />
      <rect x="45" y="130" width="70" height="35" rx="3" fill="#020617" />
      <text
        x="50"
        y="145"
        fontSize="9"
        fill="#22C55E"
        fontFamily="monospace"
        fontWeight="bold"
      >
        {thinking ? "> build_" : "> prod 🔥"}
      </text>

      {/* Coffee Cup */}
      <g transform="translate(115, 135)">
        <path d="M0 0 L15 0 L12 25 L3 25 Z" fill="#F8FAFC" />
        <path d="M2 10 L13 10" stroke="#EA580C" strokeWidth="4" />
      </g>

      {/* Heard status */}
      {state === "heard" && (
        <>
          <circle
            cx="130"
            cy="35"
            r="14"
            fill="#22C55E"
            stroke="#fff"
            strokeWidth="2"
          />
          <path
            d="M124 35 L128 40 L136 30"
            stroke="#fff"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}

function SkepticCharacter({ state }: { state: CharacterState }) {
  const talking = state === "speaking";
  const thinking = state === "thinking";

  return (
    <svg
      viewBox="0 0 160 180"
      className="h-auto w-full max-w-[140px]"
      role="img"
      aria-label="The Skeptic character"
    >
      {/* Shadow */}
      <ellipse cx="80" cy="170" rx="52" ry="8" fill="#000" opacity="0.12" />

      {/* Body / Turtleneck */}
      <path
        d="M35 170 L35 110 Q35 85 80 85 Q125 85 125 110 L125 170 Z"
        fill="#9F1239"
      />

      {/* Turtleneck Collar */}
      <rect x="64" y="80" width="32" height="20" rx="4" fill="#881337" />

      {/* Neck */}
      <path d="M68 60 L68 85 L92 85 L92 60 Z" fill="#D1A582" />

      {/* Head */}
      <ellipse cx="80" cy="55" rx="32" ry="38" fill="#F5CBA7" />

      {/* Neat Hair */}
      <path
        d="M46 55 Q45 15 80 15 Q115 15 114 55 Q110 25 80 25 Q50 25 46 55 Z"
        fill="#57534E"
      />
      <path d="M46 55 Q40 65 45 75 Q48 65 50 55 Z" fill="#57534E" />
      <path d="M114 55 Q120 65 115 75 Q112 65 110 55 Z" fill="#57534E" />

      {/* Monocle / Glasses */}
      <circle
        cx="94"
        cy="52"
        r="10"
        fill="none"
        stroke="#D4AF37"
        strokeWidth="2.5"
      />
      <line
        x1="104"
        y1="52"
        x2="114"
        y2="52"
        stroke="#D4AF37"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Eyes */}
      <circle cx="66" cy="52" r="4" fill="#0F172A" />
      <circle cx="94" cy="52" r="4" fill="#0F172A" />

      {/* Eyebrows */}
      <path
        d="M58 42 Q66 38 74 42"
        stroke="#57534E"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M86 42 Q94 38 102 42"
        stroke="#57534E"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        className={cn(thinking && "animate-panel-eyebrow")}
      />

      {/* Mouth */}
      <path
        d={talking ? "M70 74 Q80 86 90 74" : "M72 78 L88 78"}
        stroke="#0F172A"
        strokeWidth="2.5"
        fill={talking ? "#EF4444" : "none"}
        strokeLinecap="round"
        className={cn(talking && "animate-panel-talk")}
      />

      {/* Arms Crossed */}
      <path
        d="M35 125 Q80 145 125 125"
        stroke="#700F27"
        strokeWidth="16"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M125 135 Q80 155 35 135"
        stroke="#881337"
        strokeWidth="16"
        strokeLinecap="round"
        fill="none"
      />

      {/* Red Pen */}
      <g transform="translate(45, 115) rotate(45)">
        <rect x="0" y="0" width="4" height="30" rx="2" fill="#E11D48" />
        <path d="M0 30 L2 35 L4 30 Z" fill="#0F172A" />
      </g>

      {/* Heard status */}
      {state === "heard" && (
        <>
          <circle
            cx="130"
            cy="35"
            r="14"
            fill="#22C55E"
            stroke="#fff"
            strokeWidth="2"
          />
          <path
            d="M124 35 L128 40 L136 30"
            stroke="#fff"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      )}
    </svg>
  );
}
