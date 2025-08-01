import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet, apiPost, apiPut } from "../utils/api";

/**
 * Main form for creating or editing a recipe.
 * Props:
 *   mode: "create" | "edit"
 */
function RecipeForm({ mode }) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [subrecipes, setSubrecipes] = useState([]);
  const [chosenSubrecipes, setChosenSubrecipes] = useState([]);
  const [ingredients, setIngredients] = useState([""]);
  const [instructions, setInstructions] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const params = useParams();
  const navigate = useNavigate();

  // For edit: Load recipe, For create: load available categories/subrecipes
  useEffect(() => {
    (async () => {
      try {
        setAvailableCategories(await apiGet("/categories"));
        setSubrecipes(await apiGet("/subrecipes"));

        if (mode === "edit") {
          const rec = await apiGet(`/recipes/${params.id}`);
          setName(rec.name || "");
          setSelectedCategories(rec.categories || []);
          setChosenSubrecipes(rec.subrecipes || []);
          setIngredients(rec.ingredients && rec.ingredients.length > 0 ? rec.ingredients : [""]);
          setInstructions(rec.instructions && rec.instructions.length > 0 ? rec.instructions : [""]);
        }
      } catch (e) {
        setError(e.message);
      }
    })();
    // eslint-disable-next-line
  }, [mode, params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const data = {
      name,
      categories: selectedCategories,
      subrecipes: chosenSubrecipes,
      ingredients: ingredients.filter((i) => i.trim()),
      instructions: instructions.filter((i) => i.trim())
    };
    try {
      if (mode === "edit") {
        await apiPut(`/recipes/${params.id}`, data);
      } else {
        await apiPost("/recipes", data);
      }
      navigate("/recipes");
    } catch (e) {
      setError(e.message);
      setLoading(false);
    }
  };

  // Dynamic field helpers
  const addIngredient = () => setIngredients([...ingredients, ""]);
  const removeIngredient = (idx) => setIngredients(ingredients.filter((_, i) => i !== idx));
  const setIngredient = (idx, value) => setIngredients(ingredients.map((v, i) => i === idx ? value : v));
  const addInstruction = () => setInstructions([...instructions, ""]);
  const removeInstruction = (idx) => setInstructions(instructions.filter((_, i) => i !== idx));
  const setInstruction = (idx, value) => setInstructions(instructions.map((v, i) => i === idx ? value : v));

  return (
    <div>
      <form className="form-modern" onSubmit={handleSubmit}>
        <h2 style={{textAlign:"center", color:"var(--color-accent)"}}>
          {mode === "edit" ? "Edit Recipe" : "Create Recipe"}
        </h2>
        {error && <div className="form-hint" style={{color:"#b91c1c"}}>{error}</div>}

        <div className="form-group">
          <label>Recipe Name</label>
          <input value={name} onChange={e => setName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Categories</label>
          <select
            multiple
            value={selectedCategories}
            onChange={e => setSelectedCategories(
              Array.from(e.target.selectedOptions, o => o.value)
            )}
            style={{height:"70px"}}
          >
            {availableCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <div className="form-hint">Select one or more categories</div>
        </div>

        <div className="form-group">
          <label>Subrecipes</label>
          <select
            multiple
            value={chosenSubrecipes}
            onChange={e => setChosenSubrecipes(
              Array.from(e.target.selectedOptions, o => o.value)
            )}
            style={{height:"70px"}}
          >
            {subrecipes.map(sr => (
              <option key={sr.name} value={sr.name}>{sr.name}</option>
            ))}
          </select>
          <div className="form-hint">Include subrecipes (can be created as re-usable building blocks)</div>
        </div>

        <div className="form-group">
          <label>Ingredients</label>
          {ingredients.map((ing, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: "0.5em"}}>
              <input
                type="text"
                value={ing}
                onChange={e => setIngredient(idx, e.target.value)}
                required
                placeholder={`Ingredient ${idx+1}`}
              />
              <button className="btn btn-outline" type="button" style={{marginLeft:"9px", padding:"0.4em 0.7em"}}
                onClick={()=>removeIngredient(idx)} disabled={ingredients.length<=1}>✕</button>
            </div>
          ))}
          <button className="btn btn-secondary" type="button" onClick={addIngredient}>+ Add Ingredient</button>
        </div>

        <div className="form-group">
          <label>Instructions</label>
          {instructions.map((ins, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", marginBottom: "0.5em"}}>
              <input
                type="text"
                value={ins}
                onChange={e => setInstruction(idx, e.target.value)}
                required
                placeholder={`Step ${idx+1}`}
              />
              <button className="btn btn-outline" type="button" style={{marginLeft:"9px", padding:"0.4em 0.7em"}}
                onClick={()=>removeInstruction(idx)} disabled={instructions.length<=1}>✕</button>
            </div>
          ))}
          <button className="btn btn-secondary" type="button" onClick={addInstruction}>+ Add Step</button>
        </div>

        <div className="form-actions">
          <button className="btn" type="submit" disabled={loading}>
            {mode === "edit" ? "Save Changes" : "Create Recipe"}
          </button>
          <button className="btn btn-outline" type="button" onClick={() => navigate("/recipes")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default RecipeForm;
