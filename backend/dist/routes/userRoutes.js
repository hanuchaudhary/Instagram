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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Validations_1 = require("../validations/Validations");
require("dotenv/config");
const sendEmail_1 = require("../libs/sendEmail");
exports.userRouter = express_1.default.Router();
const prisma = new client_1.PrismaClient();
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, username, password } = req.body;
    const validation = Validations_1.signupSchema.safeParse({ fullName, email, username, password });
    if (!validation.success) {
        return res.status(402).json({
            success: false,
            message: validation.error.errors
        });
    }
    try {
        const userExist = yield prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }]
            }
        });
        if (userExist) {
            return res.status(409).json({
                success: false,
                message: "User already Exists with this Email or Username"
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const user = yield prisma.user.create({
            data: {
                username,
                email,
                fullName,
                avatar: "",
                bio: "",
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: (Date.now() + 3600000).toString(),
                accountType: "public"
            }
        });
        yield (0, sendEmail_1.sendEmail)(user.email, verifyCode);
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            username: user.username
        });
    }
    catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({
            success: false,
            message: "Error while registering user",
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
    }
}));
exports.userRouter.post("/verify", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { verifyCode, username } = yield req.body;
    const validation = Validations_1.verifyCodeSchema.safeParse({ verifyCode });
    if (!validation.success) {
        return res.status(402).json({
            success: false,
            error: validation.error.errors[0].message
        });
    }
    try {
        const user = yield prisma.user.findUnique({
            where: {
                username
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (verifyCode != user.verifyCode) {
            return res.status(400).json({
                success: false,
                message: "Wrong Verification Code",
            });
        }
        yield prisma.user.update({
            where: {
                id: user.id
            },
            data: {
                isVerified: true,
                verifyCode: "",
                verifyCodeExpiry: ""
            }
        });
        return res.status(201).json({
            success: true,
            message: " User verified Successfully"
        });
    }
    catch (error) {
        console.error("Error verifying user:", error);
        return res.status(500).json({
            success: false,
            message: "Error while verifying user",
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
    }
}));
exports.userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password } = req.body;
    const validation = Validations_1.signinSchema.safeParse({ email, username, password });
    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.errors[0].message
        });
    }
    try {
        const user = yield prisma.user.findFirst({
            where: {
                OR: [{ email }, { username }],
                isVerified: true
            }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist with this email or username"
            });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password"
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            fullName: user.fullName
        });
    }
    catch (error) {
        console.error("Error logging in user:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while logging in",
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        });
    }
}));
