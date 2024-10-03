const express = require('express');
const ingredientController = require('./ingredientController');
const router = express.Router();

// POST create a new ingredient
router.post('/', ingredientController.createIngredient);

// GET all 
router.get('/', ingredientController.getAllIngredients);

// GET specific ingredient
router.get('/:id', ingredientController.getIngredientById);

// PUT Update a specific ingredient
router.put('/:id', ingredientController.updateIngredient);

// PATCH partially update a specific ingredient
router.patch('/:id', ingredientController.patchIngredient);

// DELETE a specific ingredient
router.delete('/:id', ingredientController.deleteIngredient);

// GET recipes with a specific ingredient ID
router.get('/:id/recipes', ingredientController.getRecipesByIngredientId);

module.exports = router;