import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import type { Recipe } from "../types";
import { useAuth } from "../context/AuthContext";

export const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get<Recipe>(`/recipes/${id}`)
      .then(setRecipe)
      .catch(() => navigate("/"));
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;
    await api.delete(`/recipes/${id}`);
    navigate("/");
  };

  if (!recipe) return <div className="loading">Loading...</div>;

  const isAuthor = user?.id === recipe.authorId;

  return (
    <div className="recipe-detail">
      <div className="recipe-detail-header">
        <h1>{recipe.title}</h1>
        {isAuthor && (
          <div className="recipe-actions">
            <Link to={`/recipes/${id}/edit`} className="btn btn-secondary">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete
            </button>
          </div>
        )}
      </div>

      <p className="recipe-description">{recipe.description}</p>

      <div className="recipe-info">
        <span>Cooking Time: {recipe.cookingTime} min</span>
      </div>

      <div className="recipe-section">
        <h2>Ingredients</h2>
        <ul>
          {recipe.ingredients.map((ing, i) => (
            <li key={i}>{ing}</li>
          ))}
        </ul>
      </div>

      <div className="recipe-section">
        <h2>Instructions</h2>
        <ol>
          {recipe.instructions.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      <Link to="/" className="btn btn-secondary">
        Back to Recipes
      </Link>
    </div>
  );
};
