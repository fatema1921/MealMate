const User = require('../models/user');
const asyncHandler = require("express-async-handler");

// Display all users 
const getAllUsers = asyncHandler(async(req, res, next) => {
    const userList = await User.find(); 
    res.json(userList); // Returns all the users as a JSON response
}); 

// Display information about specific user 
const getUser = asyncHandler (async (req, res, next) => {
    const user = await User.findById(req.params.id); // är detta rätt, kollar vi upp geno id 
    if(!user){
        return res.status (404).json({"message": "User not found"});
    }
    res.json(user); 
}); 

// Create a new user 
const createUser = asyncHandler ( async(req , res, next) => {
    var newUser = new User ({
        name: req.body.name,
        username: req.body.username, 
        password: req.body.password, 
        meal_category: req.body.meal_category, 
        preferences: req.body.preferences,
    }); 

    await newUser.save(); 
    res.status(201).json("New user created", newUser); 
}); 

// Update an already existing user
const updateUser = asyncHandler (async (req , res, next) => {
    var updatedUser = {
        name: req.body.name,
        username: req.body.username, 
        password: req.body.password, 
        meal_category: req.body.meal_category, 
        preferences: req.body.preferences,
    }; 
    updatedUser = await User.findByIdAndUpdate(req.params.id);
    if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
    }
    res.json(updateUser); 

}); 

// Delete a user
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id); // Delete user by ID
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).end(); // Responds with no content
  });

  module.exports = {
    getAllUsers, 
    getUser, 
    createUser, 
    updateUser, 
    deleteUser
};

