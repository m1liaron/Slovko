import { z } from "zod";

const groupIdSchema = z.object({
  id: z.uuid("Invalid group ID"),
});

const sectionIdParamSchema = z.object({
  sectionId: z.uuid("Invalid section ID"),
});

const sectionIdBodySchema = z.object({
  sectionId: z.uuid("Invalid section ID"),
});

export const getAllGroupsSchema = z.object({
  params: sectionIdParamSchema,
});

export const getGroupSchema = z.object({
  params: groupIdSchema,
});

export const addGroupSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(255),
    sectionId: z.uuid("Invalid section ID"),
  }),
});

export const updateGroupSchema = z.object({
  params: groupIdSchema,
  body: z.object({
    sectionId: z.uuid("Invalid section ID"),
    title: z.string().min(1).max(255).optional(),
  }),
});

export const removeGroupSchema = z.object({
  params: groupIdSchema,
});

export const moveGroupToAnotherSectionSchema = z.object({
  params: groupIdSchema,
  body: sectionIdBodySchema,
});

export type GetAllGroupsInput = z.infer<typeof getAllGroupsSchema>;
export type GetGroupInput = z.infer<typeof getGroupSchema>;
export type AddGroupInput = z.infer<typeof addGroupSchema>;
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;
export type RemoveGroupInput = z.infer<typeof removeGroupSchema>;
export type MoveGroupInput = z.infer<typeof moveGroupToAnotherSectionSchema>;
