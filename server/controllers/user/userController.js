const User = require('../../models/user');

// Display all users 
exports.getAllUsers = async (req, res, next) => {
    try{
        const userList = await User.find(); 
        res.json(userList); // Returns all the users as a JSON response

    } catch (error){
        next(error);
    }
}; 

// Display information about specific user 
exports.getUser = async (req, res, next) => {
    try{
        const userID = req.params.id;
        const user = await User.findById(userID); // är detta rätt, kollar vi upp geno id 
        if(!user){
            return res.status (404).json({"message": "User not found"});
        } 
        res.json(user); 
    } catch(error){
        next(error);
    }
}; 

// Create a new user 
exports.createUser = async (req , res, next) => {
    try{
        const newUser = new User ({
            name: req.body.name,
            username: req.body.username, 
            password : req.body.password, 
            meal_category: req.body.meal_category, 
            preferences: req.body.preferences
        }); 
    
        await newUser.save(); 
        res.status(201).json({message: "New user created", newUser}); 

    } catch(error){
        next(error);
    } 
}; 

// Login user
exports.loginUser = async (req, res, next) => {
    try {
        const { username, password } = req.body; 

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (password === user.password) {
            return res.status(200).json({ message: "Login successful", user });
        } else {
            return res.status(401).json({ message: "Invalid password" });
        }

    } catch (error) {
        next(error);
    }
};

// Update an already existing user
exports.updateUser = async (req , res, next) => {
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
exports.deleteUser = async (req, res, next) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id); // Delete user by ID
        if (!user) {
          return res.status(404).json({message: 'User not found' });
        }
        res.status(204).end(); // Responds with no content
    } catch (error){
        next(error);
    }
   
  };

exports.patchUser = async (req, res, next) => {
    try {
        // Find user by ID
        const user = await User.findById(req.params.id);
        
        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the fields provided in the request body
        Object.assign(user, req.body);

        await user.save();

        res.json({ message: "User updated", user });

    } catch (error) {
        console.error('Error updating this user:', error);
        next(error);
    }
};



