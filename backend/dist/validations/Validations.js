"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postSchema = exports.verifyCodeSchema = exports.signinSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
exports.signupSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, { message: "Username must be at least 3 characters long" })
        .max(20, { message: "Username must be at most 20 characters long" })
        .regex(/^[a-zA-Z0-9_]+$/, { message: "Username can only contain letters, numbers, and underscores" }),
    fullName: zod_1.z
        .string()
        .min(3, { message: "Full name must be at least 3 characters long" })
        .max(50, { message: "Full name must be at most 50 characters long" })
        .regex(/^[a-zA-Z\s]+$/, { message: "Full name can only contain letters and spaces" }),
    email: zod_1.z
        .string()
        .email({ message: "Invalid email address" }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(20, { message: "Password must be at most 20 characters long" })
    // .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    // .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    // .regex(/[0-9]/, { message: "Password must contain at least one number" })
    // .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character (@, $, !, %, *, ?, &)" })
});
exports.signinSchema = zod_1.z.object({
    credential: zod_1.z
        .string().min(2, { message: "Username have atleast 2 Charcters" }),
    password: zod_1.z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" })
        .max(20, { message: "Password must be at most 20 characters long" })
    // .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    // .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    // .regex(/[0-9]/, { message: "Password must contain at least one number" })
    // .regex(/[@$!%*?&]/, { message: "Password must contain at least one special character (@, $, !, %, *, ?, &)" })
});
exports.verifyCodeSchema = zod_1.z.object({
    verifyCode: zod_1.z.string().length(6, { message: "OTP must be exactly 6 digits" }).regex(/^\d+$/, { message: "OTP must contain only numbers" }),
});
exports.postSchema = zod_1.z.object({
    caption: zod_1.z.string().min(5, { message: "Caption must have atleast 5 Charcaters" }).max(100, { message: "Caption have max 100 Characters" }),
    location: zod_1.z.string().optional(),
    mediaURL: zod_1.z.string().url({ message: "Please put valid image url" })
});
