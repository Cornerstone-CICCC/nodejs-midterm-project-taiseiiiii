import { Link } from "react-router-dom";
import type { Recipe } from "../types";

export const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  return (
    <div className="recipe-card">
      <h3>
        <Link to={`/recipes/${recipe.id}`}>{recipe.title}</Link>
      </h3>
      <p className="recipe-description">{recipe.description}</p>
      <div className="recipe-meta">
        <span>{recipe.cookingTime} min</span>
        <span>{recipe.ingredients.length} ingredients</span>
      </div>
    </div>
  );
};
