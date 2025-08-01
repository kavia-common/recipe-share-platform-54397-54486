import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiDelete } from "../utils/api";

// PUBLIC_INTERFACE
/**
 * Page for listing all recipes. Enables view/edit/delete/search.
 */
function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [filter, setFilter] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Load recipes and categories
  useEffect(() => {
    (async () => {
      try {
        setRecipes(await apiGet("/recipes"));
        setCategories(await apiGet("/categories"));
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  function handleDelete(id) {
    if (!window.confirm("Delete this recipe?")) return;
    apiDelete(`/recipes/${id}`)
      .then(() => setRecipes((prev) => prev.filter((r) => r.id !== id)))
      .catch((e) => alert("Delete failed: " + e.message));
  }

  let filteredRecipes = recipes;
  if (filter)
    filteredRecipes = filteredRecipes.filter((r) =>
      r.name.toLowerCase().includes(filter.toLowerCase())
    );
  if (category)
    filteredRecipes = filteredRecipes.filter((r) =>
      (r.categories || []).includes(category)
    );

  return (
    <div style={{ maxWidth: 800, margin: "2.2rem auto 0 auto" }}>
      <div className="recipe-list-header">
        <div>
          <input
            type="text"
            placeholder="Search recipes…"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{
              fontSize: "1em",
              padding: "0.47em 1.2em",
              borderRadius: "7px",
              border: "1.1px solid var(--border-color)",
              marginRight: "0.95em",
              background: "#fafafa"
            }}
          />
          <select
            value={category}
            style={{
              borderRadius: "6px",
              padding: "0.4em 1.1em",
              border: "1.1px solid var(--border-color)",
              background: "#fafafa"
            }}
            onChange={e => setCategory(e.target.value)}
            data-testid="category-filter"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <button className="btn" onClick={() => navigate("/recipes/new")}>+ New Recipe</button>
      </div>

      {error && <div style={{ color: "#c00", margin: "1.2em 0" }}>{error}</div>}

      <div className="recipe-list-table" style={{ overflowX: "auto" }}>
        <table className="table-modern">
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ minWidth: 130 }}>Categories</th>
              <th>Subrecipes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecipes.map((r) => (
              <tr key={r.id}>
                <td>
                  <a className="sidebar-link" href={`/recipes/${r.id}`}>{r.name}</a>
                </td>
                <td>
                  {(r.categories || []).map((cat) => <span className="tag tag-accent" key={cat}>{cat}</span>)}
                </td>
                <td>
                  {(r.subrecipes || []).map((s) => <span className="tag tag-outline" key={s}>{s}</span>)}
                </td>
                <td>
                  <button onClick={() => navigate(`/recipes/${r.id}`)} className="btn btn-outline" style={{marginRight: "0.66em"}}>View</button>
                  <button onClick={() => navigate(`/recipes/${r.id}/edit`)} className="btn btn-secondary" style={{marginRight: "0.58em"}}>Edit</button>
                  <button className="btn btn-outline" style={{color: "#a33", borderColor: "#e89a9a"}} onClick={() => handleDelete(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
            {!filteredRecipes.length && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", color: "var(--text-secondary)", padding: "2.7em" }}>
                  No recipes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecipeList;
