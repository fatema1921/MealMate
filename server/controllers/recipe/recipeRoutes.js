const express = require('express');
const router = express.Router();

const recipeController = require('./recipeController'); // Import the recipe controller

// Define recipe routes
router.get('/', recipeController.getAll); // Get all 
router.get('/:id', recipeController.getRecipe); // Get a single recipe by ID
router.post('/', recipeController.createRecipe); // Create a new recipe
router.put('/:id', recipeController.updateRecipe); // Update a recipe by ID
router.delete('//:id', recipeController.deleteRecipe); // Delete a recipe by ID
router.get('/ingredients/:ingredient_id/', recipeController.getByIngredient);// Retrieve  by using an ingridient 
router.patch('/:id', recipeController.patchRecipe); //  Update some fields for a specific recipe

// Fetch  from TheMealAPI
router.get('/search/:recipe', recipeController.searchRecipe);

router.get('/:recipeId/ingredients/:ingredientId', recipeController.getIngredientById);

router.delete('/:recipeId/ingredients/:ingredientId', recipeController.deleteIngredientById);

module.exports = router;
