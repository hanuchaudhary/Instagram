import express from 'express';
import { userRouter } from './routes/userRoutes';
import "dotenv/config";
import cors from "cors";
const app = express();
app.use(cors())
app.use(express.json());
app.use("/user", userRouter);

app.listen(process.env.PORT, () => {
    console.log("App is running on Port " + process.env.PORT);
});
