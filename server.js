const express = require('express');
const cors = require('cors'); 
const app = express();
const PORT = 3000;
const knex = require('knex')(require('./knexfile.js').development);
const { z } = require('zod');

const formatDate = (timestamp) => {
  if (!timestamp) return null;
  const date = new Date(timestamp);
  return date.toISOString(); // Format as ISO string (e.g., "2025-01-19T17:54:52.000Z")
};

// Input Validation Schema
const todoInputSchema = z.object({
  description: z
    .string({
      required_error: 'Description is required', // Custom error for missing field
      invalid_type_error: 'Description must be a string', // Custom error for wrong type
    })
    .min(1, 'Description cannot be empty'), // Custom error for empty string
  state: z.enum(['INCOMPLETE', 'COMPLETE']).optional(),
});

// Response Validation Schema
const todoResponseSchema = z.object({
  id: z.number(),
  description: z.string(),
  state: z.enum(['COMPLETE', 'INCOMPLETE']),
  createdAt: z.string(),
  completedAt: z.string().nullable(),
});

// Query Parameters Validation Schema
const querySchema = z.object({
  filter: z.enum(['ALL', 'COMPLETE', 'INCOMPLETE']).optional(),
  orderBy: z.enum(['description', 'createdAt', 'completedAt']).optional(),
});

// Middleware
app.use(cors());
app.use(express.json());
// Middleware to catch JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: 'Invalid JSON format' });
  }
  next();
});

// GET /todos - List all to-dos with filtering and sorting
app.get('/todos', async (req, res) => {
  try {
    // Validate query parameters
    const { filter = 'ALL', orderBy = 'createdAt' } = querySchema.parse(req.query);

    let query = knex('todos');
    if (filter === 'COMPLETE') {
      query = query.where('state', 'COMPLETE');
    } else if (filter === 'INCOMPLETE') {
      query = query.where('state', 'INCOMPLETE');
    }

    const todos = await query.orderBy(orderBy);

    // Validate the response for all tasks
    //const validatedTodos = todos.map((todo) => todoResponseSchema.parse(todo));
    const validatedTodos = todos.map((todo) => todoResponseSchema.parse({
      ...todo,
      createdAt: formatDate(todo.createdAt),
      completedAt: formatDate(todo.completedAt),
    }));
    res.json(validatedTodos);
  } catch (error) {
    res.status(400).json({ error: error.errors || 'Invalid query parameters' });
  }
});

// POST /todos - Add a new to-do
app.post('/todos', async (req, res) => {
  try {
    // Validate the input using todoInputSchema
    const validatedData = todoInputSchema.parse(req.body);

    // Create the new task in the database
    const [id] = await knex('todos').insert({ description: validatedData.description });
    const newTask = await knex('todos').where({ id }).first();

    // Validate the response before sending it
    //res.status(201).json(todoResponseSchema.parse(newTask));
    res.status(201).json(todoResponseSchema.parse({
      ...newTask,
      createdAt: formatDate(newTask.createdAt),
      completedAt: formatDate(newTask.completedAt),
    }));
  } catch (error) {
    res.status(400).json({ error: error.errors || 'Invalid request payload' });
  }
});

// PATCH /todos/:id - Update a to-do item
app.patch('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the input using a partial schema (only optional fields)
    const validatedData = todoInputSchema.partial().parse(req.body);

    // Check if the task exists
    const task = await knex('todos').where({ id }).first();
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update the task in the database
    const updatedTask = {
      state: validatedData.state,
      completedAt: validatedData.state === 'COMPLETE' ? new Date().toISOString() : null,
    };

    await knex('todos').where({ id }).update(updatedTask);
    const result = await knex('todos').where({ id }).first();

    // Validate the response before sending it
    //res.json(todoResponseSchema.parse(result));
    res.json(todoResponseSchema.parse({
      ...result,
      createdAt: formatDate(result.createdAt),
      completedAt: formatDate(result.completedAt),
    }));
  } catch (error) {
    res.status(400).json({ error: error.errors || 'Invalid request payload' });
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
