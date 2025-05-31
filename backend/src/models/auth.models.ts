import { db } from "../index.js";
import * as bcrypt from "bcrypt";
import type { UserData, LoginData, AuthResponse } from "../types/type.js";

export const registerUser = async (userData: UserData): Promise<AuthResponse> => {
    try {
        // Validate input
        if (!userData.username || !userData.email || !userData.password) {
            return {
                success: false,
                message: "Username, email, and password are required"
            };
        }

        // Validate username length
        if (userData.username.trim().length < 3) {
            return {
                success: false,
                message: "Username must be at least 3 characters long"
            };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            return {
                success: false,
                message: "Please provide a valid email address"
            };
        }

        // Check if user already exists by email
        const existingUserByEmail = await db.user.findUnique({
            where: { email: userData.email.toLowerCase() }
        });

        if (existingUserByEmail) {
            return {
                success: false,
                message: "User already exists with this email"
            };
        }

        // Validate password strength
        if (userData.password.length < 6) {
            return {
                success: false,
                message: "Password must be at least 6 characters long"
            };
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

        // Create user
        const newUser = await db.user.create({
            data: {
                username: userData.username.trim(),
                email: userData.email.toLowerCase(),
                password: hashedPassword
            },
            select: {
                id: true,
                username: true,
                email: true
            }
        });

        return {
            success: true,
            message: "User registered successfully",
            user: newUser
        };

    } catch (error: any) {
        console.error("Registration error:", error);

        // Handle Prisma unique constraint errors
        if (error?.code === 'P2002') {
            if (error.meta?.target?.includes('email')) {
                return {
                    success: false,
                    message: "User already exists with this email"
                };
            }
            if (error.meta?.target?.includes('username')) {
                return {
                    success: false,
                    message: "Username already exists"
                };
            }
        }

        return {
            success: false,
            message: "Registration failed. Please try again."
        };
    }
};

export const loginUser = async (loginData: LoginData): Promise<AuthResponse> => {
    try {
        // Validate input
        if (!loginData.email || !loginData.password) {
            return {
                success: false,
                message: "Email and password are required"
            };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(loginData.email)) {
            return {
                success: false,
                message: "Please provide a valid email address"
            };
        }

        // Find user by email (case insensitive)
        const user = await db.user.findUnique({
            where: { email: loginData.email.toLowerCase() }
        });

        if (!user) {
            return {
                success: false,
                message: "Invalid email or password"
            };
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(loginData.password, user.password);

        if (!isPasswordValid) {
            return {
                success: false,
                message: "Invalid email or password"
            };
        }

        return {
            success: true,
            message: "Login successful",
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        };

    } catch (error) {
        console.error("Login error:", error);
        return {
            success: false,
            message: "Login failed. Please try again."
        };
    }
};

export const getUserById = async (userId: number) => {
    try {
        if (!userId || isNaN(userId)) {
            return null;
        }

        const user = await db.user.findUnique({
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
                        hitEffects: {
                            select: {
                                id: true,
                                title: true
                            }
                        }
                    }
                }
            }
        });

        return user;
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
                hateList: {
                    select: {
                        id: true,
                        name: true,
                        hp: true
                    }
                }
            },
            orderBy: {
                id: 'desc'
            }
        });

        return {
            success: true,
            message: "Users retrieved successfully",
            users: users,
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
        // Validate input
        if (!newUsername || newUsername.trim().length === 0) {
            return {
                success: false,
                message: "Username cannot be empty"
            };
        }

        if (newUsername.trim().length < 3) {
            return {
                success: false,
                message: "Username must be at least 3 characters long"
            };
        }

        if (!userId || isNaN(userId)) {
            return {
                success: false,
                message: "Invalid user ID"
            };
        }

        // Check if user exists
        const existingUser = await db.user.findUnique({
            where: { id: userId }
        });

        if (!existingUser) {
            return {
                success: false,
                message: "User not found"
            };
        }

        // Update username
        const updatedUser = await db.user.update({
            where: { id: userId },
            data: { username: newUsername.trim() },
            select: {
                id: true,
                username: true,
                email: true
            }
        });

        return {
            success: true,
            message: "Username updated successfully",
            user: updatedUser
        };

    } catch (error: any) {
        console.error("Update username error:", error);

        // Handle Prisma unique constraint errors
        if (error?.code === 'P2002') {
            return {
                success: false,
                message: "Username already exists"
            };
        }

        return {
            success: false,
            message: "Failed to update username"
        };
    }
};

export const createUser = async (userData: UserData): Promise<AuthResponse> => {
    try {
        // Validate input
        if (!userData.username || !userData.email || !userData.password) {
            return {
                success: false,
                message: "Username, email, and password are required"
            };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            return {
                success: false,
                message: "Please provide a valid email address"
            };
        }

        // Validate username length
        if (userData.username.trim().length < 3) {
            return {
                success: false,
                message: "Username must be at least 3 characters long"
            };
        }

        // Check if user already exists by email
        const existingUserByEmail = await db.user.findUnique({
            where: { email: userData.email.toLowerCase() }
        });

        if (existingUserByEmail) {
            return {
                success: false,
                message: "User already exists with this email"
            };
        }

        // Validate password strength
        if (userData.password.length < 6) {
            return {
                success: false,
                message: "Password must be at least 6 characters long"
            };
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

        // Create user
        const newUser = await db.user.create({
            data: {
                username: userData.username.trim(),
                email: userData.email.toLowerCase(),
                password: hashedPassword
            },
            select: {
                id: true,
                username: true,
                email: true
            }
        });

        return {
            success: true,
            message: "User created successfully",
            user: newUser
        };

    } catch (error: any) {
        console.error("Create user error:", error);

        // Handle Prisma unique constraint errors
        if (error?.code === 'P2002') {
            if (error.meta?.target?.includes('email')) {
                return {
                    success: false,
                    message: "User already exists with this email"
                };
            }
            if (error.meta?.target?.includes('username')) {
                return {
                    success: false,
                    message: "Username already exists"
                };
            }
        }

        return {
            success: false,
            message: "Failed to create user"
        };
    }
};