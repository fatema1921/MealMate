const Recipe = require('../../models/recipe');

// Display all recipes
exports.getAllRecipes = async (req, res, next) => {
    try {
        const recipeList = await Recipe.find().populate('ingredients'); // Populate ingredients details
        res.json(recipeList); // Returns all the recipes as a JSON response
    } catch (error) {
        next(error);
    }
};

// Display information about a specific recipe
exports.getRecipe = async (req, res, next) => {
    try {
        const recipe = await Recipe.findById(req.params.id).populate('ingredients'); // Populate ingredients details
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.json(recipe);
    } catch (error) {
        next(error);
    }
};

// Create a new recipe
exports.createRecipe = async (req, res, next) => {
    try {
        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            meal_category: req.body.meal_category, // E.g., Vegan, Vegetarian, etc.
            ingredients: req.body.ingredients // Array of ObjectIds for ingredients
        });

        await newRecipe.save();
        res.status(201).json({ message: "New recipe created", newRecipe });
    } catch (error) {
        next(error);
    }
};

// Update an already existing recipe
exports.updateRecipe = async (req, res, next) => {
    try {
        const updatedRecipe = {
            name: req.body.name,
            description: req.body.description,
            meal_category: req.body.meal_category,
            ingredients: req.body.ingredients // Array of ObjectIds
        };

        const recipe = await Recipe.findByIdAndUpdate(req.params.id, updatedRecipe, { new: true }).populate('ingredients');
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.json(recipe); // Return the updated recipe
    } catch (error) {
        next(error);
    }
};

// Delete a recipe
exports.deleteRecipe = async (req, res, next) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id); // Delete recipe by ID
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.status(204).end(); // Respond with no content
    } catch (error) {
        next(error);
    }
};

// Add an ingredient to a recipe
exports.addIngredientToRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        const { name, quantity, unit } = req.body;

        // Validate if recipe exists
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Create new ingredient object
        const newIngredient = {
            _id: new mongoose.Types.ObjectId(),
            name,
            quantity,
            unit
        };

        // Add ingredient to the recipe's ingredients array
        recipe.ingredients.push(newIngredient);
        await recipe.save();

        res.status(201).json({
            message: 'Ingredient added successfully',
            ingredient: newIngredient
        });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

// Get all ingredients of a recipe
exports.getIngredientsOfRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;

        // Validate if recipe exists
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.status(200).json({
            ingredients: recipe.ingredients
        });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

// Get a specific ingredient by its ID
exports.getIngredientById = async (req, res) => {
    try {
        const { recipeId, ingredientId } = req.params;

        // Validate if recipe exists
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Find the ingredient within the recipe
        const ingredient = recipe.ingredients.id(ingredientId);
        if (!ingredient) {
            return res.status(404).json({ message: 'Ingredient not found' });
        }

        res.status(200).json({
            ingredient
        });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

// Delete a specific ingredient from a recipe
exports.deleteIngredientById = async (req, res) => {
    try {
        const { recipeId, ingredientId } = req.params;

        // Validate if recipe exists
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // Find the ingredient and remove it from the ingredients array
        const ingredient = recipe.ingredients.id(ingredientId);
        if (!ingredient) {
            return res.status(404).json({ message: 'Ingredient not found' });
        }

        ingredient.remove();
        await recipe.save();

        res.status(200).json({ message: 'Ingredient deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};
