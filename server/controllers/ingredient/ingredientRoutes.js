const express = require('express');
const ingredientController = require('./ingredientController');
const router = express.Router();

// POST create a new ingredient
router.post('/ingredients', ingredientController.createIngredient);

// GET all ingredients
router.get('/ingredients', ingredientController.getAllIngredients);

// GET specific ingredient
router.get('/ingredients/:id', ingredientController.getIngredientById);

// PUT Update a specific ingredient
router.put('/ingredients/:id', ingredientController.updateIngredient);

// PATCH partially update a specific ingredient
router.patch('/ingredients/:id', ingredientController.patchIngredient);

// DELETE a specific ingredient
router.delete('/ingredients/:id', ingredientController.deleteIngredient);

// GET recipes with a specific ingredient ID
router.get('/ingredients/:id/recipes', ingredientController.getRecipesByIngredientId);

module.exports = router;