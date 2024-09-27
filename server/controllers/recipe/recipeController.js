const Recipe = require('../../models/recipe');
const Ingridient = require('../../models/ingredient'); 

// Import TheMealDB API 
const express = require('express');
const axios = require('axios'); 

// Search recipie in the external database 
exports.searchRecipe = async (req, res, next) => {
    const recipe = req.params.recipe; 
    const mealDB = `https://www.themealdb.com/api/json/v1/1/search.php?s=${recipe}`;
    
    try {
       const response = await axios.get(mealDB);
       const meals = response.data.meals; 

       if(!meals){
        return res.status(404).json ({"message": "Recepie not found"}); 
       }
       res.json(meals);

    } catch (error){
        console.error('Error fetching data from TheMealDB:', error);
        next(error); 
    }

}; 


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

// Get all recipes with a specific ingredient
exports.getRecipesByIngredient = async (req, res, next) => {
    try {
        const ingredientId = req.params.ingredient_id;

        // Find all recipes that include the ingredient
        const recipes = await Recipe.find({ ingredients: ingredientId }).populate('ingredients');

        if (!recipes || recipes.length === 0) {
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
            ingredients: req.body.ingredients 
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
            ingredients: req.body.ingredients 
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


