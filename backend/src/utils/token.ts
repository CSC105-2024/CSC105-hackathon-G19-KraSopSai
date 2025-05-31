import type { Context } from 'hono';
import jwt from 'jsonwebtoken';

export const sendSecureCookie = async (c: Context) => {
    const key = 'firstSecureCookie';
    const value = 'This is the data inside the cookie but more secure this time.';

    // Use consistent environment variable name
    const secret = process.env.JWT_SECRET as string;

    if (!secret) {
        console.error('Missing JWT_SECRET in environment variables');
        return c.text('Server configuration error', 500);
    }

    try {
        const token = jwt.sign({ value }, secret, { expiresIn: '7d' });

        // Use more secure cookie options
        const cookieOptions = [
            `${key}=${token}`,
            'Path=/',
            'HttpOnly',
            'SameSite=Lax',
            ...(process.env.NODE_ENV === 'production' ? ['Secure'] : [])
        ].join('; ');

        c.header('Set-Cookie', cookieOptions);
        return c.text('Secure Cookie set');
    } catch (error) {
        console.error('JWT signing error:', error);
        return c.text('An error occurred, Secure Cookie not set', 500);
    }
};