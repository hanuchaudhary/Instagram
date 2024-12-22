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
exports.featureRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const middleware_1 = __importDefault(require("../middleware"));
exports.featureRouter = (0, express_1.Router)();
exports.featureRouter.use(middleware_1.default);
const prisma = new client_1.PrismaClient();
exports.featureRouter.post("/follow/:toUserId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { toUserId } = req.params;
    try {
        const user = yield prisma.user.findUnique({
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
        const otherUser = yield prisma.user.findUnique({
            where: {
                id: toUserId
            }, select: {
                username: true
            }
        });
        if (!otherUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const followOtherUser = yield prisma.following.create({
            data: {
                userId,
                followId: toUserId
            }
        });
        const putFollower = yield prisma.followers.create({
            data: {
                userId: toUserId,
                followId: userId
            }
        });
        return res.status(200).json({
            success: true,
            message: `${otherUser.username} followed successfully`
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
    const userId = req.userId;
    const { toUserId } = req.params;
    try {
        const user = yield prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const otherUser = yield prisma.user.findUnique({
            where: {
                id: toUserId
            }, select: {
                id: true,
                username: true
            }
        });
        if (!otherUser) {
            return res.status(404).json({
                success: false,
                message: "Followed user not found"
            });
        }
        const unfollowOtherUser = yield prisma.following.delete({
            where: {
                userId_followId: {
                    userId: userId,
                    followId: toUserId
                }
            }
        });
        const deleteFollower = yield prisma.followers.delete({
            where: {
                userId_followId: {
                    userId: toUserId,
                    followId: userId
                }
            }
        });
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
    const userId = req.userId;
    const { postId } = req.params;
    try {
        const user = yield prisma.user.findUnique({
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
        const post = yield prisma.post.findUnique({
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
        const userLikedPosts = yield prisma.like.findFirst({
            where: {
                userId,
                postId: parseInt(postId)
            }
        });
        if (userLikedPosts) {
            yield prisma.like.delete({
                where: {
                    id: userLikedPosts.id
                }
            });
            return res.status(200).json({
                success: true,
                message: "Post disliked successfully"
            });
        }
        yield prisma.like.create({
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
    const userId = req.userId;
    const { postId } = req.params;
    const { comment } = req.body;
    try {
        const user = yield prisma.user.findUnique({
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
        const post = yield prisma.post.findUnique({
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
        const commentPost = yield prisma.comment.create({
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
exports.featureRouter.get("/reels", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reels = yield prisma.reels.findMany({
            include: {
                User: {
                    select: {
                        username: true,
                        avatar: true
                    }
                }
            }, orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json({
            success: true,
            reels
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
