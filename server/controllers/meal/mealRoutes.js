const express = require('express');
const mealController = require('./mealController');
const router = express.Router();

// CRUD operations for Meal

// POST /meals - Create a new meal
router.post('/meals', mealController.createMeal);

// GET /meals - Retrieve all meals
router.get('/meals', mealController.getAllMeals);

// GET /meals/:id - Retrieve a specific meal by ID
router.get('/meals/:id', mealController.getMealById);

// PUT /meals/:id - Update a meal by ID
router.put('/meals/:id', mealController.updateMeal);

// PATCH /meals/:id - Partially update a meal by ID
router.patch('/meals/:id', mealController.partialUpdateMeal);

// DELETE /meals/:id - Delete a meal by ID
router.delete('/meals/:id', mealController.deleteMealById);

module.exports = router;