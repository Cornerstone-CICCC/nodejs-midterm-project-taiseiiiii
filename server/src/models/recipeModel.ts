import { Recipe } from "../types";

const recipes: Recipe[] = [];

export const findAll = (): Recipe[] => recipes;

export const findById = (id: string): Recipe | undefined =>
  recipes.find((r) => r.id === id);

export const search = (query: string): Recipe[] => {
  const q = query.toLowerCase();
  return recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
  );
};

export const create = (recipe: Recipe): Recipe => {
  recipes.push(recipe);
  return recipe;
};

export const update = (id: string, data: Partial<Recipe>): Recipe | null => {
  const recipe = recipes.find((r) => r.id === id);
  if (!recipe) return null;
  Object.assign(recipe, data);
  return recipe;
};

export const deleteById = (id: string): boolean => {
  const index = recipes.findIndex((r) => r.id === id);
  if (index === -1) return false;
  recipes.splice(index, 1);
  return true;
};
