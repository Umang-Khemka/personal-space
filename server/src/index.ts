
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes.js";
import entryRoutes from "./routes/entry.routes.js";
import path from 'path';
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Personal Space API is running",
  });
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/entry",entryRoutes);

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);

const clientDistPath = path.resolve(currentDir, "../../client/dist");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDistPath));

  app.get("/{*splat}", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

const startServer = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();