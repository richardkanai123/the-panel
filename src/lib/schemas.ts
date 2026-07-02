import { z } from "zod";

export const personaIdSchema = z.enum(["vc", "engineer", "skeptic"]);

export const ideaSchema = z
  .string()
  .trim()
  .min(10, "Your idea needs at least 10 characters.")
  .max(2000, "Keep it under 2000 characters.");

export const critiqueRequestSchema = z.object({
  prompt: ideaSchema,
  personaId: personaIdSchema,
});

export const critiquesSchema = z.object({
  vc: z.string().min(1),
  engineer: z.string().min(1),
  skeptic: z.string().min(1),
});

export const partialCritiquesSchema = z
  .object({
    vc: z.string().optional(),
    engineer: z.string().optional(),
    skeptic: z.string().optional(),
  })
  .refine(
    (critiques) =>
      Object.values(critiques).filter((value) => value && value.length > 0)
        .length >= 2,
    { message: "At least two critiques are required for a verdict." },
  );

export const verdictRequestSchema = z.object({
  idea: ideaSchema,
  critiques: partialCritiquesSchema,
});

export type PersonaId = z.infer<typeof personaIdSchema>;
export type Critiques = z.infer<typeof critiquesSchema>;
export type PartialCritiques = z.infer<typeof partialCritiquesSchema>;
