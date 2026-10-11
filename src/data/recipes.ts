export interface Recipe {
  id: number;
  title: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'drinks';
  time: string;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  emoji: string;
  description: string;
  ingredients: string[];
  steps: string[];
  tags: string[];
}

export const recipes: Recipe[] = [
  {
    id: 1,
    title: "Morning Honey Oatmeal",
    category: "breakfast",
    time: "15 min",
    servings: 2,
    difficulty: "easy",
    emoji: "🥣",
    description: "A warm, comforting bowl of oats drizzled with golden honey and topped with fresh berries.",
    ingredients: ["1 cup rolled oats", "2 cups milk", "2 tbsp honey", "1/2 cup mixed berries", "1 tbsp chia seeds", "Pinch of cinnamon"],
    steps: ["Bring milk to a gentle simmer in a saucepan", "Add oats and stir continuously for 5 minutes", "Remove from heat and stir in honey and cinnamon", "Pour into bowls and top with berries and chia seeds"],
    tags: ["healthy", "quick", "comforting"]
  },
  {
    id: 2,
    title: "Garden Herb Frittata",
    category: "breakfast",
    time: "25 min",
    servings: 4,
    difficulty: "medium",
    emoji: "🍳",
    description: "A fluffy egg dish bursting with fresh garden herbs and melted cheese.",
    ingredients: ["8 eggs", "1/4 cup cream", "2 tbsp fresh basil", "1 tbsp fresh thyme", "1/2 cup goat cheese", "1/4 cup sun-dried tomatoes"],
    steps: ["Whisk eggs with cream, salt and pepper", "Sauté herbs and tomatoes in an oven-safe pan", "Pour egg mixture over the herbs", "Top with crumbled goat cheese", "Bake at 375°F for 15 minutes until set"],
    tags: ["vegetarian", "elegant", "herbs"]
  },
  {
    id: 3,
    title: "Rustic Tomato Soup",
    category: "lunch",
    time: "40 min",
    servings: 6,
    difficulty: "easy",
    emoji: "🍅",
    description: "A velvety tomato soup made with roasted tomatoes and a hint of basil cream.",
    ingredients: ["2 lbs ripe tomatoes", "1 onion, diced", "4 cloves garlic", "2 cups vegetable broth", "Fresh basil leaves", "1/4 cup heavy cream"],
    steps: ["Roast tomatoes and garlic at 400°F for 20 minutes", "Sauté onion until translucent", "Add roasted tomatoes and broth, simmer 10 minutes", "Blend until smooth and stir in cream", "Garnish with fresh basil"],
    tags: ["comforting", "vegetarian", "warm"]
  },
  {
    id: 4,
    title: "Mediterranean Grain Bowl",
    category: "lunch",
    time: "30 min",
    servings: 2,
    difficulty: "easy",
    emoji: "🥗",
    description: "A colorful bowl of farro, roasted vegetables, and tangy feta with lemon dressing.",
    ingredients: ["1 cup cooked farro", "1 cucumber, diced", "1 cup cherry tomatoes", "1/2 cup kalamata olives", "1/3 cup feta cheese", "Lemon-herb vinaigrette"],
    steps: ["Cook farro according to package directions", "Dice cucumber and halve tomatoes", "Combine grains with vegetables and olives", "Crumble feta on top", "Drizzle with lemon-herb vinaigrette"],
    tags: ["healthy", "fresh", "mediterranean"]
  },
  {
    id: 5,
    title: "Honey Glazed Salmon",
    category: "dinner",
    time: "35 min",
    servings: 4,
    difficulty: "medium",
    emoji: "🐟",
    description: "Perfectly glazed salmon fillets with a sweet and savory honey-soy coating.",
    ingredients: ["4 salmon fillets", "3 tbsp honey", "2 tbsp soy sauce", "1 tbsp rice vinegar", "2 cloves garlic, minced", "1 tsp fresh ginger"],
    steps: ["Mix honey, soy sauce, vinegar, garlic and ginger", "Place salmon on a lined baking sheet", "Brush generously with glaze", "Bake at 400°F for 12-15 minutes", "Brush with remaining glaze before serving"],
    tags: ["seafood", "protein", "quick"]
  },
  {
    id: 6,
    title: "Wild Mushroom Risotto",
    category: "dinner",
    time: "50 min",
    servings: 4,
    difficulty: "hard",
    emoji: "🍄",
    description: "Creamy arborio rice slowly stirred with a medley of wild mushrooms and parmesan.",
    ingredients: ["1.5 cups arborio rice", "3 cups mixed mushrooms", "4 cups warm broth", "1/2 cup white wine", "1/2 cup parmesan", "2 tbsp butter"],
    steps: ["Sauté mushrooms until golden, set aside", "Toast rice in butter for 2 minutes", "Add wine and stir until absorbed", "Add broth one ladle at a time, stirring constantly", "Fold in mushrooms and parmesan at the end"],
    tags: ["italian", "comforting", "elegant"]
  },
  {
    id: 7,
    title: "Lavender Crème Brûlée",
    category: "dessert",
    time: "60 min",
    servings: 4,
    difficulty: "hard",
    emoji: "🍮",
    description: "A delicate custard infused with dried lavender, topped with a crackling caramel shell.",
    ingredients: ["2 cups heavy cream", "1 tbsp dried lavender", "5 egg yolks", "1/2 cup sugar", "1 tsp vanilla extract", "Extra sugar for topping"],
    steps: ["Heat cream with lavender, steep for 15 minutes", "Whisk yolks with sugar until pale", "Strain cream and slowly whisk into yolks", "Pour into ramekins, bake in water bath at 325°F for 40 min", "Chill, then torch sugar on top before serving"],
    tags: ["french", "elegant", "floral"]
  },
  {
    id: 8,
    title: "Spiced Apple Tart",
    category: "dessert",
    time: "55 min",
    servings: 8,
    difficulty: "medium",
    emoji: "🍎",
    description: "A rustic tart filled with cinnamon-spiced apples on buttery flaky pastry.",
    ingredients: ["1 sheet puff pastry", "4 apples, thinly sliced", "3 tbsp brown sugar", "1 tsp cinnamon", "2 tbsp butter", "1 egg for wash"],
    steps: ["Roll out pastry and place on baking sheet", "Toss apples with sugar, cinnamon and melted butter", "Arrange apple slices in a fan pattern on pastry", "Fold edges over and brush with egg wash", "Bake at 400°F for 25-30 minutes until golden"],
    tags: ["autumn", "rustic", "comforting"]
  },
  {
    id: 9,
    title: "Rose Petal Lemonade",
    category: "drinks",
    time: "10 min",
    servings: 4,
    difficulty: "easy",
    emoji: "🌹",
    description: "A refreshing pink lemonade delicately flavored with rose water and fresh mint.",
    ingredients: ["4 lemons, juiced", "1/3 cup sugar", "1 tsp rose water", "4 cups cold water", "Fresh rose petals", "Mint leaves"],
    steps: ["Make a simple syrup with sugar and 1 cup warm water", "Squeeze lemons and strain the juice", "Combine lemon juice, syrup, rose water and cold water", "Pour over ice and garnish with rose petals and mint"],
    tags: ["refreshing", "floral", "summer"]
  },
  {
    id: 10,
    title: "Golden Turmeric Latte",
    category: "drinks",
    time: "10 min",
    servings: 1,
    difficulty: "easy",
    emoji: "☕",
    description: "A warming, golden milk with turmeric, ginger, and a touch of black pepper.",
    ingredients: ["1 cup oat milk", "1 tsp turmeric", "1/2 tsp cinnamon", "1/4 tsp ginger", "Pinch of black pepper", "1 tbsp maple syrup"],
    steps: ["Warm oat milk in a saucepan over medium heat", "Whisk in turmeric, cinnamon, ginger and pepper", "Simmer gently for 3 minutes", "Sweeten with maple syrup", "Pour into your favorite mug and enjoy"],
    tags: ["warming", "healthy", "spiced"]
  },
  {
    id: 11,
    title: "Avocado Toast Deluxe",
    category: "breakfast",
    time: "10 min",
    servings: 2,
    difficulty: "easy",
    emoji: "🥑",
    description: "Crispy sourdough topped with smashed avocado, everything seasoning, and a poached egg.",
    ingredients: ["2 slices sourdough bread", "1 ripe avocado", "2 eggs", "Everything bagel seasoning", "Red pepper flakes", "Lemon juice"],
    steps: ["Toast sourdough until golden and crispy", "Mash avocado with lemon juice and salt", "Poach eggs in simmering water for 3 minutes", "Spread avocado on toast", "Top with poached egg and seasonings"],
    tags: ["quick", "trendy", "protein"]
  },
  {
    id: 12,
    title: "Basil Pesto Pasta",
    category: "dinner",
    time: "20 min",
    servings: 4,
    difficulty: "easy",
    emoji: "🌿",
    description: "Fresh basil pesto tossed with al dente pasta, pine nuts, and shaved parmesan.",
    ingredients: ["1 lb spaghetti", "2 cups fresh basil", "1/3 cup pine nuts", "2 cloves garlic", "1/2 cup olive oil", "1/2 cup parmesan"],
    steps: ["Cook pasta in salted water until al dente", "Blend basil, pine nuts, garlic and olive oil", "Toss hot pasta with pesto", "Top with shaved parmesan and extra basil"],
    tags: ["italian", "quick", "fresh"]
  }
];

export const categories = [
  { id: 'all', label: 'All Recipes', emoji: '📖' },
  { id: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { id: 'lunch', label: 'Lunch', emoji: '☀️' },
  { id: 'dinner', label: 'Dinner', emoji: '🌙' },
  { id: 'dessert', label: 'Desserts', emoji: '🍰' },
  { id: 'drinks', label: 'Drinks', emoji: '🍵' },
];
