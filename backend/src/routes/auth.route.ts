import { Hono } from "hono";
import {
    register,
    login,
    logout,
    getProfile,
    getAllUsersController,
    getUserByIdController,
    updateUsernameController,
    createUserController
} from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const auth = new Hono();

// Public routes
auth.post("/register", register);
auth.post("/login", login);
auth.post("/create-user", createUserController); // Admin endpoint to create users

// Protected routes
auth.post("/logout", authMiddleware, logout);
auth.get("/profile", authMiddleware, getProfile);
auth.get("/users", authMiddleware, getAllUsersController);
auth.get("/users/:id", authMiddleware, getUserByIdController);
auth.put("/update-username", authMiddleware, updateUsernameController);

export default auth;