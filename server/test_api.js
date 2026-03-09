const API_URL = 'http://localhost:5000/api';

async function test() {
    try {
        console.log('1. Logging in as demo_chef...');
        const resA = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'demo@cookbook.com', password: 'password123' })
        });
        const dataA = await resA.json();
        if (!resA.ok) throw new Error(`Login A failed: ${JSON.stringify(dataA)}`);
        const tokenA = dataA.token;
        console.log('   Success. Token A obtained.');

        console.log('2. Logging in as admin...');
        const resB = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@cookbook.com', password: 'password123' })
        });
        const dataB = await resB.json();
        if (!resB.ok) throw new Error(`Login B failed: ${JSON.stringify(dataB)}`);
        const tokenB = dataB.token;
        console.log('   Success. Token B obtained.');

        console.log('3. Creating recipe as demo_chef...');
        const recipeData = {
            title: 'Test Notification Recipe ' + Date.now(),
            description: 'Testing notifications',
            ingredients: [{ name: 'Test', quantity: 1, unit: 'pc' }],
            steps: [{ text: 'Test step' }],
            timeMinutes: 10,
            isPublic: true
        };
        const resRecipe = await fetch(`${API_URL}/recipes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenA}`
            },
            body: JSON.stringify(recipeData)
        });
        const dataRecipe = await resRecipe.json();
        if (!resRecipe.ok) throw new Error(`Create Recipe failed: ${JSON.stringify(dataRecipe)}`);
        const recipeId = dataRecipe._id;
        console.log(`   Success. Recipe ID: ${recipeId}`);

        console.log('4. Liking recipe as admin...');
        const resLike = await fetch(`${API_URL}/recipes/${recipeId}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenB}`
            }
        });
        const dataLike = await resLike.json();
        if (!resLike.ok) throw new Error(`Like failed: ${JSON.stringify(dataLike)}`);
        console.log('   Success. Like response:', dataLike);

        console.log('DONE. Check debug.log and database.');

    } catch (error) {
        console.error('TEST FAILED:', error.message);
        if (error.cause) console.error(error.cause);
    }
}

test();
