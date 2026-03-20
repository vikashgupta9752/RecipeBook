import React, { useContext } from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useOutletContext,
} from "react-router-dom";

/* ======================
   CONTEXT
====================== */
import AuthContext from "./context/AuthContext";

/* ======================
   AUTH PAGES
====================== */
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import OAuthSuccess from "./pages/OAuthSuccess";

/* ======================
   PUBLIC PAGES
====================== */
import Discover from "./pages/Discover";
import Trending from "./pages/Trending";
import Community from "./pages/Community";
import RecipeView from "./pages/RecipeView";
import FoodNews from "./pages/FoodNews";
import TVShows from "./pages/TVShows";
import CuisineRecipes from "./pages/CuisineRecipes";
import CategoryRecipes from "./pages/CategoryRecipe";
import ContactUs from "./pages/ContactUs";
import UserProfile from "./pages/UserProfile";
import ContactMessages from "./pages/admin/ContactMessages";
import Feedback from "./pages/admin/Feedback";

/* ======================
   USER PAGES (PROTECTED)
====================== */
import MyRecipes from "./pages/MyRecipes";
import Favorites from "./pages/Favorites";
import AddRecipe from "./pages/AddRecipe";
import MealPlanner from "./pages/MealPlanner";
import Friends from "./pages/Friends";
import Groups from "./pages/Groups";
import GroupDetail from "./pages/GroupDetail";
import Notifications from "./pages/Notifications";

/* ======================
   ADMIN PAGES
====================== */
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import Dashboard from "./pages/admin/Dashboard";
import AdminRecipes from "./pages/admin/Recipes";
import AdminUsers from "./pages/admin/Users";
import AdminThoughts from "./pages/admin/Thoughts";
// import ContactMessages from "./pages/admin/ContactMessages";
// import Feedback from "./pages/admin/Feedback";

/* ======================
   LAYOUT & ROUTES
====================== */
import Layout from "./components/Layout";
import AdminRoute from "./components/AdminRoute";

/* ======================
   PRIVATE ROUTE
====================== */
const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);
  const context = useOutletContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return user ? <Outlet context={context} /> : <Navigate to="/login" />;
};

/* ======================
   APP
====================== */
const App = () => {
  return (
    <Routes>

      {/* ===== AUTH ===== */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />

      {/* ===== ADMIN AUTH ===== */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ===== ADMIN PANEL ===== */}
      <Route
  path="/admin"
  element={
    <AdminRoute>
      <Admin />
    </AdminRoute>
  }
>
  <Route index element={<Navigate to="dashboard" replace />} />

  {/* Dashboard */}
  <Route path="dashboard" element={<Dashboard />} />

  {/* Recipes – Edit / Delete */}
  <Route path="recipes" element={<AdminRecipes />} />

  {/* Users */}
  <Route path="users" element={<AdminUsers />} />

  {/* Thoughts */}
  <Route path="thoughts" element={<AdminThoughts />} />

  {/* ✅ NEW: Contact Messages */}
  <Route path="contact-messages" element={<ContactMessages />} />

  {/* ✅ NEW: User Feedback */}
  <Route path="feedback" element={<Feedback />} />
</Route>


      {/* ===== MAIN LAYOUT ===== */}
      <Route element={<Layout />}>

        {/* Public inside layout */}
        <Route path="/" element={<Discover />} />
        <Route path="/trending" element={<Trending />} />
        <Route path="/community" element={<Community />} />
        <Route path="/recipes/:id" element={<RecipeView />} />
        <Route path="/food-news" element={<FoodNews />} />
        <Route path="/tv-shows" element={<TVShows />} />
        <Route path="/cuisines/:type" element={<CuisineRecipes />} />
        <Route path="/category/:category" element={<CategoryRecipes />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/profile/:id" element={<UserProfile />} />

        {/* Protected inside layout */}
        <Route element={<PrivateRoute />}>
          <Route path="/my-recipes" element={<MyRecipes />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:id" element={<GroupDetail />} />
          <Route path="/meal-planner" element={<MealPlanner />} />
          <Route path="/add-recipe" element={<AddRecipe />} />
          <Route path="/edit-recipe/:id" element={<AddRecipe />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>

      </Route>

      {/* ===== FALLBACK ===== */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
};

export default App;
