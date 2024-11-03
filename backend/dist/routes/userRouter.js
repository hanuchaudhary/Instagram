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
const Validations_1 = require("../validations/Validations");
require("dotenv/config");
const sendEmail_1 = require("../libs/sendEmail");
const multerUpload_1 = require("../libs/multerUpload");
const uploadCloudinary_1 = require("../libs/uploadCloudinary");
const middleware_1 = __importDefault(require("../middleware"));
const zod_1 = require("zod");
exports.userRouter = express_1.default.Router();
const prisma = new client_1.PrismaClient();
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, username, password } = req.body;
    const validation = Validations_1.signupSchema.safeParse({ fullName, email, username, password });
    if (!validation.success) {
        return res.status(402).json({
            success: false,
            message: validation.error.errors
        });
    }
    try {
        const userExist = yield prisma.user.findFirst({
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
                accountType: "public"
            }
        });
        yield (0, sendEmail_1.sendEmail)(user.email, verifyCode);
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
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
    const { verifyCode, username } = yield req.body;
    const validation = Validations_1.verifyCodeSchema.safeParse({ verifyCode });
    if (!validation.success) {
        return res.status(402).json({
            success: false,
            error: validation.error.errors
        });
    }
    try {
        const user = yield prisma.user.findUnique({
            where: {
                username
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (verifyCode != user.verifyCode) {
            return res.status(400).json({
                success: false,
                message: "Wrong Verification Code",
            });
        }
        yield prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                isVerified: true,
                verifyCode: "",
                verifyCodeExpiry: ""
            }
        });
        return res.status(201).json({
            success: true,
            message: " User verified Successfully"
        });
    }
    catch (error) {
        console.error("Error verifying user:", error);
        return res.status(500).json({
            success: false,
            message: "Error while verifying user",
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
    }
}));
exports.userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { credential, password } = req.body;
    const validation = Validations_1.signinSchema.safeParse({ credential, password });
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.errors[0].message
        });
    }
    try {
        const user = yield prisma.user.findFirst({
            where: {
                OR: [{ email: credential }, { username: credential }],
            }
        });
        if ((user === null || user === void 0 ? void 0 : user.isVerified) === false) {
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
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET);
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            fullName: user.fullName
        });
    }
    catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while logging in",
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
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
                following: true,
                followers: true,
                posts: true
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
        const result = yield (0, uploadCloudinary_1.uploadOnCloudinary)((_a = req.file) === null || _a === void 0 ? void 0 : _a.path);
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
