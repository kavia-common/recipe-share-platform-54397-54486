import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { apiGet } from "../utils/api";

/**
 * Detail view of a single recipe.
 */
function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setRecipe(await apiGet(`/recipes/${id}`));
      } catch (e) {
        setError(e.message);
      }
    })();
  }, [id]);

  if (error)
    return <div style={{margin: "3rem", color: "#b91c1c"}}>Error: {error}</div>;

  if (!recipe)
    return <div style={{margin: "3rem"}}>Loading recipe…</div>;

  return (
    <div className="recipe-detail">
      <div className="recipe-title">{recipe.name}</div>
      {(recipe.categories?.length > 0) && (
        <div className="recipe-info" style={{ marginBottom: "1.2em" }}>
          {recipe.categories.map((cat) => (
            <span className="tag tag-accent" key={cat}>{cat}</span>
          ))}
        </div>
      )}
      {recipe.subrecipes?.length > 0 && (
        <div className="form-hint" style={{fontWeight:"bold", marginBottom:"0.6em"}}>Subrecipes:
          {recipe.subrecipes.map((sr) => (
            <span className="tag tag-outline" key={sr}>{sr}</span>
          ))}
        </div>
      )}
      <h3 style={{marginTop: "1.5em", color: "var(--color-primary)"}}>Ingredients</h3>
      <ul className="ingredient-list">
        {recipe.ingredients && recipe.ingredients.map((ing,i) => (
          <li key={i}>{ing}</li>
        ))}
      </ul>
      <h3 style={{marginTop: "1.2em", color: "var(--color-accent)"}}>Instructions</h3>
      <ol className="instructions-list">
        {recipe.instructions && recipe.instructions.map((step, i) => (
          <li key={i}>{step}</li>
        ))}
      </ol>

      <div className="form-actions" style={{marginTop:"2em"}}>
        <button className="btn btn-secondary" onClick={() => navigate(`/recipes/${id}/edit`)}>Edit</button>
        <button className="btn btn-outline" onClick={()=>navigate("/recipes")}>Back</button>
        <Link to={`/nutritional?recipe=${id}`} className="btn btn-outline" style={{marginLeft:"0.8em"}}>Nutrition Info</Link>
      </div>
    </div>
  );
}

export default RecipeDetail;
