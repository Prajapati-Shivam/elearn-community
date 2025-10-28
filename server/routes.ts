import type { Express } from 'express';
import { createServer, type Server } from 'http';
import cors from 'cors';
import { connectDB } from './db/connection';
import { register, login } from './controllers/authController';
import {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
} from './controllers/postController';
import {
  createTeachRequest,
  getRequestsForPost,
  getMyRequests,
  updateRequestStatus,
} from './controllers/requestController';
import { authMiddleware } from './middleware/auth';

export async function registerRoutes(app: Express): Promise<Server> {
  // Enable CORS
  app.use(cors());

  // Connect to MongoDB
  await connectDB();

  // Auth routes
  app.post('/api/auth/register', register);
  app.post('/api/auth/login', login);

  // Post routes (protected)
  app.get('/api/posts', authMiddleware, getAllPosts);
  app.post('/api/posts', authMiddleware, createPost);
  app.put('/api/posts/:id', authMiddleware, updatePost);
  app.delete('/api/posts/:id', authMiddleware, deletePost);

  // Teach request routes
  // Tutor creates a request to teach a post
  app.post('/api/posts/:postId/requests', authMiddleware, createTeachRequest);
  // Student views requests for their post
  app.get('/api/posts/:postId/requests', authMiddleware, getRequestsForPost);
  // Tutor views their outgoing requests
  app.get('/api/requests', authMiddleware, getMyRequests);
  // Student accepts/rejects a request
  app.patch('/api/requests/:id', authMiddleware, updateRequestStatus);

  const httpServer = createServer(app);

  return httpServer;
}
