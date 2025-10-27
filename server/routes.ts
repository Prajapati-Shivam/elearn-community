import type { Express } from "express";
import { createServer, type Server } from "http";
import cors from "cors";
import { connectDB } from "./db/connection";
import { register, login } from "./controllers/authController";
import { getAllPosts, createPost, updatePost, deletePost } from "./controllers/postController";
import { authMiddleware } from "./middleware/auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Enable CORS
  app.use(cors());

  // Connect to MongoDB
  await connectDB();

  // Auth routes
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);

  // Post routes (protected)
  app.get("/api/posts", authMiddleware, getAllPosts);
  app.post("/api/posts", authMiddleware, createPost);
  app.put("/api/posts/:id", authMiddleware, updatePost);
  app.delete("/api/posts/:id", authMiddleware, deletePost);

  const httpServer = createServer(app);

  return httpServer;
}
