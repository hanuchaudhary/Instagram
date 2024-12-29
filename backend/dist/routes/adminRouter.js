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
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("../db/prisma"));
const adminRouter = express_1.default.Router();
// User Management Routes
adminRouter.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_1.default.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                fullName: true,
                accountType: true,
                isVerifiedAccount: true,
                createdAt: true,
            },
        });
        res.json(users);
        return;
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}));
adminRouter.put('/users/:id/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedUser = yield prisma_1.default.user.update({
            where: { id },
            data: { accountType: status },
        });
        res.json(updatedUser);
        return;
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update user status' });
    }
}));
adminRouter.put('/users/:id/verify', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { isVerified } = req.body;
    try {
        const updatedUser = yield prisma_1.default.user.update({
            where: { id },
            data: { isVerifiedAccount: isVerified },
        });
        res.json(updatedUser);
        return;
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update user verification status' });
    }
}));
// Content Moderation Routes
adminRouter.get('/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield prisma_1.default.post.findMany({
            include: {
                User: {
                    select: {
                        username: true,
                    },
                },
            },
        });
        res.json(posts);
        return;
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
}));
adminRouter.delete('/posts/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma_1.default.post.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Post deleted successfully' });
        return;
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
}));
adminRouter.get('/reports', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Assuming you have a Report model, which isn't in the provided schema
    // You might want to add this to your Prisma schema
    try {
        const reports = yield prisma_1.default.report.findMany({
            include: {
                reporter: {
                    select: {
                        username: true,
                    },
                },
                reportedUser: {
                    select: {
                        username: true,
                    },
                },
                post: true,
            },
        });
        res.json(reports);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
}));
adminRouter.put('/reports/:id/resolve', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const updatedReport = yield prisma_1.default.report.update({
            where: { id: parseInt(id) },
            data: { status: 'RESOLVED' },
        });
        res.json(updatedReport);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to resolve report' });
    }
}));
// System Logs Routes
adminRouter.get('/logs', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Assuming you have a Log model, which isn't in the provided schema
    // You might want to add this to your Prisma schema
    try {
        const logs = yield prisma_1.default.log.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 100, // Limit to last 100 logs
        });
        res.json(logs);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch system logs' });
    }
}));
exports.default = adminRouter;
