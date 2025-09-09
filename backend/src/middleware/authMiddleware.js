import jwt from "jsonwebtoken";
import userModel from "../models/auth.model.js";
import "dotenv/config";

export async function authMiddleware(req, res, next) {
    try {
        // Get token from cookie
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userModel.findById(decoded.id).select(" -__v");

        if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

        // Attach user data to request
        req.user = user;

        next();
    } catch (err) {
        console.error("Auth error:", err.message);
        return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
}
