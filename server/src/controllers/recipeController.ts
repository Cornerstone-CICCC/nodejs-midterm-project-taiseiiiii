import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import * as recipeModel from "../models/recipeModel";

export const browse = (_req: Request, res: Response): void => {
  res.json(recipeModel.findAll());
};

export const read = (req: Request, res: Response): void => {
  const recipe = recipeModel.findById(req.params.id);
  if (!recipe) {
    res.status(404).json({ error: "Recipe not found" });
    return;
  }
  res.json(recipe);
};

export const search = (req: Request, res: Response): void => {
  const q = (req.query.q as string) || "";
  res.json(recipeModel.search(q));
};

export const add = (req: Request, res: Response): void => {
  const { title, description, ingredients, instructions, cookingTime } =
    req.body;

  if (!title || !description || !ingredients || !instructions) {
    res.status(400).json({ error: "Required fields are missing" });
    return;
  }

  const recipe = recipeModel.create({
    id: uuidv4(),
    title,
    description,
    ingredients,
    instructions,
    cookingTime: cookingTime || 0,
    authorId: req.session!.userId!,
    createdAt: new Date(),
  });

  res.status(201).json(recipe);
};

export const edit = (req: Request, res: Response): void => {
  const recipe = recipeModel.findById(req.params.id);
  if (!recipe) {
    res.status(404).json({ error: "Recipe not found" });
    return;
  }

  if (recipe.authorId !== req.session!.userId) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  const { title, description, ingredients, instructions, cookingTime } =
    req.body;
  const updated = recipeModel.update(req.params.id, {
    title,
    description,
    ingredients,
    instructions,
    cookingTime,
  });

  res.json(updated);
};

export const remove = (req: Request, res: Response): void => {
  const recipe = recipeModel.findById(req.params.id);
  if (!recipe) {
    res.status(404).json({ error: "Recipe not found" });
    return;
  }

  if (recipe.authorId !== req.session!.userId) {
    res.status(403).json({ error: "Not authorized" });
    return;
  }

  recipeModel.deleteById(req.params.id);
  res.json({ message: "Recipe deleted" });
};
