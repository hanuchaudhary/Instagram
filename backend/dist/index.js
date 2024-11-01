"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = require("./routes/userRoutes");
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const postRoutes_1 = require("./routes/postRoutes");
const followRoutes_1 = require("./routes/followRoutes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/user", userRoutes_1.userRoutes);
app.use("/post", postRoutes_1.postRoutes);
app.use("/follow", followRoutes_1.followRoutes);
app.listen(process.env.PORT, () => {
    console.log("App is running on Port " + process.env.PORT);
});
