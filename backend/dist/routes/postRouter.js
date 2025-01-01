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
exports.postRouter = void 0;
const express_1 = require("express");
const multerUpload_1 = require("../libs/multerUpload");
const uploadCloudinary_1 = require("../libs/uploadCloudinary");
const PrismaClient_1 = require("../database/PrismaClient");
const middleware_1 = require("../middleware");
exports.postRouter = (0, express_1.Router)();
exports.postRouter.use(middleware_1.authMiddleware);
exports.postRouter.post("/create", multerUpload_1.upload.single("media"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { caption, location } = req.body;
    const userId = req.user.id;
    const file = req.file;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID not found in request",
        });
    }
    try {
        const user = yield PrismaClient_1.prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (!file) {
            return res.status(400).json({ success: false, message: "No file provided" });
        }
        let mediaURL = "";
        if (file.mimetype.includes("image")) {
            const cloudinaryResult = yield (0, uploadCloudinary_1.uploadOnCloudinary)(file.path, "instagram-clone/post-images", "image");
            mediaURL = cloudinaryResult === null || cloudinaryResult === void 0 ? void 0 : cloudinaryResult.url;
        }
        if (file.mimetype.includes("video")) {
            const cloudinaryResult = yield (0, uploadCloudinary_1.uploadOnCloudinary)(file.path, "instagram-clone/reels", "video");
            mediaURL = cloudinaryResult === null || cloudinaryResult === void 0 ? void 0 : cloudinaryResult.url;
        }
        const mediaType = file.mimetype.includes("image") ? "image" : "video";
        const result = yield PrismaClient_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const newPost = yield tx.post.create({
                data: {
                    caption,
                    location,
                    mediaURL,
                    userId,
                    mediaType
                },
                include: {
                    User: {
                        select: {
                            username: true,
                            fullName: true,
                            id: true,
                            avatar: true,
                            bio: true,
                        }
                    },
                    likes: true,
                },
            });
            const newReel = yield tx.reels.create({
                data: {
                    caption,
                    mediaURL,
                    userId
                },
                include: {
                    User: {
                        select: {
                            username: true,
                            fullName: true,
                            id: true,
                            avatar: true,
                            bio: true,
                        }
                    },
                },
            });
            yield tx.reelPost.create({
                data: {
                    reelId: newReel.id,
                    postId: newPost.id
                },
            });
            return { newPost, newReel };
        }));
        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: result.newPost ? result.newPost : result.newReel,
        });
    }
    catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({
            success: false,
            message: "Error while creating post",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
}));
exports.postRouter.delete("/delete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.body;
    if (!postId) {
        return res.status(400).json({
            success: false,
            message: "Post ID is required"
        });
    }
    try {
        const post = yield PrismaClient_1.prisma.post.delete({
            where: {
                id: postId
            }
        });
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Post deleted Successfully",
        });
    }
    catch (error) {
        console.error("Error while deleting post:", error);
        return res.status(500).json({
            success: false,
            message: "Error while deleting post",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
}));
exports.postRouter.post("/like/:postId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    const userId = req.user.id;
    if (!postId) {
        return res.status(400).json({
            success: false,
            message: "Post ID is required"
        });
    }
    try {
        const post = yield PrismaClient_1.prisma.post.findUnique({
            where: {
                id: parseInt(postId)
            }
        });
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post Not found"
            });
        }
        const user = yield PrismaClient_1.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not found"
            });
        }
        const alreadyLikedPost = yield PrismaClient_1.prisma.like.findFirst({
            where: {
                postId: parseInt(postId),
                userId
            }
        });
        if (alreadyLikedPost) {
            yield PrismaClient_1.prisma.like.delete({
                where: {
                    id: alreadyLikedPost.id
                }
            });
            return res.status(200).json({
                success: true,
                message: "Post DisLiked",
                isLiked: false
            });
        }
        const likedPost = yield PrismaClient_1.prisma.like.create({
            data: {
                postId: parseInt(postId),
                userId
            },
            select: {
                post: {
                    select: {
                        caption: true
                    }
                }
            }
        });
        return res.status(201).json({
            success: true,
            message: `Post Liked: ${likedPost.post.caption}`,
            isLiked: true
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
exports.postRouter.get("/postLikes/:postId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    try {
        const likesCount = yield PrismaClient_1.prisma.like.count({
            where: {
                postId: parseInt(postId)
            }
        });
        const isLiked = yield PrismaClient_1.prisma.like.findFirst({
            where: {
                postId: parseInt(postId),
                userId: req.userId
            }
        });
        return res.status(200).json({
            success: true,
            message: "Likes fetched successfully",
            likesCount,
            isLiked
        });
    }
    catch (error) {
        console.error("Error getting likes:", error);
        return res.status(500).json({
            success: false,
            message: "Error while getting likes",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
}));
exports.postRouter.get("/bulk", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    try {
        const user = yield PrismaClient_1.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const followingIds = yield PrismaClient_1.prisma.user.findUnique({
            where: { id: userId },
            select: {
                following: {
                    select: {
                        followId: true,
                        userId: true
                    },
                },
            },
        });
        const followedUserIds = (followingIds === null || followingIds === void 0 ? void 0 : followingIds.following.map(follow => follow.followId)) || [];
        const releventUserIds = [...followedUserIds, userId];
        const posts = yield PrismaClient_1.prisma.post.findMany({
            where: {
                userId: { in: releventUserIds },
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                User: {
                    select: {
                        username: true,
                        fullName: true,
                        id: true,
                        avatar: true,
                        bio: true,
                    }
                },
                likes: true,
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    }
                }
            },
            skip: (page - 1) * limit,
            take: limit,
        });
        return res.status(200).json({
            success: true,
            message: "Posts from followed users",
            posts,
        });
    }
    catch (error) {
        console.error("Error while fetching posts:", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching posts",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
}));
exports.postRouter.get("/explore", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = req.query.filter;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const posts = yield PrismaClient_1.prisma.post.findMany({
            where: {
                caption: {
                    contains: filter,
                    mode: "insensitive"
                }
            },
            orderBy: {
                likes: {
                    _count: "desc"
                },
            }, select: {
                id: true,
                mediaURL: true,
                mediaType: true,
                _count: {
                    select: {
                        likes: true
                    }
                }
            },
            skip: (page - 1) * limit,
            take: limit
        });
        return res.status(200).json({
            success: true,
            message: "Explore posts",
            posts,
        });
    }
    catch (error) {
        console.error("Error while fetching explore posts:", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching explore posts",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
}));
exports.postRouter.delete("/delete/:postId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { postId } = req.params;
        const user = yield PrismaClient_1.prisma.user.findUnique({
            where: {
                id: userId
            }
        });
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "unAuthorized"
            });
        }
        yield PrismaClient_1.prisma.post.delete({
            where: {
                id: Number(postId)
            }
        });
        return res.status(200).json({
            success: true,
            message: "Post Deleted",
        });
    }
    catch (error) {
        console.error("Error while deleting post:", error);
        return res.status(500).json({
            success: false,
            message: "Error while deleting post",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
}));
