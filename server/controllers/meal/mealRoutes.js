const express = require('express');
const mealController = require('./mealController');
const router = express.Router();

// CRUD operations for Meal

// POST / - Create a new meal
router.post('/', mealController.createMeal);

// GET / - Retrieve all 
router.get('/', mealController.getAll);

// GET //:id - Retrieve a specific meal by ID
router.get('/:id', mealController.getMealById);

// PUT //:id - Update a meal by ID
router.put('/:id', mealController.updateMeal);

// PATCH //:id - Partially update a meal by ID
router.patch('/:id', mealController.partialUpdateMeal);

// DELETE //:id - Delete a meal by ID
router.delete('/:id', mealController.deleteMealById);

module.exports = router;