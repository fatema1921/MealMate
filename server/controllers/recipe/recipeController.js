const Recipe = require('../../models/recipe');
const Ingredient = require('../../models/ingredient'); 
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const OAuth = require('oauth-1.0a');
const crypto = require('crypto');

// Import TheMealDB API 
const express = require('express'); 
const axios = require('axios');

// Display all recipes with optional search and filtering
exports.getAllRecipes = async (req, res, next) => {
    try {
        const { search, category } = req.query; // Get query parameters from the request
        let query = {};

        // Search recipes with names that match the search query (case-insensitive)
        if (search) {
            query.name = { $regex: search, $options: 'i' }; // Search by name using regular expression
        }

        // Filter by meal category if provided
        if (category) {
            query.meal_category = {$regex: category, $options: 'i' }; // Filter by category
        }

        // Fetch the recipes from the MongoDB
        const recipeList = await Recipe.find(query).populate('ingredients');

        if (!recipeList || recipeList.length === 0) {
            return res.status(404).json({ message: "No recipes found" });
        }

        res.json(recipeList); // Return the filtered or searched recipes as a JSON response
    } catch (error) {
        console.error('Error fetching recipes:', error);
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

// Get all recipes with a specific ingredient
exports.getRecipesByIngredient = async (req, res, next) => {
    try {
        const ingredientId = req.params.ingredientId.trim(); // Trim to avoid castError in the ingredient id

        // Find all recipes that include the ingredient
        const recipes = await Recipe.find({ ingredients: ingredientId }).populate('ingredients');

        if (!recipes || recipes.length === 0) {
            console.log(recipes);
            console.log(ingredientId);
            return res.status(404).json({ message: "No recipes found with this ingredient" });
        }

        res.json(recipes);
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
            meal_category: req.body.meal_category,
            ingredients: req.body.ingredients,
            prepTime: req.body.prepTime || '0',
            userMade: req.body.userMade || false
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
            ingredients: req.body.ingredients,
            prepTime: req.body.prepTime || '0',
            userMade: req.body.userMade || false
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
        res.status(204).json({message: "Recipe deleted."});
    } catch (error) {
        next(error);
    }
};

// Partial update of a recipe
exports.patchRecipe = async (req, res, next) => {
    try {
        // Find the recipe by ID
        const recipe = await Recipe.findById(req.params.id);
        
        // Check if the recipe exists
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        // Update the fields provided in the request body
        Object.assign(recipe, req.body);

        await recipe.save();

        res.json({ message: "Recipe updated", recipe });

    } catch (error) {
        console.error('Error updating this recipe:', error);
        next(error);
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

// Add a specific ingredient to a specific recipe
exports.addIngredientToRecipe = async (req, res) => {
    try {
        const { recipeId, ingredientId } = req.params;

        // Find the recipe by ID
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Check if the ingredient exists
        const ingredient = await Ingredient.findById(ingredientId);
        if (!ingredient) {
            return res.status(404).json({ error: 'Ingredient not found' });
        }

        // Check if the ingredient is already in the recipe
        if (recipe.ingredients.includes(ingredientId)) {
            return res.status(400).json({ error: 'Ingredient already added' });
        }

        // Add the ingredient to the recipe
        recipe.ingredients.push(ingredientId);
        await recipe.save();

        return res.status(200).json(recipe);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

exports.deleteIngredientById = async (req, res) => {
    try {
        const { recipeId, ingredientId } = req.params;
        
        // Find the recipe by ID
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Check if the ingredient exists in the recipe
        if (!recipe.ingredients.includes(ingredientId)) {
            return res.status(404).json({ error: 'Ingredient not found in this recipe' });
        }

        // Remove the ingredient from the recipe
        recipe.ingredients.pull(ingredientId);
        await recipe.save();

        res.status(200).json({ message: 'Ingredient deleted.' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};