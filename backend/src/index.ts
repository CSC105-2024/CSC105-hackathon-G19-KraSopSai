import { serve } from '@hono/node-server'
import { PrismaClient } from './generated/prisma/index.js'
import { Hono } from 'hono'

const app = new Hono()
export const db = new PrismaClient();

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

db.$connect()
	.then(() => {
		console.log("Connected to the database");
	})
	.catch((error) => {
		console.error("Error connecting to the database:", error);
	});

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
