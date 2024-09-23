const express = require('express');
const router = express.Router();
const userController = require('./userController'); // Import the user controller

// Define user routes
router.get('/users', userController.getAllUsers); // Get all users
router.get('/users/:id', userController.getUser); // Get a single user by ID
router.post('/users', userController.createUser); // Create a new user
router.put('/users/:id', userController.updateUser); // Update a user
router.delete('/users/:id', userController.deleteUser); // Delete a user
router.patch('/users/:id', userController.patchUser); // Update some fields for a specific user


module.exports = router;
