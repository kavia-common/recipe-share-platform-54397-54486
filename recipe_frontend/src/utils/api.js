const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000"; // REST API root

// PUBLIC_INTERFACE
/**
 * Generic GET request.
 * @param {string} path (e.g., '/recipes')
 */
export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`GET ${path}: ${res.statusText}`);
  return await res.json();
}

// PUBLIC_INTERFACE
/**
 * Generic POST request.
 * @param {string} path
 * @param {object} data
 */
export async function apiPost(path, data) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`POST ${path}: ${res.statusText}`);
  return await res.json();
}

// PUBLIC_INTERFACE
/**
 * Generic PUT request (edit).
 */
export async function apiPut(path, data) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`PUT ${path}: ${res.statusText}`);
  return await res.json();
}

// PUBLIC_INTERFACE
/**
 * Generic DELETE request.
 */
export async function apiDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`DELETE ${path}: ${res.statusText}`);
  return await res.json();
}

// PUBLIC_INTERFACE
/**
 * Request nutritional insights from OpenAI proxy endpoint.
 * @param {string} description - Recipe title and list of ingredients/instructions.
 * Returns nutritional info as string or object.
 */
export async function apiNutritionalInsight(description) {
  const res = await fetch(`${API_BASE}/nutritional`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: description })
  });
  if (!res.ok) throw new Error(`OpenAI nutrition: ${res.statusText}`);
  return await res.json();
}
