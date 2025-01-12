import express from 'express';
import { userRouter } from './routes/userRouter';
import "dotenv/config";
import cors from "cors";
import { postRouter } from './routes/postRouter';
import { featureRouter } from './routes/featureRouter';
import adminRouter from './routes/adminRouter';
import cron from 'node-cron';
import { prisma } from './database/PrismaClient';

cron.schedule('0 * * * *', async () => {  // Runs every hour
    const twentyFourHourAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    try {
        await prisma.story.deleteMany({
            where: {
                expiresAt: {
                    lte: twentyFourHourAgo // Delete stories whose expiresAt is less than or equal to 24 hours ago
                }
            }
        });
        console.log('Expired stories deleted successfully.');
    } catch (error) {
        console.error('Error deleting expired stories:', error);
    }
});

const app = express();
app.use(cors())
app.use(express.json());


app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter)
app.use("/api/v1/feature", featureRouter)
app.use("/api/v1/admin", adminRouter);


app.listen(process.env.PORT, () => {
    console.log("App is running on Port " + process.env.PORT);
});
