import { createTextStreamResponse, streamText, toTextStream } from "ai";

import {
  assertGoogleApiKey,
  getModel,
  GOOGLE_GENERATION_OPTIONS,
  VERDICT_GENERATION,
} from "@/lib/model";
import { verdictRequestSchema } from "@/lib/schemas";
import {
  buildVerdictPrompt,
  VERDICT_SYSTEM_PROMPT,
} from "@/lib/verdict-prompt";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    assertGoogleApiKey();

    const body = await req.json();
    const parsed = verdictRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 },
      );
    }

    const { idea, critiques } = parsed.data;

    const result = streamText({
      model: getModel(),
      system: VERDICT_SYSTEM_PROMPT,
      prompt: buildVerdictPrompt(idea, critiques),
      temperature: VERDICT_GENERATION.temperature,
      maxOutputTokens: VERDICT_GENERATION.maxOutputTokens,
      providerOptions: {
        google: GOOGLE_GENERATION_OPTIONS,
      },
    });

    return createTextStreamResponse({
      stream: toTextStream({ stream: result.stream }),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate verdict";

    if (message.includes("GOOGLE_GENERATIVE_AI_API_KEY")) {
      return Response.json(
        { error: "Panel is offline — check API key" },
        { status: 500 },
      );
    }

    return Response.json({ error: message }, { status: 500 });
  }
}
