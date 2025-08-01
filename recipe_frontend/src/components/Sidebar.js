import React from "react";
import { NavLink, useLocation } from "react-router-dom";

/**
 * Sidebar navigation for the Recipe Sharing app.
 * @param {Object} props
 * @param {string} props.theme
 * @param {function} props.onToggleTheme
 */
function Sidebar({ theme, onToggleTheme }) {
  const location = useLocation();

  // Helper to get active state
  function isActive(path) {
    return location.pathname.startsWith(path);
  }

  return (
    <nav className="sidebar" data-testid="sidebar">
      <div className="sidebar-logo">🍽️ RecipeShare</div>
      <div className="sidebar-links">
        <NavLink
          to="/recipes"
          className={({ isActive }) => "sidebar-link" + (isActive ? " selected" : "")}
          end
        >
          <span role="img" aria-label="list">📋</span> Recipes
        </NavLink>
        <NavLink
          to="/recipes/new"
          className={({ isActive }) => "sidebar-link" + (isActive ? " selected" : "")}
        >
          <span role="img" aria-label="new">➕</span> New Recipe
        </NavLink>
        <NavLink
          to="/categories"
          className={({ isActive }) => "sidebar-link" + (isActive ? " selected" : "")}
        >
          <span role="img" aria-label="categories">🏷️</span> Categories
        </NavLink>
        <NavLink
          to="/search"
          className={({ isActive }) => "sidebar-link" + (isActive ? " selected" : "")}
        >
          <span role="img" aria-label="search">🔍</span> Search
        </NavLink>
        <NavLink
          to="/subrecipes"
          className={({ isActive }) => "sidebar-link" + (isActive ? " selected" : "")}
        >
          <span role="img" aria-label="subrecipe">🧩</span> Subrecipes
        </NavLink>
        <NavLink
          to="/nutritional"
          className={({ isActive }) => "sidebar-link" + (isActive ? " selected" : "")}
        >
          <span role="img" aria-label="nutrition">🥦</span> Nutrition
        </NavLink>
      </div>
      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          style={{
            width: "94%",
            margin: "0.3rem 0 0.3rem 0",
            background: "var(--color-accent)",
            color: "#fff",
            fontSize: "0.98em"
          }}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>
      <div className="sidebar-footer" data-testid="sidebar-footer">
        <span style={{ fontSize: "0.9em" }}>v1.0 | by Kavia</span>
      </div>
    </nav>
  );
}

export default Sidebar;
