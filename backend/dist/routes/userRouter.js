"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv/config");
const sendEmail_1 = require("../libs/sendEmail");
const multerUpload_1 = require("../libs/multerUpload");
const uploadCloudinary_1 = require("../libs/uploadCloudinary");
const middleware_1 = __importDefault(require("../middleware"));
const zod_1 = require("zod");
const instagram_1 = require("@hanuchaudhary/instagram");
exports.userRouter = express_1.default.Router();
const prisma = new client_1.PrismaClient();
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, username, password } = req.body;
    const validation = instagram_1.signupSchema.safeParse({ fullName, email, username, password });
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
        const existByUsername = yield prisma.user.findFirst({
            where: { username }
        });
        if (existByUsername) {
            if (!existByUsername.isVerified) {
                yield prisma.user.delete({
                    where: {
                        id: existByUsername.id
                    }
                });
                console.log(`Deleted unverified user with username: ${username}`);
            }
            else {
                return res.status(409).json({
                    success: false,
                    message: "Username is not available"
                });
            }
        }
        const existByEmail = yield prisma.user.findFirst({
            where: { email, isVerified: true }
        });
        if (existByEmail) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email"
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const user = yield prisma.user.create({
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
        yield (0, sendEmail_1.sendEmail)(user.email, verifyCode);
        return res.status(201).json({
            success: true,
            message: "User registered successfully. Please verify your email.",
            username: user.username
        });
    }
    catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({
            success: false,
            message: "Error while registering user",
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
    }
}));
exports.userRouter.post("/verify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { verifyCode, username } = req.body;
    const validation = instagram_1.verifyCodeSchema.safeParse({ verifyCode });
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            errors: validation.error.errors,
            message: validation.error.errors.map((err) => err.message).join(", "),
        });
    }
    try {
        const user = yield prisma.user.findUnique({
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
        yield prisma.user.update({
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
    }
    catch (error) {
        console.error("Error verifying user:", error);
        return res.status(500).json({
            success: false,
            message: "Error while verifying user",
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
        });
    }
}));
exports.userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { credential, password } = req.body;
    if (!credential || !password) {
        return res.status(400).json({
            success: false,
            message: "Both credential (email/username) and password are required",
        });
    }
    const validation = instagram_1.signinSchema.safeParse({ credential, password });
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.errors[0].message,
        });
    }
    try {
        const user = yield prisma.user.findFirst({
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
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
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
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, username: user.username }, jwtSecret);
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            fullName: user.fullName,
        });
    }
    catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while logging in",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
}));
exports.userRouter.get("/me", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const user = yield prisma.user.findUnique({
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
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        console.error("Error while fetching profile:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching profile details",
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
    }
}));
exports.userRouter.post("/edit", middleware_1.default, multerUpload_1.upload.single("avatar"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { bio, fullName, accountType } = req.body;
    const userId = req.userId;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const result = yield (0, uploadCloudinary_1.uploadOnCloudinary)((_a = req.file) === null || _a === void 0 ? void 0 : _a.path, "instagram-clone/avatars", "image");
        const avatarURL = result === null || result === void 0 ? void 0 : result.url;
        const updateUser = yield prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                bio,
                avatar: avatarURL,
                fullName,
                accountType
            }
        });
        return res.status(200).json({
            success: false,
            message: "User Details Updated Successfully",
            updateUser
        });
    }
    catch (error) {
        console.error("Error while updating user:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating user details",
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
    }
}));
const filterSchema = zod_1.z.object({
    filter: zod_1.z.string().optional(),
});
exports.userRouter.get("/bulk", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const userId = req.userId;
        const myFollowingUsersId = yield prisma.following.findMany({
            where: {
                userId
            },
            select: {
                followId: true
            }
        });
        const followingIds = myFollowingUsersId.map(follow => follow.followId);
        const users = yield prisma.user.findMany({
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
        const usersWithFollowStatus = users.map(user => (Object.assign(Object.assign({}, user), { isFollowing: followingIds.includes(user.id) })));
        return res.status(200).json({
            success: true,
            users: usersWithFollowStatus,
        });
    }
    catch (error) {
        console.error("Error while fetching users:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching users",
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
        });
    }
}));
exports.userRouter.get("/suggestions", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "unauthorized",
            });
        }
        const myFollowingUsersId = yield prisma.following.findMany({
            where: {
                userId
            },
            select: {
                followId: true
            }
        });
        const followingIds = myFollowingUsersId.map(follow => follow.followId);
        const suggestedUsers = yield prisma.user.findMany({
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
        const suggestedUsersWithFollowStatus = suggestedUsers.map(user => (Object.assign(Object.assign({}, user), { isFollowing: followingIds.includes(user.id) })));
        return res.status(200).json({
            success: true,
            users: suggestedUsersWithFollowStatus
        });
    }
    catch (error) {
        console.error("Error while fetching suggestions:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching suggestions",
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
        });
    }
}));
exports.userRouter.get("/bulk-followers", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "unauthorized",
            });
        }
        const following = yield prisma.followers.findMany({
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
        });
        const followers = yield prisma.following.findMany({
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
        });
        return res.status(200).json({
            success: true,
            followers,
            following
        });
    }
    catch (error) {
        console.error("Error while fetching followers:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching followers",
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
        });
    }
}));
exports.userRouter.get("/profile/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        const user = yield prisma.user.findUnique({
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
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            user
        });
    }
    catch (error) {
        console.error("Error while fetching profile:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching profile",
            error: error instanceof Error ? error.message : 'An unexpected error occurred',
        });
    }
}));
exports.userRouter.post("/change-password", middleware_1.default, multerUpload_1.upload.single("avatar"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, currentPassword } = req.body;
    const userId = req.userId;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                id: userId
            }, select: {
                password: true
            }
        });
        if (!user) {
            res.status(402).json({
                message: "User Not Found"
            });
            return;
        }
        const dcryptCurrentPassword = yield bcrypt_1.default.compare(currentPassword, user === null || user === void 0 ? void 0 : user.password);
        if (!dcryptCurrentPassword) {
            res.status(402).json({
                message: "Password didn't match"
            });
            return;
        }
        const newPassword = yield bcrypt_1.default.hash(password, 10);
        const updatePassword = yield prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: newPassword
            }
        });
        return res.status(200).json({
            success: false,
            message: "Password Updated Successfully",
        });
    }
    catch (error) {
        console.error("Error while updating user:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating user details",
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
    }
}));
