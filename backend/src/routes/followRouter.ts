import { PrismaClient } from '@prisma/client';
import { Request, Response, Router } from 'express'
import authMiddleware from '../middleware';

export const followRouter = Router();
followRouter.use(authMiddleware)
const prisma = new PrismaClient();

followRouter.post("/follow", async (req: Request, res: Response): Promise<any> => {
    const userId = (req as any).userId;
    const { toUserId } = req.body;
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
            where : {
                id : toUserId
            },select : {
                username : true
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
                followId : toUserId
            }
        })

        const putFollower = await prisma.followers.create({
            data: {
                userId : toUserId,
                followId: userId
            }
        })

        return res.status(200).json({
            success: true,
            message: `${otherUser.username} followed successfully`
        }); 

    } catch (error) {
        console.error("Error creating post:", error);
        return res.status(500).json({
            success: false,
            message: "Error while creating post",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
})

followRouter.post("/unfollow", async (req: Request, res: Response): Promise<any> => {
    const userId = (req as any).userId;
    const { toUserId } = req.body 
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
            where : {
                id : toUserId
            },select : {
                id : true,
                username : true
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
