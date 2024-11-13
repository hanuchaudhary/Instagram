import express, { NextFunction, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserType } from '../types/UserTypes';
import 'dotenv/config';
import { sendEmail } from '../libs/sendEmail';
import { upload } from '../libs/multerUpload';
import { uploadOnCloudinary } from '../libs/uploadCloudinary';
import authMiddleware from '../middleware';
import { z } from 'zod';
import { signupSchema, signinSchema, verifyCodeSchema } from '@hanuchaudhary/instagram'

export const userRouter = express.Router();
const prisma = new PrismaClient();

userRouter.post("/signup", async (req: Request, res: Response): Promise<any> => {
    const { fullName, email, username, password } = req.body as UserType;

    const validation = signupSchema.safeParse({ fullName, email, username, password });
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.errors.map((error) => error.message).join(', ')
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email format"
        });
    }

    try {
        const existByUsername = await prisma.user.findFirst({
            where: { username }
        });

        if (existByUsername) {
            if (!existByUsername.isVerified) {
                await prisma.user.delete({
                    where: {
                        id: existByUsername.id
                    }
                })
                console.log(`Deleted unverified user with username: ${username}`);
            } else {
                return res.status(409).json({
                    success: false,
                    message: "Username is not available"
                });
            }
        }

        const existByEmail = await prisma.user.findFirst({
            where: { email, isVerified: true }
        });

        if (existByEmail) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email"
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
                accountType: "public",
            }
        });

        await sendEmail(user.email, verifyCode);

        return res.status(201).json({
            success: true,
            message: "User registered successfully. Please verify your email.",
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
    const { verifyCode, username } = req.body;
    const validation = verifyCodeSchema.safeParse({ verifyCode });
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            errors: validation.error.errors,
            message: validation.error.errors.map((err) => err.message).join(", "),
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const currentTime = Date.now();
        if (parseInt(user.verifyCodeExpiry) < currentTime) {
            return res.status(400).json({
                success: false,
                message: "Verification code has expired",
            });
        }

        if (verifyCode !== user.verifyCode) {
            return res.status(400).json({
                success: false,
                message: "Wrong verification code",
            });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verifyCode: "",
                verifyCodeExpiry: "",
            },
        });

        return res.status(200).json({
            success: true,
            message: "User verified successfully",
        });

    } catch (error) {
        console.error("Error verifying user:", error);
        return res.status(500).json({
            success: false,
            message: "Error while verifying user",
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
        });
    }
});

userRouter.post("/signin", async (req: Request, res: Response): Promise<any> => {
    const { credential, password } = req.body;

    if (!credential || !password) {
        return res.status(400).json({
            success: false,
            message: "Both credential (email/username) and password are required",
        });
    }

    const validation = signinSchema.safeParse({ credential, password });
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.errors[0].message,
        });
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [{ email: credential }, { username: credential }],
            },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist with this email or username",
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "User is not verified. Please verify your email address.",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password",
            });
        }

        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return res.status(500).json({
                success: false,
                message: "JWT secret is not configured. Please check the server configuration.",
            });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            jwtSecret
        );

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            fullName: user.fullName,
        });

    } catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while logging in",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
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
                posts: {
                    select: {
                        id: true,
                        mediaURL: true,
                        _count: {
                            select: {
                                comments: true,
                                likes: true
                            }
                        }
                    }
                },
                sentMessages: true,
                receivedMessages: true
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

        const myFollowingUsersId = await prisma.following.findMany({
            where: {
                userId
            },
            select: {
                followId: true
            }
        });

        const followingIds = myFollowingUsersId.map(follow => follow.followId);

        const users = await prisma.user.findMany({
            where: {
                AND: [
                    { username: { contains: filter, mode: "insensitive" } },
                    { id: { not: userId } }
                ]
            },
            select: {
                id: true,
                avatar: true,
                username: true,
                fullName: true
            }
        });

        const usersWithFollowStatus = users.map(user => ({
            ...user,
            isFollowing: followingIds.includes(user.id)
        }));

        return res.status(200).json({
            success: true,
            users: usersWithFollowStatus,
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

        const myFollowingUsersId = await prisma.following.findMany({
            where: {
                userId
            },
            select: {
                followId: true
            }
        });

        const followingIds = myFollowingUsersId.map(follow => follow.followId);

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
            },
            select: {
                id: true,
                username: true,
                fullName: true,
                avatar: true
            }
        });

        const suggestedUsersWithFollowStatus = suggestedUsers.map(user => ({
            ...user,
            isFollowing: followingIds.includes(user.id)
        }));

        return res.status(200).json({
            success: true,
            users: suggestedUsersWithFollowStatus
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

userRouter.get("/bulk-followers", authMiddleware, async (req: Request, res: Response): Promise<any> => {
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

        const following = await prisma.followers.findMany({
            where: {
                followId: user.id
            },
            include: {
                user: {
                    select: {
                        id: true,
                        avatar: true,
                        username: true
                    }
                }
            }
        })

        const followers = await prisma.following.findMany({
            where: {
                followId: user.id,
            },
            include: {
                user: {
                    select: {
                        avatar: true,
                        username: true,
                        id: true,
                    }
                }
            }
        })

        return res.status(200).json({
            success: true,
            followers,
            following
        })

    } catch (error) {
        console.error("Error while fetching followers:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching followers",
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
        });
    }
})

userRouter.get("/profile/:username", async (req: Request, res: Response): Promise<any> => {
    const { username } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                avatar: true,
                bio: true,
                fullName: true,
                posts: true,
                _count: {
                    select: {
                        followers: true,
                        following: true,
                        posts: true,
                    }
                }
            }
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user
        })
    } catch (error) {
        console.error("Error while fetching profile:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching profile",
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
        });
    }
})


userRouter.post("/change-password", authMiddleware, upload.single("avatar"), async (req: Request, res: Response): Promise<any> => {
    const { password, currentPassword } = req.body;
    const userId = (req as any).userId;
    try {

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }, select: {
                password: true
            }
        })

        if (!user) {
            res.status(402).json({
                message: "User Not Found"
            })
            return
        }

        const dcryptCurrentPassword = await bcrypt.compare(currentPassword, user?.password)
        if (!dcryptCurrentPassword) {
            res.status(402).json({
                message: "Password didn't match"
            })
            return
        }

        const newPassword = await bcrypt.hash(password, 10);

        const updatePassword = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: newPassword
            }
        })

        return res.status(200).json({
            success: false,
            message: "Password Updated Successfully",
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