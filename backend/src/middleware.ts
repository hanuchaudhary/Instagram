import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface CustomRequest extends Request {
    userId?: string;
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization;

    if (!token) {
        res.status(401).json({
            success: false,
            message: "Unauthorized: No token provided",
        });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
        if (!decoded) {
            res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid token payload",
            });
        }
        req.userId = decoded.id
        
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Unauthorized: Token verification failed",
            error
        });
    }
};

export default authMiddleware;
