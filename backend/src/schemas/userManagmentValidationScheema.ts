import { z } from "zod";

const UserRole = z.ZodEnum.create(["client", "freelancer"]);

export const createUserSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password is too long. It must be less than 20 characters"),
  username: z
    .string()
    .min(4, "Username is required")
    .max(18, "Username is too long. It must be less than 18 characters"),
  userType: UserRole,
});

export type CreateUserValidation = z.infer<typeof createUserSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
});

export type LoginValidation = z.infer<typeof loginSchema>;
