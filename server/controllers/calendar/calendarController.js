const Calendar = require('../../models/calendar');
const User = require('../../models/user');
const Meal = require('../../models/meal');

// Create a new calendar (POST /calendars)
exports.createCalendar = async (req, res) => {
    let userId = req.body.user;
    const calendar = new Calendar({
        name: req.body.name,
        user: userId,
        meals: req.body.meals
    })
    try {
        //validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(404).json({ message: 'Invalid user' });
        }

        // Verify if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newCalendar = await calendar.save();
        res.status(201).json({ message: 'Calendar created successfully', calendar: newCalendar });
    } catch (err) {
        console.error('Error while creating calendar:', err);
        let errorMessage;

        if (err.name === 'ValidationError') {
            errorMessage = 'Validation failed. Some required fields are missing or incorrectly filled out.';
        } else {
            errorMessage = 'An error occurred while creating the calendar.';
        }
        res.status(400).json({ message: errorMessage });
    }
};

// Get all calendars (GET /calendars)
exports.getAllCalendars = async (req, res) => {
    try {
        const calendars = await Calendar.find({});
        res.status(200).json({ calendars });
    } catch (err) {
        console.log(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid data. Please check the required fields.' });
        }
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

// Get a specific calendar by ID (GET /calendars/:id)
const mongoose = require('mongoose');
exports.getCalendarById = async (req, res) => {
    try {
        const calendarId = req.params.id;
        // Validate if it's a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(calendarId)) {
            return res.status(400).json({ message: 'Invalid calendar ID' });
        }
        const calendar = await Calendar.findById(calendarId);
        if (!calendar) {
            return res.status(404).json({ message: 'Calendar not found' });
        }
        res.status(200).json({ calendar });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid data. Please check the required fields.' });
        }
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

// Full update calendar by ID (PUT /calendars/:id)
exports.updateCalendar = async (req, res) => {
    try {
        const calendarId = req.params.id;
        const { name, user, meals } = req.body;

        // Check if all required fields are present
        if (!name || !user || !meals) {
            return res.status(400).json({ message: 'Missing required fields: name, user, and meals' });
        }

        const updatedCalendar = await Calendar.findByIdAndUpdate(calendarId, req.body, { new: true });
        if (!updatedCalendar) {
            return res.status(404).json({ message: 'Calendar not found' });
        }
        res.status(200).json({ message: 'Calendar updated successfully', calendar: updatedCalendar });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid data. Please check the required fields.' });
        }
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

// Partial update calendar by ID (PATCH /calendars/:id)
exports.partialUpdateCalendar = async (req, res) => {
    try {
        const calendarId = req.params.id;
        const validFields = ['name', 'user', 'meals'];  // Define allowed fields

        // Check if only valid fields are being updated
        const fieldsToUpdate = Object.keys(req.body);
        const isValidOperation = fieldsToUpdate.every((field) => validFields.includes(field));
        if (!isValidOperation) {
            return res.status(400).json({ message: 'Invalid fields in update request' });
        }

        const updatedCalendar = await Calendar.findByIdAndUpdate(calendarId, { $set: req.body }, { new: true });
        if (!updatedCalendar) {
            return res.status(404).json({ message: 'Calendar not found' });
        }
        res.status(200).json({ message: 'Calendar partially updated', calendar: updatedCalendar });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid data. Please check the required fields.' });
        }
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

// Delete a calendar by ID (DELETE /calendars/:id)
exports.deleteCalendarById = async (req, res) => {
    try {
        const calendarId = req.params.id;
        const deletedCalendar = await Calendar.findByIdAndDelete(calendarId);
        if (!deletedCalendar) {
            return res.status(404).json({ message: 'Calendar not found' });
        }
        res.status(200).json({ message: 'Calendar deleted successfully' });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: 'Invalid data. Please check the required fields.' });
        }
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};

// Add a meal to the calendar (POST /calendars/:calendarId/meals/:mealId)
exports.addMealToCalendar = async (req, res) => {
    try {
        const { calendarId, mealId } = req.params;

        // Validate if the calendar and meal exist
        const calendar = await Calendar.findById(calendarId);
        const meal = await Meal.findById(mealId);

        if (!calendar) {
            return res.status(404).json({ message: 'Calendar not found' });
        }

        if (!meal) {
            return res.status(404).json({ message: 'Meal not found' });
        }

        // Check if the meal is already associated with the calendar
        if (calendar.meals.includes(mealId)) {
            return res.status(400).json({ message: 'Meal already added to the calendar' });
        }

        // Add the meal to the meals array
        calendar.meals.push(mealId);
        await calendar.save();

        res.status(200).json({ message: 'Meal added to calendar', calendar });
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong. Please try again later.' });
    }
};