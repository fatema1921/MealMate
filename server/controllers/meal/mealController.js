const Meal = require('../../models/meal');
const Recipe = require('../../models/recipe');
const mongoose = require('mongoose');

// Create a new meal (POST /meals)
exports.createMeal = async (req, res) => {
    try {
        const { name, recipeId } = req.body;

        // Verify if recipe exists
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        const newMeal = new Meal({ name, recipe: recipeId });
        await newMeal.save();
        res.status(201).json({ message: 'Meal created successfully', meal: newMeal });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid data. Please check the required fields.' });
        }
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

// Get all meals (GET /meals)
exports.getAllMeals = async (req, res) => {
    try {
        const meals = await Meal.find().populate('recipe');
        res.status(200).json({ meals });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid data. Please check the required fields.' });
        }
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

// Get a specific meal by ID (GET /meals/:id)
exports.getMealById = async (req, res) => {
    try {
        const mealId = req.params.id;

        // Validate if it's a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(mealId)) {
            return res.status(400).json({ message: 'Invalid meal ID' });
        }

        const meal = await Meal.findById(mealId).populate('recipe');
        if (!meal) {
            return res.status(404).json({ message: 'Meal not found' });
        }

        res.status(200).json({ meal });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid data. Please check the required fields.' });
        }
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

// Full update meal by ID (PUT /meals/:id)
exports.updateMeal = async (req, res) => {
    try {
        const mealId = req.params.id;
        const { name, recipe } = req.body;

        // Check if all required fields are present
        if (!name || !recipe) {
            return res.status(400).json({ message: 'Missing required fields: name and recipe' });
        }

        const updatedMeal = await Meal.findByIdAndUpdate(mealId, req.body, { new: true });
        if (!updatedMeal) {
            return res.status(404).json({ message: 'Meal not found' });
        }

        res.status(200).json({ message: 'Meal updated successfully', meal: updatedMeal });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid data. Please check the required fields.' });
        }
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

// Partial update meal by ID (PATCH /meals/:id)
exports.partialUpdateMeal = async (req, res) => {
    try {
        const mealId = req.params.id;
        const validFields = ['name', 'recipe']; // Define allowed fields

        // Check if only valid fields are being updated
        const fieldsToUpdate = Object.keys(req.body);
        const isValidOperation = fieldsToUpdate.every((field) => validFields.includes(field));
        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid fields in update request' });
        }

        const updatedMeal = await Meal.findByIdAndUpdate(mealId, { $set: req.body }, { new: true });
        if (!updatedMeal) {
            return res.status(404).json({ message: 'Meal not found' });
        }

        res.status(200).json({ message: 'Meal partially updated', meal: updatedMeal });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid data. Please check the required fields.' });
        }
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

// Delete a meal by ID (DELETE /meals/:id)
exports.deleteMealById = async (req, res) => {
    try {
        const mealId = req.params.id;

        // Validate if it's a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(mealId)) {
            return res.status(400).json({ message: 'Invalid meal ID' });
        }

        const deletedMeal = await Meal.findByIdAndDelete(mealId);
        if (!deletedMeal) {
            return res.status(404).json({ message: 'Meal not found' });
        }

        res.status(200).json({ message: 'Meal deleted successfully' });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid data. Please check the required fields.' });
        }
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};