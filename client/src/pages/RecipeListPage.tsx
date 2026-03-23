import { useState, useEffect } from "react";
import { api } from "../api/client";
import type { Recipe } from "../types";
import { RecipeCard } from "../components/RecipeCard";

export const RecipeListPage = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [query, setQuery] = useState("");

  const fetchRecipes = async (searchQuery?: string) => {
    const path = searchQuery
      ? `/recipes/search?q=${encodeURIComponent(searchQuery)}`
      : "/recipes";
    const data = await api.get<Recipe[]>(path);
    setRecipes(data);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRecipes(query);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Recipes</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search recipes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">
            Search
          </button>
        </form>
      </div>
      {recipes.length === 0 ? (
        <p className="empty-message">
          No recipes found. Add your first recipe!
        </p>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
};
