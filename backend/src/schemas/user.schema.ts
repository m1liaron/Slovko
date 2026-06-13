import { z } from "zod";

const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    name: z.string().min(2).max(32),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email"),
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
      email: z.string().email().optional(),
      avatar: z.string().url().optional(),
      // add other updatable fields here
    })
    .strict(), // rejects unknown fields
});

const updateUserStreakSchema = z.object({
  body: z.object({
    date: z.string().datetime({ message: "Must be a valid ISO datetime" }),
    // add other streak fields your controller expects
  }),
});

const buyFreezeSchema = z.object({
  body: z.object({
    // e.g. if freeze purchase needs a count or type:
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
