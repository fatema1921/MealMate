const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    name: {
        type: String, 
        required: true, 
    }, 
    description: {
        type: String, 
    }, 
    meal_category: {
        type: String,
        enums: ["Vegan", "Vegetarian", "Gluten-free", "High-proteinS"],
    },
    ingredients: [{
        type: Schema.Types.ObjectId, ref: "Ingredient",
        required: true,
    }],
    userMade: {
        type: Boolean
    },
    saved: {
        type: Boolean
    }
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe; 