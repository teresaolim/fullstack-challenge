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

// GET /todos - List all to-dos with filtering and sorting
app.get('/todos', (req, res) => {
    const { filter = 'ALL', orderBy = 'createdAt' } = req.query;
  
    // Filter tasks
    let filteredTodos = todos;
    if (filter === 'COMPLETE') {
      filteredTodos = todos.filter((todo) => todo.state === 'COMPLETE');
    } else if (filter === 'INCOMPLETE') {
      filteredTodos = todos.filter((todo) => todo.state === 'INCOMPLETE');
    }
  
    // Sort tasks
    filteredTodos.sort((a, b) => {
      if (orderBy === 'description') {
        return a.description.localeCompare(b.description);
      } else if (orderBy === 'completedAt') {
        return new Date(a.completedAt) - new Date(b.completedAt);
      } else {
        // Default to sorting by createdAt
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });
  
    res.json(filteredTodos);
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

// PATCH /todos/:id - Update a to-do item
app.patch('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { state } = req.body;
  
    const task = todos.find((todo) => todo.id === parseInt(id));
  
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
  
    if (state) {
      task.state = state;
      task.completedAt = state === 'COMPLETE' ? new Date() : null;
    }
  
    res.json(task);
});

// DELETE /todos/:id - Remove a to-do item
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
  
    const taskIndex = todos.findIndex((todo) => todo.id === parseInt(id));
  
    if (taskIndex === -1) {
      return res.status(404).json({ error: 'Task not found' });
    }
  
    todos.splice(taskIndex, 1); // Remove the task from the array
    res.status(204).send(); // No content response
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
