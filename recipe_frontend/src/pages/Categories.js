import React, { useEffect, useState } from "react";
import { apiGet, apiPost, apiDelete } from "../utils/api";

/**
 * Category management page.
 */
function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setCategories(await apiGet("/categories"));
      } catch (e) {
        setError(e.message);
      }
    })();
  }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    try {
      await apiPost("/categories", { name: newCategory });
      setCategories((c) => [...c, newCategory]);
      setNewCategory("");
    } catch (e) {
      setError(e.message);
    }
  };

  const delCategory = async (name) => {
    if (!window.confirm(`Delete category '${name}'?`)) return;
    try {
      await apiDelete(`/categories/${name}`);
      setCategories((c) => c.filter((cat) => cat !== name));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{maxWidth:500, margin:"2.7rem auto"}}>
      <h2 style={{color:"var(--color-primary)", marginBottom:"1.3em"}}>Recipe Categories</h2>
      {error && <div className="form-hint" style={{color:"#b91c1c"}}>{error}</div>}
      <form onSubmit={addCategory} className="form-group" style={{display:"flex",gap:"0.5em"}}>
        <input
          value={newCategory}
          onChange={e=>setNewCategory(e.target.value)}
          placeholder="New category name"
          required
        />
        <button className="btn btn-secondary" type="submit">Add</button>
      </form>
      <div style={{marginTop:"1.6em"}}>
        {categories.length === 0 && (
          <div className="form-hint">No categories defined.</div>
        )}
        {categories.map(cat => (
          <div key={cat} style={{display:"flex",alignItems:"center",margin:"0.7em 0"}}>
            <div className="tag tag-accent" style={{minWidth:100}}>{cat}</div>
            <button className="btn btn-outline" style={{marginLeft:"1em"}} type="button" onClick={()=>delCategory(cat)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
