const User = require('../models/user');

// Display all users 
const getAllUsers = async function (req, res, next) {
    try{
        const userList = await User.find(); 
        res.json(userList); // Returns all the users as a JSON response
    } catch (error){
        next(error);
    }
}; 

// Display information about specific user 
const getUser = async function (req, res, next) {
    try{
        const user = await User.findById(req.params.id); // är detta rätt, kollar vi upp geno id 
        if(!user){
            return res.status (404).json({"message": "User not found"});
        } 
        res.json(user); 
    } catch(error){
        next(error);
    }
}; 

// Create a new user 
const createUser = async function (req , res, next){
    try{
        var newUser = new User ({
            name: req.body.name,
            username: req.body.username, 
            password: req.body.password, 
            meal_category: req.body.meal_category, 
            preferences: req.body.preferences,
        }); 
    
        await newUser.save(); 
        res.status(201).json({message: "New user created", newUser}); 

    } catch(error){
        next(error);
    } 
}; 

// Update an already existing user
const updateUser = async function (req , res, next) {
   try{
        var updateUser = {
            name: req.body.name,
            username: req.body.username, 
            password: req.body.password, 
            meal_category: req.body.meal_category, 
            preferences: req.body.preferences,
        }; 
        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateUser);
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updateUser); 

   } catch(error){
    next(error);
   }
}; 

// Delete a user
const deleteUser = async function (req, res, next) {
    try{
        const user = await User.findByIdAndDelete(req.params.id); // Delete user by ID
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).end(); // Responds with no content
    } catch (error){
        next(error);
    }
   
  };

  module.exports = {
    getAllUsers, 
    getUser, 
    createUser, 
    updateUser, 
    deleteUser
};

