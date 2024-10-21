const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Adjust the path as necessary
const Todo = require('../models/Todo');

const router = express.Router();

// Registration Route
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    // Respond with success
    res.status(201).json({ message: 'User registered successfully' });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Respond with success and userId
    res.status(200).json({ message: 'Login successful', userId: user._id });  // Include userId here
});


// Create a new to-do
router.post('/', async (req, res) => {
    const { text, userId } = req.body;

    if (!text || !userId) {
        return res.status(400).json({ message: 'Text and user ID are required' });
    }

    const newTodo = new Todo({
        text,
        done: false,
        userId, // Ensure userId is passed here
    });

    await newTodo.save();
    res.status(201).json(newTodo);
});


// Get all to-dos for a user
router.get('/', async (req, res) => {
    const { userId } = req.query;
    const todos = await Todo.find({ userId });
    res.json(todos);
});

// Update a to-do
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { text, done } = req.body;

    const todo = await Todo.findByIdAndUpdate(id, { text, done }, { new: true });
    res.json(todo);
});

// Delete a to-do
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Todo.findByIdAndDelete(id);
    res.status(204).send();
});

module.exports = router;
