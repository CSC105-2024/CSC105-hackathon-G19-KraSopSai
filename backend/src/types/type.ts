export interface UserData {
    username: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: {
        id: number;
        username: string;
        email: string;
    };
    users?: any[]; // For getAllUsers response
    count?: number; // For getAllUsers response
}

export interface User {
    id: number;
    username: string;
    email: string;
}

export interface JWTPayload {
    userId: number;
    email: string;
    username: string;
    exp: number;
}