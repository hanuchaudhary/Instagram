import express from 'express';
import { userRouter } from './routes/userRouter';
import "dotenv/config";
import cors from "cors";
import { postRouter } from './routes/postRouter';
import { featureRouter } from './routes/featureRouter';
import adminRouter from './routes/adminRouter';


const app = express();
app.use(cors())
app.use(express.json());


app.use("/api/v1/user", userRouter);
app.use("/api/v1/post",postRouter)
app.use("/api/v1/feature",featureRouter)
app.use("/api/v1/admin", adminRouter);


app.listen(process.env.PORT, () => {
    console.log("App is running on Port " + process.env.PORT);
});
