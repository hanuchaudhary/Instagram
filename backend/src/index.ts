import express from 'express';
import { userRouter } from './routes/userRouter';
import "dotenv/config";
import cors from "cors";
import { postRouter } from './routes/postRouter';
import { featureRouter } from './routes/featureRouter';
const app = express();
app.use(cors())
app.use(express.json());
app.use("/user", userRouter);
app.use("/post",postRouter)
app.use("/feature",featureRouter)


app.listen(process.env.PORT, () => {
    console.log("App is running on Port " + process.env.PORT);
});
