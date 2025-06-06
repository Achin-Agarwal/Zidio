import z from "zod";

export const loginUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(100, { message: "Email must not exceed 100 characters" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password must not exceed 100 characters" }),
});

export const registerUserSchema = loginUserSchema.extend({
  name: z
    .string()
    .trim()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(50, { message: "Name must not exceed 50 characters" }),
});
