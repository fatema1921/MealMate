const Ingredient = require ('../../models/ingredient');
const Recipe = require ('../../models/recipe');

// Create ingredient (POST)
exports.createIngredient = async (req, res) => {
    const ingredient = new Ingredient({
        name: req.body.name,
        calories: req.body.calories,
        shopping_list: req.body.shopping_list
    });

    try {
        const newIngredient = await ingredient.save();
        res.status(201).json(newIngredient);
    } catch (err) {
        let errorMessage;

        if (err.name === 'ValidationError') {
            errorMessage = 'Validation failed. Some required fields are missing or incorrectly filled out.';
        } else {
            errorMessage = 'An error occurred while creating the ingredient.';
        }
        res.status(400).json({ message: errorMessage });
    }
};

// Get ALL ingredients (GET)
exports.getAllIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.find();
        res.status(200).json(ingredients);
    } catch (err) {
        let errorMessage;

        errorMessage = 'An error occurred while getting ingredients.';

        res.status(500).json({ message: errorMessage });
    }
};

// Get a specific ingredient (GET :id)
exports.getIngredientById = async (req, res) => {
    const ingredientId = req.params.id;

    try {
        const ingredient = await Ingredient.findById(ingredientId);

        if (!ingredient) {
            return res.status(404).json({ message: 'Ingredient not found.' });
        }

        res.status(200).json(ingredient);
    } catch (err) {
        let errorMessage;

        if (err.kind === 'ObjectId') {
            errorMessage = 'Invalid ingredient ID.';
        } else {
            errorMessage = 'An error occurred while getting the ingredient.';
        }

        res.status(500).json({ message: errorMessage });
    }
};

// Update a specific ingredient by ID (PUT :id)
exports.updateIngredient = async (req, res) => {
    const ingredientId = req.params.id;
    const updatedData = {
        name: req.body.name,
        calories: req.body.calories,
        shopping_list: req.body.shopping_list
    };

    try {

        const ingredient = new Ingredient(updatedData);

        // Validate the new data against schema
        await ingredient.validate();

        // Replace the entire document with new data
        const updatedIngredient = await Ingredient.findByIdAndUpdate(ingredientId, updatedData, {
            new: true,
        });

        if (!updatedIngredient) {
            return res.status(404).json({ message: 'Ingredient not found.' });
        }

        res.status(200).json(updatedIngredient);
    } catch (err) {
        let errorMessage;

        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            errorMessage = 'Invalid ingredient ID.';
        } else if (err.name === 'ValidationError') {
            errorMessage = 'Validation failed. Some required fields are missing or incorrectly filled out.';
        } else {
            errorMessage = 'An error occurred while updating the ingredient.';
        }

        res.status(500).json({ message: errorMessage });
    }
};

// Partial update (PATCH :id)
exports.patchIngredient = async (req, res) => {
    const ingredientId = req.params.id;
    const updates = req.body;

    try {
        const ingredient = await Ingredient.findById(ingredientId);

        if (!ingredient) {
            return res.status(404).json({ message: 'Ingredient not found.' });
        }

        Object.assign(ingredient, updates);

        // Validate the new data against schema
        await ingredient.validate();

        // Save the updated ingredient
        const updatedIngredient = await ingredient.save();

        res.status(200).json(updatedIngredient);
    } catch (err) {
        let errorMessage;

        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            errorMessage = 'Invalid ingredient ID.';
        } else if (err.name === 'ValidationError') {
            errorMessage = 'Validation failed. Some required fields are missing or incorrectly filled out.';
        } else {
            errorMessage = 'An error occurred while updating the ingredient.';
        }

        res.status(500).json({ message: errorMessage });
    }
};

// Delete by ID (DELETE :id)
exports.deleteIngredient = async (req, res) => {
    const ingredientId = req.params.id;

    try {
        // Find and delete the ingredient by ID
        const result = await Ingredient.findByIdAndDelete(ingredientId);

        if (!result) {
            return res.status(404).json({ message: 'Ingredient not found.' });
        }

        res.status(200).json({ message: 'Ingredient deleted.' });
    } catch (err) {
        let errorMessage;

        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            errorMessage = 'Invalid ingredient ID.';
        } else {
            errorMessage = 'An error occurred while deleting the ingredient.';
        }

        res.status(500).json({ message: errorMessage });
    }
};

// Get recipes with a specific ingredient ID (GET)
exports.getRecipesByIngredientId = async (req, res) => {
    const ingredientId = req.params.id;

    try {
        const recipes = await Recipe.find({ ingredients: ingredientId });

        if (recipes.length === 0) {
            return res.status(404).json({ message: 'No recipes found for this ingredient.' });
        }

        res.status(200).json(recipes);
    } catch (err) {
        let errorMessage;

        if (err.name === 'CastError' && err.kind === 'ObjectId') {
            errorMessage = 'Invalid ingredient ID.';
        } else {
            errorMessage = 'An error occurred while retrieving recipes.';
        }

        res.status(500).json({ message: errorMessage });
    }
};





