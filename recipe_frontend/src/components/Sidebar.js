import React from "react";
import { NavLink } from "react-router-dom";

// PUBLIC_INTERFACE
/**
 * Modern sidebar navigation component with enhanced theme switching
 * @param {Object} props
 * @param {string} props.theme - Current theme ('light' or 'dark')
 * @param {function} props.onToggleTheme - Theme toggle handler
 */
function Sidebar({ theme, onToggleTheme }) {
  const navigationItems = [
    {
      to: "/recipes",
      icon: "📋",
      label: "Recipes",
      end: true
    },
    {
      to: "/recipes/new",
      icon: "➕",
      label: "New Recipe"
    },
    {
      to: "/categories",
      icon: "🏷️",
      label: "Categories"
    },
    {
      to: "/search",
      icon: "🔍",
      label: "Search"
    },
    {
      to: "/subrecipes",
      icon: "🧩",
      label: "Subrecipes"
    },
    {
      to: "/nutritional",
      icon: "🥦",
      label: "Nutrition"
    }
  ];

  return (
    <nav className="sidebar" data-testid="sidebar" role="navigation" aria-label="Main navigation">
      {/* Logo */}
      <div className="sidebar-logo">
        <span role="img" aria-label="recipe">🍽️</span>
        RecipeShare
      </div>

      {/* Navigation Links */}
      <div className="sidebar-links">
        {navigationItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => 
              `sidebar-link ${isActive ? 'selected' : ''}`
            }
            end={item.end}
            aria-label={`Navigate to ${item.label}`}
          >
            <span 
              className="emoji" 
              role="img" 
              aria-label={item.label.toLowerCase()}
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Theme Toggle */}
      <div className="theme-toggle-container">
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
          aria-pressed={theme === "dark"}
          type="button"
        >
          <span role="img" aria-hidden="true">
            {theme === "light" ? "🌙" : "☀️"}
          </span>
          <span>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </span>
        </button>
      </div>

      {/* Footer */}
      <div className="sidebar-footer" data-testid="sidebar-footer">
        <div>RecipeShare v2.0</div>
        <div>Powered by Kavia</div>
      </div>
    </nav>
  );
}

export default Sidebar;
