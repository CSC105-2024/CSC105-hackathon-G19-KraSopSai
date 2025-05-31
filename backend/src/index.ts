import { serve } from '@hono/node-server';
import { PrismaClient } from './generated/prisma/index.js';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { mainRouter } from './routes/index.route.js';
import { mainRouter } from './routes/index.route.ts';

const app = new Hono();
export const db = new PrismaClient();

// CORS middleware
app.use('/*', cors({
	origin: ['http://localhost:3000', 'http://localhost:5173'], // Add your frontend URLs
	allowHeaders: ['Content-Type', 'Authorization'],
	allowMethods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
	credentials: true,
}));

// Routes
app.get('/', (c) => {
	return c.text('Hello Hono! Auth API is running.');
});

// Connect main router directly to root (removed '/api' prefix)
app.route('/', mainRouter);

app.route("", mainRouter);

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error);
	process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	process.exit(1);
});

// Database connection
db.$connect()
	.then(() => {
		console.log("Connected to the database");
	})
	.catch((error) => {
		console.error("Error connecting to the database:", error);
		process.exit(1);
	});

// Graceful shutdown
const gracefulShutdown = async () => {
	console.log('Shutting down gracefully...');
	try {
		await db.$disconnect();
		console.log('Database disconnected');
		process.exit(0);
	} catch (error) {
		console.error('Error during shutdown:', error);
		process.exit(1);
	}
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

serve({
	fetch: app.fetch,
	port: port
}, (info) => {
	console.log(`Server is running on http://localhost:${info.port}`);
});