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
        enum: ["Vegan", "Vegetarian", "Gluten-free", "High-protein"],
    },
    ingredients: [{
        type: Schema.Types.ObjectId, ref: "Ingredient",
        required: true,
    }],
    userMade: {
        type: Boolean
    },
    prepTime: {
        type: Number
    },
    calories: {
        type: Number
    }
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe; 