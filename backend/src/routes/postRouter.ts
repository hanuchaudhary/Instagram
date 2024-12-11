import { PrismaClient } from "@prisma/client";
import { Router, Request, Response } from "express";
import authMiddleware from "../middleware";
import { upload } from "../libs/multerUpload";
import { uploadOnCloudinary } from "../libs/uploadCloudinary";

export const postRouter = Router();
postRouter.use(authMiddleware);
const prisma = new PrismaClient();


postRouter.post("/create", upload.single("media"), async (req: Request, res: Response): Promise<any> => {
    const { caption, location } = req.body;
    const userId = (req as any).userId;

    const file = req.file as Express.Multer.File;

    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID not found in request",
        });
    }

    try {
        const user = await prisma.user.findUnique({
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
            const cloudinaryResult = await uploadOnCloudinary(file.path,"instagram-clone/post-images","image");
            mediaURL = cloudinaryResult?.url as string;
        }

        if (file.mimetype.includes("video")) {
            const cloudinaryResult = await uploadOnCloudinary(file.path,"instagram-clone/reels","video");
            mediaURL = cloudinaryResult?.url as string
        }

        const result = await prisma.$transaction(async (tx) => {
            const newPost = await tx.post.create({
                data: {
                    caption,
                    location,
                    mediaURL,
                    userId,
                },
            });
            const newReel = await tx.reels.create({
                data: {
                    mediaURL,
                    userId,
                    caption
                },
            });

            return { newPost, newReel };
        });

        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: result.newPost,
            reel: result.newReel
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

postRouter.delete("/delete", async (req: Request, res: Response): Promise<any> => {
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

postRouter.post("/like", async (req: Request, res: Response): Promise<any> => {
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

postRouter.get("/postComments/:postId", async (req: Request, res: Response): Promise<any> => {
    const { postId } = req.params;

    if (!postId) {
        return res.status(400).json({
            success: false,
            message: "Post ID is required"
        });
    }

    try {
        const comments = await prisma.comment.findMany({
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
            }
        })

        return res.status(200).json({
            success: true,
            message: "Bulk comments fetched",
            comments
        })

    } catch (error) {
        console.error("Error while fetching bulk comments:", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching bulk comments",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
})

postRouter.get("/postLikes/:postId", async (req: Request, res: Response): Promise<any> => {
    const { postId } = req.params;
    try {

        const likesCount = await prisma.like.count({
            where: {
                postId: parseInt(postId)
            }
        })

        const isLiked = await prisma.like.findFirst({
            where: {
                postId: parseInt(postId),
                userId: (req as any).userId
            }
        })

        return res.status(200).json({
            success: true,
            message: "Likes fetched successfully",
            likesCount,
            isLiked
        });

    } catch (error) {
        console.error("Error getting likes:", error);
        return res.status(500).json({
            success: false,
            message: "Error while getting likes",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
})


postRouter.get("/bulk", async (req: Request, res: Response): Promise<any> => {
    const userId = (req as any).userId;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const followingIds = await prisma.user.findUnique({
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

        const followedUserIds = followingIds?.following.map(follow => follow.followId) || [];
        const releventUserIds = [...followedUserIds, userId]

        const posts = await prisma.post.findMany({
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

    } catch (error) {
        console.error("Error while fetching posts:", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching posts",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
});

postRouter.get("/explore", async (req: Request, res: Response): Promise<any> => {
    try {
        const filter = req.query.filter as string;

        const posts = await prisma.post.findMany({
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

    } catch (error) {
        console.error("Error while fetching explore posts:", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching explore posts",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
})

postRouter.delete("/delete/:postId", async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req as any).userId;
        const { postId } = req.params;

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            return res.status(403).json({
                success: false,
                message: "unAuthorized"
            })
        }

        await prisma.post.delete({
            where: {
                id: Number(postId)
            }
        });

        return res.status(200).json({
            success: true,
            message: "Post Deleted",
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
