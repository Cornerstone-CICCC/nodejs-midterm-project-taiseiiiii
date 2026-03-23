import express from "express";
import cookieSession from "cookie-session";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import recipeRoutes from "./routes/recipeRoutes";
import { requireAuth } from "./middleware/authMiddleware";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: ["recipe-app-secret-key"],
    maxAge: 24 * 60 * 60 * 1000,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/recipes", requireAuth, recipeRoutes);

export default app;
