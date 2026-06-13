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
  params: z.object({
    userId: z.string().min(1, "userId is required"),
  }),
  body: z
    .object({
      username: z.string().min(2).max(32).optional(),
      email: z.email().optional(),
      avatar: z.url().optional(),
    })
    .strict(),
});

const updateUserStreakSchema = z.object({
  body: z.object({
    date: z.date({ message: "Must be a valid ISO datetime" }),
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
  updateUserStreakSchema,
  buyFreezeSchema,
};
