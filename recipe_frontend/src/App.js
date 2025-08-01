import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import RecipeList from "./pages/RecipeList";
import RecipeForm from "./pages/RecipeForm";
import RecipeDetail from "./pages/RecipeDetail";
import Categories from "./pages/Categories";
import SearchPage from "./pages/SearchPage";
import Subrecipes from "./pages/Subrecipes";
import NutritionalInsights from "./pages/NutritionalInsights";

import "./App.css";

// PUBLIC_INTERFACE
/**
 * The root App component controls theme, layout, and routing/navigation.
 * Features persistent theme storage and smooth theme transitions.
 */
function App() {
  // Initialize theme from localStorage or default to light
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("recipe-app-theme");
    return savedTheme || "light";
  });

  // Apply theme to document and save to localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("recipe-app-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  /**
   * Toggles between light and dark theme
   */
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <div className="App">
      <Router>
        <div className="main-app-layout">
          <Sidebar theme={theme} onToggleTheme={toggleTheme} />
          <main className="main-content" role="main">
            <Routes>
              <Route path="/" element={<Navigate to="/recipes" replace />} />
              <Route path="/recipes" element={<RecipeList />} />
              <Route path="/recipes/new" element={<RecipeForm mode="create" />} />
              <Route path="/recipes/:id/edit" element={<RecipeForm mode="edit" />} />
              <Route path="/recipes/:id" element={<RecipeDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/subrecipes" element={<Subrecipes />} />
              <Route path="/nutritional" element={<NutritionalInsights />} />
              <Route 
                path="*" 
                element={
                  <div className="card" style={{ textAlign: "center", margin: "var(--space-12) auto", maxWidth: "400px" }}>
                    <h2>404 - Page Not Found</h2>
                    <p>The page you're looking for doesn't exist.</p>
                  </div>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  );
}

export default App;
