const express = require('express');
const router = express.Router();
const userController = require('./userController'); // Import the user controller

// Define user routes
router.get('/', userController.getAll); // Get all 
router.get('/:id', userController.getUser); // Get a single user by ID
router.post('/', userController.createUser); // Create a new user
router.put('/:id', userController.updateUser); // Update a user
router.delete('/:id', userController.deleteUser); // Delete a user
router.patch('/:id', userController.patchUser); // Update some fields for a specific user


module.exports = router;
