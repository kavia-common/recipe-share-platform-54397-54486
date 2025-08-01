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
    <div>
      {/* Header Section */}
      <div className="recipe-list-header">
        <h1 style={{ 
          fontSize: "var(--font-size-3xl)", 
          fontWeight: "800", 
          color: "var(--text-primary)",
          margin: 0
        }}>
          My Recipes
        </h1>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate("/recipes/new")}
          aria-label="Create new recipe"
        >
          <span role="img" aria-hidden="true">➕</span>
          New Recipe
        </button>
      </div>

      {/* Filters Section */}
      <div className="recipe-filters">
        <div className="recipe-search">
          <input
            type="text"
            placeholder="Search recipes by name..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="form-input"
            aria-label="Search recipes"
          />
        </div>
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="form-input"
          style={{ minWidth: "200px" }}
          data-testid="category-filter"
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {(filter || category) && (
          <button 
            className="btn btn-outline"
            onClick={() => {
              setFilter("");
              setCategory("");
            }}
            aria-label="Clear filters"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="card" style={{ 
          background: "#fef2f2", 
          borderColor: "#fecaca", 
          color: "#dc2626" 
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Results Summary */}
      <div style={{ 
        margin: "var(--space-6) 0", 
        color: "var(--text-muted)",
        fontSize: "var(--font-size-sm)"
      }}>
        {filteredRecipes.length === recipes.length 
          ? `Showing all ${recipes.length} recipes`
          : `Showing ${filteredRecipes.length} of ${recipes.length} recipes`
        }
      </div>

      {/* Recipes Table */}
      <div style={{ overflowX: "auto" }}>
        <table className="table-modern">
          <thead>
            <tr>
              <th>Recipe Name</th>
              <th>Categories</th>
              <th>Subrecipes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecipes.map((r) => (
              <tr key={r.id}>
                <td>
                  <button
                    className="btn btn-outline"
                    onClick={() => navigate(`/recipes/${r.id}`)}
                    style={{ 
                      padding: "var(--space-2) var(--space-3)",
                      fontSize: "var(--font-size-base)",
                      fontWeight: "600",
                      textAlign: "left",
                      justifyContent: "flex-start"
                    }}
                  >
                    {r.name}
                  </button>
                </td>
                <td>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)" }}>
                    {(r.categories || []).map((cat) => (
                      <span className="tag tag-accent" key={cat}>{cat}</span>
                    ))}
                    {(!r.categories || r.categories.length === 0) && (
                      <span style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>
                        No categories
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-1)" }}>
                    {(r.subrecipes || []).map((s) => (
                      <span className="tag tag-outline" key={s}>{s}</span>
                    ))}
                    {(!r.subrecipes || r.subrecipes.length === 0) && (
                      <span style={{ color: "var(--text-muted)", fontSize: "var(--font-size-sm)" }}>
                        None
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <div style={{ display: "flex", gap: "var(--space-2)", flexWrap: "wrap" }}>
                    <button 
                      onClick={() => navigate(`/recipes/${r.id}`)} 
                      className="btn btn-outline"
                      style={{ padding: "var(--space-2) var(--space-3)", fontSize: "var(--font-size-sm)" }}
                      aria-label={`View ${r.name}`}
                    >
                      View
                    </button>
                    <button 
                      onClick={() => navigate(`/recipes/${r.id}/edit`)} 
                      className="btn btn-secondary"
                      style={{ padding: "var(--space-2) var(--space-3)", fontSize: "var(--font-size-sm)" }}
                      aria-label={`Edit ${r.name}`}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(r.id)}
                      style={{ padding: "var(--space-2) var(--space-3)", fontSize: "var(--font-size-sm)" }}
                      aria-label={`Delete ${r.name}`}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!filteredRecipes.length && (
              <tr>
                <td colSpan={4}>
                  <div className="loading-container">
                    <span role="img" aria-hidden="true">🍽️</span>
                    <div>
                      {recipes.length === 0 
                        ? "No recipes yet. Create your first recipe to get started!"
                        : "No recipes match your search criteria."
                      }
                    </div>
                  </div>
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
