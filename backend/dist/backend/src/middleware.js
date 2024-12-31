"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const headerPayload = req.headers.authorization;
    if (!headerPayload || !headerPayload.startsWith("Bearer ")) {
        res.status(401).json({
            success: false,
            message: "Invalid token format",
        });
        return;
    }
    const token = headerPayload.split(" ")[1];
    if (!token) {
        res.status(401).json({
            success: false,
            message: "Unauthorized: No token provided",
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    }
    catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({
            success: false,
            message: "Unauthorized: Token verification failed",
            error: error instanceof Error ? error.message : "Unknown error",
        });
        return;
    }
};
exports.authMiddleware = authMiddleware;
const adminMiddleware = (req, res, next) => {
    const headerPayload = req.headers.authorization;
    if (!headerPayload || !headerPayload.startsWith("Bearer ")) {
        res.status(401).json({
            success: false,
            message: "Invalid token format",
        });
        return;
    }
    const token = headerPayload.split(" ")[1];
    if (!token) {
        res.status(401).json({
            success: false,
            message: "Unauthorized: No token provided",
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user.role = decoded.role;
        if (req.user.role !== "admin") {
            res.status(403).json({
                success: false,
                message: "Forbidden: You do not have admin privileges",
            });
            return;
        }
        next();
    }
    catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({
            success: false,
            message: "Unauthorized: Token verification failed",
            error: error instanceof Error ? error.message : "Unknown error",
        });
        return;
    }
};
exports.adminMiddleware = adminMiddleware;
