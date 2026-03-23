import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import type { Recipe } from "../types";

export const RecipeFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [instructions, setInstructions] = useState<string[]>([""]);
  const [cookingTime, setCookingTime] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      api.get<Recipe>(`/recipes/${id}`).then((recipe) => {
        setTitle(recipe.title);
        setDescription(recipe.description);
        setIngredients(recipe.ingredients);
        setInstructions(recipe.instructions);
        setCookingTime(recipe.cookingTime);
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const filteredIngredients = ingredients.filter((i) => i.trim());
    const filteredInstructions = instructions.filter((i) => i.trim());

    const body = {
      title,
      description,
      ingredients: filteredIngredients,
      instructions: filteredInstructions,
      cookingTime,
    };

    try {
      if (isEdit) {
        await api.put(`/recipes/${id}`, body);
        navigate(`/recipes/${id}`);
      } else {
        const recipe = await api.post<Recipe>("/recipes", body);
        navigate(`/recipes/${recipe.id}`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save recipe");
    }
  };

  const addItem = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList([...list, ""]);
  };

  const removeItem = (
    index: number,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.length <= 1) return;
    setList(list.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const updated = [...list];
    updated[index] = value;
    setList(updated);
  };

  return (
    <div className="recipe-form-page">
      <h1>{isEdit ? "Edit Recipe" : "New Recipe"}</h1>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="recipe-form">
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
          />
        </label>

        <label>
          Cooking Time (minutes)
          <input
            type="number"
            value={cookingTime}
            onChange={(e) => setCookingTime(Number(e.target.value))}
            min={0}
          />
        </label>

        <fieldset>
          <legend>Ingredients</legend>
          {ingredients.map((ing, i) => (
            <div key={i} className="dynamic-field">
              <input
                type="text"
                value={ing}
                onChange={(e) =>
                  updateItem(i, e.target.value, ingredients, setIngredients)
                }
                placeholder={`Ingredient ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => removeItem(i, ingredients, setIngredients)}
                className="btn-remove"
              >
                x
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem(ingredients, setIngredients)}
            className="btn btn-secondary btn-small"
          >
            + Add Ingredient
          </button>
        </fieldset>

        <fieldset>
          <legend>Instructions</legend>
          {instructions.map((step, i) => (
            <div key={i} className="dynamic-field">
              <input
                type="text"
                value={step}
                onChange={(e) =>
                  updateItem(i, e.target.value, instructions, setInstructions)
                }
                placeholder={`Step ${i + 1}`}
              />
              <button
                type="button"
                onClick={() => removeItem(i, instructions, setInstructions)}
                className="btn-remove"
              >
                x
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addItem(instructions, setInstructions)}
            className="btn btn-secondary btn-small"
          >
            + Add Step
          </button>
        </fieldset>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEdit ? "Update Recipe" : "Create Recipe"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
