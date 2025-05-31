import type { Context } from "hono";
import * as AuthModel from "../models/auth.models.js";
import { setAuthCookie, clearAuthCookie } from "../middlewares/auth.middlewares.js";

const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const handleError = (c: Context, error: any, message: string, status = 500) => {
    console.error(`${message}:`, error);
    return c.json({ success: false, message: "Error occured" }, 500);
};

export const register = async (c: Context) => {
    try {
        const { username, email, password } = await c.req.json();

        if (!username || !email || !password) {
            return c.json({ success: false, message: "Username, email, and password are required" }, 400);
        }

        if (!validateEmail(email)) {
            return c.json({ success: false, message: "Please provide a valid email address" }, 400);
        }

        const result = await AuthModel.registerUser({ username, email, password });
        if (!result.success) return c.json(result, 400);

        await setAuthCookie(c, { id: result.user!.id, email: result.user!.email, username: result.user!.username });
        return c.json(result, 201);

    } catch (error) {
        return handleError(c, error, "Registration failed. Please try again.");
    }
};

export const login = async (c: Context) => {
    try {
        const { email, password } = await c.req.json();

        if (!email || !password) {
            return c.json({ success: false, message: "Email and password are required" }, 400);
        }

        if (!validateEmail(email)) {
            return c.json({ success: false, message: "Please provide a valid email address" }, 400);
        }

        const result = await AuthModel.loginUser({ email, password });
        if (!result.success) return c.json(result, 401);

        await setAuthCookie(c, { id: result.user!.id, email: result.user!.email, username: result.user!.username });
        return c.json(result, 200);

    } catch (error) {
        return handleError(c, error, "Login failed. Please try again.");
    }
};

export const logout = async (c: Context) => {
    try {
        clearAuthCookie(c);
        return c.json({ success: true, message: "Logged out successfully" }, 200);
    } catch (error) {
        return handleError(c, error, "Logout failed");
    }
};

export const getProfile = async (c: Context) => {
    try {
        const user = c.get('user');
        if (!user) {
            return c.json({ success: false, message: "User not found" }, 404);
        }
        return c.json({ success: true, message: "Profile retrieved successfully", user }, 200);
    } catch (error) {
        return handleError(c, error, "Failed to get profile");
    }
};

export const getAllUsersController = async (c: Context) => {
    try {
        const result = await AuthModel.getAllUsers();
        return c.json(result, result.success ? 200 : 500);
    } catch (error) {
        return handleError(c, error, "Failed to get users");
    }
};

export const getUserByIdController = async (c: Context) => {
    try {
        const idParam = c.req.param('id');
        if (!idParam) {
            return c.json({ success: false, message: "User ID is required" }, 400);
        }

        const userId = parseInt(idParam);
        if (isNaN(userId)) {
            return c.json({ success: false, message: "Invalid user ID" }, 400);
        }

        const user = await AuthModel.getUserById(userId);
        if (!user) {
            return c.json({ success: false, message: "User not found" }, 404);
        }

        return c.json({ success: true, message: "User retrieved successfully", user }, 200);
    } catch (error) {
        return handleError(c, error, "Failed to get user");
    }
};

export const updateUsernameController = async (c: Context) => {
    try {
        const user = c.get('user');
        const { username } = await c.req.json();

        if (!user) {
            return c.json({ success: false, message: "Authentication required" }, 401);
        }

        if (!username) {
            return c.json({ success: false, message: "Username is required" }, 400);
        }

        const result = await AuthModel.updateUsername(user.id, username);
        return c.json(result, result.success ? 200 : 400);
    } catch (error) {
        return handleError(c, error, "Failed to update username");
    }
};

export const createUserController = async (c: Context) => {
    try {
        const { username, email, password } = await c.req.json();

        if (!username || !email || !password) {
            return c.json({ success: false, message: "Username, email, and password are required" }, 400);
        }

        const result = await AuthModel.createUser({ username, email, password });
        return c.json(result, result.success ? 201 : 400);
    } catch (error) {
        return handleError(c, error, "User creation failed. Please try again.");
    }
};