import z from "zod";

export const userBaseSchema = z.object({
  name: z
    .string({ message: "Name is required." })
    .trim()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(50, { message: "Name must not exceed 50 characters." }),

  email: z
    .string({ message: "Email is required." })
    .trim()
    .email({ message: "Please enter a valid email address." })
    .max(50, { message: "Email must not exceed 50 characters." }),

  password: z
    .string({ message: "Password is required." })
    .min(6, { message: "Password must be at least 6 characters long." })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:;<>,.?/~\-=\[\]])[A-Za-z\d!@#$%^&*()_+{}|:;<>,.?/~\-=\[\]]{6,}$/,
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      }
    ),

  role: z.enum(["user", "admin"]).optional(),
});
