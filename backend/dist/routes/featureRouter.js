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
Object.defineProperty(exports, "__esModule", { value: true });
exports.featureRouter = void 0;
const express_1 = require("express");
const instagram_1 = require("@hanuchaudhary/instagram");
const PrismaClient_1 = require("../database/PrismaClient");
const middleware_1 = require("../middleware");
exports.featureRouter = (0, express_1.Router)();
exports.featureRouter.use(middleware_1.authMiddleware);
exports.featureRouter.post("/follow/:toUserId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { toUserId } = req.params;
    try {
        const user = yield PrismaClient_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({ success: false, message: "Unauthorized" });
        }
        const otherUser = yield PrismaClient_1.prisma.user.findUnique({
            where: { id: toUserId },
            select: { username: true },
        });
        if (!otherUser) {
            return res.status(404).json({ success: false, message: "Other User Not Found" });
        }
        const existingFollow = yield PrismaClient_1.prisma.following.findUnique({
            where: { userId_followId: { userId, followId: toUserId } },
        });
        if (existingFollow) {
            return res.status(400).json({
                success: false,
                message: `You are already following ${otherUser.username}`,
            });
        }
        yield PrismaClient_1.prisma.$transaction([
            PrismaClient_1.prisma.following.create({
                data: { userId, followId: toUserId },
            }),
            PrismaClient_1.prisma.followers.create({
                data: { userId: toUserId, followId: userId },
            }),
        ]);
        return res.status(200).json({
            success: true,
            message: `${otherUser.username} followed successfully`,
        });
    }
    catch (error) {
        console.error("Error following user:", error);
        return res.status(500).json({
            success: false,
            message: "Error while following user",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
}));
exports.featureRouter.post("/unfollow/:toUserId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { toUserId } = req.params;
    try {
        const user = yield PrismaClient_1.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const otherUser = yield PrismaClient_1.prisma.user.findUnique({
            where: {
                id: toUserId
            }, select: {
                id: true,
                username: true
            }
        });
        if (!otherUser) {
            return res.status(404).json({ success: false, message: "Followed user not found" });
        }
        yield PrismaClient_1.prisma.$transaction([
            PrismaClient_1.prisma.following.delete({
                where: { userId_followId: { userId, followId: toUserId } },
            }),
            PrismaClient_1.prisma.followers.delete({
                where: { userId_followId: { userId: toUserId, followId: userId } },
            }),
        ]);
        return res.status(200).json({
            success: true,
            message: `${otherUser.username} unfollowed successfully`
        });
    }
    catch (error) {
        console.error("Error unfollowing user:", error);
        return res.status(500).json({
            success: false,
            message: "Error while unfollowing user",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
}));
exports.featureRouter.post("/like-post/:postId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { postId } = req.params;
    try {
        const user = yield PrismaClient_1.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "unAuthorized"
            });
        }
        const post = yield PrismaClient_1.prisma.post.findUnique({
            where: {
                id: parseInt(postId)
            }
        });
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        const userLikedPosts = yield PrismaClient_1.prisma.like.findFirst({
            where: {
                userId,
                postId: parseInt(postId)
            }
        });
        if (userLikedPosts) {
            yield PrismaClient_1.prisma.like.delete({
                where: {
                    id: userLikedPosts.id
                }
            });
            return res.status(200).json({
                success: true,
                message: "Post disliked successfully"
            });
        }
        yield PrismaClient_1.prisma.like.create({
            data: {
                postId: parseInt(postId),
                isLiked: true,
                userId
            }
        });
        return res.status(200).json({
            success: true,
            message: "Post liked successfully"
        });
    }
    catch (error) {
        console.error("Error liking post:", error);
        return res.status(500).json({
            success: false,
            message: "Error while liking post",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
}));
exports.featureRouter.post("/comment/:postId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { postId } = req.params;
    const { comment } = req.body;
    try {
        const user = yield PrismaClient_1.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "unAuthorized"
            });
        }
        const post = yield PrismaClient_1.prisma.post.findUnique({
            where: {
                id: parseInt(postId)
            }
        });
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
        const commentPost = yield PrismaClient_1.prisma.comment.create({
            data: {
                postId: parseInt(postId),
                userId,
                comment
            }
        });
        return res.status(200).json({
            success: true,
            message: "Commented on post successfully"
        });
    }
    catch (error) {
        console.error("Error commenting on post:", error);
        return res.status(500).json({
            success: false,
            message: "Error while commenting on post",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
}));
exports.featureRouter.get("/comments/:postId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    if (!postId) {
        return res.status(400).json({
            success: false,
            message: "Post ID is required"
        });
    }
    try {
        const comments = yield PrismaClient_1.prisma.comment.findMany({
            where: {
                postId: Number(postId)
            },
            include: {
                user: {
                    select: {
                        username: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return res.status(200).json({
            success: true,
            message: "Bulk comments fetched",
            comments
        });
    }
    catch (error) {
        console.error("Error while fetching bulk comments:", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching bulk comments",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
}));
exports.featureRouter.get("/reels", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    try {
        const reels = yield PrismaClient_1.prisma.post.findMany({
            where: {
                mediaType: 'video',
            },
            include: {
                User: {
                    select: {
                        username: true,
                        avatar: true,
                        id: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
            skip: (page - 1) * limit,
        });
        res.status(200).json({
            success: true,
            reels,
        });
        return;
    }
    catch (error) {
        console.error("Error fetching reels:", error);
        res.status(500).json({
            success: false,
            message: "Error while fetching reels",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
        return;
    }
}));
exports.featureRouter.get("/chat-users", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    try {
        const chatUsers = yield PrismaClient_1.prisma.user.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { followers: { some: { userId } } },
                            { following: { some: { followId: userId } } },
                        ]
                    },
                    { id: { not: userId } }
                ]
            }
        });
        res.status(200).json({
            success: true,
            chatUsers
        });
        return;
    }
    catch (error) {
        console.error("Error fetching chat users:", error);
        res.status(500).json({
            success: false,
            message: "Error while fetching chat users",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
        return;
    }
}));
exports.featureRouter.get("/messages/:toUserId", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { toUserId } = req.params;
    try {
        const messages = yield PrismaClient_1.prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId, receiverId: toUserId },
                    { senderId: toUserId, receiverId: userId }
                ],
            },
            orderBy: {
                createdAt: 'asc'
            }
        });
        res.status(200).json({
            success: true,
            messages
        });
        return;
    }
    catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({
            success: false,
            message: "Error while fetching messages",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
        return;
    }
}));
exports.featureRouter.post("/report", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, error } = instagram_1.reportSchema.safeParse(req.body);
    const { reportedId, reason, type, targetId } = req.body;
    const reporterId = req.userId;
    if (!success) {
        res.status(400).json({
            success: false,
            message: "Invalid request body",
            error
        });
        return;
    }
    //ReporterId is the user who is reporting the post
    //ReportedId is the user who is being reported
    //TargetId is the post or user or comment being reported
    //Type is the type of report (post, user, comment)
    if (!type || !reportedId || !reason || !targetId) {
        res.status(400).json({
            success: false,
            message: "Missing required fields",
        });
        return;
    }
    try {
        if (type === "POST") {
            yield PrismaClient_1.prisma.report.create({
                data: {
                    reporterId,
                    reason,
                    type,
                    postId: parseInt(targetId),
                    reportedId,
                },
            });
        }
        else {
            yield PrismaClient_1.prisma.report.create({
                data: {
                    reporterId,
                    reason,
                    type,
                    reportedId,
                },
            });
        }
        res.status(200).json({
            success: true,
        });
        return;
    }
    catch (error) {
        console.error("Error reporting:", error);
        res.status(500).json({
            success: false,
            message: "Error while reporting",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
        return;
    }
}));
