"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        res.status(401).json({
            success: false,
            message: "Unauthorized: No token provided",
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid token payload",
            });
        }
        req.userId = decoded.id;
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: "Unauthorized: Token verification failed",
            error
        });
    }
};
exports.default = authMiddleware;
