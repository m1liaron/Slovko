import { z } from "zod";

const uuidParam = z.uuid("Invalid UUID format");
export const getResultsDetailsSchema = z.object({});

export const getResultsStatisticsSchema = z.object({});

export const getResultsSchema = z.object({
  query: z.object({
    month: z
      .string()
      .regex(/^(0?[1-9]|1[0-2])$/, "Month must be between 1 and 12")
      .optional(),
    year: z
      .string()
      .regex(/^\d{4}$/, "Year must be a 4-digit number")
      .optional(),
    page: z
      .string()
      .regex(/^\d+$/, "Page must be a positive integer")
      .optional()
      .default("1"),
    limit: z
      .string()
      .regex(/^\d+$/, "Limit must be a positive integer")
      .optional()
      .default("10"),
  }),
});


export const getResultDetailsSchema = z.object({
  params: z.object({
    resultId: uuidParam,
  }),
});

const wordResultSchema = z.object({
    wordId: uuidParam,
    word: z.string().min(1, "Word is required"),
    translateWord: z.string().min(1, "Translation is required"),
    mistakesAmount: z.number().int().min(0, "Mistakes amount must be non-negative"),
});

export const saveResultsSchema = z.object({
    body: z.object({
        title: z.string().min(1, "Title is required"),
        startedLearn: z.coerce.date(),
        completionTime: z.number().int().min(0, "Completion time must be non-negative"),
        flashCards: z.array(wordResultSchema).min(1, "At least one flashcard result is required"),
        guessWord: z.array(wordResultSchema).min(1, "At least one guess word result is required"),
        quiz: z.array(wordResultSchema).min(1, "At least one quiz result is required"),
    }).strict(),
});

export type GetResultsInput        = z.infer<typeof getResultsSchema>;
export type GetResultDetailsInput  = z.infer<typeof getResultDetailsSchema>;
export type SaveResultsInput       = z.infer<typeof saveResultsSchema>;