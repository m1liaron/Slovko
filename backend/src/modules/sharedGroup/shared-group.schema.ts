import { z } from "zod";

const uuidParam = z.uuid("Invalid UUID format");

const createSharedGroupSchema = z.object({
  body: z
    .object({
      groupId: uuidParam,
      title: z.string().min(1, "Title is required"),
      isAnonymous: z.boolean(),
    })
    .strict(),
});

const getAllSharedGroupsSchema = z.object({
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

const getSharedGroupSchema = z.object({
  params: z.object({
    sharedGroupId: uuidParam,
  }),
});

const removeSharedGroupSchema = z.object({
  params: z.object({
    sharedGroupId: uuidParam,
  }),
});

const copySharedGroupSchema = z.object({
  params: z.object({
    sharedGroupId: uuidParam,
  }),
  body: z
    .object({
      sectionId: uuidParam,
    })
    .strict(),
});

type CreateSharedGroupInput = z.infer<typeof createSharedGroupSchema>;
type GetAllSharedGroupsInput = z.infer<typeof getAllSharedGroupsSchema>;
type GetSharedGroupInput = z.infer<typeof getSharedGroupSchema>;
type RemoveSharedGroupInput = z.infer<typeof removeSharedGroupSchema>;
type CopySharedGroupInput = z.infer<typeof copySharedGroupSchema>;

export {
  createSharedGroupSchema,
  getAllSharedGroupsSchema,
  getSharedGroupSchema,
  removeSharedGroupSchema,
  copySharedGroupSchema,

  type CreateSharedGroupInput,
  type GetAllSharedGroupsInput,
  type GetSharedGroupInput,
  type RemoveSharedGroupInput,
  type CopySharedGroupInput,
};