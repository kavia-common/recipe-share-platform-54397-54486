import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
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
 */
function App() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () =>
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));

  return (
    <Router>
      <div className="main-app-layout">
        <Sidebar theme={theme} onToggleTheme={toggleTheme} />
        <div className="main-content">
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
            <Route path="*" element={<div style={{margin: "3rem"}}>Page not found.</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
