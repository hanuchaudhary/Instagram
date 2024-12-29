import express from 'express';
import prisma from '../db/prisma';
import { adminMiddleware } from '../middleware';
const adminRouter = express.Router();
adminRouter.use(adminMiddleware);
// User Management Routes
adminRouter.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
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
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

adminRouter.put('/users/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { accountType: status },
        });
        res.json(updatedUser);
        return;
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user status' });
    }
});

adminRouter.put('/users/:id/verify', async (req, res) => {
    const { id } = req.params;
    const { isVerified } = req.body;
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: { isVerifiedAccount: isVerified },
        });
        res.json(updatedUser);
        return;
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user verification status' });
    }
});

// Content Moderation Routes
adminRouter.get('/posts', async (req, res) => {
    try {
        const posts = await prisma.post.findMany({
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
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});

adminRouter.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.post.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Post deleted successfully' });
        return;
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
});

adminRouter.get('/reports', async (req, res) => {
    // Assuming you have a Report model, which isn't in the provided schema
    // You might want to add this to your Prisma schema
    try {
        const reports = await prisma.report.findMany({
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
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reports' });
    }
});

adminRouter.put('/reports/:id/resolve', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedReport = await prisma.report.update({
            where: { id: parseInt(id) },
            data: { status: 'RESOLVED' },
        });
        res.json(updatedReport);
    } catch (error) {
        res.status(500).json({ error: 'Failed to resolve report' });
    }
});

// System Logs Routes
adminRouter.get('/logs', async (req, res) => {
    // Assuming you have a Log model, which isn't in the provided schema
    // You might want to add this to your Prisma schema
    try {
        const logs = await prisma.log.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 100, // Limit to last 100 logs
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch system logs' });
    }
});

export default adminRouter;

