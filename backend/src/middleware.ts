import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({
            success: false,
            message: "Unauthorized: Token verification failed",
            error: error instanceof Error ? error.message : "Unknown error",
        });
        return;
    }
};

const adminMiddleware = (req: Request, res: Response, next: NextFunction): void => {
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
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        req.user.role = decoded.role;

        if (req.user.role !== "admin") {
            res.status(403).json({
                success: false,
                message: "Forbidden: You do not have admin privileges",
            });
            return;
        }

        next();
    } catch (error) {
        console.error("Token verification failed:", error);
        res.status(401).json({
            success: false,
            message: "Unauthorized: Token verification failed",
            error: error instanceof Error ? error.message : "Unknown error",
        });
        return;
    }
};

export { authMiddleware, adminMiddleware };
