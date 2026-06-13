import { z } from "zod";

const uuidParam = z.object({
  params: z.object({
    id: z.uuid("Section id must be a valid UUID"),
  }),
});

const addSectionSchema = z.object({
  body: z
    .object({
      title: z.string().min(1).max(255).optional(),
      languageId: z.string().uuid("languageId must be a valid UUID").optional(),
    })
    .strict()
    .refine((b) => b.title !== undefined || b.languageId !== undefined, {
      message: "At least one of title or languageId must be provided",
    }),
});

const updateSectionSchema = uuidParam.extend({
  body: z
    .object({
      title: z.string().min(1).max(255).optional(),
      languageId: z.string().uuid("languageId must be a valid UUID").optional(),
    })
    .strict()
    .refine((b) => Object.keys(b).length > 0, {
      message: "Body must contain at least one field to update",
    }),
});

const removeSectionSchema = uuidParam;

export { addSectionSchema, updateSectionSchema, removeSectionSchema };
