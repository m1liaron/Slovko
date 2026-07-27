import { z } from "zod";

const uuidParam = z.uuid("Invalid UUID format");

const cardBodySchema = z.object({
  word: z.string().min(1, "Word is required"),
  translateWord: z.string().min(1, "Translation is required"),
  groupId: uuidParam,
  imageUri: z.string().url().optional(),
  example: z.string().optional(),
  definition: z.string().optional(),
});

export const getRepeatedCardsSchema = z.object({
  params: z.object({
    sectionId: uuidParam,
  }),
});

export const getCardsFromIdsSchema = z.object({
  body: z.array(uuidParam).min(1, "At least one card ID is required"),
});

export const getAllCardsSchema = z.object({
  params: z.object({
    groupId: uuidParam,
  }),
});

export const getAllStatusCardsSchema = z.object({
  params: z.object({
    groupId: uuidParam,
    status: z.enum(["new", "learning", "review", "mastered"]),
  }),
});

export const updateCardsAfterReviewSchema = z.object({
  body: z.array(uuidParam).min(1, "At least one card ID is required"),
});

export const addCardSchema = z.object({
  body: cardBodySchema.strict(),
});

export const addManyCardsSchema = z.object({
  body: z
    .object({
      cards: z.array(cardBodySchema).min(1, "At least one card is required"),
    })
    .strict(),
});

export const updateCardSchema = z.object({
  params: z.object({
    id: uuidParam,
  }),
  body: cardBodySchema
    .partial()
    .extend({
      groupId: uuidParam,
    })
    .strict(),
});

export const removeCardSchema = z.object({
  params: z.object({
    id: uuidParam,
  }),
});

export type GetRepeatedCardsInput = z.infer<typeof getRepeatedCardsSchema>;
export type GetCardsFromIdsInput = z.infer<typeof getCardsFromIdsSchema>;
export type GetAllCardsInput = z.infer<typeof getAllCardsSchema>;
export type GetAllStatusCardsInput = z.infer<typeof getAllStatusCardsSchema>;
export type UpdateCardsAfterReviewInput = z.infer<
  typeof updateCardsAfterReviewSchema
>;
export type AddCardInput = z.infer<typeof addCardSchema>;
export type AddManyCardsInput = z.infer<typeof addManyCardsSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type RemoveCardInput = z.infer<typeof removeCardSchema>;
