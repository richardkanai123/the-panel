import { createGoogle, type GoogleLanguageModelOptions } from "@ai-sdk/google";

const DEFAULT_MODEL = "gemini-2.5-flash";

export const GOOGLE_GENERATION_OPTIONS = {
  thinkingConfig: {
    thinkingBudget: 0,
  },
} satisfies GoogleLanguageModelOptions;

function getGoogleProvider() {
  const apiKey =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not configured");
  }

  return createGoogle({ apiKey });
}

export function getModel() {
  const modelId = process.env.AI_MODEL ?? DEFAULT_MODEL;
  return getGoogleProvider()(modelId);
}

export function assertGoogleApiKey(): void {
  if (
    !process.env.GOOGLE_GENERATIVE_AI_API_KEY &&
    !process.env.GOOGLE_API_KEY
  ) {
    throw new Error("GOOGLE_GENERATIVE_AI_API_KEY is not configured");
  }
}

export const PERSONA_GENERATION = {
  temperature: 0.9,
  maxOutputTokens: 1024,
} as const;

export const VERDICT_GENERATION = {
  temperature: 0.8,
  maxOutputTokens: 512,
} as const;
