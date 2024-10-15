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
  },
	meal_category: {
  	type: String,
    enums: ["Vegan", "Vegetarian", "Gluten-free", "High-protein"],
  },
  preferences: {
  	type: String,
  },
  recipes: [{
    type: Schema.Types.ObjectId, ref: "Recipe"
  }], 
  shopping_list: [{
    type: Schema.Types.ObjectId, ref: "Ingredient"
  }]
});

module.exports = mongoose.model('User', userSchema);