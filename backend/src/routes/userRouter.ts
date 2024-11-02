import express, { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { signinSchema, signupSchema, verifyCodeSchema } from '../validations/Validations';
import { UserType } from '../types/UserTypes';
import 'dotenv/config';
import { sendEmail } from '../libs/sendEmail';
import { upload } from '../libs/multerUpload';
import { uploadOnCloudinary } from '../libs/uploadCloudinary';
import authMiddleware from '../middleware';
import { z } from 'zod';

export const userRouter = express.Router();
const prisma = new PrismaClient();

userRouter.post("/signup", async (req: Request, res: Response): Promise<any> => {
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

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
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

userRouter.post("/verify", async (req: Request, res: Response): Promise<any> => {
    const { verifyCode, username } = await req.body;
    const validation = verifyCodeSchema.safeParse({ verifyCode });
    if (!validation.success) {
        return res.status(402).json({
            success: false,
            error: validation.error.errors
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

userRouter.post("/signin", async (req: Request, res: Response): Promise<any> => {
    const { credential, password } = req.body
    const validation = signinSchema.safeParse({ credential, password });
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.errors[0].message
        });
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: credential }, { username: credential }],
            }
        });

        if (user?.isVerified === false) {
            return res.status(404).json({
                success: false,
                message: "User is not Verified!"
            });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not Exist with this Email or Username"
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
            { expiresIn: '3h' }
        );

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            fullName: user.fullName
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

userRouter.get("/me", authMiddleware, async (req: Request, res: Response): Promise<any> => {
    const userId = (req as any).userId
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        posts: true,
                    }
                },
                following: true,
                followers: true,
                posts: true
            }
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        return res.status(200).json({
            success: true,
            user
        })

    } catch (error) {
        console.error("Error while fetching profile:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching profile details",
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
    }
})

userRouter.post("/edit", authMiddleware, upload.single("avatar"), async (req: Request, res: Response): Promise<any> => {
    const { bio, fullName, accountType } = req.body;
    const userId = (req as any).userId;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const result = await uploadOnCloudinary(req.file?.path)
        const avatarURL = result?.url

        const updateUser = await prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                bio,
                avatar: avatarURL,
                fullName,
                accountType
            }
        })

        return res.status(200).json({
            success: false,
            message: "User Details Updated Successfully",
            updateUser
        });

    } catch (error) {
        console.error("Error while updating user:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating user details",
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
    }
})

const filterSchema = z.object({
    filter: z.string().optional(),
});

userRouter.get("/bulk", authMiddleware, async (req: Request, res: Response): Promise<any> => {
    const parsed = filterSchema.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            message: "Invalid request data",
            errors: parsed.error.errors,
        });
    }

    const { filter } = parsed.data;

    try {
        const userId = (req as any).userId;
        const users = await prisma.user.findMany({
            where: { 
                AND: [
                    { username: { contains: filter } },
                    { id: { not: userId } }
                ]
            },select :{
                id : true,
                avatar : true,
                username: true,
                fullName: true
            }
        });

        return res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        console.error("Error while fetching users:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching users",
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
        });
    }
});

userRouter.get("/suggestions", authMiddleware, async (req: Request, res: Response): Promise<any> => {
    const userId = (req as any).userId;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "unauthorized",
            });
        }

        const suggestedUsers = await prisma.user.findMany({
            where: {
                AND: [
                    { id: { not: userId } },
                    {
                        NOT: {
                            followers: {
                                some: {
                                    userId: userId
                                }
                            }
                        }
                    }
                ]
            },
            take: 5,
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json({
            success: true,
            users: suggestedUsers
        });

    } catch (error) {
        console.error("Error while fetching suggestions:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching suggestions",
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
        });
    }
})


