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
exports.followRouter = void 0;
const client_1 = require("@prisma/client");
const express_1 = require("express");
const middleware_1 = __importDefault(require("../middleware"));
exports.followRouter = (0, express_1.Router)();
exports.followRouter.use(middleware_1.default);
const prisma = new client_1.PrismaClient();
exports.followRouter.post("/follow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { toUserId } = req.body;
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
        console.error("Error creating post:", error);
        return res.status(500).json({
            success: false,
            message: "Error while creating post",
            error: error instanceof Error ? error.message : "An unexpected error occurred",
        });
    }
}));
exports.followRouter.post("/unfollow", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { toUserId } = req.body;
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
