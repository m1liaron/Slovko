import { z } from "zod";

const uuidParam = z.uuid("Invalid UUID format");

const cardBodySchema = z.object({
  word: z.string().min(1, "Word is required"),
  translateWord: z.string().min(1, "Translation is required"),
  groupId: uuidParam,
  imageUri: z.url().optional(),
  example: z.string().optional(),
  definition: z.string().optional(),
});

const getRepeatedCardsSchema = z.object({
  params: z.object({
    sectionId: uuidParam,
  }),
});

const getCardsFromIdsSchema = z.object({
  body: z.array(uuidParam).min(1, "At least one card ID is required"),
});

const getAllCardsSchema = z.object({
  params: z.object({
    groupId: uuidParam,
  }),
});

const getAllStatusCardsSchema = z.object({
  params: z.object({
    groupId: uuidParam,
    status: z.enum(["new", "learning", "review", "mastered"]),
  }),
});

const updateCardsAfterReviewSchema = z.object({
  body: z.array(uuidParam).min(1, "At least one card ID is required"),
});

const addCardSchema = z.object({
  body: cardBodySchema.strict(),
});

const addManyCardsSchema = z.object({
  body: z
    .object({
      cards: z.array(cardBodySchema).min(1, "At least one card is required"),
    })
    .strict(),
});

const updateCardSchema = z.object({
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

const removeCardSchema = z.object({
  params: z.object({
    id: uuidParam,
  }),
});

export {
  uuidParam,
  cardBodySchema,
  getRepeatedCardsSchema,
  getCardsFromIdsSchema,
  getAllCardsSchema,
  getAllStatusCardsSchema,
  updateCardsAfterReviewSchema,
  addCardSchema,
  addManyCardsSchema,
  updateCardSchema,
  removeCardSchema,
};