import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RecipeDetail from "../components/RecipeDetail";
import AuthContext from "../context/AuthContext";
import api from "../services/api";

const RecipeView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // 🗑 Delete recipe (ADMIN)
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recipe?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/recipes/${id}`);
      alert("Recipe deleted successfully");
      navigate("/admin/recipes");
    } catch (error) {
      alert("Failed to delete recipe");
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto pb-24">

      {/* 🔐 ADMIN ACTIONS */}
      {user?.isAdmin && (
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => navigate(`/edit-recipe/${id}`)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            ✏️ Edit Recipe
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            🗑 Delete Recipe
          </button>
        </div>
      )}

      {/* RECIPE DETAILS */}
      <RecipeDetail
        recipe={{ _id: id }}
        onBack={() => navigate("/", { replace: true })}
        backLabel="Back to Discover"
      />
    </div>
  );
};

export default RecipeView;
