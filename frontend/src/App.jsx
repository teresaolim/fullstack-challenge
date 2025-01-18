import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState(''); // Input field state

  // Fetch tasks from the backend
  useEffect(() => {
    axios
      .get('http://localhost:3000/todos')
      .then((response) => setTasks(response.data))
      .catch((error) => console.error('Error fetching tasks:', error));
  }, []);

  // Add a new task
  const addTask = () => {
    if (!newTask.trim()) return;

    axios
      .post('http://localhost:3000/todos', { description: newTask })
      .then((response) => {
        setTasks([...tasks, response.data]); // Add the new task to the state
        setNewTask(''); // Clear the input field
      })
      .catch((error) => console.error('Error adding task:', error));
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

      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span>{task.description}</span> - <span>{task.state}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
