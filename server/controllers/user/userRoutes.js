const express = require('express');
const router = express.Router();
const userController = require('./userController'); // Import the user controller

// Define user routes
router.get('/', userController.getAllUsers); // Get all users
router.get('/:username', userController.getUser); // Get a single user by ID
router.post('/', userController.createUser); // Create a new user
router.post('/login', userController.loginUser); // Login user
router.put('/:username', userController.updateUser); // Update a user
router.delete('/:username', userController.deleteUser); // Delete a user
router.patch('/:username', userController.patchUser); // Update some fields for a specific user

module.exports = router;
