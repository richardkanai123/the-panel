import { createTextStreamResponse, streamText, toTextStream } from "ai";

import {
  assertGoogleApiKey,
  getModel,
  GOOGLE_GENERATION_OPTIONS,
  PERSONA_GENERATION,
} from "@/lib/model";
import { PERSONA_BY_ID } from "@/lib/personas";
import { critiqueRequestSchema } from "@/lib/schemas";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    assertGoogleApiKey();

    const body = await req.json();
    const parsed = critiqueRequestSchema.safeParse(body);

    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid request" },
        { status: 400 },
      );
    }

    const { prompt: idea, personaId } = parsed.data;
    const persona = PERSONA_BY_ID[personaId];

    if (!persona) {
      return Response.json({ error: "Persona not found" }, { status: 404 });
    }

    const result = streamText({
      model: getModel(),
      system: persona.systemPrompt,
      prompt: idea,
      temperature: PERSONA_GENERATION.temperature,
      maxOutputTokens: PERSONA_GENERATION.maxOutputTokens,
      providerOptions: {
        google: GOOGLE_GENERATION_OPTIONS,
      },
    });

    return createTextStreamResponse({
      stream: toTextStream({ stream: result.stream }),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate critique";

    if (message.includes("GOOGLE_GENERATIVE_AI_API_KEY")) {
      return Response.json(
        { error: "Panel is offline — check API key" },
        { status: 500 },
      );
    }

    return Response.json({ error: message }, { status: 500 });
  }
}
