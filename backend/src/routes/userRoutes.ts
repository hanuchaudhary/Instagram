import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { signinSchema, signupSchema, verifyCodeSchema } from '../validations/Validations';
import { UserType } from '../types/UserTypes';
import 'dotenv/config';
import { sendEmail } from '../libs/sendEmail';

export const userRouter = express.Router();
const prisma = new PrismaClient();

userRouter.post("/signup", async (req: any, res: any) => {
    const { fullName, email, username, password } = req.body as UserType;

    const validation = signupSchema.safeParse({ fullName, email, username, password });
    if (!validation.success) {
        return res.status(402).json({
            success: false,
            message: validation.error.errors
        });
    }

    try {
        const userExist = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        });

        if (userExist) {
            return res.status(409).json({
                success: false,
                message: "User already Exists with this Email or Username"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const user = await prisma.user.create({
            data: {
                username,
                email,
                fullName,
                avatar: "",
                bio: "",
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: (Date.now() + 3600000).toString(),
                accountType: "public"
            }
        });

        await sendEmail(user.email, verifyCode);

        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            username: user.username
        });

    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({
            success: false,
            message: "Error while registering user",
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
    }
});

userRouter.post("/verify", async (req: any, res: any) => {
    const { verifyCode, username } = await req.body;
    const validation = verifyCodeSchema.safeParse({ verifyCode });
    if (!validation.success) {
        return res.status(402).json({
            success: false,
            error: validation.error.errors[0].message
        })
    }

    try {

        const user = await prisma.user.findUnique({
            where: {
                username
            }
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        if (verifyCode != user.verifyCode) {
            return res.status(400).json({
                success: false,
                message: "Wrong Verification Code",
            })
        }

        await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                isVerified: true,
                verifyCode: "",
                verifyCodeExpiry: ""
            }
        })

        return res.status(201).json({
            success: true,
            message: " User verified Successfully"
        })

    } catch (error) {
        console.error("Error verifying user:", error);
        return res.status(500).json({
            success: false,
            message: "Error while verifying user",
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
    }
})

userRouter.post("/signin", async (req: any, res: any) => {
    const { email, username, password } = req.body as UserType;
    const validation = signinSchema.safeParse({ email, username, password });
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.errors[0].message
        });
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
                isVerified: true
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist with this email or username"
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            process.env.JWT_SECRET!,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            fullName : user.fullName
        });

    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while logging in",
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
    }
});


