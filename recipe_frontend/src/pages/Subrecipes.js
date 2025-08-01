import React, { useState, useEffect } from "react";
import { apiGet, apiPost, apiDelete, apiPut } from "../utils/api";

/**
 * Page for creating, editing, and listing subrecipes.
 */
function Subrecipes() {
  const [subrecipes, setSubrecipes] = useState([]);
  const [newSub, setNewSub] = useState({ name: "", ingredients: [""] });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editing, setEditing] = useState({ name: "", ingredients: [""] });
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        setSubrecipes(await apiGet("/subrecipes"));
      } catch (e) {}
    })();
  }, []);

  const addIngredient = (obj, setObj, idx) => {
    setObj({
      ...obj,
      ingredients: obj.ingredients.map((v, i) => i === idx ? v : v).concat([""])
    });
  };
  const setIngredient = (obj, setObj, idx, value) => {
    setObj({
      ...obj,
      ingredients: obj.ingredients.map((v, i) => i === idx ? value : v)
    });
  };
  const removeIngredient = (obj, setObj, idx) => {
    setObj({
      ...obj,
      ingredients: obj.ingredients.filter((_, i) => i !== idx)
    });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const data = {
      name: newSub.name,
      ingredients: newSub.ingredients.filter((i) => i.trim())
    };
    try {
      await apiPost("/subrecipes", data);
      setSubrecipes(await apiGet("/subrecipes"));
      setNewSub({ name: "", ingredients: [""] });
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleEdit = idx => {
    setEditingIndex(idx);
    setEditing({ ...subrecipes[idx], ingredients: subrecipes[idx].ingredients || [""] });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await apiPut(`/subrecipes/${editing.name}`, editing);
      setEditingIndex(null);
      setEditing({ name: "", ingredients: [""] });
      setSubrecipes(await apiGet("/subrecipes"));
      setError(null);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (name) => {
    if (!window.confirm("Delete this subrecipe?")) return;
    try {
      await apiDelete(`/subrecipes/${name}`);
      setSubrecipes(await apiGet("/subrecipes"));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div style={{maxWidth:600,margin:"2.8em auto"}}>
      <h2 style={{color:"var(--color-secondary)"}}>Subrecipes</h2>
      {error && <div style={{color:"#b91c1c"}}>{error}</div>}
      <form onSubmit={handleAdd} className="card form-group">
        <input required placeholder="Subrecipe name"
          value={newSub.name}
          onChange={e => setNewSub(s=>({ ...s, name: e.target.value }))}
        />
        {newSub.ingredients.map((ing, i) => (
          <div key={i} style={{display:"flex",alignItems:"center",marginTop:"0.4em"}}>
            <input
              type="text"
              value={ing}
              required
              placeholder={`Ingredient ${i+1}`}
              onChange={e=>setIngredient(newSub, setNewSub, i, e.target.value)}
            />
            <button
              className="btn btn-outline" type="button"
              style={{marginLeft:"0.5em",padding:"0.4em 0.6em"}}
              onClick={()=>removeIngredient(newSub, setNewSub, i)}
              disabled={newSub.ingredients.length <= 1}
            >✕</button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setNewSub(s => ({
            ...s,
            ingredients: [...s.ingredients, ""]
          }))}
        >+ Add Ingredient</button>
        <button type="submit" className="btn" style={{marginLeft:"0.7em",marginTop:"0.5em"}}>Create</button>
      </form>
      <div style={{margin:"2em 0"}}></div>
      <div>
        {subrecipes.map((sr, idx) => (
          <div className="card" key={idx}>
            {editingIndex !== idx ? (
              <>
                <div style={{fontWeight:"bold",color:"var(--color-accent)",fontSize:"1.1em"}}>{sr.name}</div>
                <div>
                  <ul style={{margin:"0.7em 0 0 1em"}}>
                    {sr.ingredients.map((ing,i) => <li key={i}>{ing}</li>)}
                  </ul>
                </div>
                <div className="form-actions">
                  <button className="btn btn-outline" onClick={()=>handleEdit(idx)}>Edit</button>
                  <button className="btn btn-outline" style={{color:"#a33"}} onClick={()=>handleDelete(sr.name)}>Delete</button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSave}>
                <input
                  value={editing.name}
                  onChange={e => setEditing(e=>({...e,name:e.target.value}))}
                  required
                />
                {editing.ingredients.map((ing, i) => (
                  <div key={i} style={{display:"flex",alignItems:"center",marginTop:"0.3em"}}>
                    <input
                      type="text"
                      value={ing}
                      required
                      placeholder={`Ingredient ${i+1}`}
                      onChange={e=>setEditing(edi=>({
                        ...edi,ingredients:edi.ingredients.map((v,ii)=>ii===i?e.target.value:v)
                      }))}
                    />
                    <button
                      className="btn btn-outline" type="button"
                      style={{marginLeft:"0.5em",padding:"0.4em 0.6em"}}
                      onClick={()=>setEditing(edi=>({
                        ...edi,
                        ingredients: edi.ingredients.filter((_,ii)=>ii!==i)
                      }))}
                      disabled={editing.ingredients.length <=1}
                    >✕</button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditing(edi=>({
                    ...edi, ingredients:[...edi.ingredients,""]
                  }))}
                >+ Add Ingredient</button>
                <button type="submit" className="btn" style={{marginLeft:"1em",marginTop:"0.5em"}}>Save</button>
                <button type="button" className="btn btn-outline" onClick={()=>setEditingIndex(null)}>Cancel</button>
              </form>
            )}
          </div>
        ))}
        {subrecipes.length === 0 && (<div className="form-hint">No subrecipes defined.</div>)}
      </div>
    </div>
  );
}

export default Subrecipes;
