import type { Context, Next } from "hono";
import { sign, verify } from "hono/jwt";
import { getCookie, setCookie } from "hono/cookie";
import { db } from "../index.js";

// Environment variable with fallback (like your friend's code)
export const JWT_SECRET = process.env.JWT_SECRET || "jwt-secret-key";

export const COOKIE_NAME = "auth_token";

const cookieOptions = {
    httpOnly: false, // Changed from true to false - this is crucial!
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 7 days
};

// Simplified payload interface to match your friend's approach
interface AuthPayload {
    id: number; // Changed from userId to id
    email: string;
    username: string;
}

export const setAuthCookie = async (c: Context, payload: AuthPayload) => {
    const token = await sign({
        ...payload,
        exp: Math.floor(Date.now() / 1000) + cookieOptions.maxAge
    }, JWT_SECRET);

    setCookie(c, COOKIE_NAME, token, cookieOptions);
    return token;
};

export const clearAuthCookie = (c: Context) => {
    setCookie(c, COOKIE_NAME, "", { ...cookieOptions, maxAge: 0 });
};

export const authMiddleware = async (c: Context, next: Next) => {
    try {
        // Simplified approach - only check cookie (like your friend's code)
        const token = getCookie(c, COOKIE_NAME);

        if (!token) {
            return c.json({
                error: "Authentication required" // Changed to match friend's response format
            }, 401);
        }

        try {
            // Verify the token
            const payload = await verify(token, JWT_SECRET);

            // Simplified validation (like your friend's code)
            if (!payload || !payload?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            // Check if user exists in database using id instead of userId
            const user = await db.user.findUnique({
                where: { id: payload.id as number },
                select: {
                    id: true,
                    username: true,
                    email: true
                }
            });

            if (!user) {
                return c.json({ error: "User not found" }, 401);
            }

            // Set user in context
            c.set('user', user);
            await next();

        } catch (verifyError) {
            console.error("Token verification error:", verifyError);
            return c.json({ error: "Unauthorized" }, 401);
        }
    } catch (error) {
        console.error("Auth middleware error:", error);
        return c.json({ error: "Unauthorized" }, 401);
    }
};