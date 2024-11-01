import express from 'express';
import { userRoutes } from './routes/userRoutes';
import "dotenv/config";
import cors from "cors";
import { postRoutes } from './routes/postRoutes';
import { followRoutes } from './routes/followRoutes';
const app = express();
app.use(cors())
app.use(express.json());
app.use("/user", userRoutes);
app.use("/post",postRoutes)
app.use("/follow",followRoutes)

app.listen(process.env.PORT, () => {
    console.log("App is running on Port " + process.env.PORT);
});
