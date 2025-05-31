import { Hono } from "hono";
import * as authController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";

const auth = new Hono();

// Public routes
auth.post("/register", authController.register);
auth.post("/login", authController.login);
auth.post("/create-user", authController.createUserController);

// Protected routes
auth.post("/logout", authMiddleware, authController.logout);
auth.get("/profile", authMiddleware, authController.getProfile);
auth.get("/users", authMiddleware, authController.getAllUsersController);
auth.get("/users/:id", authMiddleware, authController.getUserByIdController);
auth.put("/update-username", authMiddleware, authController.updateUsernameController);
auth.get("/test", (c) => c.json({ message: "Auth routes working!" }));

export default auth;