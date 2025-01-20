import { useState, useEffect } from 'react';
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
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>To-Do List</h1>

      {/* Add Task */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          style={{
            padding: '10px',
            width: '70%',
            marginRight: '10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
          aria-label="Task description input"
        />
        <button
          onClick={addTask}
          style={{
            padding: '10px 20px',
            borderRadius: '4px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Add Task
        </button>
      </div>

      {/* Filters and Sorting */}
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <label htmlFor="filter" style={{ marginRight: '10px' }}>Filter:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          >
            <option value="ALL">All</option>
            <option value="COMPLETE">Complete</option>
            <option value="INCOMPLETE">Incomplete</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortBy" style={{ marginRight: '10px' }}>Sort By:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          >
            <option value="description">Description</option>
            <option value="createdAt">Created Date</option>
            <option value="completedAt">Completed Date</option>
          </select>
        </div>
      </div>

      {/* Feedback Message */}
      {message && <p style={{ color: 'red', textAlign: 'center' }}>{message}</p>}

      {/* Task List */}
      <h2
        onClick={() => {
          if (sortBy === 'createdAt') setSortBy('description'); // Alphabetical (A to Z)
          else if (sortBy === 'description') setSortBy('-description'); // Reverse alphabetical (Z to A)
          else setSortBy('createdAt'); // Default sorting
        }}
        style={{
          cursor: 'pointer',
          textDecoration: 'underline',
          color: sortBy === 'description' || sortBy === '-description' ? 'green' : 'blue',
          textAlign: 'center',
        }}
        aria-label="Click to change sorting mode"
      >
        Tasks {sortBy === 'description' ? '(A-Z)' : sortBy === '-description' ? '(Z-A)' : '(Default)'}
      </h2>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px',
              borderBottom: '1px solid #ddd',
            }}
          >
            <div>
              <input
                type="checkbox"
                checked={task.state === 'COMPLETE'}
                onChange={() => toggleTaskState(task.id, task.state)}
                aria-label={`Mark task as ${task.state === 'COMPLETE' ? 'incomplete' : 'complete'}`}
              />
              <span style={{ marginLeft: '10px' }}>{task.description}</span>
            </div>
            <button
              onClick={() => deleteTask(task.id)}
              style={{
                padding: '5px 10px',
                borderRadius: '4px',
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
              aria-label="Delete task"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
