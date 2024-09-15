const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ingredientSchema = new Schema({
    name: {
        type: String, 
        required: true,
        unique: true
    },
    calories: {
        type: Number,
    },
    shopping_list: {
        type: Boolean
    }
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);