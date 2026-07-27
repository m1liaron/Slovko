import { z } from "zod";

const registerSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(2).max(32),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
    password: z.string().min(1, "Password is required"),
  }),
});

const updateUserSchema = z.object({
  body: z
    .object({
      name: z.string().min(2).max(32).optional(),
      email: z.email().optional(),
      image: z.url().optional(),
    })
    .strict(),
});

const getUserStreakDatesSchema = z.object({
  query: z.object({
    month: z.coerce.number().int().min(0),
    year: z.coerce.number().int().min(0),
  }),
});

const buyFreezeSchema = z.object({
  body: z.object({
    count: z.number().int().min(1).max(10).optional(),
  }),
});

export {
  registerSchema,
  loginSchema,
  updateUserSchema,
  getUserStreakDatesSchema,
  buyFreezeSchema,
};
