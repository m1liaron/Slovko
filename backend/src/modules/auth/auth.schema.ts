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


export {
  registerSchema,
  loginSchema
};
