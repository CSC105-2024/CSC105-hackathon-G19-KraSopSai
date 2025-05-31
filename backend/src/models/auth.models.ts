import { db } from "../index.js";
import * as bcrypt from "bcrypt";
import type { UserData, LoginData, AuthResponse } from "../types/type.js";

const validateInput = (userData: UserData) => {
    if (!userData.username || !userData.email || !userData.password) {
        return "Username, email, and password are required";
    }
    if (userData.username.trim().length < 3) {
        return "Username must be at least 3 characters long";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        return "Please provide a valid email address";
    }
    if (userData.password.length < 6) {
        return "Password must be at least 6 characters long";
    }
    return null;
};

const handlePrismaError = (error: any): string => {
    if (error?.code === 'P2002') {
        if (error.meta?.target?.includes('email')) {
            return "User already exists with this email";
        }
        if (error.meta?.target?.includes('username')) {
            return "Username already exists";
        }
    }
    return "Operation failed. Please try again.";
};

export const registerUser = async (userData: UserData): Promise<AuthResponse> => {
    try {
        const validationError = validateInput(userData);
        if (validationError) {
            return { success: false, message: validationError };
        }

        const existingUser = await db.user.findUnique({
            where: { email: userData.email.toLowerCase() }
        });

        if (existingUser) {
            return { success: false, message: "User already exists with this email" };
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const newUser = await db.user.create({
            data: {
                username: userData.username.trim(),
                email: userData.email.toLowerCase(),
                password: hashedPassword
            },
            select: { id: true, username: true, email: true }
        });

        return {
            success: true,
            message: "User registered successfully",
            user: newUser
        };

    } catch (error: any) {
        console.error("Registration error:", error);
        return { success: false, message: handlePrismaError(error) };
    }
};

export const loginUser = async (loginData: LoginData): Promise<AuthResponse> => {
    try {
        if (!loginData.email || !loginData.password) {
            return { success: false, message: "Email and password are required" };
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
            return { success: false, message: "Please provide a valid email address" };
        }

        const user = await db.user.findUnique({
            where: { email: loginData.email.toLowerCase() }
        });

        if (!user || !await bcrypt.compare(loginData.password, user.password)) {
            return { success: false, message: "Invalid email or password" };
        }

        return {
            success: true,
            message: "Login successful",
            user: { id: user.id, username: user.username, email: user.email }
        };

    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "Login failed. Please try again." };
    }
};

export const getUserById = async (userId: number) => {
    try {
        if (!userId || isNaN(userId)) return null;

        return await db.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                email: true,
                hateList: {
                    select: {
                        id: true,
                        name: true,
                        hp: true,
                        hitEffects: { select: { id: true, title: true } }
                    }
                }
            }
        });
    } catch (error) {
        console.error("Get user error:", error);
        return null;
    }
};

export const getAllUsers = async () => {
    try {
        const users = await db.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                hateList: { select: { id: true, name: true, hp: true } }
            },
            orderBy: { id: 'desc' }
        });

        return {
            success: true,
            message: "Users retrieved successfully",
            users,
            count: users.length
        };
    } catch (error) {
        console.error("Get all users error:", error);
        return {
            success: false,
            message: "Failed to retrieve users",
            users: [],
            count: 0
        };
    }
};

export const updateUsername = async (userId: number, newUsername: string): Promise<AuthResponse> => {
    try {
        if (!newUsername?.trim()) {
            return { success: false, message: "Username cannot be empty" };
        }

        if (newUsername.trim().length < 3) {
            return { success: false, message: "Username must be at least 3 characters long" };
        }

        if (!userId || isNaN(userId)) {
            return { success: false, message: "Invalid user ID" };
        }

        const updatedUser = await db.user.update({
            where: { id: userId },
            data: { username: newUsername.trim() },
            select: { id: true, username: true, email: true }
        });

        return {
            success: true,
            message: "Username updated successfully",
            user: updatedUser
        };

    } catch (error: any) {
        console.error("Update username error:", error);
        return { success: false, message: handlePrismaError(error) };
    }
};

export const createUser = async (userData: UserData): Promise<AuthResponse> => {
    try {
        const validationError = validateInput(userData);
        if (validationError) {
            return { success: false, message: validationError };
        }

        const existingUser = await db.user.findUnique({
            where: { email: userData.email.toLowerCase() }
        });

        if (existingUser) {
            return { success: false, message: "User already exists with this email" };
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12);
        const newUser = await db.user.create({
            data: {
                username: userData.username.trim(),
                email: userData.email.toLowerCase(),
                password: hashedPassword
            },
            select: { id: true, username: true, email: true }
        });

        return {
            success: true,
            message: "User created successfully",
            user: newUser
        };

    } catch (error: any) {
        console.error("Create user error:", error);
        return { success: false, message: handlePrismaError(error) };
    }
};