import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import api from '../services/api';
import AuthContext from '../context/AuthContext';
import { ChefHat, Plus, X, Sparkles, Upload, Trash2, Clock, Users, BarChart2 } from 'lucide-react';

const AddRecipe = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timeMinutes: '',
    difficulty: 'Medium',
    calories: '',
    category: 'Main Course',
    cuisine: 'General',
    tags: [],
    dietaryTags: [],
    images: [],
    servings: 1,
    prepTime: '',
    cookTime: '',
    nutrition: {
      protein: '',
      carbs: '',
      fat: '',
      fiber: ''
    },
    videoUrl: '',
    ingredients: [{ quantity: '', unit: '', name: '' }],
    steps: [{ text: '', timeMinutes: '', image: '' }],
    isPublic: true,
    views: 0,
    likesCount: 0,
  });
  const [tagInput, setTagInput] = useState('');
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Non-Veg', 'Gluten-Free', 'Halal', 'Dairy-Free', 'Nut-Free', 'Low-Carb'
  ];

  useEffect(() => {
    if (isEditing) {
      const fetchRecipe = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/recipes/${id}?skipView=true`);
          const recipe = res.data;
          setFormData({
            title: recipe.title || '',
            description: recipe.description || '',
            timeMinutes: recipe.timeMinutes || '',
            difficulty: recipe.difficulty || 'Medium',
            calories: recipe.calories || '',
            category: recipe.category || 'Main Course',
            cuisine: recipe.cuisine || 'General',
            tags: recipe.tags || [],
            dietaryTags: recipe.dietaryTags || [],
            images: recipe.images || [],
            servings: recipe.servings || 1,
            prepTime: recipe.prepTime || '',
            cookTime: recipe.cookTime || '',
            nutrition: recipe.nutrition || { protein: '', carbs: '', fat: '', fiber: '' },
            videoUrl: recipe.videoUrl || '',
            ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [{ quantity: '', unit: '', name: '' }],
            steps: recipe.steps.length > 0 ? recipe.steps : [{ text: '', timeMinutes: '', image: '' }],
            isPublic: recipe.isPublic ?? true,
            views: recipe.views || 0,
            likesCount: recipe.likesCount || 0,
          });
        } catch (error) {
          console.error('Error fetching recipe:', error);
          alert('Failed to load recipe details');
          navigate('/admin/recipes');
        } finally {
          setLoading(false);
        }
      };
      fetchRecipe();
    }
  }, [id, isEditing, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    newIngredients[index][field] = value;
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleStepChange = (index, field, value) => {
    const newSteps = [...formData.steps];
    newSteps[index][field] = value;
    setFormData({ ...formData, steps: newSteps });
  };

  const handleNutritionChange = (field, value) => {
    setFormData({
      ...formData,
      nutrition: { ...formData.nutrition, [field]: value }
    });
  };

  const addIngredient = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, { quantity: '', unit: '', name: '' }] });
  };

  const removeIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, { text: '', timeMinutes: '', image: '' }] });
  };

  const removeStep = (index) => {
    const newSteps = formData.steps.filter((_, i) => i !== index);
    setFormData({ ...formData, steps: newSteps });
  };

  const toggleDietaryTag = (tag) => {
    if (formData.dietaryTags.includes(tag)) {
      setFormData({ ...formData, dietaryTags: formData.dietaryTags.filter(t => t !== tag) });
    } else {
      setFormData({ ...formData, dietaryTags: [...formData.dietaryTags, tag] });
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const addImageUrl = () => {
    if (imageUrlInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrlInput.trim()]
      }));
      setImageUrlInput('');
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAIAnalysis = async () => {
    // Construct text for AI
    const ingredientsText = formData.ingredients.map(i => `${i.quantity} ${i.unit} ${i.name}`).join(', ');
    const stepsText = formData.steps.map(s => s.text).join('\n');

    const hasContent = ingredientsText.trim().length > 5 && stepsText.trim().length > 5;
    if (!hasContent) {
      alert('Please add ingredients and steps first!');
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const res = await api.post('/ai/analyze-recipe', {
        ingredients: [ingredientsText],
        instructions: [stepsText]
      });
      
      setFormData(prev => ({
        ...prev,
        calories: res.data.calories,
        difficulty: res.data.difficulty
      }));
    } catch (error) {
      console.error('AI Analysis failed:', error);
      alert('Failed to analyze recipe. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await api.put(`/recipes/${id}`, formData);
        alert('Recipe updated successfully!');
        navigate('/admin/recipes');
      } else {
        await api.post('/recipes', formData);
        alert('Recipe created successfully!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Failed to save recipe');
    }
  };

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
      );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-lg p-8 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-2xl">
              <ChefHat className="text-orange-600 dark:text-orange-500" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-stone-800 dark:text-stone-100">
                {isEditing ? 'Edit Recipe' : 'Add New Recipe'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Recipe Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Description *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Images (First is Cover)</label>
                
                {/* Image List */}
                <div className="flex gap-2 overflow-x-auto pb-2 mb-2 min-h-[100px] bg-stone-50 dark:bg-stone-800/50 rounded-xl p-2 border border-dashed border-stone-300 dark:border-stone-700">
                  {formData.images.length === 0 && (
                      <div className="w-full flex items-center justify-center text-stone-400 text-sm">No images added</div>
                  )}
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden group">
                      <img src={img} alt={`Recipe ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                      >
                        <Trash2 size={16} />
                      </button>
                      {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-orange-500 text-white text-[10px] text-center font-bold">COVER</span>}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Paste image URL..."
                      className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                    />
                    <button
                      type="button"
                      onClick={addImageUrl}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-orange-500"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  
                  <label className="flex items-center justify-center px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded-xl cursor-pointer hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors">
                    <Upload size={20} />
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    <div className="flex items-center gap-1"><Clock size={16}/> Prep Time (min)</div>
                </label>
                <input
                  type="number"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleChange}
                  placeholder="e.g. 15"
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    <div className="flex items-center gap-1"><ChefHat size={16}/> Cook Time (min)</div>
                </label>
                <input
                  type="number"
                  name="cookTime"
                  value={formData.cookTime}
                  onChange={handleChange}
                  placeholder="e.g. 15"
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    <div className="flex items-center gap-1"><Flame size={16}/> Total Time (min) *</div>
                </label>
                <input
                  type="number"
                  name="timeMinutes"
                  value={formData.timeMinutes}
                  onChange={handleChange}
                  placeholder="e.g. 30"
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
                    <div className="flex items-center gap-1"><Users size={16}/> Servings</div>
                </label>
                <input
                  type="number"
                  name="servings"
                  value={formData.servings}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Seafood">Seafood</option>
                  <option value="Appetizer">Appetizer</option>
                  <option value="Soup">Soup</option>
                  <option value="Salad">Salad</option>
                </select>
              </div>
            </div>

            {/* Video & Cuisine */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2 flex items-center gap-2">
                    <Play size={16} className="text-red-500" /> Video URL (YouTube/Direct)
                </label>
                <input
                  type="text"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleChange}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">🌍 Cuisine</label>
                <select
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                >
                  <option value="General">General</option>
                  <option value="Indian">Indian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Italian">Italian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Thai">Thai</option>
                  <option value="French">French</option>
                  <option value="Korean">Korean</option>
                  <option value="American">American</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="Middle Eastern">Middle Eastern</option>
                  <option value="African">African</option>
                  <option value="British">British</option>
                  <option value="Spanish">Spanish</option>
                  <option value="Vietnamese">Vietnamese</option>
                  <option value="Greek">Greek</option>
                  <option value="Caribbean">Caribbean</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* AI & Nutrition Details */}
            <div className="space-y-4">
                <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-2">
                            <Sparkles size={20} /> AI Nutrition Calculator
                        </h3>
                        <button
                            type="button"
                            onClick={handleAIAnalysis}
                            disabled={isAnalyzing}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
                        >
                            {isAnalyzing ? 'Analyzing...' : 'Auto-Calculate Details'}
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wider">Calories</label>
                            <input
                                type="number"
                                name="calories"
                                value={formData.calories}
                                onChange={handleChange}
                                placeholder="450"
                                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wider">Protein (g)</label>
                            <input
                                type="text"
                                value={formData.nutrition.protein}
                                onChange={(e) => handleNutritionChange('protein', e.target.value)}
                                placeholder="25"
                                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wider">Carbs (g)</label>
                            <input
                                type="text"
                                value={formData.nutrition.carbs}
                                onChange={(e) => handleNutritionChange('carbs', e.target.value)}
                                placeholder="50"
                                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wider">Fat (g)</label>
                            <input
                                type="text"
                                value={formData.nutrition.fat}
                                onChange={(e) => handleNutritionChange('fat', e.target.value)}
                                placeholder="15"
                                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wider">Fiber (g)</label>
                            <input
                                type="text"
                                value={formData.nutrition.fiber}
                                onChange={(e) => handleNutritionChange('fiber', e.target.value)}
                                placeholder="5"
                                className="w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Stats Editing */}
            {user && user.isAdmin && (
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart2 size={20} className="text-blue-600 dark:text-blue-400" />
                        <h3 className="font-bold text-blue-900 dark:text-blue-300">Admin Stats Control</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Total Views</label>
                            <input
                                type="number"
                                name="views"
                                value={formData.views}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Total Likes</label>
                            <input
                                type="number"
                                name="likesCount"
                                value={formData.likesCount}
                                onChange={handleChange}
                                className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Dietary Tags */}
            <div>
                <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-3">Dietary Preferences</label>
                <div className="flex flex-wrap gap-3">
                    {dietaryOptions.map(tag => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => toggleDietaryTag(tag)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                formData.dietaryTags.includes(tag)
                                    ? 'bg-green-500 text-white'
                                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Ingredients *</label>
              <div className="space-y-2">
                {formData.ingredients.map((ingredient, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <input
                      type="number"
                      value={ingredient.quantity}
                      onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                      placeholder="Qty"
                      className="w-20 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                    />
                    <input
                      type="text"
                      value={ingredient.unit}
                      onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                      placeholder="Unit (e.g. cup)"
                      className="w-32 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                    />
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      placeholder="Ingredient name"
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                      required
                    />
                    {formData.ingredients.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeIngredient(index)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addIngredient}
                className="mt-3 px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors text-sm flex items-center gap-2"
              >
                <Plus size={16} /> Add Ingredient
              </button>
            </div>

            {/* Steps */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Steps *</label>
              <div className="space-y-4">
                {formData.steps.map((step, index) => (
                  <div key={index} className="flex gap-3 items-start p-4 bg-stone-50 dark:bg-stone-800/50 rounded-xl border border-stone-100 dark:border-stone-800">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-stone-800 dark:bg-stone-700 text-white flex items-center justify-center font-bold text-sm mt-1">
                      {index + 1}
                    </span>
                    <div className="flex-1 space-y-2">
                        <textarea
                            value={step.text}
                            onChange={(e) => handleStepChange(index, 'text', e.target.value)}
                            placeholder="Describe this step..."
                            rows="2"
                            className="w-full px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                            required
                        />
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-stone-400"/>
                            <input
                                type="number"
                                value={step.timeMinutes}
                                onChange={(e) => handleStepChange(index, 'timeMinutes', e.target.value)}
                                placeholder="Time (min)"
                                className="w-24 px-3 py-1 text-sm rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                            />
                        </div>
                    </div>
                    {formData.steps.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeStep(index)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addStep}
                className="mt-3 px-4 py-2 bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors text-sm flex items-center gap-2"
              >
                <Plus size={16} /> Add Step
              </button>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add a tag..."
                  className="flex-1 px-4 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 outline-none"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 rounded-full text-sm flex items-center gap-2">
                    {tag}
                    <X size={14} className="cursor-pointer" onClick={() => removeTag(tag)} />
                  </span>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors"
              >
                {isEditing ? 'Update Recipe' : 'Create Recipe'}
              </button>
              <button
                type="button"
                onClick={() => navigate(isEditing ? '/admin/recipes' : '/')}
                className="px-6 py-3 border border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 font-bold rounded-xl hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
    </div>
  );
};

export default AddRecipe;
