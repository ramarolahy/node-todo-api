const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Create mongoose schema for todo
const TodoSchema = new Schema({
    text: {
        type: String,
        required: true,
        minlength: 7, // Min length of char
        trim: true // trim blank spaces
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
})

const Todo = mongoose.model('Todo', TodoSchema);

module.exports = {Todo};