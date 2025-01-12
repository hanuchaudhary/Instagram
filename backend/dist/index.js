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
const userRouter_1 = require("./routes/userRouter");
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const postRouter_1 = require("./routes/postRouter");
const featureRouter_1 = require("./routes/featureRouter");
const adminRouter_1 = __importDefault(require("./routes/adminRouter"));
const node_cron_1 = __importDefault(require("node-cron"));
const PrismaClient_1 = require("./database/PrismaClient");
node_cron_1.default.schedule('0 * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    const twentyFourHourAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    try {
        yield PrismaClient_1.prisma.story.deleteMany({
            where: {
                expiresAt: {
                    lte: twentyFourHourAgo // Delete stories whose expiresAt is less than or equal to 24 hours ago
                }
            }
        });
        console.log('Expired stories deleted successfully.');
    }
    catch (error) {
        console.error('Error deleting expired stories:', error);
    }
}));
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
