const express = require('express');
const cors = require('cors'); 
const app = express();
const PORT = 3000;
const knex = require('knex')(require('./knexfile.js').development);
const formatDate = (timestamp) => {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  return date.toISOString(); // Format as ISO string (e.g., "2025-01-19T17:54:52.000Z")
};

// Middleware
app.use(cors());
app.use(express.json());

// GET /todos - List all to-dos with filtering and sorting
app.get('/todos', async (req, res) => {
  try {
    const { filter = 'ALL', orderBy = 'createdAt' } = req.query;

    let query = knex('todos');
    if (filter === 'COMPLETE') {
      query = query.where('state', 'COMPLETE');
    } else if (filter === 'INCOMPLETE') {
      query = query.where('state', 'INCOMPLETE');
    }

    const todos = await query.orderBy(orderBy);
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST /todos - Add a new to-do
app.post('/todos', async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    const [id] = await knex('todos').insert({ description });
    const newTask = await knex('todos').where({ id }).first();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add a new task' });
  }
});

// PATCH /todos/:id - Update a to-do item
app.patch('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { state } = req.body;

    const task = await knex('todos').where({ id }).first();
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = {
      state,
      completedAt: state === 'COMPLETE' ? new Date() : null,
    };

    await knex('todos').where({ id }).update(updatedTask);
    const result = await knex('todos').where({ id }).first();

    result.completedAt = formatDate(result.completedAt);

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /todos/:id - Remove a to-do item
app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRows = await knex('todos').where({ id }).del();
    if (deletedRows === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
