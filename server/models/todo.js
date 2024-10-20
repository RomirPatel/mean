// models/Todo.js
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    done: { type: Boolean, default: false },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Link to the user
});

const Todo = mongoose.model('Todo', todoSchema);
module.exports = Todo;
