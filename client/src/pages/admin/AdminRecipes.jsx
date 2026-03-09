import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminRecipes = () => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    api.get("/admin/recipes").then(res => setRecipes(res.data));
  }, []);

  const deleteRecipe = async (id) => {
    if (window.confirm("Delete this recipe?")) {
      await api.delete(`/admin/recipes/${id}`);
      setRecipes(recipes.filter(r => r._id !== id));
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl mb-6">Admin – Manage Recipes</h1>

      <table className="w-full border">
        <thead>
          <tr className="bg-stone-800">
            <th>Recipe</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {recipes.map(r => (
            <tr key={r._id} className="border-t">
              <td>{r.title}</td>
              <td>{r.user?.username}</td>
              <td className="space-x-3">
                <button className="bg-yellow-500 px-3 py-1 rounded">
                  Edit
                </button>
                <button
                  onClick={() => deleteRecipe(r._id)}
                  className="bg-red-600 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRecipes;
