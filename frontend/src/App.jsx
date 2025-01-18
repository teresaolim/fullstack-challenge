import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('ALL'); // State for filter
  const [sortBy, setSortBy] = useState('createdAt'); // State for sorting

  // Fetch tasks from the backend
  useEffect(() => {
    axios
      .get('http://localhost:3000/todos', {
        params: { filter, orderBy: sortBy }, // Pass filter and sortBy as query parameters
      })
      .then((response) => setTasks(response.data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, [filter, sortBy]); // Refetch when filter or sortBy changes

  // Add a new task
  const addTask = () => {
    if (!newTask.trim()) return;

    axios
      .post('http://localhost:3000/todos', { description: newTask })
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask('');
      })
      .catch((error) => console.error('Error adding task:', error));
  };

  // Toggle task state (complete/incomplete)
  const toggleTaskState = (id, currentState) => {
    axios
      .patch(`http://localhost:3000/todos/${id}`, {
        state: currentState === 'INCOMPLETE' ? 'COMPLETE' : 'INCOMPLETE',
      })
      .then((response) => {
        setTasks(
          tasks.map((task) => (task.id === id ? response.data : task))
        );
      })
      .catch((error) => console.error('Error updating task:', error));
  };

  // Delete a task
  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:3000/todos/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
      })
      .catch((error) => console.error('Error deleting task:', error));
  };

  return (
    <div>
      <h1>To-Do List</h1>

      {/* Add Task */}
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      {/* Filters and Sorting */}
      <div>
        <label>Filter:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">All</option>
          <option value="COMPLETE">Complete</option>
          <option value="INCOMPLETE">Incomplete</option>
        </select>

        <label>Sort By:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="description">Description</option>
          <option value="createdAt">Created Date</option>
          <option value="completedAt">Completed Date</option>
        </select>
      </div>

      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.state === 'COMPLETE'}
              onChange={() => toggleTaskState(task.id, task.state)}
            />
            <span>{task.description}</span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
