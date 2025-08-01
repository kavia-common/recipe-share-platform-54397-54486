import React, { useState, useEffect } from "react";
import { apiGet } from "../utils/api";
import { useNavigate } from "react-router-dom";

/**
 * Recipe search page.
 */
function SearchPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setCategories(await apiGet("/categories"));
      } catch (e) {}
    })();
  }, []);

  const search = async (e) => {
    e.preventDefault();
    try {
      const all = await apiGet("/recipes");
      let filtered = all;
      if (query)
        filtered = filtered.filter((r) =>
          r.name.toLowerCase().includes(query.toLowerCase())
        );
      if (category)
        filtered = filtered.filter(r =>
          (r.categories || []).includes(category)
        );
      if (ingredient)
        filtered = filtered.filter(r =>
          (r.ingredients || []).some(ing =>
            ing.toLowerCase().includes(ingredient.toLowerCase())
          )
        );
      setResults(filtered);
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{maxWidth:650,margin:"2.4rem auto"}}>
      <h2 style={{color:"var(--color-accent)"}}>Recipe Search</h2>
      <form onSubmit={search}>
        <div className="form-group">
          <label>By Name</label>
          <input type="text" value={query} onChange={e=>setQuery(e.target.value)} />
        </div>
        <div className="form-group">
          <label>By Category</label>
          <select value={category} onChange={e=>setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(cat=>(
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>By Ingredient</label>
          <input type="text" value={ingredient} onChange={e=>setIngredient(e.target.value)} />
        </div>
        <button className="btn btn-secondary" type="submit">Search</button>
      </form>
      {error && <div style={{color:"#c00"}}>{error}</div>}
      <div style={{margin:"2em 0"}}>
        {results.length > 0 && (
          <table className="table-modern">
            <thead>
              <tr>
                <th>Name</th>
                <th>Categories</th>
                <th>Subrecipes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
            {results.map((r) => (
              <tr key={r.id}>
                <td><a className="sidebar-link" href={`/recipes/${r.id}`}>{r.name}</a></td>
                <td>{(r.categories || []).map((cat) => (
                  <span className="tag tag-accent" key={cat}>{cat}</span>
                ))}</td>
                <td>{(r.subrecipes || []).map((s) => (
                  <span className="tag tag-outline" key={s}>{s}</span>
                ))}</td>
                <td>
                  <button onClick={() => navigate(`/recipes/${r.id}`)} className="btn btn-outline">View</button>
                  <button onClick={() => navigate(`/recipes/${r.id}/edit`)} className="btn btn-secondary" style={{marginLeft:"0.6em"}}>Edit</button>
                </td>
              </tr>
            ))}
            </tbody>
          </table>
        )}
        {results.length === 0 && (<div className="form-hint">No results.</div>)}
      </div>
    </div>
  );
}

export default SearchPage;
