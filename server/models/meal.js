const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const mealSchema = new Schema({
    name: {
        type: String, 
        required: true,
        unique: true
    },
    recipe: {
        type: Schema.Types.ObjectId, ref: "Recipe",
        required: true
    }
});

module.exports = mongoose.model('Meal', mealSchema);