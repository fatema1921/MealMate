const express = require('express');
const router = express.Router();
const recipeController = require('./recipeController'); // Import the recipe controller

// Define recipe routes
router.get('/recipes', recipeController.getAllRecipes); // Get all recipes
router.get('/recipes/:id', recipeController.getRecipe); // Get a single recipe by ID
router.post('/recipes', recipeController.createRecipe); // Create a new recipe
router.put('/recipes/:id', recipeController.updateRecipe); // Update a recipe by ID
router.delete('/recipes/:id', recipeController.deleteRecipe); // Delete a recipe by ID

// Add an ingredient to a recipe
router.post('/recipes/:id/ingredients', recipeController.addIngredientToRecipe);

// Get all ingredients of a recipe
router.get('/recipes/:id/ingredients', recipeController.getIngredientsOfRecipe);

// Get a specific ingredient of a recipe by ingredientId
router.get('/recipes/:recipeId/ingredients/:ingredientId', recipeController.getIngredientById);

// Delete a specific ingredient from a recipe by ingredientId
router.delete('/recipes/:recipeId/ingredients/:ingredientId', recipeController.deleteIngredientById);

module.exports = router;
