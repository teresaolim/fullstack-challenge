const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Placeholder data for testing
let todos = [
  { id: 1, description: 'Buy groceries', state: 'INCOMPLETE', createdAt: new Date(), completedAt: null },
  { id: 2, description: 'Finish project', state: 'COMPLETE', createdAt: new Date(), completedAt: new Date() },
];

// GET /todos - List all to-dos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// POST /todos - Add a new to-do
app.post('/todos', (req, res) => {
    const { description } = req.body;
  
    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }
  
    const newTask = {
      id: Date.now(), // Temporary ID
      description,
      state: 'INCOMPLETE',
      createdAt: new Date(),
      completedAt: null,
    };
  
    todos.push(newTask); // Add the new task to the array
    res.status(201).json(newTask); // Return the created task
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
