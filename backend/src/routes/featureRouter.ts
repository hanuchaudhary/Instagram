import { PrismaClient } from '@prisma/client';
import { Request, Response, Router } from 'express'
import authMiddleware from '../middleware';

export const featureRouter = Router();
featureRouter.use(authMiddleware)
const prisma = new PrismaClient();

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
            return res.status(404).json({
                success: false,
                message: "unAuthorized"
            });
        }

        const otherUser = await prisma.user.findUnique({
            where: {
                id: toUserId
            }, select: {
                username: true
            }
        })

        if (!otherUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const followOtherUser = await prisma.following.create({
            data: {
                userId,
                followId: toUserId
            }
        })

        const putFollower = await prisma.followers.create({
            data: {
                userId: toUserId,
                followId: userId
            }
        })

        return res.status(200).json({
            success: true,
            message: `${otherUser.username} followed successfully`
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
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
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
            return res.status(404).json({
                success: false,
                message: "Followed user not found"
            });
        }

        const unfollowOtherUser = await prisma.following.delete({
            where: {
                userId_followId: {
                    userId: userId,
                    followId: toUserId
                }
            }
        })

        const deleteFollower = await prisma.followers.delete({
            where: {
                userId_followId: {
                    userId: toUserId,
                    followId: userId
                }
            }
        })

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

featureRouter.post("/like-dislike/:postId", async (req: Request, res: Response): Promise<any> => {
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
