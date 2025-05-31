import type { Context } from "hono";
import { registerUser, loginUser, getUserById, getAllUsers, updateUsername, createUser } from "../models/auth.models.js";
import { setAuthCookie, clearAuthCookie } from "../middlewares/auth.middlewares.js";

export const register = async (c: Context) => {
    try {
        const body = await c.req.json();
        const { username, email, password } = body;

        // Validate required fields
        if (!username || !email || !password) {
            return c.json({
                success: false,
                message: "Username, email, and password are required"
            }, 400);
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return c.json({
                success: false,
                message: "Please provide a valid email address"
            }, 400);
        }

        const result = await registerUser({ username, email, password });

        if (!result.success) {
            return c.json(result, 400);
        }

        // Set auth cookie
        await setAuthCookie(c, {
            userId: result.user!.id,
            email: result.user!.email,
            username: result.user!.username
        });

        return c.json(result, 201);

    } catch (error) {
        console.error("Register controller error:", error);
        return c.json({
            success: false,
            message: "Registration failed. Please try again."
        }, 500);
    }
};

export const login = async (c: Context) => {
    try {
        const body = await c.req.json();
        const { email, password } = body;

        // Validate required fields
        if (!email || !password) {
            return c.json({
                success: false,
                message: "Email and password are required"
            }, 400);
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return c.json({
                success: false,
                message: "Please provide a valid email address"
            }, 400);
        }

        const result = await loginUser({ email, password });

        if (!result.success) {
            return c.json(result, 401);
        }

        // Set auth cookie
        await setAuthCookie(c, {
            userId: result.user!.id,
            email: result.user!.email,
            username: result.user!.username
        });

        return c.json(result, 200);

    } catch (error) {
        console.error("Login controller error:", error);
        return c.json({
            success: false,
            message: "Login failed. Please try again."
        }, 500);
    }
};

export const logout = async (c: Context) => {
    try {
        clearAuthCookie(c);
        return c.json({
            success: true,
            message: "Logged out successfully"
        }, 200);

    } catch (error) {
        console.error("Logout controller error:", error);
        return c.json({
            success: false,
            message: "Logout failed"
        }, 500);
    }
};

export const getProfile = async (c: Context) => {
    try {
        // User info is available from auth middleware
        const user = c.get('user');

        if (!user) {
            return c.json({
                success: false,
                message: "User not found"
            }, 404);
        }

        return c.json({
            success: true,
            message: "Profile retrieved successfully",
            user: user
        }, 200);

    } catch (error) {
        console.error("Get profile controller error:", error);
        return c.json({
            success: false,
            message: "Failed to get profile"
        }, 500);
    }
};

export const getAllUsersController = async (c: Context) => {
    try {
        const result = await getAllUsers();

        if (!result.success) {
            return c.json(result, 500);
        }

        return c.json(result, 200);

    } catch (error) {
        console.error("Get all users controller error:", error);
        return c.json({
            success: false,
            message: "Failed to get users"
        }, 500);
    }
};

export const getUserByIdController = async (c: Context) => {
    try {
        const idParam = c.req.param('id');

        if (!idParam) {
            return c.json({
                success: false,
                message: "User ID is required"
            }, 400);
        }

        const userId = parseInt(idParam);

        if (isNaN(userId)) {
            return c.json({
                success: false,
                message: "Invalid user ID"
            }, 400);
        }

        const user = await getUserById(userId);

        if (!user) {
            return c.json({
                success: false,
                message: "User not found"
            }, 404);
        }

        return c.json({
            success: true,
            message: "User retrieved successfully",
            user: user
        }, 200);

    } catch (error) {
        console.error("Get user by ID controller error:", error);
        return c.json({
            success: false,
            message: "Failed to get user"
        }, 500);
    }
};

export const updateUsernameController = async (c: Context) => {
    try {
        const user = c.get('user');
        const body = await c.req.json();
        const { username } = body;

        if (!user) {
            return c.json({
                success: false,
                message: "Authentication required"
            }, 401);
        }

        if (!username) {
            return c.json({
                success: false,
                message: "Username is required"
            }, 400);
        }

        const result = await updateUsername(user.id, username);

        if (!result.success) {
            return c.json(result, 400);
        }

        return c.json(result, 200);

    } catch (error) {
        console.error("Update username controller error:", error);
        return c.json({
            success: false,
            message: "Failed to update username"
        }, 500);
    }
};

export const createUserController = async (c: Context) => {
    try {
        const body = await c.req.json();
        const { username, email, password } = body;

        // Validate required fields
        if (!username || !email || !password) {
            return c.json({
                success: false,
                message: "Username, email, and password are required"
            }, 400);
        }

        const result = await createUser({ username, email, password });

        if (!result.success) {
            return c.json(result, 400);
        }

        return c.json(result, 201);

    } catch (error) {
        console.error("Create user controller error:", error);
        return c.json({
            success: false,
            message: "User creation failed. Please try again."
        }, 500);
    }
};