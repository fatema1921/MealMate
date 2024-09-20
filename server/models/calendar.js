const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const calendarSchema = new Schema({
    name: {
        type: String, 
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId, ref: "User"
    },
    meals: [{
        type: Schema.Types.ObjectId, ref: "Meal"
    }]
});

module.exports = mongoose.model('Calendar', calendarSchema);