import { z } from 'zod';

export const signupSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(20, { message: "Username must be at most 20 characters long" })
        .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),

    fullName: z
        .string()
        .min(3, { message: "Full name must be at least 3 characters long" })
        .max(50, { message: "Full name must be at most 50 characters long" })
        .regex(/^[a-zA-Z\s]+$/, { message: "Full name can only contain letters and spaces" }),

    email: z
        .string()
        .email({ message: "Invalid email address" }),

    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(20, { message: "Password must be at most 20 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character (@, $, !, %, *, ?, &)" })
});
export type SignupType = z.infer<typeof signinSchema>;


export const signinSchema = z.object({
    credential: z
        .string().min(2, { message: "Username have atleast 2 Charcters" }),

    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(20, { message: "Password must be at most 20 characters long" })
});
export type SigninType = z.infer<typeof signinSchema>;


export const verifyCodeSchema = z.object({
    verifyCode: z.string().length(6, { message: "OTP must be exactly 6 digits" }).regex(/^\d+$/, { message: "OTP must contain only numbers" }),
})
export type VerifyfyCodeType = z.infer<typeof verifyCodeSchema>;


export const postSchema = z.object({
    caption: z.string().min(5, { message: "Caption must have atleast 5 Charcaters" }).max(100, { message: "Caption have max 100 Characters" }),
    location: z.string().optional(),
    mediaURL: z.instanceof(File).optional(),
})
export type PostType = z.infer<typeof postSchema>;


export const editProfileSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }).optional(),
    bio: z.string().max(160, {
        message: "Bio must not be longer than 160 characters.",
    }).optional(),
    accountType: z.enum(["private", "public"]).optional(),
    avatar: z.instanceof(File).optional(),
});
export type EditProfileType = z.infer<typeof editProfileSchema>;

export const reportSchema = z.object({
    reason: z.string().min(1, { message: "Reason must be atleast 1 Charcter" }),
    type: z.enum(["POST", "USER", "COMMENT"]),
    targetId: z.string(),
    reportedId: z.string()
})
export type ReportType = z.infer<typeof reportSchema>;
