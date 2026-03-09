const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Recipe = require('./models/Recipe');
const Thought = require('./models/Thought');
const bcrypt = require('bcryptjs');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const seedData = async (shouldExit = true) => {
  try {
    // Only connect if not already connected
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    // Clear existing data
    await User.deleteMany({});
    await Recipe.deleteMany({});
    await Thought.deleteMany({});

    // Create a demo user and admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const demoUser = await User.create({
      username: 'demo_chef',
      email: 'demo@cookbook.com',
      password: hashedPassword,
    });

    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@cookbook.com',
      password: hashedPassword,
    });

    console.log('Users created:');
    console.log('- Demo User:', demoUser.email);
    console.log('- Admin User:', adminUser.email);

    // Create thoughts of the day
    const thoughts = [
      {
        text: 'Cooking is love made visible.',
        author: 'Anonymous'
      },
      {
        text: 'The only time to eat diet food is while you\'re waiting for the steak to cook.',
        author: 'Julia Child'
      },
      {
        text: 'People who love to eat are always the best people.',
        author: 'Julia Child'
      },
      {
        text: 'Cooking is like painting or writing a song. Just as there are only so many notes or colors, there are only so many flavors - it\'s how you combine them that sets you apart.',
        author: 'Wolfgang Puck'
      },
      {
        text: 'Good food is the foundation of genuine happiness.',
        author: 'Auguste Escoffier'
      },
      {
        text: 'One cannot think well, love well, sleep well, if one has not dined well.',
        author: 'Virginia Woolf'
      },
      {
        text: 'Cooking is all about people. Food is maybe the only universal thing that really has the power to bring everyone together.',
        author: 'Guy Fieri'
      },
      {
        text: 'The kitchen is where we deal with the elements of the universe. It is where we come to understand our past and ourselves.',
        author: 'Laura Esquivel'
      },
      {
        text: 'If you\'re afraid of butter, use cream.',
        author: 'Julia Child'
      },
      {
        text: 'Cooking requires confident guesswork and improvisation - experimentation and substitution, dealing with failure and uncertainty in a creative way.',
        author: 'Paul Theroux'
      }
    ];

    const createdThoughts = await Thought.insertMany(thoughts);
    console.log(`${createdThoughts.length} thoughts created!`);

    // Create 15 diverse recipes
    const recipes = [
      // BREAKFAST
      {
        user: demoUser._id,
        title: 'Classic Fluffy Pancakes',
        description: 'Light, fluffy pancakes perfect for a weekend breakfast. Serve with maple syrup and fresh berries.',
        time: '25 min',
        difficulty: 'Easy',
        calories: '350',
        category: 'Breakfast',
        tags: ['Breakfast', 'Sweet', 'Kid-Friendly'],
        image: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ingredients: [
          '2 cups All-purpose flour',
          '2 tbsp Sugar',
          '2 tsp Baking powder',
          '1/2 tsp Salt',
          '1 1/2 cups Milk',
          '2 Large eggs',
          '2 tbsp Melted butter'
        ],
        instructions: [
          'In a large bowl, whisk together flour, sugar, baking powder, and salt.',
          'In another bowl, beat the milk, eggs, and melted butter.',
          'Pour the wet mixture into the dry ingredients and stir until just combined (lumps are okay).',
          'Heat a griddle over medium heat and grease lightly.',
          'Pour 1/4 cup batter for each pancake. Cook until bubbles form, then flip and cook until golden brown.'
        ],
        rating: 4.8
      },
      {
        user: demoUser._id,
        title: 'Avocado Toast with Poached Egg',
        description: 'Creamy avocado on crispy sourdough topped with a perfectly poached egg.',
        time: '10 min',
        difficulty: 'Medium',
        calories: '290',
        category: 'Breakfast',
        tags: ['Healthy', 'Breakfast', 'Quick'],
        dietaryTags: ['Vegetarian'],
        image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ingredients: [
          '1 slice Sourdough bread',
          '1/2 Ripe avocado',
          '1 Large egg',
          '1 tsp Lemon juice',
          'Salt, Pepper, Red pepper flakes'
        ],
        instructions: [
          'Toast the sourdough slice until golden.',
          'Mash the avocado with lemon juice, salt, and pepper. Spread over the toast.',
          'Bring a pot of water to a simmer. Create a vortex and drop the egg in; cook for 3-4 minutes.',
          'Place the poached egg on the toast and sprinkle with red pepper flakes.'
        ],
        rating: 4.6
      },
      {
        user: demoUser._id,
        title: 'Berry Banana Smoothie Bowl',
        description: 'A vibrant, nutritious vegan smoothie bowl packed with antioxidants.',
        time: '10 min',
        difficulty: 'Easy',
        calories: '220',
        category: 'Breakfast',
        tags: ['Vegan', 'Healthy', 'Quick'],
        dietaryTags: ['Vegetarian', 'Vegan'],
        image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ingredients: [
          '1 Frozen banana',
          '1 cup Frozen mixed berries',
          '1/2 cup Almond milk',
          '1 tbsp Chia seeds',
          'Toppings: Granola, fresh fruit'
        ],
        instructions: [
          'Blend banana, berries, and almond milk until smooth and thick.',
          'Pour into a bowl.',
          'Top with chia seeds, granola, and fresh fruit slices.'
        ],
        rating: 4.7
      },

      // LUNCH
      {
        user: demoUser._id,
        title: 'Chicken Caesar Salad',
        description: 'Classic Caesar salad with grilled chicken, crispy romaine, and homemade croutons.',
        time: '25 min',
        difficulty: 'Easy',
        calories: '450',
        category: 'Lunch',
        tags: ['Salad', 'Protein', 'Lunch'],
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ingredients: [
          '2 Chicken breasts',
          '1 head Romaine lettuce, chopped',
          '1/2 cup Parmesan cheese, shaved',
          '1 cup Croutons',
          '1/2 cup Caesar dressing'
        ],
        instructions: [
          'Season chicken breasts with salt and pepper. Pan-fry over medium heat for 5-6 minutes per side until cooked through. Slice into strips.',
          'In a large bowl, toss lettuce with Caesar dressing.',
          'Top with chicken, croutons, and parmesan cheese.'
        ],
        rating: 4.5
      },
      {
        user: demoUser._id,
        title: 'Roasted Tomato Basil Soup',
        description: 'Rich, creamy tomato soup made with roasted tomatoes and fresh basil.',
        time: '50 min',
        difficulty: 'Medium',
        calories: '180',
        category: 'Lunch',
        tags: ['Soup', 'Vegetarian', 'Comfort'],
        dietaryTags: ['Vegetarian'],
        image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ingredients: [
          '3 lbs Roma tomatoes, halved',
          '1 Onion, quartered',
          '4 Garlic cloves',
          '2 cups Vegetable broth',
          '1/2 cup Fresh basil'
        ],
        instructions: [
          'Preheat oven to 400°F (200°C).',
          'Place tomatoes, onion, and garlic on a baking sheet. Drizzle with olive oil, salt, and pepper. Roast for 40 minutes.',
          'Transfer roasted veggies to a blender. Add broth and basil.',
          'Blend until smooth. Serve hot.'
        ],
        rating: 4.8
      },
      {
        user: demoUser._id,
        title: 'Caprese Sandwich',
        description: 'Fresh mozzarella, tomatoes, and basil on ciabatta with balsamic glaze.',
        time: '10 min',
        difficulty: 'Easy',
        calories: '380',
        category: 'Lunch',
        tags: ['Vegetarian', 'Quick', 'Italian'],
        dietaryTags: ['Vegetarian'],
        image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ingredients: [
          '1 Ciabatta roll',
          '2 slices Fresh mozzarella',
          '1 Tomato, sliced',
          'Fresh basil leaves',
          '1 tbsp Balsamic glaze',
          '1 tbsp Pesto'
        ],
        instructions: [
          'Slice the roll open and spread pesto on one side.',
          'Layer tomato, mozzarella, and basil.',
          'Drizzle with balsamic glaze and close the sandwich.'
        ],
        rating: 4.4
      },

      // DINNER
      {
        user: adminUser._id,
        title: 'Spaghetti Carbonara',
        description: 'Authentic Italian carbonara with eggs, cheese, and crispy pancetta.',
        time: '25 min',
        difficulty: 'Hard',
        calories: '600',
        category: 'Dinner',
        tags: ['Italian', 'Pasta', 'Dinner'],
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ingredients: [
          '8 oz Spaghetti',
          '2 Large eggs',
          '1/2 cup Pecorino Romano cheese, grated',
          '4 oz Pancetta or Guanciale, cubed',
          'Black pepper'
        ],
        instructions: [
          'Boil pasta in salted water. Reserve 1/2 cup pasta water.',
          'Fry pancetta in a pan until crisp. Remove from heat.',
          'Whisk eggs and cheese in a bowl with plenty of pepper.',
          'Add hot pasta to the pancetta pan (off heat). Quickly mix in egg mixture, adding pasta water to create a creamy sauce without scrambling the eggs.'
        ],
        rating: 4.9
      },
      {
        user: adminUser._id,
        title: 'Chicken Tikka Masala',
        description: 'Tender chicken in a rich, creamy tomato-based curry sauce.',
        time: '60 min',
        difficulty: 'Medium',
        calories: '520',
        category: 'Dinner',
        tags: ['Indian', 'Curry', 'Spicy'],
        image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ingredients: [
          '1 lb Chicken breast, cubed',
          '1 cup Plain yogurt',
          '1 onion, diced',
          '1 can (14 oz) Tomato puree',
          '1 cup Heavy cream',
          'Spices: 2 tbsp Garam Masala, 1 tsp Cumin, 1 tsp Turmeric'
        ],
        instructions: [
          'Marinate chicken in yogurt and spices for at least 20 mins.',
          'Sear chicken in a pot; remove and set aside.',
          'Sauté onion in the same pot. Add spices and tomato puree. Simmer 10 mins.',
          'Stir in cream and return chicken to pot. Simmer 15 mins until chicken is cooked.'
        ],
        rating: 4.7
      },
      {
        user: adminUser._id,
        title: 'Beef Stir-Fry with Broccoli',
        description: 'Quick and flavorful Asian-style stir-fry with tender beef and crisp broccoli.',
        time: '25 min',
        difficulty: 'Easy',
        calories: '400',
        category: 'Dinner',
        tags: ['Asian', 'Quick', 'Healthy'],
        image: 'https://images.unsplash.com/photo-1603073513411-f8b7c8f08f5e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ingredients: [
          '1 lb Flank steak, thinly sliced',
          '2 cups Broccoli florets',
          '2 tbsp Soy sauce',
          '1 tbsp Oyster sauce',
          '1 tsp Ginger, minced',
          '1 tsp Garlic, minced'
        ],
        instructions: [
          'Whisk soy sauce, oyster sauce, ginger, and garlic.',
          'Stir-fry beef in a hot wok for 3 mins; remove.',
          'Stir-fry broccoli with a splash of water for 3 mins.',
          'Return beef and sauce to pan; toss to coat and serve.'
        ],
        rating: 4.6
      },
      {
        user: adminUser._id,
        title: 'Baked Salmon with Asparagus',
        description: 'Healthy one-pan meal with flaky salmon and roasted asparagus.',
        time: '20 min',
        difficulty: 'Easy',
        calories: '350',
        category: 'Dinner',
        tags: ['Healthy', 'Seafood', 'Quick'],
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a3a2750?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ingredients: [
          '2 Salmon fillets',
          '1 bunch Asparagus, trimmed',
          '2 tbsp Olive oil',
          '2 Lemon slices',
          'Dill, Salt, Pepper'
        ],
        instructions: [
          'Preheat oven to 400°F (200°C).',
          'Place salmon and asparagus on a foil-lined sheet.',
          'Drizzle with oil, season with herbs, and place lemon on fish.',
          'Bake for 12-15 minutes until salmon flakes easily.'
        ],
        rating: 4.8
      },
      {
        user: adminUser._id,
        title: 'Vegetable Lasagna',
        description: 'Hearty vegetarian lasagna loaded with fresh vegetables and cheese.',
        time: '90 min',
        difficulty: 'Hard',
        calories: '420',
        category: 'Dinner',
        tags: ['Vegetarian', 'Italian', 'Comfort'],
        dietaryTags: ['Vegetarian'],
        image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ingredients: [
          '12 Lasagna noodles',
          '2 cups Ricotta cheese',
          '3 cups Marinara sauce',
          '2 cups Spinach',
          '1 Zucchini, sliced',
          '2 cups Mozzarella cheese'
        ],
        instructions: [
          'Preheat oven to 375°F (190°C).',
          'Spread sauce on bottom of baking dish. Layer noodles, ricotta, spinach, zucchini, sauce, and mozzarella.',
          'Repeat layers. Top with remaining cheese.',
          'Cover with foil and bake 45 mins. Remove foil and bake 15 mins more.'
        ],
        rating: 4.7
      },
      {
        user: demoUser._id,
        title: 'Classic Beef Tacos',
        description: 'Traditional beef tacos with all your favorite toppings.',
        time: '25 min',
        difficulty: 'Easy',
        calories: '250',
        category: 'Dinner',
        tags: ['Mexican', 'Quick', 'Kid-Friendly'],
        image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ingredients: [
          '1 lb Ground beef',
          '1 packet Taco seasoning',
          '8 Hard taco shells',
          'Toppings: Lettuce, cheese, salsa, sour cream'
        ],
        instructions: [
          'Brown beef in a skillet; drain fat.',
          'Add taco seasoning and a splash of water. Simmer 5 mins.',
          'Warm taco shells in oven.',
          'Fill shells with meat and desired toppings.'
        ],
        rating: 4.5
      },

      // DESSERTS
      {
        user: demoUser._id,
        title: 'Chocolate Chip Cookies',
        description: 'Classic homemade chocolate chip cookies - crispy on the outside, chewy inside.',
        time: '25 min',
        difficulty: 'Medium',
        calories: '150',
        category: 'Dessert',
        tags: ['Dessert', 'Baking', 'Sweet'],
        image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ingredients: [
          '1 cup Butter, softened',
          '1 cup White sugar',
          '1 cup Brown sugar',
          '2 Eggs',
          '2 tsp Vanilla extract',
          '3 cups All-purpose flour',
          '1 tsp Baking soda',
          '2 cups Chocolate chips'
        ],
        instructions: [
          'Cream butter and sugars together until smooth.',
          'Beat in eggs and vanilla.',
          'Dissolve baking soda in hot water and add to batter. Stir in flour and chocolate chips.',
          'Drop spoonfuls onto baking sheet. Bake at 350°F (175°C) for 10 minutes.'
        ],
        rating: 4.9
      },
      {
        user: demoUser._id,
        title: 'Easy Banana Bread',
        description: 'Moist, flavorful banana bread perfect for breakfast or dessert.',
        time: '70 min',
        difficulty: 'Easy',
        calories: '190',
        category: 'Dessert',
        tags: ['Baking', 'Breakfast', 'Sweet'],
        image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ingredients: [
          '3 Ripe bananas, mashed',
          '1/3 cup Melted butter',
          '1 tsp Baking soda',
          'Pinch of salt',
          '3/4 cup Sugar',
          '1 Egg, beaten',
          '1 tsp Vanilla extract',
          '1 1/2 cups Flour'
        ],
        instructions: [
          'Preheat oven to 350°F (175°C). Butter a loaf pan.',
          'In a bowl, mix mashed bananas with melted butter.',
          'Mix in baking soda and salt. Stir in sugar, egg, and vanilla. Mix in flour.',
          'Pour into pan and bake for 1 hour.'
        ],
        rating: 4.8
      },
      {
        user: demoUser._id,
        title: 'No-Bake Cheesecake Cups',
        description: 'Individual no-bake cheesecake servings - easy and elegant.',
        time: '20 min',
        difficulty: 'Easy',
        calories: '280',
        category: 'Dessert',
        tags: ['Dessert', 'No-Bake', 'Easy'],
        image: 'https://images.unsplash.com/photo-1533134242820-f9d51e3e7e9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ingredients: [
          '1 cup Graham cracker crumbs',
          '4 tbsp Melted butter',
          '8 oz Cream cheese, softened',
          '1/4 cup Sugar',
          '1 tsp Lemon juice',
          '1 cup Whipped cream'
        ],
        instructions: [
          'Mix crumbs and butter. Press into the bottom of 6 jars/cups.',
          'Beat cream cheese, sugar, and lemon juice until smooth.',
          'Fold in whipped cream.',
          'Spoon over crust. Chill for 1 hour before serving.'
        ],
        rating: 4.7
      }
    ];

    // Combine with extra recipes
    const extraRecipesWithUser = require('./extraRecipes').map(r => ({
      ...r,
      user: demoUser._id
    }));

    const allRecipes = [...recipes, ...extraRecipesWithUser];

    const formattedRecipes = allRecipes.map(recipe => ({
      ...recipe,
      timeMinutes: parseInt(recipe.time) || 0,
      calories: parseInt(recipe.calories) || 0,
      ingredients: recipe.ingredients.map(ing => ({ name: ing })),
      steps: recipe.instructions.map(step => ({ text: step })),
    }));

    const createdRecipes = await Recipe.insertMany(formattedRecipes);
    console.log(`${createdRecipes.length} recipes created!`);

    console.log('\n✅ Database seeded successfully!');
    console.log('📧 Login credentials:');
    console.log('   Demo User: demo@cookbook.com / password123');
    console.log('   Admin User: admin@cookbook.com / password123');

    if (shouldExit) process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    if (shouldExit) process.exit(1);
  }
};

if (require.main === module) {
  seedData();
}

module.exports = seedData;

