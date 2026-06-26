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

const getAllGroupsSchema = z.object({
  params: sectionIdParamSchema,
});

const getGroupSchema = z.object({
  params: groupIdSchema,
});

const addGroupSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(255),
    sectionId: z.uuid("Invalid section ID"),
  }),
});

const updateGroupSchema = z.object({
  params: groupIdSchema,
  body: z.object({
    sectionId: z.uuid("Invalid section ID"),
    title: z.string().min(1).max(255).optional(),
  }),
});

const removeGroupSchema = z.object({
  params: groupIdSchema,
});

const moveGroupToAnotherSectionSchema = z.object({
  params: groupIdSchema,
  body: sectionIdBodySchema,
});

export {
  groupIdSchema,
  sectionIdParamSchema,
  sectionIdBodySchema,
  getAllGroupsSchema,
  getGroupSchema,
  addGroupSchema,
  updateGroupSchema,
  removeGroupSchema,
  moveGroupToAnotherSectionSchema,
};