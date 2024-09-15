const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
  	type: String,
  	required: true,
    unique: true,
  },
  password: {
    type: String, 
    required: true,
  }, 
  name: {
  	type: String,
  	required: true,
  },
	meal_category: {
  	type: String,
    enums: ["Vegan", "Vegetarian", "Gluten-free", "High-proteine"],
  },
  preferences: {
  	type: String,
  },
});

const User = mongoose.model('User', userSchema);