import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import zxcvbn from "zxcvbn";
import * as userModel from "../models/userModel";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }

  if (userModel.findByEmail(email)) {
    res.status(400).json({ error: "Email already exists" });
    return;
  }

  const strength = zxcvbn(password);
  if (strength.score < 2) {
    res.status(400).json({
      error: "Password is too weak",
      feedback: strength.feedback,
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = userModel.create({
    id: uuidv4(),
    username,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  });

  req.session!.userId = user.id;

  res.status(201).json({
    id: user.id,
    username: user.username,
    email: user.email,
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const user = userModel.findByEmail(email);
  if (!user) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  req.session!.userId = user.id;

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
  });
};

export const logout = (_req: Request, res: Response): void => {
  _req.session = null;
  res.json({ message: "Logged out" });
};

export const me = (req: Request, res: Response): void => {
  if (!req.session?.userId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const user = userModel.findById(req.session.userId);
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return;
  }

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
  });
};
