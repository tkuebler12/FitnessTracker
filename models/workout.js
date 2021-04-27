const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workoutSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: "Enter the type of workout you want"
    }
});

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;