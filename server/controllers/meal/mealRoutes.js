const express = require('express');
const mealController = require('./mealController');
const router = express.Router();

// CRUD operations for Meal

// POST /meals - Create a new meal
router.post('/', mealController.createMeal);

// GET /meals - Retrieve all meals
router.get('/', mealController.getAllMeals);

// GET /meals/:id - Retrieve a specific meal by ID
router.get('/:id', mealController.getMealById);

// PUT /meals/:id - Update a meal by ID
router.put('/:id', mealController.updateMeal);

// PATCH /meals/:id - Partially update a meal by ID
router.patch('/:id', mealController.partialUpdateMeal);

// DELETE /meals/:id - Delete a meal by ID
router.delete('/:id', mealController.deleteMealById);

module.exports = router;