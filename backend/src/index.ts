import express from 'express';
import { userRouter } from './routes/userRouter';
import "dotenv/config";
import cors from "cors";
import { postRouter } from './routes/postRouter';
import { followRouter } from './routes/followRouter';
const app = express();
app.use(cors())
app.use(express.json());
app.use("/user", userRouter);
app.use("/post",postRouter)
app.use("/follow",followRouter)

app.listen(process.env.PORT, () => {
    console.log("App is running on Port " + process.env.PORT);
});
