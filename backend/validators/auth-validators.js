import z from "zod";

export const loginUserSchema = z.object({
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
});

export const registerUserSchema = loginUserSchema
  .extend({
    username: z
      .string({ message: "Username is required." })
      .trim()
      .min(3, { message: "Name must be at least 3 characters long." })
      .max(50, { message: "Name must not exceed 50 characters." }),
    confirmPassword: z
      .string({ message: "Confirm password field is required." })
      .min(6, {
        message: "Confirm password must be at least 6 characters long.",
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}|:;<>,.?/~\-=\[\]])[A-Za-z\d!@#$%^&*()_+{}|:;<>,.?/~\-=\[\]]{6,}$/,
        {
          message:
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
        }
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const loginAdminSchema = loginUserSchema;

export const registerAdminSchema = registerUserSchema;
