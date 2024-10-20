const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const todosRoutes = require('./routes/todos');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/api/todos', todosRoutes);

// Connect to MongoDB
mongoose.connect('mongodb+srv://romir:tQD8HwGauAoTXFlX@mean.a4lhe.mongodb.net/todo_app?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
