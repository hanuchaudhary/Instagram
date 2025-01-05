import { Router, Request, Response } from "express";
import { upload } from "../libs/multerUpload";
import { uploadOnCloudinary } from "../libs/uploadCloudinary";
import { prisma } from '../database/PrismaClient';
import { authMiddleware } from "../middleware";


export const postRouter = Router();
postRouter.use(authMiddleware);

postRouter.post("/create", upload.single("media"), async (req: Request, res: Response): Promise<any> => {
    const { caption, location } = req.body;
    const userId = req.user.id;

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
            const cloudinaryResult = await uploadOnCloudinary(file.path, "instagram-clone/post-images", "image");
            mediaURL = cloudinaryResult?.url as string;
        }

        if (file.mimetype.includes("video")) {
            const cloudinaryResult = await uploadOnCloudinary(file.path, "instagram-clone/reels", "video");
            mediaURL = cloudinaryResult?.url as string
        }

        const mediaType = file.mimetype.includes("image") ? "image" : "video";
        const result = await prisma.$transaction(async (tx) => {
            const newPost = await tx.post.create({
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

            const newReel = await tx.reel.create({
                data: {
                    caption,
                    mediaURL,
                    userId,
                    postId: newPost.id,
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


            return { newPost, newReel };
        });


        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            post: result.newPost ? result.newPost : result.newReel,
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

postRouter.post("/like/:postId", async (req: Request, res: Response): Promise<any> => {
    const { postId } = req.params;
    const userId = req.user.id;

    if (!postId) {
        return res.status(400).json({
            success: false,
            message: "Post ID is required"
        });
    }

    try {
        const post = await prisma.post.findUnique({
            where: {
                id: parseInt(postId)
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
                postId: parseInt(postId),
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
                message: "Post DisLiked",
                isLiked: false
            })
        }

        const likedPost = await prisma.like.create({
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
        })

        return res.status(201).json({
            success: true,
            message: `Post Liked: ${likedPost.post.caption}`,
            isLiked: true
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
    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;

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
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

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
        const userId = req.user.id;
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
