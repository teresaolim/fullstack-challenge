import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('createdAt');
  const [message, setMessage] = useState(''); // Feedback message

  // Fetch tasks from the backend
  useEffect(() => {
    axios
      .get('http://localhost:3000/todos', {
        params: { filter, orderBy: sortBy },
      })
      .then((response) => setTasks(response.data))
      .catch((error) => setMessage('Error fetching tasks: ' + error.message));
  }, [filter, sortBy]);

  // Add a new task
  const addTask = () => {
    if (!newTask.trim()) {
      setMessage('Task description cannot be empty.');
      return;
    }

    axios
      .post('http://localhost:3000/todos', { description: newTask })
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask('');
        setMessage('Task added successfully!');
      })
      .catch((error) => setMessage('Error adding task: ' + error.message));
  };

  // Toggle task state
  const toggleTaskState = (id, currentState) => {
    axios
      .patch(`http://localhost:3000/todos/${id}`, {
        state: currentState === 'INCOMPLETE' ? 'COMPLETE' : 'INCOMPLETE',
      })
      .then((response) => {
        setTasks(
          tasks.map((task) => (task.id === id ? response.data : task))
        );
        setMessage('Task updated successfully!');
      })
      .catch((error) => setMessage('Error updating task: ' + error.message));
  };

  // Delete a task
  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:3000/todos/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task.id !== id));
        setMessage('Task deleted successfully!');
      })
      .catch((error) => setMessage('Error deleting task: ' + error.message));
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

      {/* Feedback Message */}
      {message && <p>{message}</p>}

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
