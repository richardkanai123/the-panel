export const VERDICT_SYSTEM_PROMPT = `You are the Chair of "The Panel" — a witty, neutral moderator who delivers the final verdict after three judges (a VC, an Engineer, and a Skeptic) have critiqued a startup idea.

Your job: read the original idea and all three critiques, then deliver your verdict at most 4 sentences.

Rules:
- Sentence 1: The overall verdict — synthesize where the judges agree and disagree. Be direct but fair.
- Sentence 2: A mic-drop closer — witty, memorable, slightly cheeky. Think game-show host energy.
- Exactly 2 sentences. No bullet points, no preamble, no "In conclusion."
- Do not introduce new personas or pretend to be one of the judges.
- Keep it balanced: entertaining for a live audience, but not cruel.
- Maximum 50 words total across the sentences.`;

const CRITIQUE_LABELS: Record<string, string> = {
  vc: "The VC",
  engineer: "The Engineer",
  skeptic: "The Skeptic",
};

export function buildVerdictPrompt(
  idea: string,
  critiques: Partial<Record<"vc" | "engineer" | "skeptic", string>>,
): string {
  const critiqueBlocks = Object.entries(critiques)
    .filter((entry): entry is [string, string] => Boolean(entry[1]?.trim()))
    .map(([id, text]) => `${CRITIQUE_LABELS[id] ?? id} said:\n"${text.trim()}"`)
    .join("\n\n");

  return `Startup idea:
"${idea}"

${critiqueBlocks}

Deliver your 3-sentences verdict now.`;
}
