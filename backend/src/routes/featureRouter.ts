import { Request, Response, Router } from 'express'
import authMiddleware from '../middleware';
import prisma from '../db/prisma';
import { reportSchema } from "@hanuchaudhary/instagram"

export const featureRouter = Router();
featureRouter.use(authMiddleware)


featureRouter.post("/follow/:toUserId", async (req: Request, res: Response): Promise<any> => {
    const userId = (req as any).userId;
    const { toUserId } = req.params;
    try {

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            return res.status(404).json({ success: false, message: "unAuthorized" });
        }

        const otherUser = await prisma.user.findUnique({
            where: {
                id: toUserId
            }, select: {
                username: true
            }
        })

        if (!otherUser) {
            return res.status(404).json({ success: false, message: "Other User Not Found" });
        }

        await prisma.$transaction([
            prisma.following.create({
                data: { userId, followId: toUserId },
            }),
            prisma.followers.create({
                data: { userId: toUserId, followId: userId },
            }),
        ]);


        return res.status(200).json({
            success: true, message: `${otherUser.username} followed successfully`
        });

    } catch (error) {
        console.error("Error following user:", error);
        return res.status(500).json({
            success: false,
            message: "Error while following user",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
})

featureRouter.post("/unfollow/:toUserId", async (req: Request, res: Response): Promise<any> => {
    const userId = (req as any).userId;
    const { toUserId } = req.params;
    try {

        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const otherUser = await prisma.user.findUnique({
            where: {
                id: toUserId
            }, select: {
                id: true,
                username: true
            }
        })

        if (!otherUser) {
            return res.status(404).json({ success: false, message: "Followed user not found" });
        }

        await prisma.$transaction([
            prisma.following.delete({
                where: { userId_followId: { userId, followId: toUserId } },
            }),
            prisma.followers.delete({
                where: { userId_followId: { userId: toUserId, followId: userId } },
            }),
        ]);

        return res.status(200).json({
            success: true,
            message: `${otherUser.username} unfollowed successfully`
        });

    } catch (error) {
        console.error("Error unfollowing user:", error);
        return res.status(500).json({
            success: false,
            message: "Error while unfollowing user",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
})

featureRouter.post("/like-post/:postId", async (req: Request, res: Response): Promise<any> => {
    const userId = (req as any).userId;
    const { postId } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "unAuthorized"
            });
        }

        const post = await prisma.post.findUnique({
            where: {
                id: parseInt(postId)
            }
        })

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const userLikedPosts = await prisma.like.findFirst({
            where: {
                userId,
                postId: parseInt(postId)
            }
        })

        if (userLikedPosts) {
            await prisma.like.delete({
                where: {
                    id: userLikedPosts.id
                }
            })
            return res.status(200).json({
                success: true,
                message: "Post disliked successfully"
            });
        }

        await prisma.like.create({
            data: {
                postId: parseInt(postId),
                isLiked: true,
                userId
            }
        })

        return res.status(200).json({
            success: true,
            message: "Post liked successfully"
        });

    } catch (error) {
        console.error("Error liking post:", error);
        return res.status(500).json({
            success: false,
            message: "Error while liking post",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
})

featureRouter.post("/comment/:postId", async (req: Request, res: Response): Promise<any> => {
    const userId = (req as any).userId;
    const { postId } = req.params;
    const { comment } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "unAuthorized"
            });
        }

        const post = await prisma.post.findUnique({
            where: {
                id: parseInt(postId)
            }
        })

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found"
            });
        }

        const commentPost = await prisma.comment.create({
            data: {
                postId: parseInt(postId),
                userId,
                comment
            }
        })

        return res.status(200).json({
            success: true,
            message: "Commented on post successfully"
        });

    } catch (error) {
        console.error("Error commenting on post:", error);
        return res.status(500).json({
            success: false,
            message: "Error while commenting on post",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
})

featureRouter.get("/comments/:postId", async (req: Request, res: Response): Promise<any> => {
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
            },
            orderBy: {
                createdAt: 'desc'
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

featureRouter.get("/reels", async (req: Request, res: Response) => {
    const { skip = 0, take = 10 } = req.query;
    try {
        const reels = await prisma.post.findMany({
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
            skip: parseInt(skip as string, 10),
            take: parseInt(take as string, 10)
        });

        res.status(200).json({
            success: true,
            reels,
        });
        return;
    } catch (error) {
        console.error("Error fetching reels:", error);
        res.status(500).json({
            success: false,
            message: "Error while fetching reels",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
        return;
    }
});

featureRouter.post("/report", authMiddleware, async (req: Request, res: Response) => {
    const { success, error } = reportSchema.safeParse(req.body)
    const { reportedId, reason, type, targetId } = req.body;

    const reporterId = (req as any).userId;

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
            await prisma.report.create({
                data: {
                    reporterId,
                    reason,
                    type,
                    postId: parseInt(targetId),
                    reportedId,
                },
            });
        } else {
            await prisma.report.create({
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
    } catch (error) {
        console.error("Error reporting:", error);
        res.status(500).json({
            success: false,
            message: "Error while reporting",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
        return;
    }
});
