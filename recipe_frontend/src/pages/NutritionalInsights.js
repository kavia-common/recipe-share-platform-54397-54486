import React, { useState, useEffect } from "react";
import { apiNutritionalInsight, apiGet } from "../utils/api";
import { useSearchParams } from "react-router-dom";

/**
 * Nutrition Information page (OpenAI-powered).
 */
function NutritionalInsights() {
  const [input, setInput] = useState("");
  const [nutrition, setNutrition] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  // If ?recipe=ID, load recipe and prepare info for OpenAI
  useEffect(() => {
    (async () => {
      const recipeId = searchParams.get("recipe");
      if (recipeId) {
        try {
          const r = await apiGet(`/recipes/${recipeId}`);
          const prompt =
            `Recipe: ${r.name}\nIngredients:\n` +
            (r.ingredients || []).map((i) => `- ${i}`).join("\n") +
            "\nSteps:\n" +
            (r.instructions || []).map((s, idx) => `${idx + 1}. ${s}`).join("\n");
          setInput(prompt);
        } catch (e) {
          setError(e.message);
        }
      }
    })();
    // only on mount and when searchParams changes
    // eslint-disable-next-line
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNutrition("");
    setError("");
    try {
      const resp = await apiNutritionalInsight(input);
      setNutrition(typeof resp === "string" ? resp : (resp.nutrition || JSON.stringify(resp)));
    } catch (e) {
      setError(e.message);
      setNutrition("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth:700,margin:"3em auto"}}>
      <h2 style={{color:"var(--color-primary)"}}>Nutrition Insights</h2>
      <form onSubmit={handleSubmit} style={{marginTop:"2em"}}>
        <label>Paste ingredients & steps, or fetch from recipe page</label>
        <textarea
          value={input}
          onChange={e=>setInput(e.target.value)}
          style={{minHeight:"130px"}}
          placeholder="Paste recipe details for nutrition analysis"
        />
        <div className="form-actions" style={{marginBottom:0}}>
          <button className="btn btn-secondary" type="submit" disabled={loading || !input.trim()}>Analyze</button>
        </div>
      </form>
      {loading && <div style={{margin:"2em"}}>Checking nutrition…</div>}
      {error && <div style={{color:"#c00"}}>{error}</div>}
      {nutrition && (
        <div className="card" style={{marginTop:"2.4em",background:"var(--bg-primary)"}}>
          <h3 style={{color:"var(--color-accent)",marginBottom:"1em"}}>Estimated Nutrition</h3>
          <pre style={{whiteSpace:"pre-wrap",fontFamily:"inherit"}}>{nutrition}</pre>
        </div>
      )}
    </div>
  );
}

export default NutritionalInsights;
