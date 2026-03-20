import { useParams, useOutletContext } from "react-router-dom";
import BentoGrid from "../components/BentoGrid";

const CategoryRecipes = ({ recipes }) => {
  const { category } = useParams();
  const { searchQuery, dietaryFilter } = useOutletContext();

  const filtered = recipes.filter(r => {
    // 1. Category check
    if (r.category !== category) return false;

    // 2. Search check
    const matchesSearch = searchQuery 
        ? r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.description?.toLowerCase().includes(searchQuery.toLowerCase())
        : true;
    
    if (!matchesSearch) return false;

    // 3. Dietary check
    const vegTags = ['Vegetarian', 'Vegan'];
    const vegKeywords = ['veg', 'paneer', 'pasta', 'dal', 'rice', 'salad', 'fruit', 'eggless', 'cheese', 'pizza', 'sandwich', 'burger', 'maggi', 'noodle'];
    const vegCategories = ['Vegetarian', 'Desserts', 'Salad', 'Breakfast', 'Appetizer'];
    
    const isVeg = 
        r.dietaryTags?.some(tag => vegTags.includes(tag)) || 
        vegCategories.includes(r.category) ||
        (r.title && vegKeywords.some(key => r.title.toLowerCase().includes(key.toLowerCase())));

    const matchesDiet = dietaryFilter === 'all' 
        ? true 
        : dietaryFilter === 'veg' 
            ? isVeg 
            : !isVeg;
            
    return matchesDiet;
  });

  const handleRecipeClick = (recipe) => {
    window.location.href = `/recipes/${recipe._id}`;
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 pb-24">
      <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">{category} Recipes</h1>
      <BentoGrid recipes={filtered} />
    </div>
  );
};

export default CategoryRecipes;
