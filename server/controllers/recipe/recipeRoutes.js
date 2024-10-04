const express = require('express');
const router = express.Router();

const recipeController = require('./recipeController'); // Import the recipe controller

// Fetch recipes from FatSecret API
router.get('/fetch-and-save', recipeController.fetchAndSaveRecipes);


// Define recipe routes
router.get('/', recipeController.getAllRecipes); // Get all recipes
router.get('/:id', recipeController.getRecipe); // Get a single recipe by ID
router.post('/', recipeController.createRecipe); // Create a new recipe
router.put('/:id', recipeController.updateRecipe); // Update a recipe by ID
router.delete('/:id', recipeController.deleteRecipe); // Delete a recipe by ID
router.post('/:recipeId/ingredients/:ingredientId', recipeController.addIngredientToRecipe); // Create post function.
router.get('/ingredients/:ingredientId', recipeController.getRecipesByIngredient); // Get by using an ingredient 
router.patch('/:id', recipeController.patchRecipe); //  Update some fields for a specific recipe


router.get('/:recipeId/ingredients/:ingredientId', recipeController.getIngredientById);

router.delete('/:recipeId/ingredients/:ingredientId', recipeController.deleteIngredientById);

module.exports = router;
