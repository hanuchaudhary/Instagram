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
exports.postRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const middleware_1 = __importDefault(require("../middleware"));
const multerUpload_1 = require("../libs/multerUpload");
const uploadCloudinary_1 = require("../libs/uploadCloudinary");
exports.postRouter = (0, express_1.Router)();
exports.postRouter.use(middleware_1.default);
const prisma = new client_1.PrismaClient();
exports.postRouter.post("/create", multerUpload_1.upload.single("media"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { caption, location } = req.body;
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID not found in request",
        });
    }
    try {
        const user = yield prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file provided" });
        }
        // Check if a media file was uploaded
        let mediaURL = "";
        if (req.file) {
            // Upload the file to Cloudinary
            const cloudinaryResult = yield (0, uploadCloudinary_1.uploadOnCloudinary)(req.file.path);
            //@ts-ignore
            mediaURL = cloudinaryResult === null || cloudinaryResult === void 0 ? void 0 : cloudinaryResult.url; // Save the secure URL from Cloudinary
        }
        const post = yield prisma.post.create({
            data: {
                caption,
                mediaURL,
                location,
                userId,
            },
        });
        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post,
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
        const post = yield prisma.post.delete({
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
exports.postRouter.post("/like", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.body;
    const userId = req.userId;
    if (!postId) {
        return res.status(400).json({
            success: false,
            message: "Post ID is required"
        });
    }
    try {
        const post = yield prisma.post.findUnique({
            where: {
                id: postId
            }
        });
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post Not found"
            });
        }
        const user = yield prisma.user.findUnique({
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
        const alreadyLikedPost = yield prisma.like.findFirst({
            where: {
                postId,
                userId
            }
        });
        if (alreadyLikedPost) {
            yield prisma.like.delete({
                where: {
                    id: alreadyLikedPost.id
                }
            });
            return res.status(200).json({
                success: true,
                message: "Post Unliked"
            });
        }
        const likedPost = yield prisma.like.create({
            data: {
                postId,
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
            message: `Post Liked: ${likedPost.post.caption}`
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
exports.postRouter.post("/comment", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment, postId } = req.body;
    //todo: comment validation
    if (!postId) {
        return res.status(400).json({
            success: false,
            message: "Post ID is required"
        });
    }
    const userId = req.userId;
    try {
        const post = yield prisma.post.findUnique({
            where: {
                id: postId
            }
        });
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }
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
        const addComment = yield prisma.comment.create({
            data: {
                comment: comment.trim(),
                userId,
                postId
            },
            select: {
                comment: true,
                post: {
                    select: {
                        caption: true
                    }
                }
            }
        });
        return res.status(201).json({
            success: true,
            message: `Comment "${addComment.comment}" added to post "${addComment.post.caption}"`
        });
    }
    catch (error) {
        console.error("Error while adding comment:", error);
        return res.status(500).json({
            success: false,
            message: "Error while adding comment",
            error: error instanceof Error ? error.message : "An unexpected error occurred"
        });
    }
}));
exports.postRouter.get("/bulk", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const user = yield prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const followingIds = yield prisma.user.findUnique({
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
        const posts = yield prisma.post.findMany({
            where: {
                userId: { in: releventUserIds },
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                User: true,
                likes: true,
                comments: {
                    include: {
                        user: {
                            select: {
                                username: true,
                                avatar: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true,
                    }
                }
            },
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
        const posts = yield prisma.post.findMany({
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
                _count: {
                    select: {
                        likes: true
                    }
                }
            }
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
        const userId = req.userId;
        const { postId } = req.params;
        const user = yield prisma.user.findUnique({
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
        yield prisma.post.delete({
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
