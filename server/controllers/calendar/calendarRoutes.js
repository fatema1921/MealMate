const express = require('express');
const calendarController = require('./calendarController');
const router = express.Router();

// CRUD operations for Calendar

// POST / - Create a new calendar
router.post('/', calendarController.createCalendar);

// GET / - Retrieve all 
router.get('/', calendarController.getAllCalendars);

// GET //:id - Retrieve a specific calendar by ID
router.get('/:id', calendarController.getCalendarById);

// PUT //:id - Update a calendar by ID
router.put('/:id', calendarController.updateCalendar);

// PATCH //:id - Partially update a calendar by ID
router.patch('/:id', calendarController.partialUpdateCalendar);

// DELETE //:id - Delete a calendar by ID
router.delete('/:id', calendarController.deleteCalendarById);

// Route to add a meal to a calendar
router.post('/:calendarId/meals/:mealId', calendarController.addMealToCalendar);

// Route to add a meal to a calendar
router.post('/:calendarId/meals/:mealId', calendarController.addMealToCalendar);

module.exports = router;