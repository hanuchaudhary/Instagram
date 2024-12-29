"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter_1 = require("./routes/userRouter");
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const postRouter_1 = require("./routes/postRouter");
const featureRouter_1 = require("./routes/featureRouter");
const adminRouter_1 = __importDefault(require("./routes/adminRouter"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/v1/user", userRouter_1.userRouter);
app.use("/api/v1/post", postRouter_1.postRouter);
app.use("/api/v1/feature", featureRouter_1.featureRouter);
app.use("/api/v1/admin", adminRouter_1.default);
app.listen(process.env.PORT, () => {
    console.log("App is running on Port " + process.env.PORT);
});
