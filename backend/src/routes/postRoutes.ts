import { PrismaClient } from "@prisma/client";
import { Router, Request, Response, json } from "express";
import authMiddleware from "../middleware";

export const postRoutes = Router();
postRoutes.use(authMiddleware);
const prisma = new PrismaClient();

postRoutes.post("/create", async (req: Request, res: Response): Promise<any> => {
    const { caption, location } = req.body;
    const userId = (req as any).userId;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID not found in request",
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not found",
            });
        }

        // TODO: Add validation for caption and location
        // TODO: Add support for media upload
        const post = await prisma.post.create({
            data: {
                caption,
                mediaURL: "",
                location,
                userId,
            },
        });

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post,
        });
    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({
            success: false,
            message: "Error while creating post",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
});


postRoutes.delete("/delete", async (req: Request, res: Response): Promise<any> => {
    const { postId } = req.body;

    if (!postId) {
        return res.status(400).json({
            success: false,
            message: "Post ID is required"
        });
    }

    try {
        const post = await prisma.post.delete({
            where: {
                id: postId
            }
        })

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

    } catch (error) {
        console.error("Error while deleting post:", error);
        return res.status(500).json({
            success: false,
            message: "Error while deleting post",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
})

postRoutes.post("/like", async (req: Request, res: Response): Promise<any> => {
    const { postId } = req.body;
    const userId = (req as any).userId;

    if (!postId) {
        return res.status(400).json({
            success: false,
            message: "Post ID is required"
        });
    }

    try {
        const post = await prisma.post.findUnique({
            where: {
                id: postId
            }
        })

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post Not found"
            })
        }

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not found"
            })
        }

        const alreadyLikedPost = await prisma.like.findFirst({
            where: {
                postId,
                userId
            }
        })

        if (alreadyLikedPost) {
            await prisma.like.delete({
                where: {
                    id: alreadyLikedPost.id
                }
            })
            return res.status(200).json({
                success: true,
                message: "Post Unliked"
            })
        }

        const likedPost = await prisma.like.create({
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
        })

        return res.status(201).json({
            success: true,
            message: `Post Liked: ${likedPost.post.caption}`
        })

    } catch (error) {
        console.error("Error liking post:", error);
        return res.status(500).json({
            success: false,
            message: "Error while liking post",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
})

postRoutes.post("/comment", async (req: Request, res: Response): Promise<any> => {
    const { comment, postId } = req.body;
    //todo: comment validation

    if (!postId) {
        return res.status(400).json({
            success: false,
            message: "Post ID is required"
        });
    }

    const userId = (req as any).userId;

    try {
        const post = await prisma.post.findUnique({
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

        const user = await prisma.user.findUnique({
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

        const addComment = await prisma.comment.create({
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

    } catch (error) {
        console.error("Error while adding comment:", error);
        return res.status(500).json({
            success: false,
            message: "Error while adding comment",
            error: error instanceof Error ? error.message : "An unexpected error occurred"
        });
    }
});