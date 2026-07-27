import { z } from "zod";

const uuidParam = z.uuid("Invalid UUID format");

export const createSharedGroupSchema = z.object({
  body: z
    .object({
      groupId: uuidParam,
      title: z.string().min(1, "Title is required"),
      isAnonymous: z.boolean(),
    })
    .strict(),
});

export const getAllSharedGroupsSchema = z.object({
  query: z.object({
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

export const getSharedGroupSchema = z.object({
  params: z.object({
    sharedGroupId: uuidParam,
  }),
});

export const removeSharedGroupSchema = z.object({
  params: z.object({
    sharedGroupId: uuidParam,
  }),
});

export const copySharedGroupSchema = z.object({
  params: z.object({
    sharedGroupId: uuidParam,
  }),
  body: z
    .object({
      sectionId: uuidParam,
    })
    .strict(),
});

export type CreateSharedGroupInput = z.infer<typeof createSharedGroupSchema>;
export type GetAllSharedGroupsInput = z.infer<typeof getAllSharedGroupsSchema>;
export type GetSharedGroupInput = z.infer<typeof getSharedGroupSchema>;
export type RemoveSharedGroupInput = z.infer<typeof removeSharedGroupSchema>;
export type CopySharedGroupInput = z.infer<typeof copySharedGroupSchema>;
